import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "98.css";

// Datele transformate (BT -> OldBank)
const ANNOUNCEMENTS_DATA = [
    { id: 1, date: "24 NOI 2025", type: "System Update", icon: "info", title: "Rebranding: OldBank Mobile devine OldPay", body: "OldBank Mobile și Web au devenit OldPay Mobile și Web (pentru persoanele fizice) și OldGo Mobile și Web (pentru companii). Actualizați aplicațiile pentru a evita problemele de compatibilitate." },
    { id: 2, date: "14 NOI 2025", type: "Maintenance", icon: "warning", title: "Mentenanță programată OldWeb", body: "Mentenanță programată pentru serviciul OldWeb, în 16/17 noiembrie (duminică/luni). Serviciile online vor fi indisponibile între orele 02:00 - 06:00." },
    { id: 3, date: "23 OCT 2025", type: "Maintenance", icon: "warning", title: "Mentenanță generală servere", body: "Mentenanță programată OldBank, în 24/25 octombrie (vineri/sâmbătă) și 25/26 octombrie (sâmbătă/duminică). ATM-urile vor funcționa normal." },
    { id: 4, date: "11 AUG 2025", type: "Schedule", icon: "clock", title: "Program OldBank: 15 August", body: "Unitățile OldBank vor fi închise pe 15 August (Sf. Maria). Call Center-ul va funcționa după program normal pentru urgențe." },
    { id: 5, date: "03 OCT 2025", type: "Maintenance", icon: "warning", title: "Mentenanță baze de date", body: "Mentenanță programată OldBank, în 4 și 5 octombrie. Posibile întreruperi scurte la plățile cu cardul online." },
    { id: 6, date: "20 MAI 2025", type: "Corporate", icon: "info", title: "Vasile Pușcaș: Academia Europaea", body: "Prof. univ. dr. Vasile Pușcaș, parte din Consiliul de Administrație OldBank, a fost ales membru al prestigioasei Academii Europaea." },
    { id: 7, date: "15 SEP 2025", type: "Corporate", icon: "info", title: "OldBank Investor Day", body: "OldBank Investor Day va avea loc în noiembrie. Vom prezenta strategia pentru anul 2026 și rezultatele trimestriale." },
    { id: 8, date: "20 MAR 2025", type: "Maintenance", icon: "warning", title: "Mentenanță critică carduri", body: "Mentenanță programată pentru cardurile și aplicațiile OldBank în 22/23 martie, intervalul 12:30 AM - 2:30 AM. Tranzacțiile vor fi oprite." }
];

// --- HELPER PENTRU PARSAREA DATELOR ÎN ROMÂNĂ ---
const parseRomanianDate = (dateString: string) => {
    const months: { [key: string]: number } = {
        'IAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAI': 4, 'IUN': 5,
        'IUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOI': 10, 'DEC': 11
    };

    // Format așteptat: "24 NOI 2025"
    const parts = dateString.split(' ');
    if (parts.length !== 3) return 0; // Fallback

    const day = parseInt(parts[0], 10);
    const month = months[parts[1].toUpperCase()];
    const year = parseInt(parts[2], 10);

    return new Date(year, month, day).getTime();
};

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

