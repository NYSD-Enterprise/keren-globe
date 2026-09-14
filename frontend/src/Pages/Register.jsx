 import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Services/Api";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await API.post("/register", {
        username,
        email,
        password,
      });

      setMessage(
        response.data.message || "Registration successful! 🎉"
      );

      // Clear form
      setUsername("");
      setEmail("");
      setPassword("");

      // Go to login after registration
      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      console.error("Registration error:", error);

      setMessage(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>

      <div style={registerCardStyle}>

        {/* LOGO */}
        <div style={logoStyle}>
          🌍
        </div>

        <h1 style={titleStyle}>
          Create Your Account
        </h1>

        <p style={subtitleStyle}>
          Join GlobeTrotter and start planning amazing trips.
        </p>

        <form onSubmit={handleRegister}>

          {/* USERNAME */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              style={inputStyle}
            />
          </div>

          {/* EMAIL */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={inputStyle}
            />
          </div>

          {/* PASSWORD */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              minLength="6"
              style={inputStyle}
            />

            <small style={passwordHintStyle}>
              Password must contain at least 6 characters.
            </small>
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={registerButtonStyle}
          >
            {loading
              ? "Creating Account..."
              : "📝 Create Account"}
          </button>

        </form>

        {/* MESSAGE */}
        {message && (
          <div
            style={{
              ...messageStyle,
              color: message.toLowerCase().includes("successful")
                ? "green"
                : "red",
              background: message.toLowerCase().includes("successful")
                ? "#ecfff0"
                : "#ffecec",
            }}
          >
            {message}
          </div>
        )}

        {/* LOGIN */}
        <p style={loginTextStyle}>
          Already have an account?
        </p>

        <button
          onClick={() => navigate("/login")}
          style={loginButtonStyle}
        >
          🔐 Login
        </button>

      </div>

    </div>
  );
}

/* =========================
   STYLES
========================= */

const pageStyle = {
  minHeight: "calc(100vh - 70px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 20px",
  background:
    "linear-gradient(135deg, #eef6ff, #ffffff)",
  boxSizing: "border-box",
};

const registerCardStyle = {
  width: "100%",
  maxWidth: "460px",
  background: "#ffffff",
  padding: "40px",
  borderRadius: "18px",
  boxShadow:
    "0 10px 35px rgba(0, 0, 0, 0.12)",
  boxSizing: "border-box",
};

const logoStyle = {
  width: "70px",
  height: "70px",
  borderRadius: "50%",
  background: "#eef6ff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "38px",
  margin: "0 auto 20px",
};

const titleStyle = {
  textAlign: "center",
  margin: "0",
  fontSize: "30px",
  color: "#222",
};

const subtitleStyle = {
  textAlign: "center",
  color: "#666",
  marginTop: "10px",
  marginBottom: "30px",
  lineHeight: "1.5",
};

const formGroupStyle = {
  marginBottom: "20px",
};

const labelStyle = {
  display: "block",
  fontWeight: "600",
  marginBottom: "8px",
  color: "#333",
};

const inputStyle = {
  width: "100%",
  padding: "13px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "15px",
  boxSizing: "border-box",
  outline: "none",
};

const passwordHintStyle = {
  display: "block",
  marginTop: "6px",
  color: "#777",
};

const registerButtonStyle = {
  width: "100%",
  padding: "14px",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "white",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
};

const messageStyle = {
  marginTop: "20px",
  padding: "12px",
  borderRadius: "8px",
  textAlign: "center",
  fontWeight: "500",
};

const loginTextStyle = {
  textAlign: "center",
  marginTop: "28px",
  marginBottom: "10px",
  color: "#666",
};

const loginButtonStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #2563eb",
  borderRadius: "8px",
  background: "white",
  color: "#2563eb",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
};

export default Register;