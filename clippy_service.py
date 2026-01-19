"""
Clippy Service v2.5 – Retro Bank Assistant using Gemini (new API)
- More conversational normal mode with LLM-generated suggestions
- Flexible What-if analysis (K1b0)
- /score endpoint for rough credit-health score estimation (NOT real FICO)
- 15s timeout on all LLM calls
"""

import os
import uuid
import json
import concurrent.futures
from typing import List, Optional, Dict, Any, Tuple

from fastapi import FastAPI
from pydantic import BaseModel, Field

# NEW Gemini client
from google import genai


# =============================
# Gemini setup
# =============================

MODEL_NAME = "gemma-3-27b-it"   # or "gemini-1.5-pro" gemini-2.5-flash-live

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    # ensuring it doesn't crash on import if just testing code structure
    pass

try:
    client = genai.Client(api_key=api_key)
except Exception:
    client = None

# LLM timeout in seconds
LLM_TIMEOUT_SECONDS = 15


# =============================
# FastAPI app
# =============================

app = FastAPI(
    title="Clippy Service",
    description="Retro bank assistant backed by Gemini (new API)",
    version="2.5.0",
)


# =============================
# Data models
# =============================

class CategoryAmount(BaseModel):
    category: str
    amount: float


class SpendingSummary(BaseModel):
    period: str = Field(..., description="Example: 2025-11")
    currency: str = "RON"
    total_income: Optional[float] = None
    total_expenses: Optional[float] = None
    by_category: List[CategoryAmount]


class Transaction(BaseModel):
    id: int
    date: str
    amount: float
    currency: str = "RON"
    type: str  # DEBIT, CREDIT
    description: str
    category: Optional[str] = None


class Context(BaseModel):
    spending_summary: Optional[SpendingSummary] = None
    # use default_factory to avoid mutable default issues
    recent_transactions: List[Transaction] = Field(default_factory=list)


class Meta(BaseModel):
    new_session: bool = False
    first_greeting: bool = False


class ClippyRequest(BaseModel):
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    message: Optional[str] = None
    locale: str = "en-US"
    context: Optional[Context] = None
    meta: Meta = Meta()


class Action(BaseModel):
    type: str
    data: Dict[str, Any] = Field(default_factory=dict)


class ClippyResponse(BaseModel):
    reply: str
    suggested_replies: List[str] = Field(default_factory=list)
    actions: List[Action] = Field(default_factory=list)


# For what-if analysis (separate endpoint, but reuses Context)
class WhatIfRequest(BaseModel):
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    question: str
    locale: str = "en-US"
    context: Optional[Context] = None


# For credit-health score estimation
class ScoreRequest(BaseModel):
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    locale: str = "en-US"
    context: Optional[Context] = None


class ScoreResponse(BaseModel):
    score: int
    label: str
    explanation: str
    suggestions: List[str] = Field(default_factory=list)


# In-memory session storage
SESSIONS: Dict[str, List[Dict[str, str]]] = {}


# =============================
# Prompt helpers – normal Clippy
# =============================

