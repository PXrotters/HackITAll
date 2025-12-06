import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "98.css";

const NEWS_DATA = [
    {
        id: 1,
        date: "04 DEC 2025",
        subject: "Fitch confirmă rating-urile OldBank",
        from: "OldBank PR Dept.",
        priority: "High",
        body: "Agenția de rating Fitch a reconfirmat rating-urile OldBank, subliniind poziția solidă de capital și lichiditate a băncii, precum și calitatea activelor. Această confirmare reflectă stabilitatea modelului nostru de business într-un mediu economic dinamic."
    },
    {
        id: 2,
        date: "28 NOI 2025",
        subject: "Grupul OldBank ajunge la 800.000 de participanți",
        from: "OldBank Pensions",
        priority: "Normal",
        body: "Grupul OldBank a atins pragul de 800.000 de participanți la fondurile de pensii din Pilonul 2 și 3, în urma finalizării cu succes a achiziției BRD Pensii. Această tranzacție consolidează poziția noastră pe piața pensiilor private din România."
    },
    {
        id: 3,
        date: "27 NOI 2025",
        subject: "Finanțare sindicalizată de 300 mil. EUR",
        from: "OldBank Corporate",
        priority: "Normal",
        body: "OldBank a coordonat, în calitate de aranjator principal, o finanțare sindicalizată majoră în valoare de 300 milioane de euro pentru Autonom Services. Aceasta demonstrează capacitatea noastră de a susține liderii pieței de mobilitate."
    },
    {
        id: 4,
        date: "21 NOI 2025",
        subject: "Succes: Cea mai mare emisiune de obligațiuni AT1",
        from: "OldBank Treasury",
        priority: "High",
        body: "OldBank a finalizat cu succes cea mai mare emisiune de obligațiuni AT1 din Europa Centrală și de Est. Interesul ridicat al investitorilor confirmă încrederea piețelor internaționale în strategia noastră."
    },
    {
        id: 5,
        date: "13 NOI 2025",
        subject: "Parteneriat Mastercard & OldBank & Salvați Copiii",
        from: "CSR Dept.",
        priority: "Normal",
        body: "Lansăm programul „Susținem cele mai grele începuturi”, o inițiativă de 1,5 milioane de euro pentru reducerea mortalității infantile în România. Dotăm maternitățile cu echipamente vitale pentru prematuri."
    },
    {
        id: 6,
        date: "13 NOI 2025",
        subject: "Aprobare ASF pentru achiziția BRD Pensii",
        from: "Legal Dept.",
        priority: "Low",
        body: "OldBank și OldBank Investments au primit aprobarea oficială ASF pentru achiziția BRD Pensii și a fondului de pensii private obligatorii BRD. Procesul de integrare intră în linie dreaptă."
    },
    {
        id: 7,
        date: "10 NOI 2025",
        subject: "Rezultate financiare Q3 2025",
        from: "CEO Office",
        priority: "High",
        body: "Rezultate financiare la 30 septembrie 2025. Business-ul OldBank a continuat ritmul de creștere și dezvoltare atât pe plan operațional, cât și financiar. Profitabilitatea rămâne solidă, susținută de creditare."
    },
    {
        id: 8,
        date: "10 NOI 2025",
        subject: "Finanțări garantate 70% de BID",
        from: "SME Lending",
        priority: "Normal",
        body: "Am lansat finanțări garantate 70% de către Banca de Investiții și Dezvoltare pentru clienții OldBank companii. O nouă oportunitate pentru antreprenorii români de a accesa capital."
    }
];

