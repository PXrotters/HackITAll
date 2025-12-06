import React from 'react';
import { Link } from 'react-router-dom';
import "98.css";

const About: React.FC = () => {
    // Stiluri pentru coloane (ca să arate ca în poză, dar retro)
    const columnStyle = {
        display: 'flex',
        flexDirection: 'column' as 'column',
        gap: '5px',
        marginBottom: '20px'
    };

    const headerStyle = {
        fontWeight: 'bold',
        marginBottom: '10px',
        textDecoration: 'underline'
    };

    return (
        // Fereastra mare centrată
        <div className="window" style={{ width: 1000, maxWidth: '95%', margin: '50px auto' }}>
            <div className="title-bar">
                <div className="title-bar-text">About OldBank - Directory</div>
                <div className="title-bar-controls">
                    <button aria-label="Close"></button>
                </div>
            </div>

            <div className="window-body" style={{ fontSize: '13px' }}>
                <p style={{ marginBottom: '20px' }}>Select a category to learn more about our bank:</p>

                {/* GRID LAYOUT: 3 Coloane pentru desktop */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>

                    {/* Coloana 1: CARIERE */}
                    <div style={columnStyle}>
                        <div style={headerStyle}>📂 CARIERE</div>
                        <Link to="/jobs">Joburi disponibile</Link>
                        <Link to="/internships">Internships</Link>
                        <Link to="/life-at-oldbank">Life@OldBank</Link>
                        <Link to="/culture">Cultura OldBank</Link>
                        <Link to="/oldbank-code">OldBank Code</Link>
                    </div>

                    {/* Coloana 2: NEWSROOM */}
                    <div style={columnStyle}>
                        <div style={headerStyle}>📰 NEWSROOM</div>
                        <Link to="/newsroom">Comunicate de presă</Link>
                        <Link to="/newsroom">Milestones</Link>
                        <Link to="/newsroom">Noutăți</Link>
                        <a href="#">#OldBank Voice</a>
                        <a href="#">Anunțuri</a>
                    </div>

                    {/* Coloana 3: BLOG */}
                    <div style={columnStyle}>
                        <div style={headerStyle}>📝 BLOG</div>
                        <a href="#">Campanii</a>
                        <a href="#">Educație financiară</a>
                        <a href="#">OldBank Pay</a>
                        <a href="#">Evenimente</a>
                        <a href="#">The MaCRO Zone</a>
                    </div>

                    {/* Coloana 4: PODCAST */}
                    <div style={columnStyle}>
                        <div style={headerStyle}>🎙️ PODCAST</div>
                        <a href="#">OldBank Business Talks</a>
                        <a href="#">OldBank Talks</a>
                    </div>

                    {/* Coloana 5: COMUNITATE */}
                    <div style={columnStyle}>
                        <div style={headerStyle}>🤝 OldBank COMUNITATE</div>
                        <a href="#">Educație</a>
                        <a href="#">Social</a>
                        <a href="#">Mediu</a>
                    </div>

                </div>

                {/* Footer al ferestrei */}
                <div className="status-bar" style={{ marginTop: '20px' }}>
                    <p className="status-bar-field">Total links: 20</p>
                    <p className="status-bar-field">System: Online</p>
                </div>
            </div>
        </div>
    );
};

export default About;