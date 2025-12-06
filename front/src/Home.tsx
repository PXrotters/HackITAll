import React, { useState, useEffect, useMemo } from 'react';
import Clippy from './components/Clippy';
import RetroPieChart from './components/RetroPieChart';

interface BankAccount {
    id: number;
    iban: string;
    balance: number;
    currency: string;
    name: string;
}

interface Transaction {
    id: number;
    createdAt: string;
    type: 'DEBIT' | 'CREDIT';
    amount: number;
    description: string;
    category?: { name: string };
}

const Home: React.FC = () => {
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [newAccountName, setNewAccountName] = useState('');
    const [newAccountCurrency, setNewAccountCurrency] = useState('RON');
    const [sourceAccountId, setSourceAccountId] = useState<number | null>(null);
    const [destinationIban, setDestinationIban] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');

    const token = localStorage.getItem('token');

    const fetchAccounts = async () => {
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
        if (token) {
            fetchAccounts();
        }
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
                    description,
                    category
                })
            });
            if (response.ok) {
                alert('Transfer successful!');
                setAmount('');
                setDestinationIban('');
                setDescription('');
                setCategory('');
                fetchAccounts();
            } else {
                const err = await response.text();
                alert('Transfer failed: ' + err); // Backend might return error message
            }
        } catch (error) {
            console.error(error);
        }
    };

    // History Modal State
    const [historyAccountId, setHistoryAccountId] = useState<number | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [showStats, setShowStats] = useState(false);

    const fetchHistory = async (accountId: number) => {
        setHistoryAccountId(accountId);
        setShowStats(true); // Open stats by default
        setTransactions([]);
        try {
            const response = await fetch(`http://localhost:8090/api/v1/bank/accounts/${accountId}/transactions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setTransactions(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Calculate chart data
    const chartData = useMemo(() => {
        const stats: Record<string, number> = {};
        transactions.filter(t => t.type === 'DEBIT').forEach(t => {
            const cat = t.category?.name || 'Uncategorized';
            stats[cat] = (stats[cat] || 0) + t.amount;
        });

        const colors = ['#0000FF', '#FF00FF', '#008080', '#00FF00', '#FFFF00', '#800080', '#808000'];
        return Object.keys(stats).map((key, i) => ({
            label: key,
            value: stats[key],
            color: colors[i % colors.length]
        }));
    }, [transactions]);

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
                                <li key={acc.id} style={{ marginBottom: '10px', border: '1px solid gray', padding: '5px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <strong>{acc.name}</strong> ({acc.currency}) <br />
                                        IBAN: {acc.iban} <br />
                                        Balance: <strong>{acc.balance}</strong>
                                    </div>
                                    <button onClick={() => fetchHistory(acc.id)}>History</button>
                                </li>
                            ))}
                        </ul>
                    )}
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
                    <div className="field-row-stacked">
                        <label>Category (e.g. Food, Rent)</label>
                        <input type="text" value={category} onChange={e => setCategory(e.target.value)} />
                    </div>
                    <button style={{ marginTop: '10px' }} onClick={handleTransfer}>Send Money</button>
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

            {/* History Window */}
            {historyAccountId && (
                <>
                    {/* Statistics Window (Separate) */}
                    {showStats && (
                        <div className="window" style={{ width: 300, height: 'fit-content', marginRight: '-10px', zIndex: 1 }}>
                            <div className="title-bar">
                                <div className="title-bar-text">Spending Analysis</div>
                                <div className="title-bar-controls">
                                    <button aria-label="Close" onClick={() => setShowStats(false)}></button>
                                </div>
                            </div>
                            <div className="window-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <p style={{ margin: '5px 0' }}><strong>Spending by Category</strong></p>
                                <RetroPieChart data={chartData} width={260} height={170} />
                                {chartData.length === 0 && <p>No spending data to chart.</p>}
                            </div>
                        </div>
                    )}

                    {/* History Window */}
                    <div className="window" style={{ width: 400, height: 350, display: 'flex', flexDirection: 'column' }}>
                        <div className="title-bar">
                            <div className="title-bar-text">Transaction History (Account #{historyAccountId})</div>
                            <div className="title-bar-controls">
                                <button aria-label="Close" onClick={() => setHistoryAccountId(null)}></button>
                            </div>
                        </div>
                        <div className="window-body" style={{ flex: 1, overflowY: 'auto' }}>
                            {/* Selected Account Info */}
                            {accounts.find(a => a.id === historyAccountId) && (
                                <div style={{ textAlign: 'center', margin: '10px 0', padding: '10px', background: '#e0e0e0', border: '2px solid white', boxShadow: 'inset 1px 1px #404040, inset -1px -1px white' }}>
                                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                        {accounts.find(a => a.id === historyAccountId)?.name}
                                    </div>
                                    <div style={{ fontSize: '14px' }}>
                                        Balance: <strong>{accounts.find(a => a.id === historyAccountId)?.balance} {accounts.find(a => a.id === historyAccountId)?.currency}</strong>
                                    </div>
                                </div>
                            )}

                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left' }}>Date</th>
                                        <th style={{ textAlign: 'left' }}>Type</th>
                                        <th style={{ textAlign: 'left' }}>Category</th>
                                        <th style={{ textAlign: 'left' }}>Description</th>
                                        <th style={{ textAlign: 'right' }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(tx => (
                                        <tr key={tx.id}>
                                            <td>{new Date(tx.createdAt).toLocaleString()}</td>
                                            <td>{tx.type}</td>
                                            <td>{tx.category?.name || '-'}</td>
                                            <td>{tx.description}</td>
                                            <td style={{ textAlign: 'right', color: tx.type === 'DEBIT' ? 'red' : 'green' }}>
                                                {tx.type === 'DEBIT' ? '-' : '+'}{tx.amount}
                                            </td>
                                        </tr>
                                    ))}
                                    {transactions.length === 0 && (
                                        <tr><td colSpan={5} style={{ textAlign: 'center' }}>No transactions found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div >
    );
};

export default Home;