// --- COMPONENTA ANNOUNCEMENTS ---
const Announcements: React.FC = () => {
    const navigate = useNavigate();
    const [selectedNotice, setSelectedNotice] = useState<any>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [showAbout, setShowAbout] = useState(false);

    // State pentru date și sortare
    const [items, setItems] = useState(ANNOUNCEMENTS_DATA);
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    const closeMenu = () => setActiveMenu(null);

    // Funcție pentru a returna iconița corectă
    const getIcon = (type: string) => {
        switch (type) {
            case "warning": return "https://win98icons.alexmeub.com/icons/png/msg_warning-0.png";
            case "clock": return "https://win98icons.alexmeub.com/icons/png/time_and_date-0.png";
            default: return "https://win98icons.alexmeub.com/icons/png/msg_information-0.png";
        }
    };

    // --- LOGICA DE SORTARE ---
    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';

        // Dacă dăm click pe aceeași coloană, inversăm direcția
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        const sortedItems = [...items].sort((a: any, b: any) => {
            let valA, valB;

            if (key === 'date') {
                valA = parseRomanianDate(a.date);
                valB = parseRomanianDate(b.date);
            } else {
                valA = a[key].toLowerCase();
                valB = b[key].toLowerCase();
            }

            if (valA < valB) return direction === 'asc' ? -1 : 1;
            if (valA > valB) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setSortConfig({ key, direction });
        setItems(sortedItems);
    };

    // Helper pentru afișarea săgeții de sortare
    const getSortIndicator = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? " ▲" : " ▼";
    };

    // --- ACȚIUNI MENIU ---
    const handleSaveLog = () => {
        closeMenu();
        const content = items.map(i => `[${i.date}] ${i.type.toUpperCase()}: ${i.title}\n${i.body}`).join("\n\n---\n\n");
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "system_alerts.log";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCopy = () => {
        closeMenu();
        if (selectedNotice) {
            navigator.clipboard.writeText(selectedNotice.title);
            alert("Clipboard: Title copied.");
        } else {
            alert("Error: No item selected.");
        }
    };

    const handleRefresh = () => {
        closeMenu();
        setItems([]);
        setTimeout(() => {
            setItems(ANNOUNCEMENTS_DATA);
            setSortConfig(null); // Reset sort la refresh
        }, 500);
    };

    const handleAbout = () => {
        closeMenu();
        setShowAbout(true);
    };

    return (
        <div style={{ height: "100vh", overflow: "hidden", background: "transparent" }} onClick={() => activeMenu && closeMenu()}>

            <DraggableWindow title="System Notifications & Alerts" width={800} height={500} onClose={() => navigate('/about')}>

                {/* Meniu Funcțional */}
                <div style={{ display: 'flex', gap: 0, padding: "2px 0", marginBottom: 2, background: "#c0c0c0", borderBottom: "1px solid gray", userSelect: "none" }}>

                    <div style={{ position: 'relative' }}>
                        <div onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'file' ? null : 'file') }}
                            style={{ padding: "2px 8px", cursor: "pointer", background: activeMenu === 'file' ? "#000080" : "transparent", color: activeMenu === 'file' ? "white" : "black" }}>
                            <u>F</u>ile
                        </div>
                        {activeMenu === 'file' && (
                            <div className="window" style={{ position: 'absolute', top: '100%', left: 0, width: 150, zIndex: 200 }}>
                                <div className="menu-item" onClick={handleSaveLog}>Save Log...</div>
                                <div style={{ borderTop: "1px solid gray", margin: "2px 0" }}></div>
                                <div className="menu-item" onClick={() => navigate('/about')}>Exit</div>
                            </div>
                        )}
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'edit' ? null : 'edit') }}
                            style={{ padding: "2px 8px", cursor: "pointer", background: activeMenu === 'edit' ? "#000080" : "transparent", color: activeMenu === 'edit' ? "white" : "black" }}>
                            <u>E</u>dit
                        </div>
                        {activeMenu === 'edit' && (
                            <div className="window" style={{ position: 'absolute', top: '100%', left: 0, width: 150, zIndex: 200 }}>
                                <div className="menu-item" onClick={handleCopy}>Copy Selected</div>
                                <div className="menu-item" onClick={() => alert("Select All")}>Select All</div>
                            </div>
                        )}
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'view' ? null : 'view') }}
                            style={{ padding: "2px 8px", cursor: "pointer", background: activeMenu === 'view' ? "#000080" : "transparent", color: activeMenu === 'view' ? "white" : "black" }}>
                            <u>V</u>iew
                        </div>
                        {activeMenu === 'view' && (
                            <div className="window" style={{ position: 'absolute', top: '100%', left: 0, width: 150, zIndex: 200 }}>
                                <div className="menu-item" onClick={handleRefresh}>Refresh</div>
                            </div>
                        )}
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'help' ? null : 'help') }}
                            style={{ padding: "2px 8px", cursor: "pointer", background: activeMenu === 'help' ? "#000080" : "transparent", color: activeMenu === 'help' ? "white" : "black" }}>
                            <u>H</u>elp
                        </div>
                        {activeMenu === 'help' && (
                            <div className="window" style={{ position: 'absolute', top: '100%', left: 0, width: 150, zIndex: 200 }}>
                                <div className="menu-item" onClick={handleAbout}>About Notifications</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="window-body" style={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

                    <div style={{ padding: "5px", background: "#ffffe1", border: "1px solid gray", marginBottom: "5px", display: "flex", gap: "10px", alignItems: "center" }}>
                        <img src="https://win98icons.alexmeub.com/icons/png/msg_information-0.png" alt="info" />
                        <span style={{ fontSize: "12px" }}>Click on column headers to sort the logs. Select an item for details.</span>
                    </div>

                    <div className="sunken-panel" style={{ flexGrow: 1, background: "white", overflowY: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                            <thead style={{ position: 'sticky', top: 0, background: "#c0c0c0", borderBottom: "1px solid gray", zIndex: 1 }}>
                                <tr>
                                    {/* HEADERS CU ONCLICK PENTRU SORTARE */}
                                    <th
                                        style={{ textAlign: "left", padding: "2px", width: "80px", cursor: "pointer", userSelect: "none" }}
                                        onClick={() => handleSort('type')}
                                        onMouseEnter={(e) => e.currentTarget.style.background = "#dfdfdf"}
                                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                    >
                                        Type {getSortIndicator('type')}
                                    </th>
                                    <th
                                        style={{ textAlign: "left", padding: "2px", width: "100px", borderLeft: "1px solid white", cursor: "pointer", userSelect: "none" }}
                                        onClick={() => handleSort('date')}
                                        onMouseEnter={(e) => e.currentTarget.style.background = "#dfdfdf"}
                                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                    >
                                        Date {getSortIndicator('date')}
                                    </th>
                                    <th
                                        style={{ textAlign: "left", padding: "2px", borderLeft: "1px solid white", cursor: "pointer", userSelect: "none" }}
                                        onClick={() => handleSort('title')}
                                        onMouseEnter={(e) => e.currentTarget.style.background = "#dfdfdf"}
                                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                    >
                                        Subject {getSortIndicator('title')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr
                                        key={item.id}
                                        onClick={() => setSelectedNotice(item)}
                                        style={{ cursor: "pointer", background: selectedNotice?.id === item.id ? "#000080" : "transparent", color: selectedNotice?.id === item.id ? "white" : "black" }}
                                    >
                                        <td style={{ textAlign: "center", padding: "2px", display: 'flex', alignItems: 'center', gap: 5 }}>
                                            <img src={getIcon(item.icon)} alt="icon" style={{ width: 16, height: 16 }} />
                                            {item.type}
                                        </td>
                                        <td style={{ padding: "2px" }}>{item.date}</td>
                                        <td style={{ padding: "2px", fontWeight: "bold" }}>{item.title}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>

                <div className="status-bar" style={{ marginTop: 5 }}>
                    <p className="status-bar-field">{items.length} objects</p>
                </div>

            </DraggableWindow>

            {/* --- MESSAGE BOX POPUP --- */}
            {selectedNotice && (
                <DraggableWindow
                    title={selectedNotice.type === "Maintenance" ? "System Warning" : "System Information"}
                    width={400}
                    height="auto"
                    onClose={() => setSelectedNotice(null)}
                    zIndex={200}
                >
                    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
                        <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
                            <img
                                src={getIcon(selectedNotice.icon)}
                                alt="icon"
                                style={{ width: 32, height: 32 }}
                            />
                            <div>
                                <div style={{ fontWeight: "bold", marginBottom: "5px" }}>{selectedNotice.title}</div>
                                <div style={{ fontSize: "12px" }}>{selectedNotice.body}</div>
                                <div style={{ fontSize: "11px", color: "gray", marginTop: "10px" }}>Date: {selectedNotice.date}</div>
                            </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <button style={{ width: "80px" }} onClick={() => setSelectedNotice(null)}>OK</button>
                        </div>
                    </div>
                </DraggableWindow>
            )}

            {/* --- ABOUT POPUP --- */}
            {showAbout && (
                <DraggableWindow title="About" width={300} height={180} onClose={() => setShowAbout(false)} zIndex={300}>
                    <div style={{ textAlign: 'center', padding: 20 }}>
                        <img src="https://win98icons.alexmeub.com/icons/png/msg_information-0.png" width="32" alt="info" />
                        <p><strong>OldBank Alert System</strong></p>
                        <p>v1.0.2</p>
                        <button onClick={() => setShowAbout(false)} style={{ marginTop: 10 }}>OK</button>
                    </div>
                </DraggableWindow>
            )}

            <style>{`.menu-item { padding: 2px 10px; cursor: pointer; } .menu-item:hover { background-color: #000080; color: white; }`}</style>
        </div>
    );
};

export default Announcements;