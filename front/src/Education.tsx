import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "98.css";

// --- DATELE EDUCAȚIONALE (Conținut Retro) ---
const EDUCATION_DATA = [
    {
        id: "intro",
        title: "Bun venit",
        type: "page",
        icon: "https://win98icons.alexmeub.com/icons/png/help_question_mark-0.png",
        content: (
            <div style={{ padding: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ margin: 0, fontFamily: '"Pixelated MS Sans Serif", Arial', fontWeight: "bold" }}>OldBank Academy</h3>
                </div>

                <fieldset style={{ marginBottom: "20px" }}>
                    <legend>Info</legend>
                    <p style={{ marginTop: "5px", marginBottom: "10px" }}>
                        Bine ați venit! Aici găsiți resurse pentru a descifra tainele finanțelor.
                    </p>
                    <p style={{ margin: 0 }}>
                        Selectați un subiect din arborele din stânga.
                    </p>
                </fieldset>

                <div className="status-bar">
                    <p className="status-bar-field">Status: Ready</p>
                    <p className="status-bar-field">Tips: 3</p>
                </div>
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
                    <div style={{ padding: "5px" }}>
                        <fieldset>
                            <legend style={{ fontWeight: "bold" }}>Budget.exe</legend>
                            <p style={{ marginBottom: "15px" }}>Partitioning Disk (Income)...</p>

                            {/* Retro Table Style for 50/30/20 */}
                            <table style={{ width: "100%", border: "2px solid white", borderRight: "2px solid gray", borderBottom: "2px solid gray", background: "#c0c0c0", marginBottom: "15px" }}>
                                <tbody>
                                    <tr>
                                        <td style={{ width: "40px", border: "1px solid gray", textAlign: "center", fontWeight: "bold", background: "white" }}>50%</td>
                                        <td style={{ border: "1px solid gray", padding: "2px 5px" }}>Nevoi (Chirie, Hrană)</td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: "40px", border: "1px solid gray", textAlign: "center", fontWeight: "bold", background: "white" }}>30%</td>
                                        <td style={{ border: "1px solid gray", padding: "2px 5px" }}>Dorințe (Hobby, Fun)</td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: "40px", border: "1px solid gray", textAlign: "center", fontWeight: "bold", background: "white" }}>20%</td>
                                        <td style={{ border: "1px solid gray", padding: "2px 5px" }}>Economii (Viitor)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </fieldset>

                        <div style={{ marginTop: "15px", border: "1px solid gray", padding: "5px", background: "#FFFFE0", display: "flex", gap: "5px" }}>
                            <img src="https://win98icons.alexmeub.com/icons/png/msg_warning-0.png" style={{ width: 16, height: 16 }} alt="" />
                            <i style={{ fontSize: "11px" }}>Sfat: Automatizează transferul de 20% în ziua salariului.</i>
                        </div>
                    </div>
                )
            },
            {
                id: "emergency_fund",
                title: "Fondul de Urgență",
                type: "page",
                content: (
                    <div style={{ padding: "5px" }}>
                        <div style={{ marginBottom: "10px" }}>
                            <div>
                                <h4 style={{ margin: 0 }}>Safety_Net_v1.0</h4>
                                <p style={{ margin: 0, color: "gray", fontSize: "11px" }}>Protecție împotriva neprevăzutului.</p>
                            </div>
                        </div>

                        <div className="sunken-panel" style={{ background: "white", padding: "10px", marginBottom: "10px" }}>
                            <p>Fondul de urgență este "tamponul" tău financiar.</p>
                            <ul style={{ paddingLeft: "20px" }}>
                                <li>Probleme medicale</li>
                                <li>Reparații auto</li>
                                <li>Pierderea jobului</li>
                            </ul>
                        </div>

                        <fieldset>
                            <legend>Target</legend>
                            <div style={{ textAlign: "center", padding: "10px", fontWeight: "bold" }}>
                                3 - 6 luni de cheltuieli
                            </div>
                        </fieldset>
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
                    <div style={{ padding: "5px" }}>
                        <div style={{ border: "2px solid red", padding: "10px", background: "#FFE0E0", marginBottom: "15px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                                <h4 style={{ margin: 0, color: "red" }}>SECURITY ALERT</h4>
                            </div>
                            <p style={{ margin: 0 }}>Phishing-ul este o tentativă de fraudă.</p>
                        </div>

                        <fieldset>
                            <legend>Firewall Mental</legend>
                            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <input type="checkbox" checked readOnly /> Nu da click pe link-uri dubioase
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <input type="checkbox" checked readOnly /> Verifică adresa expeditorului
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <input type="checkbox" checked readOnly /> Banca nu cere PIN-ul
                                </label>
                            </div>
                        </fieldset>
                    </div>
                )
            },
            {
                id: "passwords",
                title: "Parole Puternice",
                type: "page",
                content: (
                    <div style={{ padding: "5px" }}>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                            <h4 style={{ margin: 0 }}>Password Generator</h4>
                        </div>

                        <fieldset>
                            <legend>Requirements</legend>
                            <ul style={{ listStyleType: "square", paddingLeft: "20px" }}>
                                <li>Minim 12 caractere</li>
                                <li>Litere (A-z)</li>
                                <li>Cifre (0-9)</li>
                                <li>Simboluri (!@#$)</li>
                            </ul>
                        </fieldset>

                        <div className="field-row" style={{ marginTop: "10px" }}>
                            <label>Bad Password:</label>
                            <input type="text" value="123456" disabled style={{ width: "100px" }} />
                        </div>
                        <div className="field-row" style={{ marginTop: "5px" }}>
                            <label>Good Password:</label>
                            <input type="text" value="Tr0ub4dor&3" disabled style={{ width: "100px" }} />
                        </div>
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
                    <div style={{ padding: "5px" }}>
                        <div className="sunken-panel" style={{ background: "white", height: "300px", padding: "5px", overflowY: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <tbody>
                                    <tr style={{ background: "navy", color: "white" }}>
                                        <td style={{ padding: "2px 5px", fontWeight: "bold" }}>Termen</td>
                                        <td style={{ padding: "2px 5px", fontWeight: "bold" }}>Definiție</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: "5px", borderBottom: "1px solid silver", fontWeight: "bold" }}>ROBOR</td>
                                        <td style={{ padding: "5px", borderBottom: "1px solid silver" }}>Dobânda la care băncile își "vând" bani între ele.</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: "5px", borderBottom: "1px solid silver", fontWeight: "bold" }}>IRCC</td>
                                        <td style={{ padding: "5px", borderBottom: "1px solid silver" }}>Indice pentru creditele consumatorilor (mai stabil).</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: "5px", borderBottom: "1px solid silver", fontWeight: "bold" }}>DAE</td>
                                        <td style={{ padding: "5px", borderBottom: "1px solid silver" }}>Dobânda Anuală Efectivă (costul total al creditului).</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
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
        options: ["Un tip de investiție", "Pescuit sportiv", "Furt de date", "Un bonus"],
        correct: 2
    },
    {
        id: 3,
        question: "Cât trebuie să acopere Fondul de Urgență?",
        options: ["3-6 luni de cheltuieli", "1 lună", "1 an", "Nu e nevoie"],
        correct: 0
    }
];

