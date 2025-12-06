import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "98.css";

// 1. Definim datele joburilor (Mock Data)
const JOBS_DATA = [
    { id: 1, title: "COBOL Developer", dept: "IT Legacy", type: "Full-Time", salary: "10000 BITCOINS", desc: "Maintain code from 1995. Must know how to use a floppy disk." },
    { id: 2, title: "Fax Machine Operator", dept: "Communication", type: "Internship", salary: "Unpaid", desc: "Responsible for sending important memos via fax line." },
    { id: 3, title: "Chief Excel Officer", dept: "Finance", type: "Part-Time", salary: "500 Credits", desc: "Must know VLOOKUP and how to create colored pie charts." },
    { id: 4, title: "Coffee Java Script Dev", dept: "IT Modern", type: "Full-Time", salary: "Competitive", desc: "Write React code and brew coffee simultaneously." },
    { id: 5, title: "Windows 95 Installer", dept: "IT Support", type: "Contract", salary: "Hourly", desc: "Install Windows 95 on new machines from a stack of 20 floppies." },
    { id: 6, title: "Mouse Ball Cleaner", dept: "Maintenance", type: "Part-Time", salary: "Minimum Wage", desc: "Ensure all mechanical mice roll smoothly by cleaning their trackballs." },
    { id: 7, title: "Y2K Prep Specialist", dept: "Risk Mgmt", type: "Full-Time", salary: "High", desc: "Prepare our systems for the year 2000. Yes, we know it's 2025." },
];

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
                        <button aria-label="Minimize"></button>
                        <button aria-label="Maximize"></button>
                        <button aria-label="Close" onClick={() => navigate('/about')}></button>
                    </div>
                </div>

                {/* Meniul de sus (File, Edit...) */}
                <div className="window-body" style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", gap: "10px", paddingBottom: "10px", borderBottom: "2px solid #dfdfdf" }}>
                        <button onClick={() => navigate('/about')}>⬅ Back</button>
                        <span style={{ padding: "5px" }}>Address: <span style={{ background: "white", border: "1px solid gray", padding: "2px 10px" }}>C:\Jobs</span></span>
                    </div>

                    {/* Zona Albă cu Lista de Joburi */}
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
                                        <td style={{ padding: "5px", display: "flex", alignItems: "center", gap: "5px" }}>
                                            <img src="https://win98icons.alexmeub.com/icons/png/document_text-0.png" style={{ width: 16 }} alt="doc" />
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

            {/* --- POPUP (DETALII JOB) - Apare doar când selectezi un job --- */}
            {selectedJob && (
                <div className="window" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "400px", zIndex: 1000, boxShadow: "10px 10px 0px rgba(0,0,0,0.5)" }}>
                    <div className="title-bar">
                        <div className="title-bar-text">Job Properties</div>
                        <div className="title-bar-controls">
                            <button aria-label="Close" onClick={() => setSelectedJob(null)}></button>
                        </div>
                    </div>
                    <div className="window-body">
                        <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                            <img src="https://win98icons.alexmeub.com/icons/png/briefcase-2.png" style={{ width: "48px", height: "48px" }} alt="job" />
                            <div>
                                <h3 style={{ margin: 0 }}>{selectedJob.title}</h3>
                                <p style={{ margin: 0, color: "gray" }}>Type: {selectedJob.type}</p>
                            </div>
                        </div>

                        <fieldset>
                            <legend>Description</legend>
                            <p>{selectedJob.desc}</p>
                        </fieldset>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                            <button onClick={() => alert("Application sent via Fax!")}>Apply Now</button>
                            <button onClick={() => setSelectedJob(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Jobs;