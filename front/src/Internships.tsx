import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "98.css";

// Datele pentru Internships
const INTERNSHIPS_DATA = [
    { id: 1, title: "Archive_Sort.exe", dept: "Floppy Disk Manager", type: "3 Months", salary: "Unpaid", desc: "Your job is to organize our stack of 500 floppy disks by color and label them." },
    { id: 2, title: "Coffee_Runner.bat", dept: "Caffeine Logistics", type: "6 Months", salary: "Coffee Beans", desc: "Ensure the Java developers never run out of fuel. Speed is key." },
    { id: 3, title: "Cable_Untangler.sys", dept: "Server Room Hero", type: "12 Months", salary: "Experience", desc: "Untangle the mess of cables behind the main server rack. Good luck." },
    { id: 4, title: "Bug_Squasher.dll", dept: "QA Tester", type: "Summer", salary: "Stipend", desc: "Play our banking app until it crashes. Then write down why on a sticky note." },
    { id: 5, title: "Fax_Fixer.com", dept: "Hardware Support", type: "3 Months", salary: "Vouchers", desc: "Unjam the paper from the fax machine. It happens daily." },
];

// --- COMPONENTA POPUP DRAGGABLE ---
interface InternshipPopupProps {
    internship: any;
    onClose: () => void;
}

const InternshipPopup: React.FC<InternshipPopupProps> = ({ internship, onClose }) => {
    // Poziționare inițială centrată
    const [pos, setPos] = useState({ x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 150 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const windowRef = useRef<HTMLDivElement>(null);

    const startDrag = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (windowRef.current) {
            const rect = windowRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
            setIsDragging(true);
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            setPos({
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    return (
        <div
            ref={windowRef}
            className="window"
            style={{
                position: "fixed",
                top: `${pos.y}px`,
                left: `${pos.x}px`,
                width: "400px",
                zIndex: 9999,
                boxShadow: "10px 10px 0px rgba(0,0,0,0.5)",
                margin: 0 // Important pentru a preveni săriturile
            }}
        >
            <div
                className="title-bar"
                onMouseDown={startDrag}
                style={{ cursor: 'move', userSelect: 'none' }}
            >
                <div className="title-bar-text">{internship.title} - Properties</div>
                <div className="title-bar-controls">
                    <button aria-label="Close" onClick={onClose}></button>
                </div>
            </div>
            <div className="window-body">
                <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                    <img src="https://win98icons.alexmeub.com/icons/png/console_prompt-0.png" style={{ width: "48px", height: "48px" }} alt="job" />
                    <div>
                        <h3 style={{ margin: 0 }}>{internship.title}</h3>
                        <p style={{ margin: 0, color: "gray" }}>Role: {internship.dept}</p>
                    </div>
                </div>

                <fieldset>
                    <legend>Description</legend>
                    <p>{internship.desc}</p>
                    <p style={{ marginTop: '10px', fontStyle: 'italic' }}>Duration: {internship.type}</p>
                </fieldset>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                    <button onClick={() => alert("Application sent via Fax!")}>Apply Now</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};


// --- COMPONENTA PRINCIPALĂ ---
const Internships: React.FC = () => {
    const navigate = useNavigate();
    const [selectedIntern, setSelectedIntern] = useState<any>(null);

    return (
        <div style={{ padding: "50px", height: "100vh", boxSizing: "border-box" }}>

            {/* --- FEREASTRA PRINCIPALĂ (FILE EXPLORER) --- */}
            <div className="window" style={{ maxWidth: "800px", margin: "0 auto", height: "500px", display: "flex", flexDirection: "column" }}>

                <div className="title-bar">
                    <div className="title-bar-text">C:\OldBank\INTERNSHIPS</div>
                    <div className="title-bar-controls">
                        <button aria-label="Close" onClick={() => navigate('/about')}></button>
                    </div>
                </div>

                <div className="window-body" style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", gap: "10px", paddingBottom: "10px", borderBottom: "2px solid #dfdfdf" }}>
                        <button onClick={() => navigate('/about')}>⬅ Back</button>
                        <span style={{ padding: "5px" }}>Address: <span style={{ background: "white", border: "1px solid gray", padding: "2px 10px" }}>C:\Internships</span></span>
                    </div>

                    <div className="sunken-panel" style={{ flexGrow: 1, background: "white", marginTop: "10px", overflowY: "auto", padding: "5px" }}>

                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                            <thead style={{ borderBottom: "2px solid black", textAlign: "left" }}>
                                <tr>
                                    <th style={{ padding: "5px" }}>File Name</th>
                                    <th style={{ padding: "5px" }}>Role</th>
                                    <th style={{ padding: "5px" }}>Duration</th>
                                    <th style={{ padding: "5px" }}>Compensation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {INTERNSHIPS_DATA.map((item) => (
                                    <tr
                                        key={item.id}
                                        style={{ cursor: "pointer" }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = "#000080"; e.currentTarget.style.color = "white"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "black"; }}
                                        onClick={() => setSelectedIntern(item)}
                                    >
                                        <td style={{ padding: "5px", display: "flex", alignItems: "center", gap: "5px" }}>
                                            <img src="https://win98icons.alexmeub.com/icons/png/console_prompt-0.png" style={{ width: 16 }} alt="doc" />
                                            {item.title}
                                        </td>
                                        <td style={{ padding: "5px" }}>{item.dept}</td>
                                        <td style={{ padding: "5px" }}>{item.type}</td>
                                        <td style={{ padding: "5px" }}>{item.salary}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>

                    <div className="status-bar" style={{ marginTop: "10px" }}>
                        <p className="status-bar-field">{INTERNSHIPS_DATA.length} object(s)</p>
                        <p className="status-bar-field">Disk space: 1.44 MB</p>
                    </div>
                </div>
            </div>

            {/* --- POPUP (DETALII INTERNSHIP) - DRAGGABLE --- */}
            {selectedIntern && (
                <InternshipPopup
                    internship={selectedIntern}
                    onClose={() => setSelectedIntern(null)}
                />
            )}

        </div>
    );
};

export default Internships;