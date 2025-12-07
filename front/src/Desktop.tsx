import React from 'react';
import { Link } from 'react-router-dom';
import xpWallpaper from './assets/windows_xp_original-wallpaper-3840x2160.jpg';

const Desktop: React.FC = () => {

    const iconStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '80px',
        textAlign: 'center',
        cursor: 'pointer',
        color: 'white',
        textShadow: '1px 1px 2px black',
        marginBottom: '20px'
    };

    const iconImgStyle: React.CSSProperties = {
        fontSize: '48px',
        marginBottom: '5px',
        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
    };

    const iconTextStyle: React.CSSProperties = {
        fontFamily: 'Tahoma, sans-serif',
        fontSize: '14px'
    }

    return (
        <div style={{
            backgroundImage: `url(${xpWallpaper})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100vh',
            width: '100vw',
            position: 'relative',
            overflow: 'hidden'
        }}>

            {/* Desktop Icons Container */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
            }}>

                {/* Register Icon */}
                <Link to="/register" style={{ textDecoration: 'none' }}>
                    <div className="desktop-icon" style={iconStyle}>
                        <div style={iconImgStyle}>📝</div>
                        <span style={iconTextStyle}>Register</span>
                    </div>
                </Link>

                {/* Login Icon */}
                <Link to="/login" style={{ textDecoration: 'none' }}>
                    <div className="desktop-icon" style={iconStyle}>
                        <div style={iconImgStyle}>🔑</div>
                        <span style={iconTextStyle}>Login</span>
                    </div>
                </Link>

                {/* About Icon */}
                <Link to="/about" style={{ textDecoration: 'none' }}>
                    <div className="desktop-icon" style={iconStyle}>
                        <div style={iconImgStyle}>ℹ️</div>
                        <span style={iconTextStyle}>About</span>
                    </div>
                </Link>

                {/* My Computer (Home placeholder if we wanted one, but sticking to requested icons) */}

            </div>

            {/* OldBank.exe Welcome Window - Restored from Home.tsx */}
            <div className="window" style={{
                width: 400,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10
            }}>
                <div className="title-bar">
                    <div className="title-bar-text">OldBank.exe</div>
                    <div className="title-bar-controls">
                        <button aria-label="Minimize"></button>
                        <button aria-label="Maximize"></button>
                        <button aria-label="Close"></button>
                    </div>
                </div>
                <div className="window-body">
                    <p style={{ textAlign: 'center', fontSize: '18px' }}>
                        Welcome to the <strong>OldBank App</strong>.
                    </p>
                    <p style={{ textAlign: 'center' }}>
                        Please use the icons to <Link to="/login">Login</Link> or <Link to="/register">Register</Link>.
                    </p>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png" alt="PC" />
                    </div>
                </div>
            </div>

            {/* Start Bar Placeholder (optional, just for visuals if needed, but user didn't explicitly ask for a functional taskbar, just "home when logged out") */}
            {/* We can leave the "Taskbar" visual out for now or add a static one at bottom. Given the request "look like a windows desktop... only his page", the wallpaper + icons is key. The App.tsx has a top window bar. We will hide that top bar for this view. */}

        </div>
    );
};

export default Desktop;
