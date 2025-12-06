import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "98.css";

// Datele pentru Social (OldBank)
const SOCIAL_DATA = [
    {
        id: 1,
        title: "Caravana Faptelor Bune",
        icon: "https://win98icons.alexmeub.com/icons/png/truck-0.png",
        desc: "Mergem din oraș în oraș pentru a ajuta comunitățile locale cu resurse și voluntari.",
        goal: "Target: 50.000 RON"
    },
    {
        id: 2,
        title: "Fă DAR din ce ai",
        icon: "https://win98icons.alexmeub.com/icons/png/gift-0.png",
        desc: "Colectăm haine și jucării pentru familiile defavorizate. Orice ajutor contează.",
        goal: "Donations: Open"
    },
    {
        id: 3,
        title: "Asistență medicală pediatrică gratuită",
        icon: "https://win98icons.alexmeub.com/icons/png/heart-0.png",
        desc: "Susținem accesul la servicii medicale de calitate pentru copiii din zonele rurale.",
        goal: "Doctors Needed: 5"
    },
    {
        id: 4,
        title: "Ambasador pentru Acasă",
        icon: "https://win98icons.alexmeub.com/icons/png/world-3.png",
        desc: "Program dedicat românilor din diaspora care vor să se întoarcă și să investească acasă.",
        goal: "Community: Global"
    },
    {
        id: 5,
        title: "Remesh - a doua șansă",
        icon: "https://win98icons.alexmeub.com/icons/png/recycle_bin_full-4.png",
        desc: "Atelier de inserție socio-profesională care transformă bannere publicitare în accesorii fashion.",
        goal: "Eco-Friendly"
    },
    {
        id: 6,
        title: "Crăciunul Dorințelor Simple",
        icon: "https://win98icons.alexmeub.com/icons/png/star-0.png",
        desc: "Îndeplinim dorințele copiilor din centrele de plasament în prag de sărbători.",
        goal: "Wishes: 500+"
    },
    {
        id: 7,
        title: "O porție în plus la masa de Crăciun",
        icon: "https://win98icons.alexmeub.com/icons/png/utensils-0.png", // Icon simulat (nu exista tacamuri in win98 default, folosim ceva similar sau generic)
        desc: "Asigurăm o masă caldă cât mai multor familii nevoiașe în perioada sărbătorilor.",
        goal: "Meals: 1000"
    },
    {
        id: 8,
        title: "Terapie asistată de câini",
        icon: "https://win98icons.alexmeub.com/icons/png/accessibility_two_windows.png",
        desc: "Proiect dedicat copiilor cu nevoi speciale, folosind terapia cu animale pentru recuperare.",
        goal: "Ongoing"
    },
    {
        id: 9,
        title: "Alege tu ce faptă bună vrei să faci",
        icon: "https://win98icons.alexmeub.com/icons/png/help_question_mark-0.png",
        desc: "Platformă deschisă unde poți propune propriul tău proiect de CSR.",
        goal: "Open Call"
    },
    {
        id: 10,
        title: "Niciunui copil să nu-i fie frig",
        icon: "https://win98icons.alexmeub.com/icons/png/temperature-0.png", // Icon simulat
        desc: "Distribuim haine groase și încălțăminte de iarnă pentru copiii din satele izolate.",
        goal: "Winter Ready"
    },
    {
        id: 11,
        title: "O nouă generație de asistenți",
        icon: "https://win98icons.alexmeub.com/icons/png/users-1.png",
        desc: "Burse de studiu pentru elevii care vor să urmeze o carieră în asistență socială sau medicală.",
        goal: "Scholars: 20"
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
            <div className="title-bar" onMouseDown={startDrag} style={{ cursor: "move", userSelect: "none" }}>
                <div className="title-bar-text" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <img src="https://win98icons.alexmeub.com/icons/png/trust1-0.png" style={{ width: 16 }} alt="" />
                    {title}
                </div>
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

// --- COMPONENTA SOCIAL ---
const Social: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCause, setSelectedCause] = useState<any>(SOCIAL_DATA[0]);
    const [donatedAmount, setDonatedAmount] = useState(0);

    const handleDonate = () => {
        alert(`Mulțumim! Ai contribuit la cauza: ${selectedCause.title}`);
        setDonatedAmount(prev => prev + 1);
    };

    return (
        <div style={{ height: "100vh", overflow: "hidden", background: "transparent" }}>

            <DraggableWindow title="OldBank Community & Social" width={850} height={550} onClose={() => navigate('/about')}>

                {/* TOOLBAR */}
                <div style={{ padding: "5px", borderBottom: "1px solid gray", display: "flex", gap: "10px", background: "#c0c0c0" }}>
                    <button style={{ minWidth: 80, fontWeight: 'bold' }}>❤️ Donate</button>
                    <button style={{ minWidth: 80 }}>Volunteer</button>
                    <div style={{ width: 1, height: 20, background: 'gray', margin: '0 5px' }}></div>
                    <button style={{ minWidth: 60 }} onClick={() => navigate('/about')}>Back</button>
                </div>

                <div style={{ display: "flex", flexGrow: 1, overflow: "hidden", padding: "10px", gap: "10px" }}>

                    {/* LISTA CAUZE (STÂNGA) */}
                    <div className="sunken-panel" style={{ width: "300px", background: "white", overflowY: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                            <thead>
                                <tr style={{ background: "#000080", color: "white" }}>
                                    <th style={{ textAlign: "left", padding: "2px 5px" }}>Initiative Name</th>
                                    <th style={{ textAlign: "right", padding: "2px 5px" }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {SOCIAL_DATA.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        onClick={() => setSelectedCause(item)}
                                        style={{
                                            cursor: "pointer",
                                            background: selectedCause.id === item.id ? "#c0c0c0" : "white",
                                            border: selectedCause.id === item.id ? "1px dotted black" : "none"
                                        }}
                                    >
                                        <td style={{ padding: "5px", display: "flex", alignItems: "center", gap: "5px" }}>
                                            <img src={item.icon} alt="" style={{ width: 16, height: 16 }} />
                                            {item.title}
                                        </td>
                                        <td style={{ padding: "5px", textAlign: "right", color: "green" }}>Active</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* DETALII CAUZĂ (DREAPTA) */}
                    <div className="window" style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                        <div className="window-body" style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>

                            <div style={{ display: "flex", gap: "15px", marginBottom: "20px", alignItems: "flex-start" }}>
                                <div style={{ border: "2px solid gray", padding: "5px", background: "white" }}>
                                    <img src={selectedCause.icon} alt="icon" style={{ width: 64, height: 64 }} />
                                </div>
                                <div>
                                    <h3 style={{ marginTop: 0, marginBottom: "5px" }}>{selectedCause.title}</h3>
                                    <p style={{ margin: 0, fontStyle: "italic", color: "gray" }}>{selectedCause.goal}</p>
                                </div>
                            </div>

                            <fieldset style={{ flexGrow: 1, marginBottom: "10px" }}>
                                <legend>Mission Statement</legend>
                                <div style={{ padding: "10px", fontSize: "14px", lineHeight: "1.5" }}>
                                    {selectedCause.desc}
                                    <br /><br />
                                    <p>OldBank se implică activ în comunitate. Credem că faptele bune se fac împreună.</p>
                                </div>
                            </fieldset>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", alignItems: "center" }}>
                                {donatedAmount > 0 && <span style={{ color: "blue" }}>You helped {donatedAmount} times!</span>}
                                <button style={{ fontWeight: "bold", minWidth: 100 }} onClick={handleDonate}>🤝 Contribute</button>
                            </div>

                        </div>
                    </div>

                </div>

                <div className="status-bar" style={{ marginTop: 5 }}>
                    <p className="status-bar-field">Total Initiatives: {SOCIAL_DATA.length}</p>
                    <p className="status-bar-field">Community Status: Strong</p>
                </div>

            </DraggableWindow>
        </div>
    );
};

export default Social;