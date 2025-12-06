import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "98.css";
import xpWallpaper from './assets/windows_xp_original-wallpaper-3840x2160.jpg';

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

  return (
    <Router>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", ...backgroundStyle }}>

        {/* === BARA DE MENIU (SUS) === */}
        <div className="window" style={{ margin: "10px", zIndex: 100 }}>
          <div className="window-body" style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>

            <div style={{ fontWeight: "bold", marginRight: "20px" }}>
              💻 OldBank {localStorage.getItem('username') ? `| Hello, ${localStorage.getItem('username')}` : ''}
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

      </div>
    </Router>
  );
}

export default App;