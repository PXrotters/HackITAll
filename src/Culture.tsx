import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "98.css";

const Culture: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>('valori');

    // Stare pentru Popup-uri (reține care popup e deschis: 'educatie', 'social', 'mediu' sau null)
    const [activePopup, setActivePopup] = useState<string | null>(null);

    // Datele pentru fiecare Popup
    const popupContent: any = {
        educatie: {
            title: "Detalii - Educatie.txt",
            text: "Investim în viitor! Programul 'OldBank Academy' oferă burse de studiu pentru 500 de studenți anual. Organizăm workshop-uri de educație financiară în licee și parteneriate cu universitățile de top din țară.",
            icon: "https://win98icons.alexmeub.com/icons/png/help_book_big-0.png"
        },
        social: {
            title: "Detalii - Social Impact.txt",
            text: "Suntem alături de cei care au nevoie. Anul acesta am donat peste 1 milion de RON către cauze umanitare și am construit 5 case pentru familii defavorizate prin programul nostru de voluntariat.",
            icon: "https://win98icons.alexmeub.com/icons/png/users-0.png"
        },
        mediu: {
            title: "Detalii - Green Initiative.txt",
            text: "OldBank devine verde! Am redus consumul de hârtie cu 60% prin digitalizare. Pentru fiecare cont nou deschis online, plantăm un copac în 'Pădurea OldBank'.",
            icon: "https://win98icons.alexmeub.com/icons/png/world-3.png"
        }
    };

    return (
        <div style={{ padding: "50px", height: "100vh", boxSizing: "border-box", overflow: "hidden" }}>

            {/* FEREASTRA PRINCIPALĂ */}
            <div className="window" style={{ maxWidth: "800px", margin: "0 auto", height: "650px", display: "flex", flexDirection: "column" }}>

                <div className="title-bar">
                    <div className="title-bar-text">OldBank Culture Properties</div>
                    <div className="title-bar-controls">
                        <button aria-label="Minimize"></button>
                        <button aria-label="Maximize"></button>
                        <button aria-label="Close" onClick={() => navigate('/about')}></button>
                    </div>
                </div>

                <div className="window-body" style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>

                    {/* --- SISTEMUL DE TAB-URI --- */}
                    <menu role="tablist">
                        <li role="tab" aria-selected={activeTab === 'valori'} onClick={() => setActiveTab('valori')}>
                            <a href="#valori">Valorile Noastre</a>
                        </li>
                        <li role="tab" aria-selected={activeTab === 'diversitate'} onClick={() => setActiveTab('diversitate')}>
                            <a href="#diversitate">Diversitate</a>
                        </li>
                        <li role="tab" aria-selected={activeTab === 'impact'} onClick={() => setActiveTab('impact')}>
                            <a href="#impact">Impact & Comunitate</a>
                        </li>
                        <li role="tab" aria-selected={activeTab === 'contact'} onClick={() => setActiveTab('contact')}>
                            <a href="#contact">Contact</a>
                        </li>
                    </menu>

                    {/* --- CONȚINUTUL TAB-URILOR --- */}
                    <div className="window" role="tabpanel" style={{ flexGrow: 1, padding: "20px", overflowY: "auto", position: "relative" }}>

                        {/* TAB 1: VALORI */}
                        {activeTab === 'valori' && (
                            <div>
                                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                                    <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png" alt="icon" style={{ width: 48, height: 48 }} />
                                    <h2 style={{ marginTop: 5 }}>Valorile ne apropie</h2>
                                    <p>Împreună reușim să creăm povești de succes.</p>
                                </div>

                                <fieldset>
                                    <legend>System Core Values</legend>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>
                                        <div className="field-row"><input type="checkbox" checked readOnly /><label>Încredere</label></div>
                                        <div className="field-row"><input type="checkbox" checked readOnly /><label>Empatie</label></div>
                                        <div className="field-row"><input type="checkbox" checked readOnly /><label>Respect</label></div>
                                        <div className="field-row"><input type="checkbox" checked readOnly /><label>Entuziasm</label></div>
                                        <div className="field-row"><input type="checkbox" checked readOnly /><label>Pasiune pentru antreprenoriat</label></div>
                                        <div className="field-row"><input type="checkbox" checked readOnly /><label>Muncă de echipă</label></div>
                                    </div>
                                </fieldset>

                                <div className="status-bar" style={{ marginTop: "20px" }}>
                                    <p className="status-bar-field">Status: All systems operational</p>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: DIVERSITATE */}
                        {activeTab === 'diversitate' && (
                            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                                    <img src="https://win98icons.alexmeub.com/icons/png/users-1.png" alt="users" style={{ width: 48 }} />
                                    <h3>Diferențele ne unesc</h3>
                                </div>

                                <div className="sunken-panel" style={{ padding: "15px", background: "white", flexGrow: 1 }}>
                                    <p style={{ lineHeight: "1.6", margin: 0 }}>
                                        <strong>Diversitatea, incluziunea și egalitatea de șanse</strong> sunt câteva dintre principiile care stau la baza relației între noi, <strong>#OameniidelaOldBank</strong>.
                                        <br /><br />
                                        Suntem diferiți, avem perspective diferite, iar asta ne ajută să evoluăm continuu. Așa am reușit să construim ceva unic, care ne unește: spiritul OldBank.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: IMPACT (EDUCAȚIE / SOCIAL / MEDIU) */}
                        {activeTab === 'impact' && (
                            <div>
                                {/* Educație */}
                                <fieldset style={{ marginBottom: "15px" }}>
                                    <legend style={{ fontWeight: "bold" }}>📚 Educație</legend>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <img src="https://win98icons.alexmeub.com/icons/png/help_book_big-0.png" style={{ width: 32, height: 32 }} alt="book" />
                                        <div style={{ flexGrow: 1 }}>
                                            <p style={{ fontSize: "12px", marginTop: 0 }}>Credem că educația deschide drumuri și schimbă vieți. Ne implicăm și susținem proiecte ambițioase.</p>
                                            <button style={{ marginTop: "5px" }} onClick={() => setActivePopup('educatie')}>Mai mult...</button>
                                        </div>
                                    </div>
                                </fieldset>

                                {/* Social */}
                                <fieldset style={{ marginBottom: "15px" }}>
                                    <legend style={{ fontWeight: "bold" }}>🤝 Social</legend>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        {/* ICONIȚĂ FIXATĂ: trust1-0.png (strângere de mână) */}
                                        <img src="https://win98icons.alexmeub.com/icons/png/users-0.png" style={{ width: 32, height: 32 }} alt="social" />
                                        <div style={{ flexGrow: 1 }}>
                                            <p style={{ fontSize: "12px", marginTop: 0 }}>Din grijă pentru oameni, susținem comunitățile defavorizate. Stă în puterea noastră să ajutăm.</p>
                                            <button style={{ marginTop: "5px" }} onClick={() => setActivePopup('social')}>Mai mult...</button>
                                        </div>
                                    </div>
                                </fieldset>

                                {/* Mediu */}
                                <fieldset>
                                    <legend style={{ fontWeight: "bold" }}>🌍 Mediu</legend>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <img src="https://win98icons.alexmeub.com/icons/png/world-3.png" style={{ width: 32, height: 32 }} alt="earth" />
                                        <div style={{ flexGrow: 1 }}>
                                            <p style={{ fontSize: "12px", marginTop: 0 }}>Ne place natura! Contribuim activ în proiecte care fac diferența pentru un mediu mai curat.</p>
                                            <button style={{ marginTop: "5px" }} onClick={() => setActivePopup('mediu')}>Mai mult...</button>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        )}

                        {/* TAB 4: CONTACT */}
                        {activeTab === 'contact' && (
                            <div style={{ textAlign: "center", paddingTop: "50px" }}>
                                {/* ICONIȚĂ FIXATĂ: outlook_express-0.png (plic cu săgeți) */}
                                <img src="https://win98icons.alexmeub.com/icons/png/outlook_express-0.png" style={{ width: 64 }} alt="mail" />
                                <h2>Suntem aici pentru tine</h2>
                                <p>În cazul în care ai alte întrebări sau sugestii:</p>

                                <div style={{ marginTop: "20px", padding: "10px", border: "2px solid gray", display: "inline-block", background: "#e0e0e0" }}>
                                    <strong>📧 Email:</strong><br />
                                    <span style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}>
                                        recrutare@oldbank.ro
                                    </span>
                                </div>
                            </div>
                        )}

                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px", gap: "10px" }}>
                        <button onClick={() => navigate('/about')} style={{ minWidth: "80px" }}>OK</button>
                        <button onClick={() => navigate('/about')} style={{ minWidth: "80px" }}>Cancel</button>
                    </div>

                </div>
            </div>

            {/* --- POPUP WINDOW (Apare peste conținut când apeși "Mai mult") --- */}
            {activePopup && popupContent[activePopup] && (
                <div className="window" style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "400px",
                    zIndex: 1000,
                    boxShadow: "10px 10px 0px rgba(0,0,0,0.5)"
                }}>
                    <div className="title-bar">
                        <div className="title-bar-text">{popupContent[activePopup].title}</div>
                        <div className="title-bar-controls">
                            <button aria-label="Close" onClick={() => setActivePopup(null)}></button>
                        </div>
                    </div>
                    <div className="window-body">
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                            <img src={popupContent[activePopup].icon} alt="icon" style={{ width: 32, height: 32 }} />
                            <p style={{ marginTop: 0 }}>{popupContent[activePopup].text}</p>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '15px' }}>
                            <button onClick={() => setActivePopup(null)} style={{ width: "80px" }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Culture;