def build_system_prompt() -> str:
    """
    Base system prompt for normal Clippy conversations.
    More conversational and slightly quirky, but still professional.
    Also instructs the model to output 3 short suggestions.
    """
    return (
        "You are **Clippy**, a retro, paperclip-shaped virtual assistant living inside a bank app. "
        "Your personality is friendly, slightly quirky, and reminiscent of old operating-system helpers, "
        "but you remain professional and helpful.\n\n"

        "Your job is to help users understand their spending habits, budgets, and specific transactions "
        "using ONLY the financial data and context provided in the prompt.\n\n"

        "=== STYLE RULES ===\n"
        "- Keep the main reply concise (usually 1–2 sentences).\n"
        "- Use natural, conversational language with contractions (you're, I'm, can't).\n"
        "- Sound friendly, supportive, and lightly humorous, but never sarcastic or childish.\n"
        "- You can occasionally make a small retro/Clippy-style joke (e.g., about being a paperclip), but keep it subtle.\n"
        "- Do NOT use emojis.\n"
        "- Avoid exclamation marks except when genuinely fitting.\n"
        "- Never talk about being an AI model; always remain in character as Clippy.\n\n"

        "=== CONTENT RULES ===\n"
        "- Use ONLY the spending data and transaction list provided.\n"
        "- If analyzing transactions, look for patterns (e.g., too many coffees, duplicate charges, big weekend spending).\n"
        "- Identify the user's top spending categories and give 1–2 actionable, simple budgeting suggestions in the reply.\n"
        "- Keep all math simple and correct.\n"
        "- If the user is just chatting (e.g., 'hi', 'how are you'), respond briefly in character, "
        "then gently steer back to finances.\n"
        "- Do NOT give investment, legal, or tax advice.\n\n"

        "=== BEHAVIOR RULES ===\n"
        "- Be supportive and neutral. Never shame users for spending choices.\n"
        "- Maintain the playful retro Clippy tone.\n"
        "- If the data is insufficient to answer precisely, say so clearly and offer a simple next step "
        "(e.g., ask them to open a specific section in the app).\n\n"

        "=== OUTPUT FORMAT (VERY IMPORTANT) ===\n"
        "- First, write your main reply as normal text.\n"
        "- Then on a new line write exactly: 'SUGGESTIONS:'\n"
        "- After 'SUGGESTIONS:', provide exactly 3 short, tap-friendly suggestion options separated by ' | '.\n"
        "  Example: SUGGESTIONS: Show my recent food spending | Check for suspicious charges | Help me save this month\n"
        "- Suggestions should be context-aware and feel like natural next steps the user might tap.\n\n"

        "Respond as Clippy following all rules above."
    )


# =============================
# Prompt helpers – What-if (K1b0)
# =============================

def build_what_if_system_prompt() -> str:
    """
    System prompt for detailed, hypothetical analyses in an old sci-fi terminal style.
    K1b0 can handle both transaction-based scenarios and broader hypotheticals
    (e.g. Bitcoin 10 years ago).
    """
    base = (
        "You are **K1b0**, a retro sci-fi terminal AI inside a bank app. "
        "You simulate alternate financial timelines in a concise, mechanical tone.\n\n"
    )
    return base + (
        "=== WHAT-IF ANALYSIS MODE (ALTERNATE TIMELINE) ===\n"
        "- The user is asking to simulate a financial 'What-If' scenario.\n"
        "- Examples:\n"
        "  * 'What if I never smoked?'\n"
        "  * 'What if I stopped eating out?'\n"
        "  * 'What if I had invested this money in Bitcoin 10 years ago?'\n"
        "  * 'What if I used these amounts for something else?'\n\n"

        "=== SCENARIO TYPES ===\n"
        "- **Transaction-based scenarios** (clearly tied to categories/merchants in the provided data):\n"
        "  * Use the transaction list and spending summary to compute an alternate outcome.\n"
        "- **External or abstract scenarios** (e.g., investing in Bitcoin, generic savings, no clear matching transactions):\n"
        "  * Use rough world knowledge and simple estimates even if there is no direct transaction match.\n"
        "  * It is acceptable to assume a simple amount and timeframe from the question (e.g. '1,000 RON 10 years ago').\n"
        "  * Always treat the result as an approximate simulation, not an exact calculation.\n\n"

        "=== ANALYSIS STEPS (TRANSACTION-BASED) ===\n"
        "1. **Identify Transactions**: Find all transactions in the provided list that match the user's hypothetical criteria "
        "(e.g., specific category like 'Smoking', 'Food', or a merchant/keyword).\n"
        "2. **Calculate Savings**: Sum these targeted transactions to find the 'Recovered Funds'.\n"
        "3. **Project New Balance**: If `spending_summary` is available, calculate:\n"
        "   - Adjusted Total Expenses = (Current Total Expenses - Recovered Funds)\n"
        "   - Adjusted Net Balance = (Total Income - Adjusted Total Expenses)\n\n"

        "=== ANALYSIS RULES (EXTERNAL / INVESTMENT SCENARIOS) ===\n"
        "- Use simple, rough assumptions based on the question (e.g., amount and year mentioned).\n"
        "- For Bitcoin or other assets, use high-level historical knowledge (e.g., 'might now be worth tens of thousands').\n"
        "- Do NOT claim exact prices or precise returns; always describe them as estimates.\n"
        "- Clearly mark the result as an approximate simulation and not financial advice.\n\n"

        "=== OUTPUT FORMAT ===\n"
        "- Use a clear, retro-computer style.\n"
        "- For **transaction-based scenarios**, if matching transactions are found, follow this template:\n"
        "  \"\"\"\n"
        "  [ALTERNATE TIMELINE SIMULATION]\n"
        "  Identified: <N> matching transactions (e.g., '5 cigarette purchases').\n"
        "  Recovered Funds: <Amount> <Currency> (money you would have saved).\n"
        "  Projected Balance: <Amount> <Currency> at the end of this period.\n"
        "  Impact: <1 short sentence on how this changes their situation>.\n"
        "  Note: Estimate only; not financial advice.\n"
        "  \"\"\"\n"
        "- For **external/investment scenarios** (e.g., Bitcoin) or when no matching transactions exist:\n"
        "  * Still start with '[ALTERNATE TIMELINE SIMULATION]'.\n"
        "  * Give 1–3 short lines that describe the rough outcome (e.g., 'that 1,000 RON might now be worth tens of thousands').\n"
        "  * End with 'Note: Estimate only; not financial advice.'\n\n"

        "=== TONE ===\n"
        "- Sound like an old sci-fi terminal: concise, neutral, slightly cold, but readable.\n"
        "- No jokes, no mystical language, no emojis.\n"
        "- Prefer short numeric ranges or rough phrases like 'a few hundred', 'tens of thousands'.\n"
    )


