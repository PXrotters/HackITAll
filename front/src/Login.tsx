import React from 'react';
import "98.css";

const Login: React.FC = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

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
                alert('Login successful!');
                window.location.href = '/'; // Simple redirect for now
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        }
    };

    return (
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
    );
};

export default Login;