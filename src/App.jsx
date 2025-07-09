import React, { useState, useEffect } from "react";
import StatsChart from "./components/StatsChart";
import "./App.css";

export default function App() {
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem("tasks");
        return saved
            ? JSON.parse(saved)
            : [
                  {
                      id: 1,
                      title: "運動30分鐘",
                      done: false,
                      dueDate: "2025-07-10",
                  },
                  {
                      id: 2,
                      title: "閱讀一本書",
                      done: false,
                      dueDate: "2025-07-12",
                  },
              ];
    });

    const [newTask, setNewTask] = useState("");
    const [newDueDate, setNewDueDate] = useState("");

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    const toggleTask = (id) => {
        setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    };

    const addTask = () => {
        if (newTask.trim() === "") return;

        const task = {
            id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
            title: newTask.trim(),
            done: false,
            dueDate: newDueDate || "",
        };

        setTasks([...tasks, task]);
        setNewTask("");
        setNewDueDate("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") addTask();
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter((t) => t.id !== id));
    };

    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [editDueDate, setEditDueDate] = useState("");

    const startEditing = (task) => {
        setEditingId(task.id);
        setEditText(task.title);
        setEditDueDate(task.dueDate);
    };

    const finishEditing = () => {
        if (editText.trim() === "") {
            setEditingId(null);
            return;
        }
        setTasks(
            tasks.map((t) =>
                t.id === editingId
                    ? { ...t, title: editText.trim(), dueDate: editDueDate }
                    : t
            )
        );
        setEditingId(null);
    };

    const handleEditKey = (e) => {
        if (e.key === "Enter") finishEditing();
        else if (e.key === "Escape") setEditingId(null);
    };

    // 判斷是否過期
    const isOverdue = (dueDate) => {
        if (!dueDate) return false;
        return (
            new Date(dueDate) < new Date(new Date().toISOString().slice(0, 10))
        );
    };

    // 按截止日期排序
    const sortedTasks = [...tasks].sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
    });

    return (
        <div className="container">
            <h1>Habit Tracker</h1>

            <div className="input-group">
                <input
                    type="text"
                    placeholder="輸入新任務名稱"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    style={{ marginLeft: "0.5rem" }}
                />
                <button onClick={addTask}>新增任務</button>
            </div>

            <ul className="task-list">
                {sortedTasks.map((task) => (
                    <li key={task.id} className="task-item">
                        <label
                            className={`task-label ${task.done ? "done" : ""}`}
                        >
                            <input
                                type="checkbox"
                                checked={task.done}
                                onChange={() => toggleTask(task.id)}
                            />
                            {editingId !== task.id && (
                                <span
                                    style={{
                                        color: isOverdue(task.dueDate)
                                            ? "red"
                                            : "inherit",
                                    }}
                                >
                                    {task.title}{" "}
                                    {task.dueDate && (
                                        <small>（截止：{task.dueDate}）</small>
                                    )}
                                </span>
                            )}
                        </label>

                        {editingId === task.id && (
                            <>
                                <input
                                    type="text"
                                    className="edit-input"
                                    value={editText}
                                    onChange={(e) =>
                                        setEditText(e.target.value)
                                    }
                                    onKeyDown={handleEditKey}
                                    autoFocus
                                />
                                <input
                                    type="date"
                                    className="edit-input"
                                    value={editDueDate}
                                    onChange={(e) =>
                                        setEditDueDate(e.target.value)
                                    }
                                    onKeyDown={handleEditKey}
                                    style={{ marginLeft: "0.5rem" }}
                                />
                            </>
                        )}

                        <div className="btn-group">
                            {editingId !== task.id ? (
                                <>
                                    <button
                                        onClick={() => startEditing(task)}
                                        className="edit-btn"
                                        type="button"
                                    >
                                        編輯
                                    </button>
                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        className="delete-btn"
                                        type="button"
                                    >
                                        刪除
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={finishEditing}
                                    className="save-btn"
                                    type="button"
                                >
                                    儲存
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            <div className="chart-container">
                <StatsChart tasks={tasks} />
            </div>
        </div>
    );
}