def build_user_prompt(message: str, context: Optional[Context]) -> str:
    """
    Normal conversation prompt: includes spending summary, recent transactions, and user message.
    """
    parts: List[str] = []

    if context:
        if context.spending_summary:
            s = context.spending_summary
            parts.append("User's spending summary:\n")
            parts.append(f"- Period: {s.period}\n")
            parts.append(f"- Currency: {s.currency}\n")
            if s.total_income is not None:
                parts.append(f"- Total income: {s.total_income:.2f}\n")
            if s.total_expenses is not None:
                parts.append(f"- Total expenses: {s.total_expenses:.2f}\n")
            parts.append("- By category:\n")
            for c in s.by_category:
                parts.append(f"  * {c.category}: {c.amount:.2f} {s.currency}\n")
            parts.append("\n")

        if context.recent_transactions:
            parts.append("Recent Transactions:\n")
            for tx in context.recent_transactions[-10:]:  # last 10
                cat_str = f" [{tx.category or 'Uncategorized'}]" if tx.category else ""
                parts.append(
                    f"- [{tx.date}]{cat_str} {tx.type} {tx.amount:.2f} {tx.currency}: {tx.description}\n"
                )
            parts.append("\n")

    parts.append("User message:\n")
    parts.append(message or "The user didn’t share any spending data, but wants general money advice.\n")

    return "".join(parts)


def build_what_if_user_prompt(question: str, context: Optional[Context]) -> str:
    """
    Prompt specifically for what-if analysis.
    Includes all provided data + clear labeling of the hypothetical question.
    """
    parts: List[str] = []

    if context:
        if context.spending_summary:
            s = context.spending_summary
            parts.append("User's spending summary:\n")
            parts.append(f"- Period: {s.period}\n")
            parts.append(f"- Currency: {s.currency}\n")
            if s.total_income is not None:
                parts.append(f"- Total income: {s.total_income:.2f}\n")
            if s.total_expenses is not None:
                parts.append(f"- Total expenses: {s.total_expenses:.2f}\n")
            parts.append("- By category:\n")
            for c in s.by_category:
                parts.append(f"  * {c.category}: {c.amount:.2f} {s.currency}\n")
            parts.append("\n")

        if context.recent_transactions:
            parts.append("Recent Transactions (full list for analysis):\n")
            for tx in context.recent_transactions:
                cat_str = f" [{tx.category or 'Uncategorized'}]" if tx.category else ""
                parts.append(
                    f"- ID {tx.id}: [{tx.date}]{cat_str} {tx.type} {tx.amount:.2f} {tx.currency}: {tx.description}\n"
                )
            parts.append("\n")

    parts.append("User what-if question about their past transactions or alternate timeline:\n")
    parts.append(question + "\n")

    return "".join(parts)


