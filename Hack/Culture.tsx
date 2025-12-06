import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "98.css";

const Culture: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>('valori');

    return (
        <div style={{ padding: "10px 50px", height: "100vh", boxSizing: "border-box", overflow: "hidden" }}>

            {/* FEREASTRA PRINCIPALĂ */}
            {/* MODIFICARE: Am redus height la 500px pentru a fi mai mică */}
            <div className="window" style={{ maxWidth: "800px", margin: "0 auto", height: "500px", display: "flex", flexDirection: "column" }}>

                <div className="title-bar">
                    <div className="title-bar-text">OldBank Culture Properties</div>
                    <div className="title-bar-controls">
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
                                    <legend style={{ fontWeight: "bold" }}>Educație</legend>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <img src="https://win98icons.alexmeub.com/icons/png/help_book_big-0.png" style={{ width: 32, height: 32 }} alt="book" />
                                        <div style={{ flexGrow: 1 }}>
                                            <p style={{ fontSize: "12px", marginTop: 0 }}>Credem că educația deschide drumuri și schimbă vieți. Ne implicăm și susținem proiecte ambițioase.</p>

                                            {/* MODIFICARE: Text buton "Mai mult..." */}
                                            <button style={{ marginTop: "5px", cursor: "pointer", minWidth: "100px" }} onClick={() => navigate('/education')}>
                                                Mai mult...
                                            </button>
                                        </div>
                                    </div>
                                </fieldset>

                                {/* Social */}
                                <fieldset style={{ marginBottom: "15px" }}>
                                    <legend style={{ fontWeight: "bold" }}>Social</legend>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <img src="https://win98icons.alexmeub.com/icons/png/users-0.png" style={{ width: 32, height: 32 }} alt="social" />
                                        <div style={{ flexGrow: 1 }}>
                                            <p style={{ fontSize: "12px", marginTop: 0 }}>Din grijă pentru oameni, susținem comunitățile defavorizate. Stă în puterea noastră să ajutăm.</p>

                                            {/* MODIFICARE: Text buton "Mai mult..." */}
                                            <button style={{ marginTop: "5px", cursor: "pointer", minWidth: "100px" }} onClick={() => navigate('/social')}>
                                                Mai mult...
                                            </button>
                                        </div>
                                    </div>
                                </fieldset>

                                {/* Mediu */}
                                <fieldset>
                                    <legend style={{ fontWeight: "bold" }}>Mediu</legend>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <img src="https://win98icons.alexmeub.com/icons/png/world-3.png" style={{ width: 32, height: 32 }} alt="earth" />
                                        <div style={{ flexGrow: 1 }}>
                                            <p style={{ fontSize: "12px", marginTop: 0 }}>Ne place natura! Contribuim activ în proiecte care fac diferența pentru un mediu mai curat.</p>

                                            {/* MODIFICARE: Text buton "Mai mult..." */}
                                            <button style={{ marginTop: "5px", cursor: "pointer", minWidth: "100px" }} onClick={() => navigate('/environment')}>
                                                Mai mult...
                                            </button>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        )}

                        {/* TAB 4: CONTACT */}
                        {activeTab === 'contact' && (
                            <div style={{ textAlign: "center", paddingTop: "50px" }}>
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
                </div>
            </div>
        </div>
    );
};

export default Culture;