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
      setAuthToken(result.token, result.username);
      onLoggedIn(result.username);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>{mode === "login" ? "Log in" : "Create account"}</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <button type="submit">{mode === "login" ? "Log in" : "Sign up"}</button>
      <p>
      <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "Need an account? Sign up" : "Have an account? Log in"}
      </button>
      </p>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
