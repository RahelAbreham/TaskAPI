import { useEffect, useState } from "react";
import TaskList from "./components/TaskList";
import Login from "./components/Login";
import { setAuthToken, getStoredSession, onUnauthorized } from "./api/client";

export default function App() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const session = getStoredSession();
    if (session) setUsername(session.username);
  }, []);

  useEffect(() => {
    onUnauthorized(() => {
      setAuthToken(null);
      setUsername(null);
    });
  }, []);

  function handleLogout() {
    setAuthToken(null);
    setUsername(null);
  }

  if (!username) {
    return (
      <div className="app">
        <h1 style={{ textAlign: "center" }}>Task Manager</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <Login onLoggedIn={setUsername} />
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Task Manager</h1>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p>Logged in as {username}</p>
        <button onClick={handleLogout} style={{ padding: "6px 12px", cursor: "pointer" }}>
          Log out
        </button>
      </div>
      <TaskList />
    </div>
  );
}