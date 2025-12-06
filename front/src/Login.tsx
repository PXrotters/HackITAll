import React from 'react';
import "98.css";

const Login: React.FC = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const [showSuccess, setShowSuccess] = React.useState(false);

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:8090/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('username', data.username);
                setShowSuccess(true);
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        }
    };

    return (
        <>
            {showSuccess && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div className="window" style={{ width: 300 }}>
                        <div className="title-bar">
                            <div className="title-bar-text">Success</div>
                            <div className="title-bar-controls">
                                <button aria-label="Close" onClick={() => window.location.href = '/'}></button>
                            </div>
                        </div>
                        <div className="window-body">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 5px' }}>
                                <img src="https://win98icons.alexmeub.com/icons/png/check-0.png" alt="Success" style={{ width: 32, height: 32 }} />
                                <p style={{ margin: 0, fontSize: '14px' }}>Login successful!</p>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 15, marginBottom: 5 }}>
                                <button style={{ minWidth: 80 }} onClick={() => window.location.href = '/'}>OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="window" style={{ width: 300, margin: '50px auto' }}>
                <div className="title-bar">
                    <div className="title-bar-text">Login System</div>
                </div>
                <div className="window-body">
                    <div style={{ textAlign: 'center', marginBottom: 15 }}>
                        <img src="https://win98icons.alexmeub.com/icons/png/key_win-0.png" alt="Key" />
                    </div>

                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                    <div className="field-row" style={{ marginBottom: 10 }}>
                        <label htmlFor="user" style={{ width: 80 }}>Email:</label>
                        <input
                            id="user"
                            type="email"
                            style={{ width: '100%' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="field-row" style={{ marginBottom: 10 }}>
                        <label htmlFor="pass" style={{ width: 80 }}>Password:</label>
                        <input
                            id="pass"
                            type="password"
                            style={{ width: '100%' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 15 }}>
                        <button style={{ fontWeight: 'bold' }} onClick={handleLogin}>Enter</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;