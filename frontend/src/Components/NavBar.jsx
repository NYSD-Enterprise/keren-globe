    import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, clearSession } from "../Services/auth";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(getUser);

  const handleLogout = () => {
    clearSession();

    setUser(null);

    navigate("/login");
  };

  return (
    <nav className="app-navbar" style={navStyle}>
      {/* LOGO */}
      <Link to="/" style={logoStyle}>
        GlobeTrotter
      </Link>

      {/* NAVIGATION */}
      <div className="app-navbar-links" style={linksStyle}>
        <Link to="/" style={linkStyle}>
          Home
        </Link>

        <Link to="/chat" style={chatStyle}>
          Community Chat
        </Link>

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
            <Link to="/login" style={linkStyle}>
              Login
            </Link>

            <Link to="/register" style={registerStyle}>
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