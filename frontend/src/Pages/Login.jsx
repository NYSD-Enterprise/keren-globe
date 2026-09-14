import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Services/Api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await API.post("/login", {
        email,
        password,
      });

      // Save JWT token
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Save user information
      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }

      setMessage("Login successful! 🎉");

      // Go to Home after successful login
      setTimeout(() => {
        navigate("/");
      }, 800);

    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        error.response?.data?.message ||
        "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>

      <div style={loginCardStyle}>

        {/* Logo */}
        <div style={logoStyle}>
          🌍
        </div>

        <h1 style={titleStyle}>
          Welcome Back
        </h1>

        <p style={subtitleStyle}>
          Login to continue planning your journey
        </p>

        <form onSubmit={handleLogin}>

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
              placeholder="Enter your password"
              required
              style={inputStyle}
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={loginButtonStyle}
          >
            {loading ? "Logging in..." : "🔐 Login"}
          </button>

        </form>

        {/* MESSAGE */}
        {message && (
          <div
            style={{
              ...messageStyle,
              color: message.includes("successful")
                ? "green"
                : "red",
              background: message.includes("successful")
                ? "#ecfff0"
                : "#ffecec",
            }}
          >
            {message}
          </div>
        )}

        {/* REGISTER LINK */}
        <p style={registerTextStyle}>
          Don't have an account?
        </p>

        <button
          onClick={() => navigate("/register")}
          style={registerButtonStyle}
        >
          📝 Create an Account
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

const loginCardStyle = {
  width: "100%",
  maxWidth: "430px",
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

const loginButtonStyle = {
  width: "100%",
  padding: "14px",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "white",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  marginTop: "5px",
};

const messageStyle = {
  marginTop: "20px",
  padding: "12px",
  borderRadius: "8px",
  textAlign: "center",
  fontWeight: "500",
};

const registerTextStyle = {
  textAlign: "center",
  marginTop: "28px",
  marginBottom: "10px",
  color: "#666",
};

const registerButtonStyle = {
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

export default Login;