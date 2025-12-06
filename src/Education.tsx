import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "98.css";

// Structura datelor (Cărți și Pagini)
const EDUCATION_DATA = [
    {
        id: "intro",
        title: "Bun venit la OldBank Academy",
        type: "page",
        icon: "https://win98icons.alexmeub.com/icons/png/help_question_mark-0.png",
        content: (
            <div>
                <h3>Bine ați venit la OldBank Academy!</h3>
                <p>Aici veți găsi resurse esențiale pentru a naviga în lumea finanțelor. Misiunea noastră este să transformăm "limbajul bancar" în ceva simplu și accesibil.</p>
                <p>Selectați un subiect din meniul din stânga pentru a începe.</p>
                <br />
                <strong>Subiecte populare:</strong>
                <ul>
                    <li>Cum să economisești inteligent</li>
                    <li>Ghidul de securitate online</li>
                    <li>Dicționar de termeni bancari</li>
                </ul>
            </div>
        )
    },
    {
        id: "savings",
        title: "Economisire și Buget",
        type: "book",
        children: [
            {
                id: "rule_50_30_20",
                title: "Regula 50/30/20",
                type: "page",
                content: (
                    <div>
                        <h4>Regula de aur a bugetului: 50/30/20</h4>
                        <p>Aceasta este o metodă simplă de a-ți împărți venitul lunar:</p>
                        <ul>
                            <li><strong>50% - Nevoi:</strong> Chirii, facturi, mâncare.</li>
                            <li><strong>30% - Dorințe:</strong> Ieșiri în oraș, haine, hobby-uri.</li>
                            <li><strong>20% - Economii:</strong> Fond de urgență, investiții.</li>
                        </ul>
                        <p style={{ color: 'gray', fontStyle: 'italic' }}>Sfat: Automatizează transferul celor 20% în ziua de salariu!</p>
                    </div>
                )
            },
            {
                id: "emergency_fund",
                title: "Fondul de Urgență",
                type: "page",
                content: (
                    <div>
                        <h4>Ce este Fondul de Urgență?</h4>
                        <p>Este o sumă de bani pusă deoparte exclusiv pentru situații neprevăzute (probleme medicale, reparații auto, pierderea jobului).</p>
                        <p><strong>Cât să strângi?</strong> Recomandăm echivalentul a 3-6 luni de cheltuieli esențiale.</p>
                    </div>
                )
            }
        ]
    },
    {
        id: "security",
        title: "Securitate Digitală",
        type: "book",
        children: [
            {
                id: "phishing",
                title: "Ce este Phishing-ul?",
                type: "page",
                content: (
                    <div>
                        <h4 style={{ color: 'red' }}>Atenție la Phishing!</h4>
                        <p>Phishing-ul este încercarea frauduloasă de a obține informații sensibile (parole, date card) pretinzând a fi o entitate de încredere (ex: OldBank).</p>
                        <p><strong>Cum te protejezi?</strong></p>
                        <ul>
                            <li>Nu da click pe link-uri suspecte din SMS/Email.</li>
                            <li>OldBank nu îți va cere niciodată PIN-ul prin telefon.</li>
                            <li>Verifică mereu adresa expeditorului.</li>
                        </ul>
                    </div>
                )
            },
            {
                id: "passwords",
                title: "Parole Puternice",
                type: "page",
                content: (
                    <div>
                        <h4>Ghid pentru parole sigure</h4>
                        <p>Nu folosi "123456" sau "parola". O parolă sigură trebuie să aibă:</p>
                        <ul>
                            <li>Minim 12 caractere.</li>
                            <li>Litere mari, mici, numere și simboluri (!@#).</li>
                            <li>Să fie unică pentru fiecare cont.</li>
                        </ul>
                    </div>
                )
            }
        ]
    },
    {
        id: "glossary",
        title: "Dicționar Bancar",
        type: "book",
        children: [
            {
                id: "robor_ircc",
                title: "ROBOR vs IRCC",
                type: "page",
                content: (
                    <div>
                        <h4>ROBOR vs IRCC</h4>
                        <p>Doi indici importanți pentru credite:</p>
                        <dl>
                            <dt><strong>ROBOR</strong></dt>
                            <dd>Dobânda medie la care băncile se împrumută între ele.</dd>
                            <dt><strong>IRCC</strong></dt>
                            <dd>Indice de referință pentru creditele consumatorilor (calculat trimestrial).</dd>
                        </dl>
                    </div>
                )
            }
        ]
    }
];

// --- DATE QUIZ ---
const QUIZ_QUESTIONS = [
    {
        id: 1,
        question: "Care este procentul recomandat pentru economii conform regulii 50/30/20?",
        options: ["10%", "20%", "30%", "50%"],
        correct: 1
    },
    {
        id: 2,
        question: "Ce reprezintă Phishing-ul?",
        options: ["Un tip de investiție sigură", "O metodă de pescuit sportiv", "Furt de date prin înșelăciune", "Un bonus bancar"],
        correct: 2
    },
    {
        id: 3,
        question: "Câte luni de cheltuieli ar trebui să acopere Fondul de Urgență?",
        options: ["1 lună", "3-6 luni", "1 an", "Nu e nevoie"],
        correct: 1
    }
];

// --- COMPONENTA DRAGGABLE ---
interface DraggableWindowProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    width?: number | string;
    height?: number | string;
}