# =============================
# Prompt helpers – Credit score (rough estimate)
# =============================

def build_score_system_prompt() -> str:
    """
    System prompt for estimating a rough 'credit health score' inspired by FICO range,
    based ONLY on the provided transaction context.

    IMPORTANT:
    - This is NOT a real FICO® or official credit score.
    - It must be clearly communicated as a rough, educational estimate.
    """
    return (
        "You are **ScoreBot**, a cautious credit-health analyzer inside a bank app.\n\n"
        "Your task is to look at the user's transactions and spending summary and produce a very rough, "
        "educational estimate of their 'credit health score' on a 300–850 scale, loosely inspired by FICO®-style ranges.\n\n"
        "=== SAFETY & LIMITATIONS ===\n"
        "- You do NOT know the user's real credit history, credit utilization, or official reports.\n"
        "- You are ONLY allowed to estimate based on the provided account and transaction information.\n"
        "- This must be clearly explained as a rough, fictional estimate, NOT an official score and NOT something to rely on.\n"
        "- Do NOT give concrete loan recommendations, do NOT say they will or will not be approved for credit.\n\n"
        "=== SCORING RULES (HIGH LEVEL) ===\n"
        "- Use the 300–850 range.\n"
        "- 300–579: Poor\n"
        "- 580–669: Fair\n"
        "- 670–739: Good\n"
        "- 740–799: Very Good\n"
        "- 800–850: Excellent\n"
        "- Base your rough estimate on signals you can infer, such as:\n"
        "  * Regular income vs. expenses (does income appear to exceed expenses?).\n"
        "  * Signs of stability (recurring salary, consistent patterns).\n"
        "  * Signs of stress (frequent overdraft-like behavior, many high-value debits relative to income).\n"
        "- It is fine to make soft assumptions, but always frame them as guesses.\n\n"
        "=== OUTPUT FORMAT (STRICT) ===\n"
        "- You MUST respond ONLY with a single line starting with 'SCORE_JSON:' followed by a valid JSON object.\n"
        "- That JSON MUST have the following keys:\n"
        "  * 'score' (integer between 300 and 850)\n"
        "  * 'label' (one of: 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent')\n"
        "  * 'explanation' (short human-readable sentence or two explaining why you chose this score)\n"
        "  * 'suggestions' (an array of 1–3 short, practical tips for improving or maintaining credit health)\n"
        "- Example:\n"
        "  SCORE_JSON: {\"score\": 705, \"label\": \"Good\", \"explanation\": \"Income is consistently higher than expenses with no obvious signs of distress.\", \"suggestions\": [\"Keep paying all bills on time\", \"Avoid carrying high card balances\"]}\n\n"
        "Respond ONLY in this SCORE_JSON format. Do not add any extra text."
    )


def build_score_user_prompt(context: Optional[Context]) -> str:
    """
    User prompt for the credit-health score estimation, based on context only.
    """
    parts: List[str] = []

    if context:
        if context.spending_summary:
            s = context.spending_summary
            parts.append("User's spending summary:\n")
            parts.append(f"- Period: {s.period}\n")
            parts.append(f"- Currency: {s.currency}\n")
            if s.total_income is not None:
                parts.append(f"- Total income: {s.total_income:.2f}\n")
            if s.total_expenses is not None:
                parts.append(f"- Total expenses: {s.total_expenses:.2f}\n")
            parts.append("- By category:\n")
            for c in s.by_category:
                parts.append(f"  * {c.category}: {c.amount:.2f} {s.currency}\n")
            parts.append("\n")

        if context.recent_transactions:
            parts.append("Recent Transactions (sample):\n")
            for tx in context.recent_transactions[-30:]:
                cat_str = f" [{tx.category or 'Uncategorized'}]" if tx.category else ""
                parts.append(
                    f"- [{tx.date}]{cat_str} {tx.type} {tx.amount:.2f} {tx.currency}: {tx.description}\n"
                )
            parts.append("\n")

    parts.append(
        "Using only this information, estimate a rough, educational 'credit health score' as described in the system prompt.\n"
    )

    return "".join(parts)


