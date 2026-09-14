    import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, clearSession } from "../Services/auth";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(getUser);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    clearSession();

    setUser(null);
    closeMenu();

    navigate("/login");
  };

  return (
    <nav className="app-navbar" style={navStyle}>
      <div className="app-navbar-top">
        {/* LOGO */}
        <Link to="/" style={logoStyle} onClick={closeMenu}>
          GlobeTrotter
        </Link>

        {/* HAMBURGER (mobile only) */}
        <button
          type="button"
          className="app-navbar-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* NAVIGATION */}
      <div
        className={`app-navbar-links${menuOpen ? " is-open" : ""}`}
        style={linksStyle}
      >
        <Link to="/" style={linkStyle} onClick={closeMenu}>
          Home
        </Link>

        {user && (
          <>
            <Link to="/?view=destinations" style={linkStyle} onClick={closeMenu}>
              Explore
            </Link>

            <Link to="/?view=recommendations" style={linkStyle} onClick={closeMenu}>
              Recommendations
            </Link>

            <Link to="/?view=planner" style={linkStyle} onClick={closeMenu}>
              Plan Trip
            </Link>

            <Link to="/?view=itineraries" style={linkStyle} onClick={closeMenu}>
              My Itineraries
            </Link>

            <Link to="/chat" style={chatStyle} onClick={closeMenu}>
              Community Chat
            </Link>
          </>
        )}

        {user ? (
          <>
            <span style={userStyle}>
              {user.username}
            </span>

            <button
              onClick={handleLogout}
              style={logoutStyle}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle} onClick={closeMenu}>
              Login
            </Link>

            <Link to="/register" style={registerStyle} onClick={closeMenu}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

/* =========================
   NAVBAR STYLES
========================= */

const navStyle = {
  width: "100%",
  minHeight: "70px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 35px",
  boxSizing: "border-box",
  background: "#ffffff",
  borderBottom: "1px solid #e5e7eb",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

const logoStyle = {
  textDecoration: "none",
  color: "#2563eb",
  fontSize: "22px",
  fontWeight: "700",
};

const linksStyle = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
};

const linkStyle = {
  textDecoration: "none",
  color: "#333333",
  fontSize: "15px",
  fontWeight: "600",
};

const chatStyle = {
  textDecoration: "none",
  color: "#2563eb",
  fontSize: "15px",
  fontWeight: "700",
};

const registerStyle = {
  textDecoration: "none",
  color: "#ffffff",
  background: "#2563eb",
  padding: "10px 16px",
  borderRadius: "8px",
  fontWeight: "600",
};

const userStyle = {
  color: "#333333",
  fontWeight: "600",
};

const logoutStyle = {
  border: "none",
  background: "#ef4444",
  color: "#ffffff",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

export default Navbar;