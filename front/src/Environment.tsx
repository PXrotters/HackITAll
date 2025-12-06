import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "98.css";

// Datele pentru Mediu (OldBank)
const ECO_DATA = [
    {
        id: 1,
        title: "Via Transilvanica",
        location: "Transylvania Region",
        status: "Active",
        icon: "https://win98icons.alexmeub.com/icons/png/world-3.png",
        desc: "Susținem 'Drumul care unește'. Am marcat 100km din traseul turistic care traversează România de la nord la sud, promovând diversitatea culturală și naturală."
    },
    {
        id: 2,
        title: "Mai plantăm o pădure",
        location: "National Wide",
        status: "In Progress",
        icon: "https://win98icons.alexmeub.com/icons/png/tree-0.png", // (sau generic file daca nu incarca)
        // Fallback icon visual logic handled in rendering
        desc: "Voluntarii OldBank au plantat peste 50.000 de puieți în zonele defrișate. Obiectivul nostru este de a reîmpăduri 10 hectare până în 2030."
    },
    {
        id: 3,
        title: "Ghidul bunelor EcoManiere",
        location: "Digital / PDF",
        status: "Published",
        icon: "https://win98icons.alexmeub.com/icons/png/chm-0.png",
        desc: "Un manual digital de educație ecologică. Înveți cum să reciclezi corect, să reduci consumul de plastic și să economisești energie acasă."
    },
    {
        id: 4,
        title: "Parcul Național Văcărești",
        location: "Bucharest Delta",
        status: "Protected Zone",
        icon: "https://win98icons.alexmeub.com/icons/png/search_file-2.png",
        desc: "Protejăm 'Delta dintre blocuri'. Finanțăm infrastructura de vizitare și programele de monitorizare a biodiversității din cel mai mare parc natural urban."
    },
    {
        id: 5,
        title: "#PeopleOfChange",
        location: "Community",
        status: "Recruiting",
        icon: "https://win98icons.alexmeub.com/icons/png/users-1.png",
        desc: "O platformă dedicată eroilor locali care schimbă lumea prin inițiative sustenabile mici, dar cu impact mare."
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

const DraggableWindow: React.FC<DraggableWindowProps> = ({ title, children, onClose, width = 850, height = 550 }) => {
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
            <div className="title-bar" onMouseDown={startDrag} style={{ cursor: "move", userSelect: "none", background: "linear-gradient(90deg, #008000, #004000)" }}>
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

// --- COMPONENTA ENVIRONMENT ---
const Environment: React.FC = () => {
    const navigate = useNavigate();
    const [selectedProject, setSelectedProject] = useState<any>(ECO_DATA[0]);
    const [isScanning, setIsScanning] = useState(false);
    const [treesPlanted, setTreesPlanted] = useState(1240);

    const handleSelect = (project: any) => {
        setIsScanning(true);
        // Simulam scanarea
        setTimeout(() => {
            setSelectedProject(project);
            setIsScanning(false);
        }, 800);
    };

    const handlePlant = () => {
        setTreesPlanted(prev => prev + 1);
        alert("Thank you! Virtual tree planted.");
    };

    return (
        <div style={{ height: "100vh", overflow: "hidden", background: "transparent" }}>

            <DraggableWindow title="OldBank Eco-Monitor v3.1" width={850} height={550} onClose={() => navigate('/about')}>

                {/* TOOLBAR */}
                <div style={{ padding: "5px", borderBottom: "1px solid gray", display: "flex", gap: "10px", background: "#c0c0c0" }}>
                    <button style={{ minWidth: 80 }}>Scan Map</button>
                    <button style={{ minWidth: 80 }}>Analysis</button>
                    <div style={{ width: 1, height: 20, background: 'gray', margin: '0 5px' }}></div>
                    <button style={{ minWidth: 60 }} onClick={() => navigate('/about')}>Exit</button>
                </div>

                <div style={{ display: "flex", flexGrow: 1, overflow: "hidden", padding: "10px", gap: "10px" }}>

                    {/* LISTA PROIECTE (STÂNGA) */}
                    <div className="sunken-panel" style={{ width: "250px", background: "white", overflowY: "auto" }}>
                        <div style={{ background: "#008000", color: "white", padding: "2px 5px", fontWeight: "bold", fontSize: "12px" }}>Active Sectors</div>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {ECO_DATA.map((item) => (
                                <li
                                    key={item.id}
                                    onClick={() => handleSelect(item)}
                                    style={{
                                        padding: "8px",
                                        borderBottom: "1px dotted #ccc",
                                        cursor: "pointer",
                                        background: selectedProject.id === item.id ? "#e0ffe0" : "transparent",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px"
                                    }}
                                >
                                    {/* Fallback simplu pentru iconiță */}
                                    <img src={item.icon} alt="icon" style={{ width: 16, height: 16 }} onError={(e) => { e.currentTarget.src = "https://win98icons.alexmeub.com/icons/png/world-3.png" }} />
                                    <span style={{ fontSize: "12px" }}>{item.title}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* DETALII (DREAPTA) - Stil Monitor */}
                    <div className="window" style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                        <div className="window-body" style={{ flexGrow: 1, display: "flex", flexDirection: "column", padding: 0 }}>

                            {/* ECRANUL DE SCANARE/HARTA */}
                            <div className="sunken-panel" style={{
                                height: "200px",
                                background: "black",
                                margin: "10px",
                                position: "relative",
                                overflow: "hidden",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                {/* Grid verde retro pe fundal */}
                                <div style={{
                                    position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                                    backgroundImage: "linear-gradient(#003300 1px, transparent 1px), linear-gradient(90deg, #003300 1px, transparent 1px)",
                                    backgroundSize: "20px 20px",
                                    opacity: 0.5
                                }}></div>

                                {isScanning ? (
                                    <div style={{ color: "#00ff00", fontFamily: "monospace", fontSize: "16px" }}>
                                        [ SCANNING SECTOR DATA... ]
                                        <div style={{ marginTop: 10, width: 200, height: 10, border: "1px solid #00ff00" }}>
                                            <div style={{ height: "100%", width: "100%", background: "#00ff00", animation: "progress 0.8s linear" }}></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: "center", zIndex: 1 }}>
                                        <img src={selectedProject.icon} alt="big icon" style={{ width: 64, height: 64, filter: "sepia(100%) hue-rotate(90deg) saturate(300%)" }} />
                                        <h2 style={{ color: "#00ff00", fontFamily: "monospace", margin: "10px 0 0 0", textTransform: "uppercase" }}>{selectedProject.location}</h2>
                                        <p style={{ color: "#008000", margin: 0 }}>Status: {selectedProject.status}</p>
                                    </div>
                                )}
                            </div>

                            {/* TEXT DETALII */}
                            <fieldset style={{ margin: "0 10px 10px 10px", flexGrow: 1 }}>
                                <legend>Project Data</legend>
                                <div style={{ padding: "10px", fontSize: "13px", lineHeight: "1.5" }}>
                                    <h4 style={{ marginTop: 0 }}>{selectedProject.title}</h4>
                                    <p>{selectedProject.desc}</p>
                                </div>
                            </fieldset>

                            {/* ACȚIUNI */}
                            <div style={{ padding: "0 10px 10px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <img src="https://win98icons.alexmeub.com/icons/png/tree-0.png" alt="tree" style={{ width: 16 }} onError={(e) => { e.currentTarget.src = "https://win98icons.alexmeub.com/icons/png/file_lines-0.png" }} />
                                    <span style={{ fontWeight: "bold" }}>Total Trees: {treesPlanted}</span>
                                </div>
                                <button style={{ fontWeight: "bold", color: "green" }} onClick={handlePlant}>🌱 Plant a Tree</button>
                            </div>

                        </div>
                    </div>

                </div>

                {/* STATUS BAR */}
                <div className="status-bar" style={{ marginTop: 5 }}>
                    <p className="status-bar-field">Air Quality: GOOD</p>
                    <p className="status-bar-field">CO2 Reduced: 450 Tons</p>
                    <p className="status-bar-field">System: Eco-Friendly</p>
                </div>

                <style>{`@keyframes progress { from { width: 0%; } to { width: 100%; } }`}</style>

            </DraggableWindow>
        </div>
    );
};

export default Environment;