# =============================
# LLM call + timeout + parsers
# =============================

def call_llm(system_prompt: str, user_prompt: str) -> str:
    """
    Call Gemini using the new google.genai client.
    """
    if not client:
        return "I'm sorry, my brain (API key) is missing. Please configure the server."

    full_prompt = system_prompt + "\n\n" + user_prompt

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=full_prompt
        )

        if hasattr(response, "text") and response.text:
            return response.text.strip()

        return "I'm having trouble thinking right now. Please try again."

    except Exception as e:
        print("[Gemini error]", e)
        return "Oops! Clippy had a glitch. Try again in a moment."


def call_llm_with_timeout(system_prompt: str, user_prompt: str) -> str:
    """
    Wrap call_llm in a timeout so requests don't hang longer than LLM_TIMEOUT_SECONDS.
    """
    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
        future = executor.submit(call_llm, system_prompt, user_prompt)
        try:
            return future.result(timeout=LLM_TIMEOUT_SECONDS)
        except concurrent.futures.TimeoutError:
            return "Sorry, I'm taking too long to respond right now. Please try again in a moment."


def parse_reply_and_suggestions(raw: str) -> Tuple[str, List[str]]:
    """
    Parse the model output into (reply, suggestions).
    Expected format:
      <main reply text>
      SUGGESTIONS: option 1 | option 2 | option 3
    If parsing fails, returns (raw, []).
    """
    if not raw:
        return "", []

    lower = raw.lower()
    marker = "suggestions:"
    idx = lower.find(marker)
    if idx == -1:
        return raw.strip(), []

    reply_text = raw[:idx].strip()
    suggestions_part = raw[idx + len(marker):].strip()

    # Try splitting by '|'
    suggestions: List[str] = []
    if "|" in suggestions_part:
        chunks = suggestions_part.split("|")
    else:
        # Fallback: split by newlines
        chunks = suggestions_part.splitlines()

    for ch in chunks:
        s = ch.strip()
        # Remove leading bullet characters if present
        if s.startswith(("-", "•", "*")):
            s = s[1:].strip()
        if s:
            suggestions.append(s)

    # Keep only first 3 suggestions
    suggestions = suggestions[:3]

    return reply_text, suggestions


def build_suggested_replies_fallback(user_message: str) -> List[str]:
    """
    Old rule-based suggestions kept as a fallback in case the model
    doesn't follow the SUGGESTIONS format.
    """
    text = (user_message or "").lower()

    if any(word in text for word in ["suspicious", "fraud", "fraudulent", "chargeback"]):
        return [
            "Show me all recent card payments",
            "Highlight other unusual charges",
            "How do I block my card?"
        ]

    if any(word in text for word in ["food", "grocer", "restaurant", "coffee", "dining", "eat out", "eating out"]):
        return [
            "Break down my food spending by week",
            "Compare this month’s food spending to last month",
            "Help me set a food budget"
        ]

    if any(word in text for word in ["save", "saving", "budget", "plan", "overspend", "too much"]):
        return [
            "Help me create a simple monthly budget",
            "Show where I overspend the most",
            "Give me one small saving tip"
        ]

    if any(word in text for word in ["smoke", "cigarette", "tobacco", "vape"]):
        return [
            "Estimate how much I’d save if I quit smoking",
            "Compare smoking costs to another category",
            "Show my non-smoking spending"
        ]

    if any(word in text for word in ["what if", "if i never", "if i stopped", "hypothetical", "bitcoin", "btc"]):
        return [
            "What if I never smoked?",
            "What if I stopped eating out?",
            "What if I invested some money instead?"
        ]

    # default generic options
    return [
        "Show me older transactions",
        "Help me save money",
        "Summarize my top spending categories"
    ]


