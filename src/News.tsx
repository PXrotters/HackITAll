import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "98.css";

// Datele transformate (BT -> OldBank)
const NEWS_ITEMS = [
    { id: 1, date: "04 DEC 2025", category: "Comunicate", title: "Fitch confirmă rating-urile OldBank", icon: "https://win98icons.alexmeub.com/icons/png/certificate-1.png", body: "Agenția Fitch a reconfirmat rating-urile OldBank, subliniind poziția solidă de capital. Aceasta este o veste excelentă pentru investitorii noștri." },
    { id: 2, date: "28 NOI 2025", category: "Noutăți", title: "OldBank, premiată pentru relația cu investitorii", icon: "https://win98icons.alexmeub.com/icons/png/trophy-0.png", body: "În cadrul galei anuale a Bursei, OldBank a primit premiul pentru 'Cea mai bună comunicare cu investitorii', confirmând transparența noastră." },
    { id: 3, date: "28 NOI 2025", category: "#OldBankVoice", title: "Daniela Secară: Listarea nu mai este opțională", icon: "https://win98icons.alexmeub.com/icons/png/microphone-0.png", body: "Daniela Secară, OldBank Capital Partners: 'Pentru companiile care aspiră la leadership în economie, prezența pe bursă devine o necesitate, nu doar o opțiune.'" },
    { id: 4, date: "27 NOI 2025", category: "Comunicate", title: "Finanțare sindicalizată de 300 mil. EUR pentru Autonom", icon: "https://win98icons.alexmeub.com/icons/png/money_bag-0.png", body: "OldBank a coordonat, ca aranjator principal, finanțarea sindicalizată de 300 milioane de euro pentru Autonom Services." },
    { id: 5, date: "28 NOI 2025", category: "Comunicate", title: "Grupul OldBank ajunge la 800.000 participanți Pensii", icon: "https://win98icons.alexmeub.com/icons/png/users-1.png", body: "În urma achiziției BRD Pensii, Grupul OldBank a atins pragul istoric de 800.000 de participanți la fondurile Pilon 2 și 3." },
    { id: 6, date: "26 NOI 2025", category: "#OldBankVoice", title: "Ionuț Morar: Transformăm leasingul în soluții de mobilitate", icon: "https://win98icons.alexmeub.com/icons/png/car-0.png", body: "Ionuț Morar, OldBank Leasing: 'Viziunea noastră este să transformăm leasingul dintr-un simplu produs financiar într-o platformă complexă de soluții.'" },
    { id: 7, date: "28 NOI 2025", category: "Noutăți", title: "Grupul OldBank News | Noiembrie 2025", icon: "https://win98icons.alexmeub.com/icons/png/newspaper-0.png", body: "Rezumatul lunii Noiembrie: Lansări noi în OldPay, parteneriate strategice și rezultate financiare peste așteptări." },
    { id: 8, date: "25 NOI 2025", category: "#OldBankVoice", title: "Tiberiu Moisă: O perioadă bună pentru decizii curajoase", icon: "https://win98icons.alexmeub.com/icons/png/lightbulb-0.png", body: "Tiberiu Moisă, OldBank: 'Văd o perioadă foarte bună pentru decizii curajoase atunci când curajul, ca şi calcul economic, face sens.'" }
];

// --- DRAGGABLE WINDOW COMPONENT ---
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