const Newsroom: React.FC = () => {
    const navigate = useNavigate();
    const [selectedMail, setSelectedMail] = useState<any>(NEWS_DATA[0]);

    // State-uri pentru interactivitate
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [showAbout, setShowAbout] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // --- STATE PENTRU SAVE AS ---
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [saveFileName, setSaveFileName] = useState("");

    const closeMenu = () => setActiveMenu(null);

    // Deschide fereastra de salvare
    const openSaveDialog = () => {
        closeMenu();
        // Setăm un nume default bazat pe subiect
        const safeName = selectedMail.subject.replace(/[^a-z0-9]/gi, '_').substring(0, 20);
        setSaveFileName(safeName + ".txt");
        setShowSaveDialog(true);
    };

    // Funcția care face descărcarea reală
    const performSave = () => {
        // 1. Creăm conținutul fișierului text
        const fileContent = `
Subject: ${selectedMail.subject}
Date: ${selectedMail.date}
From: ${selectedMail.from}
--------------------------------------------------

${selectedMail.body}

--------------------------------------------------
Saved from OldBank Newsroom System
`;
        // 2. Creăm un "Blob" (fișier virtual în memoria browserului)
        const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });

        // 3. Creăm un link invizibil și dăm click pe el automat
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = saveFileName || "email.txt"; // Folosim numele introdus
        document.body.appendChild(link);
        link.click();

        // 4. Curățenie
        document.body.removeChild(link);
        setShowSaveDialog(false); // Închidem fereastra
    };

    const handlePrint = () => {
        closeMenu();
        window.print();
    };

    const handleCopy = () => {
        closeMenu();
        if (selectedMail) {
            navigator.clipboard.writeText(selectedMail.subject + "\n" + selectedMail.body);
            alert("System Clipboard:\nText copied successfully.");
        }
    };

    const handleRefresh = () => {
        closeMenu();
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
        }, 2000);
    };

    const handleAbout = () => {
        closeMenu();
        setShowAbout(true);
    };

    const handleExit = () => {
        navigate('/about');
    };

    return (
        <div style={{
            padding: "20px",
            paddingTop: "40px",
            height: "100vh",
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
        }} onClick={() => activeMenu && closeMenu()}>

            <div className="window" style={{ width: "900px", maxWidth: "100%", height: "600px", maxHeight: "85vh", display: "flex", flexDirection: "column", position: 'relative', zIndex: 1 }}>

                <div className="title-bar">
                    <div className="title-bar-text">Inbox - OldBank Express News</div>
                    <div className="title-bar-controls">
                        <button aria-label="Minimize"></button>
                        <button aria-label="Maximize"></button>
                        <button aria-label="Close" onClick={handleExit}></button>
                    </div>
                </div>

                {/* --- MENIUL FUNCȚIONAL --- */}
                <div style={{ position: 'relative', borderBottom: "1px solid gray", background: "#c0c0c0" }}>
                    <div style={{ display: "flex", gap: "0px", padding: "2px 0", fontSize: "12px", userSelect: "none" }}>

                        {/* FILE MENU */}
                        <div style={{ position: 'relative' }}>
                            <div
                                onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'file' ? null : 'file'); }}
                                style={{ padding: "2px 8px", cursor: "pointer", background: activeMenu === 'file' ? "#000080" : "transparent", color: activeMenu === 'file' ? "white" : "black" }}>
                                <u>F</u>ile
                            </div>
                            {activeMenu === 'file' && (
                                <div className="window" style={{ position: 'absolute', top: '100%', left: 0, width: '150px', zIndex: 100, padding: 2 }}>
                                    {/* AICI AM CONECTAT BUTONUL SAVE AS */}
                                    <div className="menu-item" onClick={openSaveDialog}>Save As...</div>
                                    <div className="menu-item" onClick={handlePrint}>Print</div>
                                    <div style={{ borderTop: "1px solid gray", margin: "2px 0" }}></div>
                                    <div className="menu-item" onClick={handleExit}>Exit</div>
                                </div>
                            )}
                        </div>

                        {/* EDIT MENU */}
                        <div style={{ position: 'relative' }}>
                            <div
                                onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'edit' ? null : 'edit'); }}
                                style={{ padding: "2px 8px", cursor: "pointer", background: activeMenu === 'edit' ? "#000080" : "transparent", color: activeMenu === 'edit' ? "white" : "black" }}>
                                <u>E</u>dit
                            </div>
                            {activeMenu === 'edit' && (
                                <div className="window" style={{ position: 'absolute', top: '100%', left: 0, width: '150px', zIndex: 100, padding: 2 }}>
                                    <div className="menu-item" onClick={handleCopy}>Copy Subject</div>
                                    <div className="menu-item" style={{ color: 'gray' }}>Paste</div>
                                    <div style={{ borderTop: "1px solid gray", margin: "2px 0" }}></div>
                                    <div className="menu-item" onClick={() => alert("Selected all messages.")}>Select All</div>
                                </div>
                            )}
                        </div>

                        {/* VIEW MENU */}
                        <div style={{ position: 'relative' }}>
                            <div
                                onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'view' ? null : 'view'); }}
                                style={{ padding: "2px 8px", cursor: "pointer", background: activeMenu === 'view' ? "#000080" : "transparent", color: activeMenu === 'view' ? "white" : "black" }}>
                                <u>V</u>iew
                            </div>
                            {activeMenu === 'view' && (
                                <div className="window" style={{ position: 'absolute', top: '100%', left: 0, width: '150px', zIndex: 100, padding: 2 }}>
                                    <div className="menu-item" onClick={handleRefresh}>Refresh</div>
                                    <div className="menu-item">Encoding</div>
                                </div>
                            )}
                        </div>

                        {/* HELP MENU */}
                        <div style={{ position: 'relative' }}>
                            <div
                                onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'help' ? null : 'help'); }}
                                style={{ padding: "2px 8px", cursor: "pointer", background: activeMenu === 'help' ? "#000080" : "transparent", color: activeMenu === 'help' ? "white" : "black" }}>
                                <u>H</u>elp
                            </div>
                            {activeMenu === 'help' && (
                                <div className="window" style={{ position: 'absolute', top: '100%', left: 0, width: '150px', zIndex: 100, padding: 2 }}>
                                    <div className="menu-item" onClick={handleAbout}>About OldBank News</div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* Body Split View */}
                <div className="window-body" style={{ flexGrow: 1, display: "flex", flexDirection: "column", padding: 0, margin: 2, overflow: "hidden" }}>

                    {/* 1. Lista de Emailuri (Sus) */}
                    <div className="sunken-panel" style={{ height: "40%", background: "white", overflowY: "auto", borderLeft: "none", borderRight: "none", borderTop: "2px solid white" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "fixed" }}>
                            <thead style={{ position: 'sticky', top: 0, background: '#c0c0c0', borderBottom: '1px solid gray', zIndex: 1 }}>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: 2, width: "180px", borderRight: "1px solid gray", paddingLeft: "5px" }}>From</th>
                                    <th style={{ textAlign: 'left', padding: 2, width: "auto", borderRight: "1px solid gray", paddingLeft: "5px" }}>Subject</th>
                                    <th style={{ textAlign: 'left', padding: 2, width: "100px", paddingLeft: "5px" }}>Received</th>
                                </tr>
                            </thead>
                            <tbody>
                                {NEWS_DATA.map((news) => (
                                    <tr
                                        key={news.id}
                                        onClick={() => setSelectedMail(news)}
                                        style={{
                                            background: selectedMail.id === news.id ? "#000080" : "transparent",
                                            color: selectedMail.id === news.id ? "white" : "black",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <td style={{ padding: "1px 4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", borderRight: "1px solid #dfdfdf" }}>{news.from}</td>
                                        <td style={{ padding: "1px 4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", borderRight: "1px solid #dfdfdf" }}>{news.subject}</td>
                                        <td style={{ padding: "1px 4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{news.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Separator */}
                    <div style={{ height: 4, background: '#c0c0c0', borderTop: '1px solid white', borderBottom: '1px solid gray', cursor: 'row-resize' }}></div>

                    {/* 2. Preview Pane (Jos) */}
                    <div className="sunken-panel" style={{ flexGrow: 1, background: "white", padding: "15px", overflowY: "auto", border: "none" }}>
                        {selectedMail ? (
                            <div>
                                <div style={{ borderBottom: "1px solid #ccc", paddingBottom: 5, marginBottom: 10, background: "#ffffe1", padding: 10, border: "1px solid #999", fontSize: "12px" }}>
                                    <div style={{ marginBottom: 2 }}><strong>From:</strong> {selectedMail.from}</div>
                                    <div style={{ marginBottom: 2 }}><strong>Date:</strong> {selectedMail.date}</div>
                                    <div style={{ marginTop: 5 }}><strong>Subject:</strong> {selectedMail.subject}</div>
                                </div>
                                <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.5", fontSize: "13px", padding: "5px" }}>
                                    <h3 style={{ marginTop: 0, marginBottom: 15 }}>{selectedMail.subject}</h3>
                                    <p style={{ margin: 0 }}>{selectedMail.body}</p>
                                    <br />
                                    <p style={{ fontStyle: 'italic', color: 'gray', fontSize: "11px", marginTop: 20 }}>
                                        ---<br />
                                        OldBank Press Office<br />
                                        <a href="#" style={{ color: 'blue' }}>www.oldbank.ro</a>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'gray' }}>Select a message to read.</div>
                        )}
                    </div>

                </div>

                {/* Status Bar */}
                <div className="status-bar">
                    <p className="status-bar-field">8 message(s)</p>
                    <p className="status-bar-field">Connected to OldBank Server</p>
                </div>

            </div>

            {/* --- FEREASTRA "SAVE AS" DIALOG --- */}
            {showSaveDialog && (
                <div className="window" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "400px", zIndex: 1000, boxShadow: "10px 10px 0 rgba(0,0,0,0.5)" }}>
                    <div className="title-bar">
                        <div className="title-bar-text">Save Message As</div>
                        <div className="title-bar-controls">
                            <button aria-label="Close" onClick={() => setShowSaveDialog(false)}></button>
                        </div>
                    </div>
                    <div className="window-body">
                        <div style={{ display: 'flex', marginBottom: 10, alignItems: 'center' }}>
                            <label style={{ width: 70 }}>Save in:</label>
                            <select style={{ flexGrow: 1 }}>
                                <option>C:\My Documents</option>
                                <option>A:\Floppy</option>
                            </select>
                        </div>

                        <div className="sunken-panel" style={{ height: 150, background: 'white', marginBottom: 10, padding: 5, overflowY: 'scroll' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><img src="https://win98icons.alexmeub.com/icons/png/directory_closed-0.png" width="16" /> My Pictures</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><img src="https://win98icons.alexmeub.com/icons/png/directory_closed-0.png" width="16" /> My Webs</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><img src="https://win98icons.alexmeub.com/icons/png/notepad-0.png" width="16" /> readme.txt</div>
                        </div>

                        <div style={{ display: 'flex', marginBottom: 5, alignItems: 'center' }}>
                            <label style={{ width: 70 }}>File name:</label>
                            <input
                                type="text"
                                style={{ flexGrow: 1 }}
                                value={saveFileName}
                                onChange={(e) => setSaveFileName(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', marginBottom: 10, alignItems: 'center' }}>
                            <label style={{ width: 70 }}>Save as type:</label>
                            <select style={{ flexGrow: 1 }}>
                                <option>Text File (*.txt)</option>
                                <option>Mail Message (*.eml)</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 5 }}>
                            <button style={{ width: 70 }} onClick={performSave}>Save</button>
                            <button style={{ width: 70 }} onClick={() => setShowSaveDialog(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- FEREASTRA "ABOUT" POPUP --- */}
            {showAbout && (
                <div className="window" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "300px", zIndex: 999 }}>
                    <div className="title-bar">
                        <div className="title-bar-text">About OldBank News</div>
                        <div className="title-bar-controls">
                            <button aria-label="Close" onClick={() => setShowAbout(false)}></button>
                        </div>
                    </div>
                    <div className="window-body" style={{ textAlign: 'center' }}>
                        <img src="https://win98icons.alexmeub.com/icons/png/outlook_express-0.png" alt="logo" style={{ width: 32, marginBottom: 10 }} />
                        <p>OldBank Express News</p>
                        <p style={{ fontSize: 12 }}>Version 1.0 (Build 1998)</p>
                        <p style={{ fontSize: 12 }}>Copyright © 1995-2025 OldBank Corp.</p>
                        <button style={{ marginTop: 10, width: 80 }} onClick={() => setShowAbout(false)}>OK</button>
                    </div>
                </div>
            )}

            {/* --- ANIMAȚIA DE REFRESH --- */}
            {isRefreshing && (
                <div className="window" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "300px", zIndex: 999 }}>
                    <div className="title-bar">
                        <div className="title-bar-text">Receiving Mail...</div>
                    </div>
                    <div className="window-body">
                        <p>Connecting to POP3 server...</p>
                        <div style={{ height: 20, width: "100%", background: "white", border: "1px solid gray", position: "relative" }}>
                            <div style={{ height: "100%", background: "navy", width: "100%", animation: "progress 2s linear" }}></div>
                        </div>
                    </div>
                </div>
            )}

            <style>
                {`
                .menu-item {
                    padding: 2px 10px;
                    cursor: pointer;
                }
                .menu-item:hover {
                    background-color: #000080;
                    color: white;
                }
                @keyframes progress { from { width: 0%; } to { width: 100%; } }
                `}
            </style>

        </div>
    );
};

export default Newsroom;