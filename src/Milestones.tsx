import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "98.css";

// Datele transformate (BT -> OldBank)
const MILESTONES_DATA = [
    { id: 1, date: "11 NOV 2025", title: "Record: Bank Friday 2025", icon: "https://win98icons.alexmeub.com/icons/png/cd_audio_cd_a-4.png", stats: "30.000 aplicatii / zi", body: "30.000 de persoane au aplicat într-o singură zi pentru produse și servicii ale Grupului OldBank, în campania Bank Friday 2025. Sistemele au funcționat la capacitate maximă fără erori critice." },
    { id: 2, date: "07 OCT 2025", title: "Creștere OldBank Pensii", icon: "https://win98icons.alexmeub.com/icons/png/chart1-0.png", stats: "+9.000 participanti", body: "Record lunar de 9.000 de participanți noi la OldBank Pensii, înregistrat în luna septembrie. Încrederea în sistemul nostru de pensii este la un nivel istoric." },
    { id: 3, date: "29 SEP 2025", title: "Interacțiuni Chat OldBank", icon: "https://win98icons.alexmeub.com/icons/png/chm-0.png", stats: "1.000.000 interactiuni", body: "Am atins pragul de 1 milion de interacțiuni prin Chat OldBank în aplicația OldPay. Asistentul nostru virtual a procesat cererile cu o viteză record de procesare." },
    { id: 4, date: "28 AUG 2025", title: "Siguranța Online", icon: "https://win98icons.alexmeub.com/icons/png/security_key-0.png", stats: "280.000 utilizatori", body: "280.000 de persoane și-au testat cunoștințele pe platforma OldBank 'Siguranța online'. Educația digitală rămâne o prioritate pentru protecția datelor clienților noștri." },
    { id: 5, date: "24 IUL 2025", title: "Dublare Acționari", icon: "https://win98icons.alexmeub.com/icons/png/users-1.png", stats: "71.000 actionari", body: "OldBank și-a dublat numărul de acționari față de 2021 și a ajuns la aproape 71.000. Comunitatea investitorilor noștri este mai puternică ca niciodată." },
    { id: 6, date: "21 MAI 2025", title: "Asset Management via OldPay", icon: "https://win98icons.alexmeub.com/icons/png/money_bag-0.png", stats: "100.000 investitori", body: "Peste 100.000 de persoane investesc în fondurile OldBank Asset Management folosind direct aplicația OldPay. Democratizarea investițiilor continuă." },
    { id: 7, date: "12 MAI 2025", title: "Antreprenori pe OldBank Go", icon: "https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png", stats: "300.000 firme", body: "Peste 300.000 de antreprenori fac banking și business prin platforma OldBank Go. Susținem economia locală prin tehnologie simplificată." },
    { id: 8, date: "05 FEB 2025", title: "Investiții 'Pensia Mea'", icon: "https://win98icons.alexmeub.com/icons/png/piggy_bank-0.png", stats: "100.000 contracte", body: "100.000 de persoane au ales să investească în produsul 'Pensia Mea' de la OldBank Pensii, asigurându-și un viitor financiar mai stabil." }
];

// --- COMPONENTA DRAGGABLE ---
interface DraggableWindowProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    width?: number | string;
    height?: number | string;
    zIndex?: number;
}

