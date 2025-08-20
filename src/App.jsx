import React, { useState, useEffect } from "react";
import StatsChart from "./components/StatsChart";
import DraggableTaskList from "./components/TaskList/DraggableTaskList";
import HabitHeatmap from "./components/Charts/HabitHeatmap";
import { 
    saveTasks, 
    loadTasks, 
    loadTaskHistory, 
    updateTaskHistory 
} from "./utils/storageUtils";
import { getTodayString, isOverdue } from "./utils/dateUtils";
import "./App.css";

export default function App() {
    const [tasks, setTasks] = useState(() => {
        const saved = loadTasks();
        const defaultTasks = [
            {
                id: 1,
                title: "運動30分鐘",
                done: false,
                dueDate: "2025-08-21",
                category: "健康",
                order: 0,
            },
            {
                id: 2,
                title: "閱讀一本書",
                done: false,
                dueDate: "2025-08-23",
                category: "學習",
                order: 1,
            },
        ];

        if (saved.length > 0) {
            // 確保所有載入的任務都有 order 屬性
            return saved.map((task, index) => ({
                ...task,
                order: task.order !== undefined ? task.order : index
            }));
        }
        return defaultTasks;
    });

    const [taskHistory, setTaskHistory] = useState(() => loadTaskHistory());
    const [newTask, setNewTask] = useState("");
    const [newDueDate, setNewDueDate] = useState("");
    const [newCategory, setNewCategory] = useState("其他");
    const [showHeatmap, setShowHeatmap] = useState(false);
    const categories = ["健康", "學習", "工作", "其他"];
    const [filterCategory, setFilterCategory] = useState("全部");

    const isFormValid =
        newTask.trim() !== "" &&
        newDueDate.trim() !== "" &&
        newCategory.trim() !== "";

    useEffect(() => {
        saveTasks(tasks);
    }, [tasks]);

    const toggleTask = (id) => {
        const updatedTasks = tasks.map((t) => {
            if (t.id === id) {
                const newDoneState = !t.done;
                // 更新歷史記錄
                updateTaskHistory(id, getTodayString(), newDoneState);
                return { ...t, done: newDoneState };
            }
            return t;
        });
        setTasks(updatedTasks);
        // 重新載入歷史記錄
        setTaskHistory(loadTaskHistory());
    };

    const handleReorder = (reorderedTasks) => {
        // 直接使用傳入的任務列表，它們已經有正確的 order
        setTasks(reorderedTasks);
    };

    const addTask = () => {
        if (!isFormValid) {
            alert("請填寫所有欄位：任務名稱、截止日與分類");
            return;
        }

        const task = {
            id: Date.now(), // 使用時間戳作為ID，避免重複
            title: newTask.trim(),
            done: false,
            dueDate: newDueDate,
            category: newCategory,
            order: tasks.length,
        };

        setTasks([...tasks, task]);
        setNewTask("");
        setNewDueDate("");
        setNewCategory("其他");
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

    const sortedTasks = [...tasks].sort((a, b) => {
        // 首先按order排序，如果沒有order則按創建順序
        if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
        }
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
    });

    return (
        <div className="container">
            <header className="app-header">
                <h1>Habit Tracker</h1>
                <div className="view-toggle">
                    <button 
                        className={`toggle-btn ${!showHeatmap ? 'active' : ''}`}
                        onClick={() => setShowHeatmap(false)}
                    >
                        任務列表
                    </button>
                    <button 
                        className={`toggle-btn ${showHeatmap ? 'active' : ''}`}
                        onClick={() => setShowHeatmap(true)}
                    >
                        熱力圖
                    </button>
                </div>
            </header>

            {!showHeatmap ? (
                <>
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
                        />
                        <select
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="category-select"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>

                        <button onClick={addTask} disabled={!isFormValid}>
                            新增任務
                        </button>
                    </div>

                    <div className="filter-buttons">
                        {["全部", ...categories].map((cat) => (
                            <button
                                key={cat}
                                className={`filter-btn ${
                                    filterCategory === cat ? "active" : ""
                                }`}
                                onClick={() => setFilterCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <DraggableTaskList
                        tasks={sortedTasks}
                        taskHistory={taskHistory}
                        onReorder={handleReorder}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                        onStartEdit={startEditing}
                        onFinishEdit={finishEditing}
                        editingId={editingId}
                        editText={editText}
                        setEditText={setEditText}
                        editDueDate={editDueDate}
                        setEditDueDate={setEditDueDate}
                        filterCategory={filterCategory}
                    />

                    <div className="chart-container">
                        <StatsChart tasks={tasks} taskHistory={taskHistory} />
                    </div>
                </>
            ) : (
                <HabitHeatmap tasks={tasks} taskHistory={taskHistory} />
            )}
        </div>
    );
}
