"use client";
import { useState, useEffect } from "react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Safe background styling (runs only in browser)
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.height = "100vh";
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.style.background =
      "linear-gradient(135deg, #667eea, #764ba2)";
  }, []);

  const getUsers = () => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("users")) || [];
  };

  const saveUsers = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const users = getUsers();

    if (isLogin) {
      const user = users.find(
        (u) => u.email === email.trim() && u.password === password.trim()
      );

      if (user) {
        alert("Login Successful!");
      } else {
        setError("Invalid email or password!");
      }
    } else {
      if (password !== confirmPassword) {
        setError("Passwords do not match!");
        return;
      }

      const userExists = users.some((u) => u.email === email.trim());
      if (userExists) {
        setError("User already exists!");
      } else {
        users.push({ email: email.trim(), password: password.trim() });
        saveUsers(users);
        alert("Account created successfully!");
        setIsLogin(true);
      }
    }
  }

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.15)",
        padding: "40px",
        borderRadius: "20px",
        backdropFilter: "blur(10px)",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        width: "350px",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "20px", color: "white" }}>
        {isLogin ? "Login" : "Sign Up"}
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
          />
        )}

        {error && (
          <p style={{ color: "red", fontSize: "14px" }}>{error}</p>
        )}

        <button type="submit" style={buttonStyle}>
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <p style={{ marginTop: "15px", color: "white" }}>
        {isLogin ? "New user?" : "Already have an account?"}{" "}
        <span
          style={{ textDecoration: "underline", cursor: "pointer" }}
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
          }}
        >
          {isLogin ? "Sign Up" : "Login"}
        </span>
      </p>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "8px 0",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  background: "#ffffff",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: "10px",
};
