import React from 'react';
import "98.css";

const Register: React.FC = () => {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const handleRegister = async () => {
        const username = `${firstName} ${lastName}`.trim();
        if (!username || !email || !password) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password }),
            });

            if (response.ok) {
                alert('Registration successful! Please login.');
                window.location.href = '/login'; // Assuming there is a login route, or we can just reload
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="window" style={{ width: 350, margin: '50px auto' }}>
            <div className="title-bar">
                <div className="title-bar-text">New User Registration</div>
            </div>
            <div className="window-body">
                <p>Please fill in the form below:</p>

                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                <div className="field-row" style={{ marginBottom: 8 }}>
                    <label style={{ width: 100 }}>First Name:</label>
                    <input type="text" style={{ width: '100%' }} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>

                <div className="field-row" style={{ marginBottom: 8 }}>
                    <label style={{ width: 100 }}>Last Name:</label>
                    <input type="text" style={{ width: '100%' }} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>

                <div className="field-row" style={{ marginBottom: 8 }}>
                    <label style={{ width: 100 }}>Email:</label>
                    <input type="email" style={{ width: '100%' }} value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="field-row" style={{ marginBottom: 8 }}>
                    <label style={{ width: 100 }}>Password:</label>
                    <input type="password" style={{ width: '100%' }} value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div className="field-row" style={{ marginBottom: 8 }}>
                    <label style={{ width: 100 }}>Phone (Opt):</label>
                    <input type="tel" style={{ width: '100%' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15, gap: 10 }}>
                    <button>Cancel</button>
                    <button style={{ fontWeight: 'bold' }} onClick={handleRegister}>Register</button>
                </div>
            </div>
        </div>
    );
};

export default Register;