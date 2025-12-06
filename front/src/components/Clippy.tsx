import React, { useState, useRef, useEffect } from 'react';

interface ClippyProps {
    username: string;
    accounts: any[];
}

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'clippy';
}

interface CategoryAmount {
    category: string;
    amount: number;
}

interface SpendingSummary {
    period: string;
    currency: string;
    total_income?: number;
    total_expenses?: number;
    by_category: CategoryAmount[];
}

interface Transaction {
    id: number;
    date: string;
    amount: number;
    currency: string;
    type: 'DEBIT' | 'CREDIT';
    description: string;
    category?: string;
}

interface Context {
    spending_summary?: SpendingSummary;
    recent_transactions?: Transaction[];
}

interface Meta {
    new_session: boolean;
    first_greeting: boolean;
}

interface ClippyRequest {
    session_id?: string;
    user_id?: string;
    message?: string;
    locale?: string;
    context?: Context;
    meta?: Meta;
}

interface Action {
    type: string;
    data: any;
}

interface ClippyResponse {
    reply: string;
    suggested_replies: string[];
    actions: Action[];
}

const Clippy: React.FC<ClippyProps> = ({ username, accounts }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        // Initial placeholder, will be replaced/augmented by greeting
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId, setSessionId] = useState<string>('');
    const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    // Initialize session and get greeting
    useEffect(() => {
        const newSessionId = crypto.randomUUID();
        setSessionId(newSessionId);

        // Fetch greeting
        fetchGreeting(newSessionId);
    }, []);

    const fetchGreeting = async (sid: string) => {
        setIsTyping(true);
        try {
            const req: ClippyRequest = {
                session_id: sid,
                user_id: username,
                meta: {
                    new_session: true,
                    first_greeting: true
                },
                // We can construct a basic context if we have data, but initially maybe not needed for greeting
                context: {
                    spending_summary: {
                        period: new Date().toISOString().slice(0, 7), // YYYY-MM
                        currency: 'RON',
                        by_category: accounts.map(acc => ({ category: acc.name, amount: acc.balance })) // Gross simplification for context
                    }
                }
            };

            const response = await fetch('/clippy/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req)
            });

            if (response.ok) {
                const data: ClippyResponse = await response.json();
                setMessages(prev => [...prev, { id: Date.now(), text: data.reply, sender: 'clippy' }]);
                setSuggestedReplies(data.suggested_replies);
            }
        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { id: Date.now(), text: "Hi! I'm Clippy. (Connection error)", sender: 'clippy' }]);
        } finally {
            setIsTyping(false);
        }
    };

    const fetchAllTransactions = async (): Promise<Transaction[]> => {
        const token = localStorage.getItem('token');
        if (!token || accounts.length === 0) return [];

        const allTx: Transaction[] = [];
        for (const acc of accounts) {
            try {
                const res = await fetch(`http://localhost:8090/api/v1/bank/accounts/${acc.id}/transactions`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    // Enrich with currency from account
                    const enriched = data.map((t: any) => ({
                        id: t.id,
                        date: t.createdAt, // Backend sends 'createdAt'
                        amount: t.amount,
                        currency: acc.currency,
                        type: t.type,
                        description: t.description,
                        category: t.category?.name || 'General' // Use name from backend object
                    }));
                    allTx.push(...enriched);
                }
            } catch (err) {
                console.error("Failed to fetch history for account " + acc.id, err);
            }
        }
        // Sort by date desc
        return allTx.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
    };

    const handleSendMessage = async (textOverride?: string) => {
        const textToSend = textOverride || inputValue;
        if (!textToSend.trim()) return;

        const newUserMsg: Message = {
            id: Date.now(),
            text: textToSend,
            sender: 'user'
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setSuggestedReplies([]); // Clear suggestions after user action
        setIsTyping(true);

        try {
            // Construct Context based on accounts (Mapping accounts to categories for now as a hack)
            const summary: SpendingSummary = {
                period: new Date().toISOString().slice(0, 7),
                currency: 'RON', // Defaulting
                total_income: 0,
                total_expenses: 0,
                by_category: accounts.map(acc => ({ category: acc.name, amount: acc.balance }))
            };

            const recentTransactions = await fetchAllTransactions();

            const req: ClippyRequest = {
                session_id: sessionId,
                user_id: username,
                message: textToSend,
                context: {
                    spending_summary: summary,
                    recent_transactions: recentTransactions
                },
                meta: {
                    new_session: false,
                    first_greeting: false
                }
            };

            const response = await fetch('/clippy/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req)
            });

            if (response.ok) {
                const data: ClippyResponse = await response.json();
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: data.reply,
                    sender: 'clippy'
                }]);
                setSuggestedReplies(data.suggested_replies);
            } else {
                setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting to the server.", sender: 'clippy' }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "An error occurred while sending your message.", sender: 'clippy' }]);
        } finally {
            setIsTyping(false);
        }
    };

    const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);
    const [whatIfMessages, setWhatIfMessages] = useState<Message[]>([
        { id: 0, text: "I can simulate financial scenarios. Ask me: 'What if I stopped smoking?' or 'What if I cut dining out by 50%?'", sender: 'clippy' }
    ]);
    const [whatIfInput, setWhatIfInput] = useState('');
    const [isWhatIfThinking, setIsWhatIfThinking] = useState(false);
    const whatIfEndRef = useRef<HTMLDivElement>(null);

    const handleWhatIf = async () => {
        if (!whatIfInput.trim()) return;

        const newUserMsg: Message = {
            id: Date.now(),
            text: whatIfInput,
            sender: 'user'
        };

        setWhatIfMessages(prev => [...prev, newUserMsg]);
        const question = whatIfInput;
        setWhatIfInput('');
        setIsWhatIfThinking(true);

        try {
            // Construct Context
            const summary: SpendingSummary = {
                period: new Date().toISOString().slice(0, 7),
                currency: 'RON',
                total_income: 0,
                total_expenses: 0,
                by_category: accounts.map(acc => ({ category: acc.name, amount: acc.balance }))
            };

            const recentTransactions = await fetchAllTransactions();

            const req = {
                session_id: sessionId, // Shared session ID ok? Or new? Let's share for context or new. New is safer for clean slate.
                user_id: username,
                question: question,
                context: {
                    spending_summary: summary,
                    recent_transactions: recentTransactions
                }
            };

            const response = await fetch('/clippy/whatif', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req)
            });

            if (response.ok) {
                const data = await response.json();
                setWhatIfMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: data.reply,
                    sender: 'clippy'
                }]);
            } else {
                setWhatIfMessages(prev => [...prev, { id: Date.now() + 1, text: "Simulation failed. Try again.", sender: 'clippy' }]);
            }
        } catch (error) {
            console.error(error);
            setWhatIfMessages(prev => [...prev, { id: Date.now() + 1, text: "Error connecting to simulation engine.", sender: 'clippy' }]);
        } finally {
            setIsWhatIfThinking(false);
        }
    };

    useEffect(() => {
        if (isWhatIfOpen) {
            whatIfEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [whatIfMessages, isWhatIfOpen]);

    const handleReset = () => {
        setMessages([]);
        setSuggestedReplies([]);
        const newSessionId = crypto.randomUUID();
        setSessionId(newSessionId);
        fetchGreeting(newSessionId);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <>
            {/* === MAIN CLIPPY (Bottom Right) === */}
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'end'
            }}>
                {isOpen && (
                    <div className="window" style={{ marginBottom: '10px', width: '300px', height: '450px', display: 'flex', flexDirection: 'column' }}>
                        <div className="title-bar">
                            <div className="title-bar-text">Clippy Assistant</div>
                            <div className="title-bar-controls">
                                <button aria-label="Close" onClick={() => setIsOpen(false)}></button>
                            </div>
                        </div>
                        <div className="window-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px', padding: '5px', background: 'white', border: '1px solid #808080' }}>
                                {messages.map(msg => (
                                    <div key={msg.id} style={{
                                        marginBottom: '5px',
                                        textAlign: msg.sender === 'user' ? 'right' : 'left'
                                    }}>
                                        <span style={{
                                            background: msg.sender === 'user' ? '#e0e0e0' : '#ffffdd',
                                            padding: '5px 10px',
                                            borderRadius: '5px',
                                            display: 'inline-block',
                                            border: '1px solid gray'
                                        }}>
                                            <strong>{msg.sender === 'user' ? 'You' : 'Clippy'}:</strong> {msg.text}
                                        </span>
                                    </div>
                                ))}
                                {isTyping && <p style={{ fontStyle: 'italic', fontSize: '12px' }}>Clippy is thinking...</p>}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Suggested Replies */}
                            {suggestedReplies.length > 0 && (
                                <div style={{ marginBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                    {suggestedReplies.map((suggestion, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSendMessage(suggestion)}
                                            style={{
                                                fontSize: '11px',
                                                padding: '4px 8px',
                                                fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif',
                                                cursor: 'pointer',
                                                color: suggestion.toLowerCase().includes('suspicious') ? 'white' : '#000080',
                                                backgroundColor: suggestion.toLowerCase().includes('suspicious') ? '#cc0000' : 'white',
                                                fontWeight: suggestion.toLowerCase().includes('suspicious') ? 'bold' : 'normal',
                                                border: 'none',
                                                boxShadow: suggestion.toLowerCase().includes('suspicious')
                                                    ? 'inset -1px -1px #550000, inset 1px 1px #ff6666, inset -2px -2px #880000, inset 2px 2px #ffcccc'
                                                    : 'inset -1px -1px #404040, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
                                            }}
                                        >
                                            {suggestion.toLowerCase().includes('suspicious') && <span style={{ marginRight: '4px' }}>⚠️</span>}
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '5px' }}>
                                <button onClick={handleReset} style={{ minWidth: '50px' }}>Reset</button>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={e => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    style={{ flex: 1 }}
                                    placeholder="Ask Clippy..."
                                />
                                <button onClick={() => handleSendMessage()}>Send</button>
                            </div>
                        </div>
                    </div>
                )}

                {!isOpen && messages.length > 0 && (
                    <div className="window" style={{ marginBottom: '10px', width: '200px', display: 'block' }}>
                        <div className="window-body">
                            <p>{messages[messages.length - 1].text}</p>
                        </div>
                    </div>
                )}

                <img
                    src="/assistants/clippy-white-1.gif"
                    alt="Clippy"
                    style={{ width: '150px', height: '150px', cursor: 'pointer' }}
                    onClick={() => setIsOpen(!isOpen)}
                />
            </div>

            {/* === WHAT-IF ASSISTANT (Bottom Left) === */}
            <div style={{
                position: 'fixed',
                bottom: '20px',
                left: '20px', // Left corner
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start'
            }}>
                {isWhatIfOpen && (
                    <div className="window" style={{ marginBottom: '10px', width: '300px', height: '400px', display: 'flex', flexDirection: 'column' }}>
                        <div className="title-bar">
                            <div className="title-bar-text">🔮 What-If Analysis</div>
                            <div className="title-bar-controls">
                                <button aria-label="Close" onClick={() => setIsWhatIfOpen(false)}></button>
                            </div>
                        </div>
                        <div className="window-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px', padding: '5px', background: 'black', color: '#00ff00', fontFamily: 'monospace', border: '1px solid #808080' }}>
                                {whatIfMessages.map(msg => (
                                    <div key={msg.id} style={{ marginBottom: '10px' }}>
                                        <strong>{msg.sender === 'user' ? '> YOU' : '> SYSTEM'}:</strong>
                                        <div style={{ marginLeft: '10px', whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                                    </div>
                                ))}
                                {isWhatIfThinking && <div>{'> CALCULATING PROJECTION...'}</div>}
                                <div ref={whatIfEndRef} />
                            </div>

                            <div style={{ display: 'flex', gap: '5px' }}>
                                <input
                                    type="text"
                                    value={whatIfInput}
                                    onChange={e => setWhatIfInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleWhatIf()}
                                    style={{ flex: 1, fontFamily: 'monospace' }}
                                    placeholder="Enter scenario..."
                                />
                                <button onClick={handleWhatIf}>Run</button>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setIsWhatIfOpen(!isWhatIfOpen)}
                    style={{
                        height: '40px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                >
                    🔮 What-If Analysis
                </button>
            </div>
        </>
    );
};

export default Clippy;
