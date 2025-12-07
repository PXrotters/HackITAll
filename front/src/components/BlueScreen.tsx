import React, { useEffect } from 'react';

interface BlueScreenProps {
    onRestart: () => void;
}

const BlueScreen: React.FC<BlueScreenProps> = ({ onRestart }) => {
    useEffect(() => {
        const handleKeyDown = () => {
            onRestart();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', handleKeyDown);
        };
    }, [onRestart]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#0000AA',
            color: '#FFFFFF',
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '18px',
            padding: '40px',
            boxSizing: 'border-box',
            zIndex: 10000,
            cursor: 'none',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{ maxWidth: '800px' }}>
                <p style={{ backgroundColor: '#AAAAAA', color: '#0000AA', display: 'inline-block', padding: '2px 5px', fontWeight: 'bold' }}>Windows</p>
                <br /><br />
                <p>A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36. The current application will be terminated.</p>
                <br />
                <p>*  Press any key to terminate the current application.</p>
                <p>*  Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</p>
                <br />
                <p style={{ textAlign: 'center', marginTop: '50px' }}>Press any key to continue_</p>
            </div>
        </div>
    );
};

export default BlueScreen;
