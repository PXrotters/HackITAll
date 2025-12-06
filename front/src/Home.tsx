import React, { useEffect, useState } from 'react';
import "98.css";
import Clippy from './components/Clippy';

interface BankAccount {
    id: number;
    iban: string;
    currency: string;
    balance: number;
    name: string;
}

const Home: React.FC = () => {
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [loading, setLoading] = useState(false);

    // Create Account State
    const [newAccountName, setNewAccountName] = useState('');
    const [newAccountCurrency, setNewAccountCurrency] = useState('RON');

    // Transfer State
    const [sourceAccountId, setSourceAccountId] = useState<number | null>(null);
    const [destinationIban, setDestinationIban] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    const token = localStorage.getItem('token');

    const fetchAccounts = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8090/api/v1/bank/accounts', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setAccounts(data);
                if (data.length > 0 && !sourceAccountId) {
                    setSourceAccountId(data[0].id);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, [token]);

    const handleCreateAccount = async () => {
        try {
            const response = await fetch('http://localhost:8090/api/v1/bank/accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: newAccountName, currency: newAccountCurrency })
            });
            if (response.ok) {
                alert('Account created!');
                setNewAccountName('');
                fetchAccounts();
            } else {
                alert('Failed to create account');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleTransfer = async () => {
        if (!sourceAccountId) return;
        try {
            const response = await fetch('http://localhost:8090/api/v1/bank/transfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    sourceAccountId,
                    destinationIban,
                    amount: parseFloat(amount),
                    description
                })
            });
            if (response.ok) {
                alert('Transfer successful!');
                setAmount('');
                setDestinationIban('');
                setDescription('');
                fetchAccounts();
            } else {
                const err = await response.text();
                alert('Transfer failed: ' + err); // Backend might return error message
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!token) {
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
                        Please <a href="/login">Login</a> to view your accounts.
                    </p>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png" alt="PC" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Clippy accounts={accounts} username={localStorage.getItem('username') || 'Guest'} />
            {/* Accounts List */}
            <div className="window" style={{ width: 400 }}>
                <div className="title-bar">
                    <div className="title-bar-text">My Accounts</div>
                </div>
                <div className="window-body">
                    {loading ? <p>Loading...</p> : (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {accounts.map(acc => (
                                <li key={acc.id} style={{ marginBottom: '10px', border: '1px solid gray', padding: '5px', background: 'white' }}>
                                    <strong>{acc.name}</strong> ({acc.currency}) <br />
                                    IBAN: {acc.iban} <br />
                                    Balance: <strong>{acc.balance}</strong>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Create Account */}
            <div className="window" style={{ width: 300, height: 'fit-content' }}>
                <div className="title-bar">
                    <div className="title-bar-text">New Account</div>
                </div>
                <div className="window-body">
                    <div className="field-row-stacked">
                        <label>Account Name</label>
                        <input type="text" value={newAccountName} onChange={e => setNewAccountName(e.target.value)} />
                    </div>
                    <div className="field-row-stacked">
                        <label>Currency</label>
                        <select value={newAccountCurrency} onChange={e => setNewAccountCurrency(e.target.value)}>
                            <option value="RON">RON</option>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>
                    <button style={{ marginTop: '10px' }} onClick={handleCreateAccount}>Create Account</button>
                </div>
            </div>

            {/* Make Transfer */}
            <div className="window" style={{ width: 300, height: 'fit-content' }}>
                <div className="title-bar">
                    <div className="title-bar-text">Quick Transfer</div>
                </div>
                <div className="window-body">
                    <div className="field-row-stacked">
                        <label>From Account</label>
                        <select value={sourceAccountId || ''} onChange={e => setSourceAccountId(Number(e.target.value))}>
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>{acc.name} ({acc.balance} {acc.currency})</option>
                            ))}
                        </select>
                    </div>
                    <div className="field-row-stacked">
                        <label>To IBAN</label>
                        <input type="text" value={destinationIban} onChange={e => setDestinationIban(e.target.value)} />
                    </div>
                    <div className="field-row-stacked">
                        <label>Amount</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
                    </div>
                    <div className="field-row-stacked">
                        <label>Description</label>
                        <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                    <button style={{ marginTop: '10px' }} onClick={handleTransfer}>Send Money</button>
                </div>
            </div>
        </div>
    );
};

export default Home;