const DraggableWindow: React.FC<DraggableWindowProps> = ({ title, children, onClose, width = 800, height = 500 }) => {
    const [pos, setPos] = useState<{ x: number | string, y: number | string }>({ x: "50%", y: "50%" });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const windowRef = useRef<HTMLDivElement>(null);

    const startDrag = (e: React.MouseEvent) => {
        e.preventDefault();
        if (windowRef.current) {
            const rect = windowRef.current.getBoundingClientRect();
            setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            setPos({ x: rect.left, y: rect.top });
            setIsDragging(true);
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            setPos({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
        };
        const handleMouseUp = () => setIsDragging(false);
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    const transformStyle = (typeof pos.x === 'string' && pos.x === '50%') ? "translate(-50%, -50%)" : "none";

    return (
        <div ref={windowRef} className="window" style={{ position: "fixed", left: pos.x, top: pos.y, transform: transformStyle, width, height, zIndex: 100, boxShadow: "10px 10px 0px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column" }}>
            <div className="title-bar" onMouseDown={startDrag} style={{ cursor: "move", userSelect: "none" }}>
                <div className="title-bar-text">{title}</div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize"></button>
                    <button aria-label="Maximize"></button>
                    <button aria-label="Close" onClick={onClose}></button>
                </div>
            </div>
            <div className="window-body" style={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>{children}</div>
        </div>
    );
};

// --- COMPONENTA EDUCATION ---
const Education: React.FC = () => {
    const navigate = useNavigate();
    const [selectedPage, setSelectedPage] = useState<any>(EDUCATION_DATA[0]);
    const [openBooks, setOpenBooks] = useState<{ [key: string]: boolean }>({ "savings": true });

    // QUIZ STATE
    const [showQuiz, setShowQuiz] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: number }>({});
    const [showResults, setShowResults] = useState(false);

    const toggleBook = (id: string) => {
        setOpenBooks(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSelect = (item: any) => {
        if (item.type === 'page') {
            setSelectedPage(item);
        } else {
            toggleBook(item.id);
        }
    };

    const handleAnswer = (optionIndex: number) => {
        setAnswers(prev => ({ ...prev, [currentQuestion]: optionIndex }));
    };

    const handleNextQuestion = () => {
        if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResults(true);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const calculateScore = () => {
        let score = 0;
        QUIZ_QUESTIONS.forEach((q, idx) => {
            if (answers[idx] === q.correct) score++;
        });
        return score;
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setAnswers({});
        setShowResults(false);
        setShowQuiz(false);
    };

    const renderTree = (items: any[], depth = 0) => {
        return items.map((item) => (
            <div key={item.id} style={{ marginLeft: depth * 15 }}>
                <div
                    onClick={() => handleSelect(item)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        cursor: 'pointer',
                        padding: '2px',
                        background: (selectedPage.id === item.id) ? '#000080' : 'transparent',
                        color: (selectedPage.id === item.id) ? 'white' : 'black'
                    }}
                >
                    <img
                        src={item.type === 'book'
                            ? (openBooks[item.id]
                                ? "https://win98icons.alexmeub.com/icons/png/help_book_open-4.png"
                                : "https://win98icons.alexmeub.com/icons/png/help_book_closed-4.png")
                            : "https://win98icons.alexmeub.com/icons/png/help_question_mark-0.png"
                        }
                        alt="icon"
                        style={{ width: 16, height: 16 }}
                    />
                    <span style={{ fontSize: 12 }}>{item.title}</span>
                </div>
                {item.type === 'book' && openBooks[item.id] && item.children && (
                    renderTree(item.children, depth + 1)
                )}
            </div>
        ));
    };

    return (
        <div style={{ height: "100vh", overflow: "hidden", background: "transparent" }}>

            <DraggableWindow title="OldBank Help System" width={800} height={550} onClose={() => navigate('/about')}>
                <div style={{ padding: "5px", borderBottom: "1px solid gray", display: "flex", gap: "10px", background: "#c0c0c0" }}>
                    <button style={{ minWidth: 60 }} onClick={() => navigate('/about')}>Index</button>
                    <button style={{ minWidth: 60 }} disabled>Back</button>
                    <button style={{ minWidth: 60 }} onClick={() => window.print()}>Print</button>
                    <button style={{ minWidth: 60 }} disabled>Options</button>
                    <div style={{ flexGrow: 1 }}></div>
                    <button style={{ fontWeight: 'bold', color: 'blue' }} onClick={() => setShowQuiz(true)}>📝 Take Quiz</button>
                </div>

                <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                    <div className="sunken-panel" style={{ width: "250px", background: "white", overflowY: "auto", padding: "10px", borderRight: "2px solid gray" }}>
                        {renderTree(EDUCATION_DATA)}
                    </div>
                    <div style={{ flexGrow: 1, background: "white", overflowY: "auto", padding: "20px" }}>
                        {selectedPage ? (
                            <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.5" }}>
                                <div style={{ borderBottom: "1px solid #ccc", paddingBottom: 10, marginBottom: 15 }}>
                                    <h2 style={{ margin: 0 }}>{selectedPage.title}</h2>
                                </div>
                                {selectedPage.content}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', marginTop: 50, color: 'gray' }}>Select a topic from the left.</div>
                        )}
                    </div>
                </div>
            </DraggableWindow>

            {/* --- QUIZ POPUP --- */}
            {showQuiz && (
                <DraggableWindow title="OldBank Exam Simulator v1.0" width={500} height={480} onClose={() => setShowQuiz(false)}>
                    <div style={{ padding: "20px", display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box", overflowY: "auto" }}>

                        <div style={{ display: 'flex', gap: 15, marginBottom: 20, alignItems: 'center' }}>
                            <img src="https://win98icons.alexmeub.com/icons/png/chm-0.png" style={{ width: 48, height: 48 }} alt="quiz" />
                            <div>
                                <h3 style={{ margin: 0 }}>Financial Literacy Exam</h3>
                                <p style={{ margin: 0, fontSize: 12 }}>Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}</p>
                            </div>
                        </div>

                        {!showResults ? (
                            <>
                                <fieldset style={{ flexGrow: 1, marginBottom: 10, padding: 15 }}>
                                    <legend style={{ fontWeight: 'bold' }}>Question</legend>
                                    <p style={{ fontSize: 14, marginBottom: 20 }}>{QUIZ_QUESTIONS[currentQuestion].question}</p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {QUIZ_QUESTIONS[currentQuestion].options.map((opt, idx) => (
                                            <div key={idx} className="field-row">
                                                <input
                                                    type="radio"
                                                    id={`opt-${idx}`}
                                                    name="quiz-option"
                                                    checked={answers[currentQuestion] === idx}
                                                    onChange={() => handleAnswer(idx)}
                                                />
                                                <label htmlFor={`opt-${idx}`} style={{ cursor: 'pointer', fontSize: 13 }}>{opt}</label>
                                            </div>
                                        ))}
                                    </div>
                                </fieldset>

                                {/* Bara Progres */}
                                <div style={{ marginBottom: 15 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                                        <span>Progress</span>
                                        <span>{Math.round(((currentQuestion) / QUIZ_QUESTIONS.length) * 100)}%</span>
                                    </div>
                                    <div style={{ height: 20, width: "100%", background: "white", border: "1px solid gray", padding: 2 }}>
                                        <div style={{ height: "100%", width: `${((currentQuestion) / QUIZ_QUESTIONS.length) * 100}%`, background: "navy" }}></div>
                                    </div>
                                </div>

                                {/* BUTOANELE DE NAVIGARE (AICI ERA PROBLEMA) */}
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <button
                                        onClick={handlePrevQuestion}
                                        disabled={currentQuestion === 0}
                                        style={{ width: 80 }}
                                    >
                                        &lt; Back
                                    </button>
                                    <button
                                        onClick={handleNextQuestion}
                                        disabled={answers[currentQuestion] === undefined}
                                        style={{ width: 80, fontWeight: 'bold' }}
                                    >
                                        {currentQuestion === QUIZ_QUESTIONS.length - 1 ? "Finish" : "Next >"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <div style={{ fontSize: 60 }}>
                                    {calculateScore() === QUIZ_QUESTIONS.length ? "🏆" : calculateScore() > 0 ? "👍" : "📚"}
                                </div>
                                <h2>Exam Completed!</h2>
                                <p style={{ fontSize: 16 }}>Your Score: <strong>{calculateScore()} / {QUIZ_QUESTIONS.length}</strong></p>
                                <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                                    <button onClick={() => { setAnswers({}); setCurrentQuestion(0); setShowResults(false); }} style={{ width: 100 }}>Retry</button>
                                    <button onClick={resetQuiz} style={{ width: 100 }}>Close</button>
                                </div>
                            </div>
                        )}
                    </div>
                </DraggableWindow>
            )}
        </div>
    );
};

export default Education;