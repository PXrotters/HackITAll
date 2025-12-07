import React from 'react';
import "98.css";

interface RetroModalProps {
    isOpen: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    buttons?: {
        label: string;
        onClick: () => void;
        autoFocus?: boolean;
    }[];
}

const RetroModal: React.FC<RetroModalProps> = ({ isOpen, title, children, onClose, buttons }) => {
    if (!isOpen) return null;

    return (
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
            <div className="window" style={{ minWidth: 300, maxWidth: 400 }}>
                <div className="title-bar">
                    <div className="title-bar-text">{title}</div>
                    <div className="title-bar-controls">
                        <button aria-label="Close" onClick={onClose}></button>
                    </div>
                </div>
                <div className="window-body">
                    <div style={{ padding: '10px 5px' }}>
                        {children}
                    </div>
                    {buttons && buttons.length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: 15, marginBottom: 5 }}>
                            {buttons.map((btn, idx) => (
                                <button
                                    key={idx}
                                    onClick={btn.onClick}
                                    style={{ minWidth: 70, fontWeight: btn.autoFocus ? 'bold' : 'normal' }}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RetroModal;
