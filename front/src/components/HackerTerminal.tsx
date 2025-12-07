import React, { useState, useEffect, useRef } from 'react';

interface HackerTerminalProps {
    isOpen: boolean;
    onClose: () => void;
    token: string | null;
    accounts: any[];
    refreshAccounts: () => void;
}

const HackerTerminal: React.FC<HackerTerminalProps> = ({ isOpen, onClose, token, accounts, refreshAccounts }) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>(['Welcome to OldBank Mainframe.', 'Type "help" for a list of commands.']);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            inputRef.current?.focus();
        }
    }, [isOpen, history]);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCommand = async (cmd: string) => {
        const parts = cmd.trim().split(/\s+/);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        setHistory(prev => [...prev, `user@oldbank:~$ ${cmd}`]);

        switch (command) {
            case 'help':
                setHistory(prev => [...prev,
                    'Available commands:',
                    '  ls            - List all accounts and balances',
                    '  transfer      - Transfer money',
                    '      Usage: transfer --from <ID> --to <IBAN> --amount <VAL>',
                    '  clear         - Clear terminal screen',
                    '  exit          - Close session'
                ]);
                break;
            case 'clear':
                setHistory([]);
                break;
            case 'exit':
                setHistory(prev => [...prev, 'Terminating session...']);
                setTimeout(onClose, 800);
                break;
            case 'ls':
                if (accounts.length === 0) {
                    setHistory(prev => [...prev, 'No accounts found.']);
                } else {
                    accounts.forEach(acc => {
                        setHistory(prev => [...prev, `[ID: ${acc.id}] ${acc.name} - ${acc.balance} ${acc.currency} (IBAN: ${acc.iban})`]);
                    });
                }
                break;
            case 'transfer':
                await handleTransfer(args);
                break;
            default:
                setHistory(prev => [...prev, `Command not found: ${command}`]);
        }
    };

    const handleTransfer = async (args: string[]) => {
        const fromIdx = args.indexOf('--from');
        const toIdx = args.indexOf('--to');
        const amtIdx = args.indexOf('--amount');

        if (fromIdx === -1 || toIdx === -1 || amtIdx === -1) {
            setHistory(prev => [...prev, 'Error: Missing arguments.', 'Usage: transfer --from <ID> --to <IBAN> --amount <VAL>']);
            return;
        }

        const sourceAccountId = args[fromIdx + 1];
        const destinationIban = args[toIdx + 1];
        const amount = parseFloat(args[amtIdx + 1]);

        if (!sourceAccountId || !destinationIban || isNaN(amount)) {
            setHistory(prev => [...prev, 'Error: Invalid arguments.']);
            return;
        }

        setHistory(prev => [...prev, 'Initiating transfer protocol...', '...']);

        try {
            const response = await fetch('http://localhost:8090/api/v1/bank/transfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    sourceAccountId: parseInt(sourceAccountId),
                    destinationIban,
                    amount,
                    description: 'HACKER_TERMINAL_TX',
                    category: 'DarkWeb'
                })
            });

            if (response.ok) {
                setHistory(prev => [...prev, 'SUCCESS: Transfer complete.', 'Trace deleted.']);
                refreshAccounts();
            } else {
                const err = await response.text();
                setHistory(prev => [...prev, `FAILED: ${err}`]);
            }
        } catch (error) {
            setHistory(prev => [...prev, 'CRITICAL ERROR: Connection refused.']);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (input.trim()) {
                handleCommand(input);
            }
            setInput('');
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'black',
            color: '#00FF00',
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '16px',
            padding: '20px',
            boxSizing: 'border-box',
            zIndex: 10000,
            overflow: 'auto',
            textShadow: '0 0 5px #00FF00'
        }} onClick={() => inputRef.current?.focus()}>
            <div style={{ marginBottom: '10px' }}>
                {history.map((line, i) => (
                    <div key={i} style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{line}</div>
                ))}
            </div>
            <div style={{ display: 'flex' }} ref={bottomRef}>
                <span style={{ marginRight: '10px' }}>user@oldbank:~$</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#00FF00',
                        outline: 'none',
                        flex: 1,
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        textShadow: 'inherit'
                    }}
                    autoFocus
                />
            </div>
        </div>
    );
};

export default HackerTerminal;
