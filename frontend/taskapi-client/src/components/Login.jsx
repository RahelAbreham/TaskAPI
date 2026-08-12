import { useState } from "react";
import { api, setAuthToken } from "../api/client";

export default function Login({ onLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const result = mode === "login"
        ? await api.login(username, password)
        : await api.register(username, password);
      setAuthToken(result.token);
      onLoggedIn(result.username);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "320px",
      }}
    >
      <h2 style={{ margin: "0 0 8px 0" }}>
        {mode === "login" ? "Log in" : "Create account"}
      </h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: "8px", fontSize: "14px" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "8px", fontSize: "14px" }}
      />

      <button type="submit" style={{ padding: "8px", cursor: "pointer" }}>
        {mode === "login" ? "Log in" : "Sign up"}
      </button>

      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        style={{
          padding: "8px",
          cursor: "pointer",
          background: "transparent",
          border: "1px solid #ccc",
        }}
      >
        {mode === "login" ? "Need an account? Sign up" : "Have an account? Log in"}
      </button>

      {error && <p style={{ color: "#b00020", margin: "4px 0 0 0" }}>{error}</p>}
    </form>
  );
}