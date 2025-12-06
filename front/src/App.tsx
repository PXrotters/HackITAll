import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "98.css";
import xpWallpaper from './assets/windows_xp_original-wallpaper-3840x2160.jpg';
import winLogo from './assets/win.png';
import hourglassIcon from './assets/hourglass.png';

// Importăm paginile create
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import About from "./About";
import Jobs from "./Jobs";
import Internships from "./Internships";
import LifeAtOldBank from "./LifeAtOldBank";
import Culture from "./Culture";
import OldBankCode from "./OldBankCode";
import Newsroom from "./Newsroom";
import Milestones from "./Milestones";
import News from "./News";
import Announcements from "./Announcements";
import Education from "./Education";
import Social from "./Social";
import Environment from "./Environment";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const backgroundStyle = isDarkMode ? {
    // Keep transparent to show body background from index.css
  } : {
    backgroundImage: `url(${xpWallpaper})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
  };

  // State for Credit Score Logic
  const [isScoreOpen, setIsScoreOpen] = useState(false);
  const [scoreData, setScoreData] = useState<any>(null);
  const [isScoreLoading, setIsScoreLoading] = useState(false);

  // State for dragging popup
  const [scorePosition, setScorePosition] = useState({ x: 0, y: 0 });
  const [isDraggingScore, setIsDraggingScore] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragTrail, setDragTrail] = useState<{ x: number, y: number }[]>([]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDraggingScore(true);
    const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingScore) {
      const newPos = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      };
      setScorePosition(newPos);

      // Make it "jerky" (saccadic) by only adding to trail if moved significantly
      setDragTrail(prev => {
        const lastPos = prev[prev.length - 1];
        // Threshold of 25px for noticeable steps
        if (!lastPos || (Math.abs(newPos.x - lastPos.x) > 25 || Math.abs(newPos.y - lastPos.y) > 25)) {
          return [...prev.slice(-100), newPos]; // Increased limit slightly to handle longer trails if needed
        }
        return prev;
      });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingScore(false);
    setDragTrail([]); // Clear trail on release
  };

  const handleCheckScore = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login first to check your score.");
      return;
    }

    setIsScoreLoading(true);
    try {
      // 1. Fetch user accounts to find ID
      let accountId = null;
      let recentTransactions: any[] = [];
      let spendingSummary: any = null;

      try {
        const accRes = await fetch('http://localhost:8090/api/v1/bank/accounts', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (accRes.ok) {
          const accounts = await accRes.json();
          if (accounts.length > 0) {
            accountId = accounts[0].id;
          }
        }
      } catch (e) {
        console.error("Error fetching accounts", e);
      }

      // 2. If account found, fetch Transactions & Stats
      if (accountId) {
        try {
          const txRes = await fetch(`http://localhost:8090/api/v1/bank/accounts/${accountId}/transactions`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (txRes.ok) {
            const txData = await txRes.json();
            // Map to format expected by score endpoint
            recentTransactions = txData.map((t: any) => ({
              id: t.id,
              date: new Date(t.createdAt).toISOString().split('T')[0],
              amount: t.amount,
              currency: "RON", // API might not strictly return currency in list, assuming RON or t.currency if available
              type: t.type,
              description: t.description,
              category: t.category?.name || "Uncategorized"
            }));
          }

          const statRes = await fetch(`http://localhost:8090/api/v1/bank/accounts/${accountId}/analytics/monthly?month=2025-11`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (statRes.ok) {
            const statData = await statRes.json();
            spendingSummary = {
              period: "2025-11",
              currency: "RON",
              by_category: Object.entries(statData.categoryBreakdown || {}).map(([cat, amt]) => ({
                category: cat,
                amount: amt
              }))
            };
          }
        } catch (e) {
          console.error("Error fetching stats", e);
        }
      }

      // 3. Call Score Endpoint (Proxied)
      const res = await fetch('/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: "global-score-request", // arbitrary ID
          context: {
            spending_summary: spendingSummary,
            recent_transactions: recentTransactions
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        setScoreData(data);
        setIsScoreOpen(true);
      } else {
        alert("Could not calculate score right now.");
      }

    } catch (error) {
      console.error(error);
      alert("Error connecting to score service.");
    } finally {
      setIsScoreLoading(false);
    }
  };

  // Helper to render the popup content (reused for ghosts)
  const renderPopupContent = (isGhost = false) => (
    <>
      <div
        className="title-bar"
        onMouseDown={!isGhost ? handleMouseDown : undefined}
        style={{ cursor: !isGhost ? 'move' : 'default', background: isGhost ? 'linear-gradient(90deg, #000080, #1084d0)' : undefined }}
      >
        <div className="title-bar-text">Credit Health Estimate</div>
        {!isGhost && (
          <div className="title-bar-controls">
            <button aria-label="Close" onClick={() => setIsScoreOpen(false)}></button>
          </div>
        )}
      </div>
      <div className="window-body">
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <h3>Estimated Score: {scoreData.score}</h3>
          <div style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: scoreData.score >= 740 ? 'green' : (scoreData.score >= 670 ? 'blue' : (scoreData.score >= 580 ? '#b8860b' : 'red'))
          }}>
            {scoreData.label}
          </div>
          <p style={{ fontStyle: 'italic', fontSize: '11px', marginTop: '5px' }}>
            *Educational estimate only. Not a real FICO score.
          </p>
        </div>
        {!isGhost && (
          <>
            <fieldset style={{ marginBottom: '10px' }}>
              <legend>Analysis</legend>
              <p style={{ fontSize: '12px', margin: '5px' }}>{scoreData.explanation}</p>
            </fieldset>
            <fieldset>
              <legend>Tips</legend>
              <ul style={{ fontSize: '12px', paddingLeft: '20px', margin: '5px 0' }}>
                {scoreData.suggestions.map((tip: string, idx: number) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{tip}</li>
                ))}
              </ul>
            </fieldset>
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <button onClick={() => setIsScoreOpen(false)}>Close</button>
            </div>
          </>
        )}
      </div>
    </>
  );

  return (
    <Router>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", ...backgroundStyle }}>

        {/* === BARA DE MENIU (SUS) === */}
        <div className="window" style={{ margin: "10px", zIndex: 100 }}>
          <div className="window-body" style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>

            <div style={{ fontWeight: "bold", marginRight: "20px", display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src={winLogo} alt="Logo" style={{ height: '24px' }} />
              OldBank {localStorage.getItem('username') ? `| Hello, ${localStorage.getItem('username')}` : ''}
            </div>

            {/* Link-urile sunt stilizate ca butoane Windows */}
            <Link to="/">
              <button>🏠 Home</button>
            </Link>

            {!localStorage.getItem('token') ? (
              <>
                <Link to="/login">
                  <button>🔑 Login</button>
                </Link>

                <Link to="/register">
                  <button>📝 Register</button>
                </Link>
              </>
            ) : (
              <button onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                window.location.href = '/login';
              }}>
                🚪 Logout
              </button>
            )}

            <Link to="/about">
              <button>ℹ️ About</button>
            </Link>

            {localStorage.getItem('token') && (
              <button onClick={handleCheckScore} disabled={isScoreLoading} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                {isScoreLoading ? <img src={hourglassIcon} alt="Loading..." style={{ height: '16px' }} /> : '📉 Score'}
              </button>
            )}

            <div style={{ marginLeft: 'auto' }}>
              <button onClick={() => setIsDarkMode(!isDarkMode)}>
                {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
              </button>
            </div>

          </div>
        </div>

        {/* === ZONA DE CONȚINUT (SCHIMBĂTOARE) === */}
        <div style={{ flexGrow: 1, position: "relative" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/life-at-oldbank" element={<LifeAtOldBank />} />
            <Route path="/culture" element={<Culture />} />
            <Route path="/oldbank-code" element={<OldBankCode />} />
            <Route path="/newsroom" element={<Newsroom />} />
            <Route path="/milestones" element={<Milestones />} />
            <Route path="/news" element={<News />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/education" element={<Education />} />
            <Route path="/social" element={<Social />} />
            <Route path="/environment" element={<Environment />} />
          </Routes>
        </div>

        {/* === CREDIT SCORE POPUP & GHOSTS === */}
        {isScoreOpen && scoreData && (
          <>
            {/* TRAIL GHOSTS */}
            {dragTrail.map((pos, idx) => (
              <div
                key={idx}
                className="window"
                style={{
                  position: 'fixed',
                  top: pos.y,
                  left: pos.x,
                  width: '350px',
                  zIndex: 9000 + idx, // Below main popup (9999)
                  opacity: 0.5 + (idx / dragTrail.length) * 0.5, // Fade effect
                  pointerEvents: 'none', // Ghosts shouldn't capture clicks
                  boxShadow: 'none'
                }}
              >
                {renderPopupContent(true)}
              </div>
            ))}

            {/* MAIN POPUP */}
            <div
              className="window"
              style={{
                position: 'fixed',
                // Use state position if set (dragged), otherwise center initially
                top: scorePosition.y || '50%',
                left: scorePosition.x || '50%',
                transform: (scorePosition.x === 0 && scorePosition.y === 0) ? 'translate(-50%, -50%)' : 'none',
                width: '350px',
                zIndex: 9999,
                boxShadow: '10px 10px 0 rgba(0,0,0,0.5)'
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {renderPopupContent(false)}
            </div>
          </>
        )}

      </div>
    </Router>
  );
}

export default App;