def parse_score_output(raw: str) -> Optional[ScoreResponse]:
    """
    Parse SCORE_JSON: { ... } from the LLM output into ScoreResponse.
    """
    if not raw:
        return None

    lower = raw.lower()
    marker = "score_json:"
    idx = lower.find(marker)
    if idx == -1:
        return None

    json_part = raw[idx + len(marker):].strip()
    try:
        data = json.loads(json_part)
        score = int(data.get("score", 0))
        label = str(data.get("label", "Unknown"))
        explanation = str(data.get("explanation", "")).strip()
        suggestions_raw = data.get("suggestions", [])
        suggestions = [str(s).strip() for s in suggestions_raw if str(s).strip()]
        return ScoreResponse(
            score=score,
            label=label,
            explanation=explanation,
            suggestions=suggestions[:3],
        )
    except Exception as e:
        print("[Score parse error]", e)
        return None


# =============================
# API ENDPOINTS
# =============================

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "clippy_v2.5", "timeout_seconds": LLM_TIMEOUT_SECONDS}


@app.post("/clippy/message", response_model=ClippyResponse)
def clippy_message(req: ClippyRequest):

    session_id = req.session_id or str(uuid.uuid4())

    # Initial greeting → NO LLM CALL
    if req.meta.first_greeting or req.meta.new_session:
        SESSIONS[session_id] = []
        return ClippyResponse(
            reply=(
                "Hey, I'm Clippy, your retro little bank sidekick. "
                "I can peek at your recent transactions and turn them into something that actually makes sense. "
                "What would you like to look at first?"
            ),
            suggested_replies=[
                "Show me a quick spending overview",
                "Do I have any suspicious charges?",
                "How much did I spend on food lately?"
            ],
            actions=[]
        )

    # Build messages
    system_prompt = build_system_prompt()
    user_prompt = build_user_prompt(req.message or "", req.context)

    # Call LLM with timeout
    raw_reply = call_llm_with_timeout(system_prompt, user_prompt)

    # Parse into main reply + model-generated suggestions
    reply_text, suggestions = parse_reply_and_suggestions(raw_reply)

    if not reply_text:
        reply_text = raw_reply or "Sorry, I got a bit tangled. Could you try asking that again?"

    if not suggestions:
        # Fallback if model didn't follow the format
        suggestions = build_suggested_replies_fallback(req.message or "")

    # Save history (optional, still simple key-value store)
    history = SESSIONS.get(session_id, [])
    history.append({"role": "user", "content": req.message or ""})
    history.append({"role": "assistant", "content": reply_text})
    SESSIONS[session_id] = history

    return ClippyResponse(
        reply=reply_text,
        suggested_replies=suggestions,
        actions=[]
    )


@app.post("/clippy/whatif", response_model=ClippyResponse)
def clippy_whatif(req: WhatIfRequest):
    """
    Flexible what-if analysis.

    Example questions:
    - "How would my account look if I never smoked?"
    - "What if I stopped eating out?"
    - "What if I had invested 1,000 RON in Bitcoin 10 years ago?"
    - "What fun things could I have done with the money I spent on ridesharing?"
    """
    session_id = req.session_id or str(uuid.uuid4())

    system_prompt = build_what_if_system_prompt()
    user_prompt = build_what_if_user_prompt(req.question, req.context)

    reply = call_llm_with_timeout(system_prompt, user_prompt)

    # Store in the same session history for continuity
    history = SESSIONS.get(session_id, [])
    history.append({"role": "user", "content": f"[WHAT-IF] {req.question}"})
    history.append({"role": "assistant", "content": reply})
    SESSIONS[session_id] = history

    # Suggested replies tailored to what-if mode (can keep simple/static here)
    suggested = [
        "What if I cut my food spending by half?",
        "What if I stopped using ride-sharing?",
        "Compare this what-if with my actual spending"
    ]

    return ClippyResponse(
        reply=reply,
        suggested_replies=suggested,
        actions=[]
    )


