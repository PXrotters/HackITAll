import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "98.css";

// Importăm paginile create
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import About from "./About";

function App() {
  return (
    <Router>
      <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

        {/* === BARA DE MENIU (SUS) === */}
        <div className="window" style={{ margin: "10px", zIndex: 100 }}>
          <div className="window-body" style={{ display: "flex", gap: "10px", alignItems: "center" }}>

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

          </div>
        </div>

        {/* === ZONA DE CONȚINUT (SCHIMBĂTOARE) === */}
        <div style={{ flexGrow: 1, position: "relative" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}

export default App;