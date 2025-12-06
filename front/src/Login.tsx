import React from 'react';
import "98.css";

const Login: React.FC = () => {
    return (
        <div className="window" style={{ width: 300, margin: '50px auto' }}>
            <div className="title-bar">
                <div className="title-bar-text">Login System</div>
            </div>
            <div className="window-body">
                <div style={{ textAlign: 'center', marginBottom: 15 }}>
                    <img src="https://win98icons.alexmeub.com/icons/png/key_win-0.png" alt="Key" />
                </div>

                <div className="field-row" style={{ marginBottom: 10 }}>
                    <label htmlFor="user" style={{ width: 80 }}>Username:</label>
                    <input id="user" type="text" style={{ width: '100%' }} />
                </div>
                <div className="field-row" style={{ marginBottom: 10 }}>
                    <label htmlFor="pass" style={{ width: 80 }}>Password:</label>
                    <input id="pass" type="password" style={{ width: '100%' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 15 }}>
                    <button style={{ fontWeight: 'bold' }}>Enter</button>
                </div>
            </div>
        </div>
    );
};

export default Login;