@app.post("/score", response_model=ScoreResponse)
def score_endpoint(req: ScoreRequest):
    """
    Estimate a rough 'credit health score' (300–850) based ONLY on the provided context.

    IMPORTANT:
    - This is NOT a real FICO® or official credit score.
    - It is a fictional, educational estimate based on limited data.
    """
    system_prompt = build_score_system_prompt()
    user_prompt = build_score_user_prompt(req.context)

    raw = call_llm_with_timeout(system_prompt, user_prompt)
    parsed = parse_score_output(raw)

    if not parsed:
        # Fallback very generic response if parsing failed or timed out
        return ScoreResponse(
            score=650,
            label="Fair",
            explanation=(
                "I couldn't read a structured score from the model, "
                "so this is a generic placeholder estimate based on limited data."
            ),
            suggestions=[
                "Pay all bills on time",
                "Avoid maxing out cards or overdrawing accounts",
                "Keep a stable income-to-expense pattern",
            ],
        )

    return parsed


# Demo endpoint without a database
@app.post("/clippy/demo", response_model=ClippyResponse)
def clippy_demo():
    fake_request = ClippyRequest(
        session_id="demo",
        message="What happened yesterday?",
        context=Context(
            spending_summary=SpendingSummary(
                period="2025-11",
                currency="RON",
                total_income=5000,
                total_expenses=2000,
                by_category=[
                    CategoryAmount(category="Food", amount=500),
                    CategoryAmount(category="Smoking", amount=300),
                    CategoryAmount(category="Transport", amount=400),
                ]
            ),
            recent_transactions=[
                Transaction(id=1, date="2025-11-20", amount=50.00, type="DEBIT",
                            description="Mega Image", category="Food"),
                Transaction(id=2, date="2025-11-21", amount=120.00, type="DEBIT",
                            description="Gas Station", category="Transport"),
                Transaction(id=3, date="2025-11-21", amount=15.00, type="DEBIT",
                            description="Coffee Shop", category="Food"),
                Transaction(id=4, date="2025-11-22", amount=5000.00, type="CREDIT",
                            description="Salary", category="Income"),
                Transaction(id=5, date="2025-11-23", amount=40.00, type="DEBIT",
                            description="Cigarettes", category="Smoking"),
            ]
        )
    )
    return clippy_message(fake_request)


# Optional demo for the what-if endpoint
@app.post("/clippy/demo-whatif", response_model=ClippyResponse)
def clippy_demo_whatif():
    fake_request = WhatIfRequest(
        session_id="demo-whatif",
        question="What if I had never smoked and invested 1,000 RON in Bitcoin 10 years ago?",
        context=Context(
            spending_summary=SpendingSummary(
                period="2025-11",
                currency="RON",
                total_income=5000,
                total_expenses=2000,
                by_category=[
                    CategoryAmount(category="Food", amount=500),
                    CategoryAmount(category="Smoking", amount=300),
                    CategoryAmount(category="Transport", amount=400),
                ]
            ),
            recent_transactions=[
                Transaction(id=1, date="2025-11-20", amount=50.00, type="DEBIT",
                            description="Mega Image", category="Food"),
                Transaction(id=2, date="2025-11-21", amount=120.00, type="DEBIT",
                            description="Gas Station", category="Transport"),
                Transaction(id=3, date="2025-11-21", amount=15.00, type="DEBIT",
                            description="Coffee Shop", category="Food"),
                Transaction(id=4, date="2025-11-22", amount=5000.00, type="CREDIT",
                            description="Salary", category="Income"),
                Transaction(id=5, date="2025-11-23", amount=40.00, type="DEBIT",
                            description="Cigarettes", category="Smoking"),
                Transaction(id=6, date="2025-11-24", amount=35.00, type="DEBIT",
                            description="Cigarettes at gas station", category="Smoking"),
            ]
        )
    )
    return clippy_whatif(fake_request)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
