import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "98.css";

// 1. Datele Joburilor
const JOBS_DATA = [
    { id: 1, title: "COBOL Developer", dept: "IT Legacy", type: "Full-Time", salary: "9000 €", desc: "Maintain code from 1995. Must know how to use a floppy disk.", img: "https://win98icons.alexmeub.com/icons/png/console_prompt-0.png" },
    { id: 2, title: "Fax Machine Operator", dept: "Communication", type: "Internship", salary: "Unpaid", desc: "Responsible for sending important memos via fax line.", img: "https://win98icons.alexmeub.com/icons/png/console_prompt-0.png" },
    { id: 3, title: "Chief Excel Officer", dept: "Finance", type: "Part-Time", salary: "2500 RON", desc: "Must know VLOOKUP and how to create colored pie charts.", img: "https://win98icons.alexmeub.com/icons/png/console_prompt-0.png" },
    { id: 4, title: "Coffee Java Script Dev", dept: "IT Modern", type: "Full-Time", salary: "3800 RON", desc: "Write React code and brew coffee simultaneously.", img: "https://win98icons.alexmeub.com/icons/png/console_prompt-0.png" },
    { id: 5, title: "Windows 95 Installer", dept: "IT Support", type: "Contract", salary: "500 RON", desc: "Install Windows 95 on new machines from a stack of 20 floppies.", img: "https://win98icons.alexmeub.com/icons/png/console_prompt-0.png" },
    { id: 6, title: "Mouse Ball Cleaner", dept: "Maintenance", type: "Part-Time", salary: "Minimum Wage", desc: "Ensure all mechanical mice roll smoothly by cleaning their trackballs.", img: "https://win98icons.alexmeub.com/icons/png/console_prompt-0.png" },
    { id: 7, title: "Y2K Prep Specialist", dept: "Risk Mgmt", type: "Full-Time", salary: "6,000 €", desc: "Prepare our systems for the year 2000. Yes, we know it's 2025.", img: "https://win98icons.alexmeub.com/icons/png/console_prompt-0.png" },
];

// --- COMPONENTA POPUP DRAGGABLE ---
interface JobPopupProps {
    job: any;
    onClose: () => void;
}

const JobPopup: React.FC<JobPopupProps> = ({ job, onClose }) => {
    // Calculăm poziția inițială pentru a fi aproximativ în centru
    // (folosim valori hardcoded sau window.innerWidth pentru centrare)
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
                position: "fixed", // Folosim fixed ca să stea peste orice, chiar dacă dăm scroll
                top: `${pos.y}px`,
                left: `${pos.x}px`,
                width: "400px",
                zIndex: 9999,
                boxShadow: "10px 10px 0px rgba(0,0,0,0.5)",
                margin: 0 // IMPORTANT pentru a preveni "săritul"
            }}
        >
            <div
                className="title-bar"
                onMouseDown={startDrag}
                style={{ cursor: 'move', userSelect: 'none' }}
            >
                <div className="title-bar-text">Job Properties</div>
                <div className="title-bar-controls">
                    <button aria-label="Close" onClick={onClose}></button>
                </div>
            </div>
            <div className="window-body">
                <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                    <img src={job.img} style={{ width: "64px", height: "64px", objectFit: "cover" }} alt="job" />
                    <div>
                        <h3 style={{ margin: 0 }}>{job.title}</h3>
                        <p style={{ margin: 0, color: "gray" }}>Type: {job.type}</p>
                    </div>
                </div>

                <fieldset>
                    <legend>Description</legend>
                    <p>{job.desc}</p>
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
const Jobs: React.FC = () => {
    const navigate = useNavigate();
    const [selectedJob, setSelectedJob] = useState<any>(null);

    return (
        <div style={{ padding: "50px", height: "100vh", boxSizing: "border-box" }}>

            {/* --- FEREASTRA PRINCIPALĂ (FILE EXPLORER) --- */}
            <div className="window" style={{ maxWidth: "800px", margin: "0 auto", height: "500px", display: "flex", flexDirection: "column" }}>

                <div className="title-bar">
                    <div className="title-bar-text">C:\OldBank\CAREERS</div>
                    <div className="title-bar-controls">
                        <button aria-label="Close" onClick={() => navigate('/about')}></button>
                    </div>
                </div>

                <div className="window-body" style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", gap: "10px", paddingBottom: "10px", borderBottom: "2px solid #dfdfdf" }}>
                        <button onClick={() => navigate('/about')}>⬅ Back</button>
                        <span style={{ padding: "5px" }}>Address: <span style={{ background: "white", border: "1px solid gray", padding: "2px 10px" }}>C:\Jobs</span></span>
                    </div>

                    <div className="sunken-panel" style={{ flexGrow: 1, background: "white", marginTop: "10px", overflowY: "auto", padding: "5px" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                            <thead style={{ borderBottom: "2px solid black", textAlign: "left" }}>
                                <tr>
                                    <th style={{ padding: "5px" }}>Name</th>
                                    <th style={{ padding: "5px" }}>Department</th>
                                    <th style={{ padding: "5px" }}>Type</th>
                                    <th style={{ padding: "5px" }}>Salary</th>
                                </tr>
                            </thead>
                            <tbody>
                                {JOBS_DATA.map((job) => (
                                    <tr
                                        key={job.id}
                                        style={{ cursor: "pointer" }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = "#000080"; e.currentTarget.style.color = "white"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "black"; }}
                                        onClick={() => setSelectedJob(job)}
                                    >
                                        <td style={{ padding: "5px", display: "flex", alignItems: "center", gap: "10px" }}>
                                            <img src={job.img} style={{ width: 32, height: 32, objectFit: 'cover' }} alt="job" />
                                            {job.title}
                                        </td>
                                        <td style={{ padding: "5px" }}>{job.dept}</td>
                                        <td style={{ padding: "5px" }}>{job.type}</td>
                                        <td style={{ padding: "5px" }}>{job.salary}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="status-bar" style={{ marginTop: "10px" }}>
                        <p className="status-bar-field">{JOBS_DATA.length} object(s)</p>
                        <p className="status-bar-field">Disk space: 1.44 MB</p>
                    </div>
                </div>
            </div>

            {/* --- POPUP (DETALII JOB) - DRAGGABLE --- */}
            {selectedJob && (
                <JobPopup
                    job={selectedJob}
                    onClose={() => setSelectedJob(null)}
                />
            )}

        </div>
    );
};

export default Jobs;