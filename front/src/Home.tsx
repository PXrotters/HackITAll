import React from 'react';
import "98.css";

const Home: React.FC = () => {
    return (
        <div className="window" style={{ width: 400, margin: '100px auto' }}>
            <div className="title-bar">
                <div className="title-bar-text">OldBank.exe</div>
            </div>
            <div className="window-body">
                <p style={{ textAlign: 'center', fontSize: '18px' }}>
                    Welcome to the <strong>OldBank App</strong>.
                </p>
                <p style={{ textAlign: 'center' }}>
                    Please select an option from the menu above to continue.
                </p>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png" alt="PC" />
                </div>
            </div>
        </div>
    );
};

export default Home;