// --- COMPONENTA DRAGGABLE (Stil Social.tsx) ---
interface DraggableWindowProps {
    title: string;
    icon?: string;
    children: React.ReactNode;
    onClose: () => void;
    width?: number | string;
    height?: number | string;
    zIndex?: number;
}

const DraggableWindow: React.FC<DraggableWindowProps> = ({
    title,
    icon = "https://win98icons.alexmeub.com/icons/png/chm-0.png",
    children,
    onClose,
    width = 800,
    height = 500,
    zIndex = 100
}) => {
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
        <div
            ref={windowRef}
            className="window"
            style={{
                position: "fixed",
                left: pos.x,
                top: pos.y,
                transform: transformStyle,
                width,
                height,
                zIndex,
                boxShadow: "10px 10px 0px rgba(0,0,0,0.5)",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <div className="title-bar" onMouseDown={startDrag} style={{ cursor: "move", userSelect: "none" }}>
                <div className="title-bar-text" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <img src={icon} style={{ width: 16, height: 16 }} alt="" />
                    {title}
                </div>
                <div className="title-bar-controls">
                    <button aria-label="Close" onClick={onClose}></button>
                </div>
            </div>
            <div className="window-body" style={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden", margin: 0, padding: 2 }}>
                {children}
            </div>
        </div>
    );
};

// --- COMPONENTA MAIN ---
const Education: React.FC = () => {
    const navigate = useNavigate();
    const [selectedPage, setSelectedPage] = useState<any>(EDUCATION_DATA[0]);

    // Quiz State
    const [showQuiz, setShowQuiz] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: number }>({});
    const [showResults, setShowResults] = useState(false);

    const handleSelect = (item: any) => {
        if (item.type === 'page') {
            setSelectedPage(item);
        }
        // If type is book, do nothing (static)
    };

    // --- Quiz Logic ---
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

    // --- Tree Render (Modified for Static Folders) ---
    const renderTree = (items: any[], depth = 0) => {
        return items.map((item) => (
            <div key={item.id} style={{ marginLeft: depth * 15 }}>
                <div
                    onClick={() => handleSelect(item)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        cursor: item.type === 'page' ? 'pointer' : 'default', // Only pages represent actionable items
                        padding: '1px 2px',
                        background: (selectedPage?.id === item.id) ? '#000080' : 'transparent',
                        color: (selectedPage?.id === item.id) ? 'white' : 'black',
                        border: (selectedPage?.id === item.id) ? '1px dotted white' : '1px solid transparent',
                        fontSize: '11px',
                        fontFamily: '"MS Sans Serif", sans-serif'
                    }}
                >
                    <img
                        src={item.type === 'book'
                            ? "https://win98icons.alexmeub.com/icons/png/directory_closed-5.png" // Always open icon
                            : "https://win98icons.alexmeub.com/icons/png/help_question_mark-0.png"
                        }
                        alt="icon"
                        style={{ width: 16, height: 16 }}
                    />
                    <span>{item.title}</span>
                </div>
                {/* Always render children if they exist, ignoring any open/close content state */}
                {item.type === 'book' && item.children && (
                    renderTree(item.children, depth + 1)
                )}
            </div>
        ));
    };

    return (
        <div style={{ height: "100vh", overflow: "hidden", background: "transparent" }}>

            <DraggableWindow
                title="OldBank Help System"
                onClose={() => navigate('/about')}
            >
                {/* TOOLBAR (Stil Windows 98 Help) */}
                <div style={{ padding: "4px", borderBottom: "1px solid gray", display: "flex", gap: "5px", background: "#c0c0c0", alignItems: "center" }}>
                    <button style={{ minWidth: 60 }} onClick={() => navigate('/about')}>Back</button>

                    <div style={{ width: 1, height: 18, background: 'gray', margin: '0 2px', borderRight: '1px solid white' }}></div>

                    <button style={{ fontWeight: 'bold' }} onClick={() => setShowQuiz(true)}>
                        <img src="https://win98icons.alexmeub.com/icons/png/keys-0.png" style={{ width: 12, marginRight: 5 }} alt="" />
                        Mini-Quiz
                    </button>
                </div>

                <div style={{ display: "flex", flexGrow: 1, overflow: "hidden", padding: "5px", gap: "5px", background: "#c0c0c0" }}>

                    {/* LEFT PANEL: Tree View */}
                    <div className="sunken-panel" style={{ width: "220px", background: "white", overflowY: "auto", padding: "5px" }}>
                        {renderTree(EDUCATION_DATA)}
                    </div>

                    {/* RIGHT PANEL: Content */}
                    <div className="sunken-panel" style={{ flexGrow: 1, background: "white", overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column" }}>
                        {selectedPage ? (
                            <div style={{ fontFamily: '"MS Sans Serif", sans-serif', fontSize: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '2px solid #ccc', paddingBottom: 10, marginBottom: 15 }}>
                                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>{selectedPage.title}</h2>
                                </div>
                                <div style={{ lineHeight: '1.5' }}>
                                    {selectedPage.content}
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', marginTop: 50, color: 'gray' }}>Select a topic to read.</div>
                        )}
                    </div>
                </div>

                {/* STATUS BAR */}
                <div className="status-bar" style={{ marginTop: 0 }}>
                    <p className="status-bar-field">Topic: {selectedPage?.title || "None"}</p>
                    <p className="status-bar-field">OldBank Academy v1.0</p>
                </div>
            </DraggableWindow>

            {/* --- QUIZ POPUP WINDOW --- */}
            {showQuiz && (
                <DraggableWindow
                    title="Evaluation Mode"
                    width={450}
                    height={450}
                    zIndex={200}
                    icon="https://win98icons.alexmeub.com/icons/png/keys-0.png"
                    onClose={() => setShowQuiz(false)}
                >
                    <div style={{ padding: "15px", display: "flex", flexDirection: "column", height: "100%", background: "#c0c0c0" }}>

                        {!showResults ? (
                            <>
                                <div style={{ marginBottom: 15, display: 'flex', gap: 10, alignItems: 'center' }}>
                                    <img src="https://win98icons.alexmeub.com/icons/png/msg_question-0.png" style={{ width: 32, height: 32 }} alt="" />
                                    <div>
                                        <strong>Question {currentQuestion + 1} / {QUIZ_QUESTIONS.length}</strong>
                                        <div style={{ fontSize: '11px', color: '#555' }}>Selectați răspunsul corect.</div>
                                    </div>
                                </div>

                                <fieldset style={{ flexGrow: 1, marginBottom: 10 }}>
                                    <legend>Question</legend>
                                    <p style={{ margin: '10px 0', fontWeight: 'bold' }}>{QUIZ_QUESTIONS[currentQuestion].question}</p>

                                    {QUIZ_QUESTIONS[currentQuestion].options.map((opt, idx) => (
                                        <div key={idx} className="field-row" style={{ marginBottom: 5 }}>
                                            <input
                                                type="radio"
                                                id={`q${currentQuestion}-opt${idx}`}
                                                name={`question-${currentQuestion}`}
                                                checked={answers[currentQuestion] === idx}
                                                onChange={() => handleAnswer(idx)}
                                            />
                                            <label htmlFor={`q${currentQuestion}-opt${idx}`} style={{ cursor: 'pointer' }}>{opt}</label>
                                        </div>
                                    ))}
                                </fieldset>

                                {/* Retro Progress Block */}
                                <div style={{ marginBottom: 15 }}>
                                    <div className="sunken-panel" style={{ height: 20, background: "white", padding: 2, position: 'relative' }}>
                                        <div style={{ width: `${((currentQuestion) / QUIZ_QUESTIONS.length) * 100}%`, background: "#000080", height: '100%' }}></div>
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex' }}>
                                            {[...Array(10)].map((_, i) => (
                                                <div key={i} style={{ flex: 1, borderRight: '1px solid silver' }}></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 5 }}>
                                    <button onClick={() => setShowQuiz(false)}>Cancel</button>
                                    <button
                                        disabled={answers[currentQuestion] === undefined}
                                        onClick={handleNextQuestion}
                                        style={{ fontWeight: 'bold' }}
                                    >
                                        {currentQuestion === QUIZ_QUESTIONS.length - 1 ? "Finish" : "Next >"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <img src="https://win98icons.alexmeub.com/icons/png/certificate-0.png" style={{ width: 48, height: 48, marginBottom: 10 }} alt="" />
                                <h3>Test Finalizat!</h3>
                                <p>Scorul tău: {calculateScore()} din {QUIZ_QUESTIONS.length}</p>
                                <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                                    <button onClick={resetQuiz}>Reîncepe</button>
                                    <button onClick={() => setShowQuiz(false)}>Închide</button>
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