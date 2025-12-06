import React from 'react';
import { Link } from 'react-router-dom';
import "98.css";

const About: React.FC = () => {
    // --- STILURI ---
    const columnStyle = {
        display: 'flex',
        flexDirection: 'column' as 'column',
        gap: '5px',
        marginBottom: '20px'
    };

    const headerStyle = {
        fontWeight: 'bold',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    };

    const iconStyle = {
        width: '24px',
        height: '24px',
        imageRendering: 'pixelated' as 'pixelated'
    };


    return (
        <div
            className="window"
            style={{
                width: 1200,
                maxWidth: '95%',
                margin: '50px auto',
                boxShadow: 'initial',
                zIndex: 1000
            }}
        >
            <div className="title-bar">
                <div className="title-bar-text">About OldBank - Directory</div>
                <div className="title-bar-controls">
                </div>
            </div>

            <div className="window-body" style={{ fontSize: '14px' }}>
                <p style={{ marginBottom: '20px' }}>Select a category to learn more about our bank:</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>

                    {/* Coloana 1: CARIERE */}
                    <div style={columnStyle}>
                        <div style={headerStyle}>
                            <img src="https://win98icons.alexmeub.com/icons/png/briefcase-2.png" alt="" style={iconStyle} />
                            <span style={{ textDecoration: 'underline' }}>CARIERE</span>
                        </div>
                        <Link to="/jobs">Joburi disponibile</Link>
                        <Link to="/internships">Internships</Link>
                        <Link to="/life-at-oldbank">Life@OldBank</Link>
                        <Link to="/culture">Cultura OldBank</Link>
                        <Link to="/oldbank-code">OldBank Code</Link>
                    </div>

                    {/* Coloana 2: NEWSROOM */}
                    <div style={columnStyle}>
                        <div style={headerStyle}>
                            <img src="https://win98icons.alexmeub.com/icons/png/help_question_mark-0.png" alt="" style={iconStyle} />
                            <span style={{ textDecoration: 'underline' }}>NEWSROOM</span>
                        </div>
                        <Link to="/newsroom">Comunicate de presă</Link>
                        <Link to="/milestones">Milestones</Link>
                        <Link to="/news">Noutăți</Link>
                        <Link to="/announcements">Anunțuri</Link>
                    </div>

                    {/* Coloana 3: COMUNITATE */}
                    <div style={columnStyle}>
                        <div style={headerStyle}>
                            <img src="https://win98icons.alexmeub.com/icons/png/world-3.png" alt="" style={iconStyle} />
                            <span style={{ textDecoration: 'underline' }}>OldBank COMUNITATE</span>
                        </div>
                        <Link to="/education">Educație</Link>
                        <Link to="/social">Social</Link>
                        <Link to="/environment">Mediu</Link>
                    </div>

                </div>

                <div className="status-bar" style={{ marginTop: '20px' }}>
                    <p className="status-bar-field">Total links: 12</p>
                    <p className="status-bar-field">System: Online</p>
                </div>
            </div>
        </div>
    );
};

export default About;