// --- COMPONENTA NEWS ---
const News: React.FC = () => {
    const navigate = useNavigate();
    const [selectedNews, setSelectedNews] = useState<any>(NEWS_ITEMS[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("All");

    const handleSelect = (item: any) => {
        setIsLoading(true);
        setTimeout(() => {
            setSelectedNews(item);
            setIsLoading(false);
        }, 600);
    };

    // --- FUNCȚII NOI PENTRU BUTOANE ---
    const handlePrint = () => {
        window.print();
    };

    const handleSave = () => {
        if (!selectedNews) return;

        // Creăm textul fișierului
        const content = `TITLE: ${selectedNews.title}\nDATE: ${selectedNews.date}\nCATEGORY: ${selectedNews.category}\n\n${selectedNews.body}\n\n---\nSaved from OldBank News Reader`;

        // Creăm un blob și un link de descărcare
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        // Numele fișierului bazat pe titlu (curățat de caractere speciale)
        const safeTitle = selectedNews.title.replace(/[^a-z0-9]/gi, '_').substring(0, 20);
        link.download = `${safeTitle}.txt`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredItems = filter === "All" ? NEWS_ITEMS : NEWS_ITEMS.filter(item => item.category.includes(filter));

    return (
        <div style={{ height: "100vh", overflow: "hidden", background: "transparent" }}>
            <DraggableWindow title="OldBank News Reader v2.0" width={900} height={600} onClose={() => navigate('/about')}>
                <div style={{ padding: "5px", display: "flex", gap: "5px", borderBottom: "1px solid gray", background: "#c0c0c0" }}>
                    <button className={filter === "All" ? "active" : ""} onClick={() => setFilter("All")} style={{ fontWeight: filter === "All" ? "bold" : "normal" }}>🌍 All Topics</button>
                    <button className={filter === "Comunicate" ? "active" : ""} onClick={() => setFilter("Comunicate")}>📄 Press</button>
                    <button className={filter === "Noutăți" ? "active" : ""} onClick={() => setFilter("Noutăți")}>📰 General News</button>
                    <button className={filter === "Voice" ? "active" : ""} onClick={() => setFilter("Voice")}>🗣️ #OldBankVoice</button>
                </div>

                <div style={{ display: "flex", flexGrow: 1, overflow: "hidden", gap: "5px", padding: "5px" }}>
                    <div className="sunken-panel" style={{ width: "320px", background: "white", overflowY: "auto", display: "flex", flexDirection: "column" }}>
                        {filteredItems.map((item) => (
                            <div key={item.id} onClick={() => handleSelect(item)} style={{ padding: "5px", borderBottom: "1px dotted #ccc", cursor: "pointer", background: selectedNews?.id === item.id ? "#000080" : "transparent", color: selectedNews?.id === item.id ? "white" : "black", display: "flex", gap: "8px", alignItems: "center" }}>
                                <img src={item.icon} alt="icon" style={{ width: 24, height: 24 }} />
                                <div>
                                    <div style={{ fontSize: "10px", opacity: 0.8 }}>{item.date} | {item.category}</div>
                                    <div style={{ fontWeight: "bold", fontSize: "12px", lineHeight: "1.1" }}>{item.title}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="window" style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                        <div className="window-body" style={{ flexGrow: 1, background: "white", padding: "20px", overflowY: "auto", position: "relative" }}>
                            {isLoading ? (
                                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                                    <img src="https://win98icons.alexmeub.com/icons/png/hourglass-0.png" alt="loading" />
                                    <p>Downloading article...</p>
                                    <div style={{ width: 150, height: 15, border: "1px solid black", marginTop: 5 }}><div style={{ width: "60%", height: "100%", background: "navy" }}></div></div>
                                </div>
                            ) : selectedNews ? (
                                <>
                                    <div style={{ borderBottom: "2px solid black", paddingBottom: "10px", marginBottom: "20px" }}>
                                        <h2 style={{ margin: 0, fontSize: "20px" }}>{selectedNews.title}</h2>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", color: "gray", fontSize: "12px" }}>
                                            <span>Date: {selectedNews.date}</span>
                                            <span>Category: {selectedNews.category}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "20px" }}>
                                        <div style={{ flexGrow: 1, fontSize: "14px", lineHeight: "1.5" }}>
                                            <p><strong>BUCUREȘTI (OldBank News Wire)</strong> - {selectedNews.body}</p>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                                        </div>
                                    </div>
                                    {/* BUTOANELE FUNCȚIONALE */}
                                    <div style={{ marginTop: "30px", borderTop: "1px solid gray", paddingTop: "10px" }}>
                                        <button style={{ float: "right" }} onClick={handlePrint}>Print Article</button>
                                        <button style={{ float: "right", marginRight: "5px" }} onClick={handleSave}>Save to Floppy</button>
                                    </div>
                                </>
                            ) : (
                                <div style={{ textAlign: "center", marginTop: "50px", color: "gray" }}>Select a headline to read.</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="sunken-panel" style={{ margin: "5px", background: "black", color: "#00ff00", padding: "2px", fontFamily: "monospace", fontSize: "12px", overflow: "hidden", whiteSpace: "nowrap" }}>
                    <div style={{ display: "inline-block", animation: "marquee 15s linear infinite" }}>
                        +++ BREAKING NEWS: Fitch confirmă rating-urile OldBank +++ Grupul OldBank ajunge la 800.000 participanți Pensii +++ Bank Friday: 30.000 aplicații într-o zi +++
                    </div>
                </div>
                <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }`}</style>
            </DraggableWindow>
        </div>
    );
};

export default News;