import React from 'react';
import "98.css";

const Register: React.FC = () => {
    return (
        <div className="window" style={{ width: 350, margin: '50px auto' }}>
            <div className="title-bar">
                <div className="title-bar-text">New User Registration</div>
            </div>
            <div className="window-body">
                <p>Please fill in the form below:</p>

                <div className="field-row" style={{ marginBottom: 8 }}>
                    <label style={{ width: 100 }}>First Name:</label>
                    <input type="text" style={{ width: '100%' }} />
                </div>

                <div className="field-row" style={{ marginBottom: 8 }}>
                    <label style={{ width: 100 }}>Last Name:</label>
                    <input type="text" style={{ width: '100%' }} />
                </div>

                <div className="field-row" style={{ marginBottom: 8 }}>
                    <label style={{ width: 100 }}>Email:</label>
                    <input type="email" style={{ width: '100%' }} />
                </div>

                <div className="field-row" style={{ marginBottom: 8 }}>
                    <label style={{ width: 100 }}>Password:</label>
                    <input type="password" style={{ width: '100%' }} />
                </div>

                <div className="field-row" style={{ marginBottom: 8 }}>
                    <label style={{ width: 100 }}>Phone (Opt):</label>
                    <input type="tel" style={{ width: '100%' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15, gap: 10 }}>
                    <button>Cancel</button>
                    <button style={{ fontWeight: 'bold' }}>Register</button>
                </div>
            </div>
        </div>
    );
};

export default Register;