const DraggableWindow: React.FC<DraggableWindowProps> = ({ title, children, onClose, width = 800, height = 500, zIndex = 100 }) => {
    const [pos, setPos] = useState<{ x: number | string, y: number | string }>({ x: "50%", y: "50%" });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const windowRef = useRef<HTMLDivElement>(null);

    const startDrag = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
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
        <div ref={windowRef} className="window" style={{ position: "fixed", left: pos.x, top: pos.y, transform: transformStyle, width, height, zIndex, boxShadow: "10px 10px 0px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column" }}>
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

// --- COMPONENTA PRINCIPALĂ MILESTONES ---
const Milestones: React.FC = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState(MILESTONES_DATA);

    // Ținem minte și indexul curent pentru a naviga ușor
    const [selectedIndex, setSelectedIndex] = useState(0);
    const selectedEvent = events[selectedIndex];

    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [showAbout, setShowAbout] = useState(false);

    const closeMenu = () => setActiveMenu(null);

    // --- LOGICA PREVIOUS / NEXT ---
    const handlePrevious = () => {
        if (selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        }
    };

    const handleNext = () => {
        if (selectedIndex < events.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        }
    };

    // Funcție pentru când dai click pe listă (sincronizare index)
    const handleSelectFromList = (index: number) => {
        setSelectedIndex(index);
    };

    // --- ACȚIUNI MENIU ---
    const handleExport = () => {
        closeMenu();
        const content = events.map(e => `[${e.date}] ${e.title} - ${e.stats}\n${e.body}`).join("\n\n-------------------\n\n");
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "system_history.log";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleClearLog = () => {
        closeMenu();
        if (window.confirm("Warning: Clearing the system log cannot be undone. Continue?")) {
            setEvents([]);
            setSelectedIndex(-1); // Deselectăm tot
        }
    };

    const handleRefresh = () => {
        closeMenu();
        setEvents([]);
        setTimeout(() => {
            setEvents(MILESTONES_DATA);
            setSelectedIndex(0);
        }, 500);
    };

    const handleAbout = () => {
        closeMenu();
        setShowAbout(true);
    };

    return (
        <div style={{ height: "100vh", overflow: "hidden", background: "transparent" }} onClick={() => activeMenu && closeMenu()}>

            <DraggableWindow title="System History - OldBank Milestones" width={850} height={550} onClose={() => navigate('/about')}>

                {/* Bara de meniu */}
                <div style={{ display: 'flex', gap: 0, padding: "2px 0", marginBottom: 2, background: "#c0c0c0", borderBottom: "1px solid gray", userSelect: "none" }}>
                    <div style={{ position: 'relative' }}>
                        <div onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'file' ? null : 'file') }} style={{ padding: "2px 8px", cursor: "pointer", background: activeMenu === 'file' ? "#000080" : "transparent", color: activeMenu === 'file' ? "white" : "black" }}><u>F</u>ile</div>
                        {activeMenu === 'file' && <div className="window" style={{ position: 'absolute', top: '100%', left: 0, width: 150, zIndex: 200 }}><div className="menu-item" onClick={handleExport}>Save Log As...</div><div style={{ borderTop: "1px solid gray", margin: "2px 0" }}></div><div className="menu-item" onClick={() => navigate('/about')}>Exit</div></div>}
                    </div>
                    <div style={{ position: 'relative' }}>
                        <div onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'action' ? null : 'action') }} style={{ padding: "2px 8px", cursor: "pointer", background: activeMenu === 'action' ? "#000080" : "transparent", color: activeMenu === 'action' ? "white" : "black" }}><u>A</u>ction</div>
                        {activeMenu === 'action' && <div className="window" style={{ position: 'absolute', top: '100%', left: 0, width: 150, zIndex: 200 }}><div className="menu-item" onClick={handleClearLog}>Clear All Events</div></div>}
                    </div>
                    <div style={{ position: 'relative' }}>
                        <div onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'view' ? null : 'view') }} style={{ padding: "2px 8px", cursor: "pointer", background: activeMenu === 'view' ? "#000080" : "transparent", color: activeMenu === 'view' ? "white" : "black" }}><u>V</u>iew</div>
                        {activeMenu === 'view' && <div className="window" style={{ position: 'absolute', top: '100%', left: 0, width: 150, zIndex: 200 }}><div className="menu-item" onClick={handleRefresh}>Refresh</div></div>}
                    </div>
                    <div style={{ position: 'relative' }}>
                        <div onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'help' ? null : 'help') }} style={{ padding: "2px 8px", cursor: "pointer", background: activeMenu === 'help' ? "#000080" : "transparent", color: activeMenu === 'help' ? "white" : "black" }}><u>H</u>elp</div>
                        {activeMenu === 'help' && <div className="window" style={{ position: 'absolute', top: '100%', left: 0, width: 150, zIndex: 200 }}><div className="menu-item" onClick={handleAbout}>About History</div></div>}
                    </div>
                </div>

                {/* Container Split */}
                <div style={{ display: "flex", flexGrow: 1, gap: "10px", height: "100%", overflow: "hidden" }}>

                    {/* STANGA: Lista de Evenimente */}
                    <div className="sunken-panel" style={{ width: "300px", background: "white", padding: "5px", overflowY: "auto" }}>
                        <p style={{ marginTop: 0, marginBottom: 5, fontWeight: 'bold', fontSize: 12 }}>Event Log (2025):</p>

                        {events.length === 0 ? (
                            <div style={{ padding: 10, color: 'gray', textAlign: 'center' }}>No events found.</div>
                        ) : (
                            <ul className="tree-view" style={{ listStyle: 'none', paddingLeft: 10, margin: 0 }}>
                                {events.map((item, idx) => (
                                    <li
                                        key={item.id}
                                        onClick={() => handleSelectFromList(idx)} // Selectăm prin index
                                        style={{
                                            cursor: "pointer",
                                            padding: "4px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "5px",
                                            background: selectedIndex === idx ? "#000080" : "transparent",
                                            color: selectedIndex === idx ? "white" : "black",
                                            border: selectedIndex === idx ? "1px dotted white" : "1px solid transparent"
                                        }}
                                    >
                                        <img src={item.icon || "https://win98icons.alexmeub.com/icons/png/notepad-0.png"} alt="icon" style={{ width: 16, height: 16 }} />
                                        <span style={{ fontSize: "12px" }}>
                                            <strong>{item.date.split(" ")[0]} {item.date.split(" ")[1]}</strong> - {item.title}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* DREAPTA: Detalii Eveniment */}
                    <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                        <div className="window" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            <div className="window-body" style={{ flexGrow: 1 }}>

                                {selectedEvent ? (
                                    <>
                                        <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px", borderBottom: "2px solid gray", paddingBottom: "10px" }}>
                                            <img src={selectedEvent.icon || "https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png"} alt="big icon" style={{ width: 32, height: 32 }} />
                                            <div>
                                                <h3 style={{ margin: 0 }}>{selectedEvent.title}</h3>
                                                <p style={{ margin: 0, fontSize: "11px", color: "gray" }}>Event ID: {selectedEvent.id} | Date: {selectedEvent.date}</p>
                                            </div>
                                        </div>

                                        <fieldset style={{ marginBottom: "15px" }}>
                                            <legend>Key Performance Indicator</legend>
                                            <div className="field-row" style={{ justifyContent: 'space-between', padding: "5px" }}>
                                                <label>Impact:</label>
                                                <input type="text" readOnly value={selectedEvent.stats} style={{ width: "200px", fontWeight: "bold", textAlign: "center" }} />
                                            </div>
                                        </fieldset>

                                        <fieldset style={{ flexGrow: 1 }}>
                                            <legend>Description</legend>
                                            <textarea
                                                readOnly
                                                value={selectedEvent.body}
                                                style={{ width: "100%", height: "150px", resize: "none", background: "#f0f0f0", border: "none", outline: "none", padding: "5px" }}
                                            />
                                        </fieldset>
                                    </>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'gray' }}>Select an event to view details.</div>
                                )}

                            </div>

                            {/* Butoane Jos (Previous / Next / Close) */}
                            <div style={{ padding: "10px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                                <button
                                    onClick={handlePrevious}
                                    disabled={!selectedEvent || selectedIndex <= 0}
                                    style={{ minWidth: 80 }}
                                >
                                    &lt; Previous
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={!selectedEvent || selectedIndex >= events.length - 1}
                                    style={{ minWidth: 80 }}
                                >
                                    Next &gt;
                                </button>
                                <button onClick={() => navigate('/about')} style={{ minWidth: 80 }}>Close</button>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="status-bar" style={{ marginTop: 5 }}>
                    <p className="status-bar-field">{events.length} events loaded</p>
                    <p className="status-bar-field">Selected: {selectedIndex + 1}/{events.length}</p>
                </div>

            </DraggableWindow>

            {/* --- ABOUT POPUP --- */}
            {showAbout && (
                <DraggableWindow title="About System History" width={300} height={200} onClose={() => setShowAbout(false)} zIndex={999}>
                    <div style={{ textAlign: 'center', padding: 20 }}>
                        <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png" width="32" alt="pc" />
                        <p><strong>OldBank Event Log Viewer</strong></p>
                        <p>Version 1.0</p>
                        <button onClick={() => setShowAbout(false)} style={{ marginTop: 10 }}>OK</button>
                    </div>
                </DraggableWindow>
            )}

            <style>{`.menu-item { padding: 2px 10px; cursor: pointer; } .menu-item:hover { background-color: #000080; color: white; }`}</style>
        </div>
    );
};

export default Milestones;