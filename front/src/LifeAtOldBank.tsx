import React from 'react';
import { useNavigate } from 'react-router-dom';
import "98.css";

const LifeAtOldBank: React.FC = () => {
    const navigate = useNavigate();

    return (
        // MODIFICARE: Am redus padding-ul de sus la 20px (în loc de 50px)
        <div style={{ padding: "20px 50px", height: "100vh", boxSizing: "border-box", overflow: "hidden" }}>

            {/* FEREASTRA PRINCIPALĂ */}
            {/* MODIFICARE: margin: "0 auto" pentru a nu avea spațiu extra sus */}
            <div className="window" style={{ maxWidth: "800px", margin: "0 auto", height: "600px", display: "flex", flexDirection: "column" }}>

                <div className="title-bar">
                    <div className="title-bar-text">Life @ OldBank - Internal Memo.txt</div>
                    <div className="title-bar-controls">
                        <button aria-label="Close" onClick={() => navigate('/about')}></button>
                    </div>
                </div>

                <div className="window-body" style={{ flexGrow: 1, overflowY: "auto", padding: "15px" }}>

                    {/* Header cu imagine și Titlu */}
                    <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                        <img
                            src="https://win98icons.alexmeub.com/icons/png/world-3.png"
                            alt="globe"
                            style={{ width: "48px", height: "48px" }}
                        />
                        <div>
                            <h2 style={{ margin: 0 }}>Ne pasă de #OameniidelaOldBank.</h2>
                            <p style={{ margin: 0, fontStyle: "italic" }}>Așa că investim în ei.</p>
                        </div>
                    </div>

                    <p style={{ marginBottom: "20px", lineHeight: "1.5" }}>
                        De la planuri de carieră, oportunități de schimbare profesională și program flexibil,
                        până la abonamente medicale complexe, prime de performanță și multe alte beneficii,
                        suntem alături de <strong>#OameniidelaOldBank</strong>.
                    </p>

                    {/* SECȚIUNEA 1: ACADEMIA */}
                    <fieldset style={{ marginBottom: "20px" }}>
                        <legend style={{ fontWeight: "bold", display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <img src="https://win98icons.alexmeub.com/icons/png/certificate-1.png" alt="cert" style={{ width: 16, height: 16 }} />
                            Academia OldBank
                        </legend>
                        <div style={{ display: "flex", gap: "10px", alignItems: "start", marginTop: "10px" }}>
                            <img src="https://win98icons.alexmeub.com/icons/png/help_book_big-0.png" style={{ width: 32 }} alt="book" />
                            <div>
                                <h4 style={{ marginTop: 0, marginBottom: "5px" }}>Nu ne oprim niciodată din învățat</h4>
                                <p>
                                    Misiunea Academiei OldBank este să ofere cele mai bune traininguri interne,
                                    sau cu alți specialiști din domeniu. Investim continuu în dezvoltarea profesională
                                    a oamenilor care formează echipa OldBank.
                                </p>
                            </div>
                        </div>
                    </fieldset>

                    {/* SECȚIUNEA 2: RECONVERSIE */}
                    <fieldset style={{ marginBottom: "20px" }}>
                        <legend style={{ fontWeight: "bold", display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <img src="https://win98icons.alexmeub.com/icons/png/recycle_bin_full-4.png" alt="recycle" style={{ width: 16, height: 16 }} />
                            Reconversie profesională
                        </legend>
                        <div style={{ display: "flex", gap: "10px", alignItems: "start", marginTop: "10px" }}>
                            {/* AM ÎNLOCUIT TOOLS CU CONSOLE PROMPT (DEV TOOLS) */}
                            <img src="https://win98icons.alexmeub.com/icons/png/console_prompt-0.png" style={{ width: 32 }} alt="tools" />
                            <div>
                                <h4 style={{ marginTop: 0, marginBottom: "5px" }}>O șansă cât se poate de reală</h4>
                                <p>
                                    Prin programele noastre de reskilling, orice angajat OldBank are șansa de a se dezvolta
                                    și în alte domenii. Când unul dintre colegii noștri simte nevoia de o schimbare,
                                    are la dispoziție mentori gata să îl ajute și oportunități reale de a-și schimba
                                    parcursul profesional.
                                </p>
                            </div>
                        </div>
                    </fieldset>

                    {/* BUTONUL DE FINAL */}
                    <div style={{ textAlign: "center", marginTop: "30px", padding: "20px", borderTop: "2px solid gray" }}>
                        <p style={{ fontWeight: "bold", marginBottom: "10px" }}>Vrei să faci parte din povestea noastră?</p>
                        <button
                            onClick={() => navigate('/jobs')}
                            style={{ padding: "10px 20px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                {/* AM ÎNLOCUIT SĂGEATA CU O ICONIȚĂ DE JOB (BRIEFCASE) */}
                                <img src="https://win98icons.alexmeub.com/icons/png/briefcase-0.png" alt="job" style={{ width: 16, height: 16 }} />
                                Hai în echipă!
                            </div>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LifeAtOldBank;