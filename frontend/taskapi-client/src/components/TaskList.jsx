import { useEffect, useState } from "react";
import { api } from "../api/client";

const STATUSES = ["Pending", "InProgress", "Completed"];
const PRIORITIES = ["Low", "Medium", "High"];

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);

  async function loadTasks() {
    try {
      const data = await api.getTasks();
      setTasks(data.filter((t) => !t.isDeleted));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await api.createTask({
        title,
        description,
        priority,
        dueDate: dueDate || null,
        status: "Pending",
      });
      setTitle("");
      setDescription("");
      setDueDate("");
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdate(task, changes) {
    try {
      await api.updateTask(task.id, { ...task, ...changes });
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(task) {
    try {
      await api.deleteTask(task.id);
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(task) {
    setEditingId(task.id);
    setDraft({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
  }

  async function saveEdit(task) {
    await handleUpdate(task, {
      title: draft.title,
      description: draft.description,
      priority: draft.priority,
      dueDate: draft.dueDate || null,
    });
    setEditingId(null);
    setDraft(null);
  }

  return (
    <div className="task-list">
      <h2>Tasks</h2>

      <form onSubmit={handleCreate} className="task-form">
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button type="submit">Add task</button>
      </form>

      {error && <p className="error">{error}</p>}

      {tasks.length === 0 ? (
        <p>No tasks yet - add one above.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr>
              <th style={{ padding: "8px", borderBottom: "2px solid #ddd" }}>Task Details</th>
              <th style={{ padding: "8px", borderBottom: "2px solid #ddd" }}>Priority</th>
              <th style={{ padding: "8px", borderBottom: "2px solid #ddd" }}>Status</th>
              <th style={{ padding: "8px", borderBottom: "2px solid #ddd" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) =>
              editingId === task.id ? (
                <tr key={task.id} style={{ borderBottom: "1px solid #eee", background: "#fafafa" }}>
                  <td style={{ padding: "8px", verticalAlign: "top" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <input
                        value={draft.title}
                        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                        style={{ padding: "6px" }}
                      />
                      <input
                        value={draft.description}
                        onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                        placeholder="Description"
                        style={{ padding: "6px" }}
                      />
                      <input
                        type="date"
                        value={draft.dueDate}
                        onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
                        style={{ padding: "6px" }}
                      />
                    </div>
                  </td>
                  <td style={{ padding: "8px", verticalAlign: "top" }}>
                    <select
                      value={draft.priority}
                      onChange={(e) => setDraft({ ...draft, priority: e.target.value })}
                      style={{ padding: "4px 8px" }}
                    >
                      {PRIORITIES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: "8px", verticalAlign: "top" }}>{task.status}</td>
                  <td style={{ padding: "8px", verticalAlign: "top" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => saveEdit(task)} style={{ padding: "4px 8px", cursor: "pointer" }}>
                        Save
                      </button>
                      <button onClick={cancelEdit} style={{ padding: "4px 8px", cursor: "pointer" }}>
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={task.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "8px", verticalAlign: "top" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <strong style={{ fontSize: "1.1em" }}>{task.title}</strong>
                      {task.description && (
                        <span style={{ color: "#555", margin: "0" }}>{task.description}</span>
                      )}
                      {task.dueDate && (
                        <small style={{ color: "#888" }}>Due: {task.dueDate.slice(0, 10)}</small>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "8px", verticalAlign: "top" }}>{task.priority}</td>
                  <td style={{ padding: "8px", verticalAlign: "top" }}>
                    <select
                      value={task.status}
                      onChange={(e) => handleUpdate(task, { status: e.target.value })}
                      style={{ padding: "4px 8px", borderRadius: "4px" }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: "8px", verticalAlign: "top" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => startEdit(task)} style={{ padding: "4px 8px", cursor: "pointer" }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(task)} style={{ padding: "4px 8px", cursor: "pointer" }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}