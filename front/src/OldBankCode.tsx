import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "98.css";

const OldBankCode: React.FC = () => {
    const navigate = useNavigate();

    // Stare pentru efectul de "scriere la mașină"
    const [typedText, setTypedText] = useState("");
    const fullText = `> INITIALIZING OLDBANK CODE SYSTEMS...\n> LOAD MODULE: DIGITAL_NATIVES.EXE\n> ...\n> Noi, oamenii de la OldBank Code, construim experiența de banking pentru cei peste 4 milioane de clienți – de la app-ul tău preferat, până la chatbotul care îți răspunde la aproape orice întrebare.\n>\n> VIITORUL BANKINGULUI ÎNCEPE CU NOI.\n> Suntem cea mai mare bancă, experiența pe care o oferim face parte din viața a milioane de oameni.\n> ...\n> UN NOU JOB. O NOUĂ VIAȚĂ.\n> Programul OldBank Transformers a ajutat 23 de colegi să treacă de la banking la IT.\n> ...SYSTEM READY.`;

    // Stare pentru fereastra de Proiecte
    const [showProjects, setShowProjects] = useState(false);


    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setTypedText((prev) => prev + fullText.charAt(index));
            index++;
            if (index === fullText.length) clearInterval(interval);
        }, 30);
        return () => clearInterval(interval);
    }, []);

    const techStack = [
        { category: "Databases", items: ["MSSQL", "Oracle", "PL-SQL"] },
        { category: "Backend", items: ["Java", "PHP", "C#", "Python", "Scala"] },
        { category: "Frontend", items: ["JS/TS", "Angular", "React"] },
        { category: "Big Data/AI", items: ["Spark", "Kafka", "PyTorch", "Tensorflow"] },
        { category: "DevOps", items: ["Docker", "K8s", "Jenkins", "Ansible"] }
    ];

    // Datele Proiectelor (Transformate în Stil Retro)
    const projectsData = [
        {
            id: "oldpay",
            name: "OldPay.exe",
            subtitle: "Digital Wallet v1.0",
            icon: "https://win98icons.alexmeub.com/icons/png/key_padlock-0.png",
            desc: "Zeci de beneficii la un click distanță. Plătește cu telefonul, trimite bani instant.",
            memory: "16 MB RAM"
        },
        {
            id: "oldgo",
            name: "BizManager_98.com",
            subtitle: "Enterprise Solution",
            icon: "https://win98icons.alexmeub.com/icons/png/briefcase-0.png",
            desc: "Aplicația ta de business. Facturare, plăți și gestionare cashflow într-o fereastră DOS.",
            memory: "32 MB RAM"
        },
        {
            id: "RURU",
            name: "R.U.R.U.bat",
            subtitle: "Artificial Intelligence",
            icon: "https://win98icons.alexmeub.com/icons/png/msagent-3.png",
            desc: "RURU de la OldBank. Informații non-stop despre produsele și serviciile noastre.",
            memory: "64 MB RAM"
        }
    ];



    return (
        <div style={{ padding: "5px 50px", height: "100vh", boxSizing: "border-box", overflow: "hidden" }}>

            {/* --- FEREASTRA PRINCIPALĂ (SYSTEM LOG) --- */}
            <div className="window" style={{ maxWidth: "800px", margin: "0 auto", height: "600px", display: "flex", flexDirection: "column", position: 'relative', zIndex: 1 }}>

                <div className="title-bar">
                    <div className="title-bar-text">OldBank Code - System Overview.log</div>
                    <div className="title-bar-controls">
                        <button aria-label="Close" onClick={() => navigate('/about')}></button>
                    </div>
                </div>

                <div className="window-body" style={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

                    {/* TERMINAL */}
                    <div className="sunken-panel" style={{ background: "black", color: "#00ff00", padding: "15px", height: "200px", overflowY: "auto", fontFamily: "'Courier New', monospace", marginBottom: "20px" }}>
                        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                            {typedText}
                            <span className="blink">_</span>
                        </pre>
                    </div>

                    {/* TEHNOLOGII (CHECKBOXES) */}
                    <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                            <h3 style={{ margin: 0 }}>System Components</h3>
                        </div>

                        <div className="sunken-panel" style={{ background: "white", padding: "10px", flexGrow: 1, overflowY: "auto", border: "2px solid #808080" }}>
                            {techStack.map((stack, index) => (
                                <fieldset key={index} style={{ marginBottom: "10px" }}>
                                    <legend style={{ fontWeight: "bold" }}>{stack.category}</legend>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                                        {stack.items.map((item, idx) => (
                                            <div className="field-row" key={idx}>
                                                <input type="checkbox" id={`${stack.category}-${idx}`} checked readOnly />
                                                <label htmlFor={`${stack.category}-${idx}`}>{item}</label>
                                            </div>
                                        ))}
                                    </div>
                                </fieldset>
                            ))}
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div className="status-bar" style={{ flexGrow: 1, marginRight: "20px" }}>
                            <p className="status-bar-field">Create. Grow. Deliver.</p>
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                            {/* BUTONUL INOVATIV DE PROIECTE */}
                            <button
                                style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: "bold" }}
                                onClick={() => setShowProjects(true)}
                            >
                                <img src="https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png" alt="proj" style={{ width: 16 }} />
                                Launch Projects Manager
                            </button>

                            <button style={{ display: 'flex', alignItems: 'center', gap: '5px' }} onClick={() => navigate('/jobs')}>
                                <img src="https://win98icons.alexmeub.com/icons/png/briefcase-0.png" alt="jobs" style={{ width: 16 }} />
                                Joburi
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- FEREASTRA POP-UP "PROJECTS MANAGER" (Ceva inovativ) --- */}
            {showProjects && (
                <div className="window" style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "600px",
                    zIndex: 100,
                    boxShadow: "15px 15px 0px rgba(0,0,0,0.5)"
                }}>
                    <div className="title-bar">
                        <div className="title-bar-text">OldBank Software Repository (Add/Remove Programs)</div>
                        <div className="title-bar-controls">
                            <button aria-label="Close" onClick={() => setShowProjects(false)}></button>
                        </div>
                    </div>

                    <div className="window-body">
                        <p style={{ marginBottom: "15px" }}>Applications to execute or install on the banking mainframe:</p>

                        <div className="sunken-panel" style={{ background: "white", padding: "10px", height: "300px", overflowY: "auto" }}>
                            {projectsData.map((proj) => (
                                <div key={proj.id} style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "15px",
                                    padding: "10px",
                                    borderBottom: "1px dotted gray",
                                    background: "transparent",
                                    color: "black"
                                }}>
                                    <img src={proj.icon} alt="icon" style={{ width: 32, height: 32 }} />

                                    <div style={{ flexGrow: 1 }}>
                                        <div style={{ fontWeight: "bold", fontSize: "14px" }}>{proj.name}</div>
                                        <div style={{ fontSize: "12px", fontStyle: "italic" }}>{proj.subtitle}</div>
                                        <div style={{ marginTop: "5px" }}>{proj.desc}</div>


                                    </div>

                                    <div style={{ textAlign: "right", minWidth: "80px" }}>
                                        <div style={{ fontSize: "11px", marginBottom: "5px" }}>{proj.memory}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="status-bar" style={{ marginTop: "10px" }}>
                            <p className="status-bar-field">3 Applications found</p>
                            <p className="status-bar-field">Disk Space: 98% Used</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stiluri CSS pentru animații */}
            <style>
                {`
          .blink { animation: blink-animation 1s steps(5, start) infinite; }
          @keyframes blink-animation { to { visibility: hidden; } }
          @keyframes progress { from { width: 0%; } to { width: 100%; } }
        `}
            </style>

        </div>
    );
};

export default OldBankCode;