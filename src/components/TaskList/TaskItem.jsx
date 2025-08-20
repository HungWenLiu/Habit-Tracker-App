import React, { useState } from 'react';
import { isOverdue, calculateStreak } from '../../utils/dateUtils';
import './TaskItem.css';

const TaskItem = ({ 
  task, 
  taskHistory, 
  onToggle, 
  onEdit, 
  onDelete, 
  onStartEdit, 
  onFinishEdit,
  editingId,
  editText,
  setEditText,
  editDueDate,
  setEditDueDate 
}) => {
  const streak = calculateStreak(taskHistory[task.id] || []);
  
  const handleEditKey = (e) => {
    if (e.key === "Enter") onFinishEdit();
    else if (e.key === "Escape") onStartEdit(null);
  };

  return (
    <li className="task-item">
      <label className={`task-label ${task.done ? "done" : ""}`}>
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => onToggle(task.id)}
        />
        <span className="checkbox-custom"></span>

        {editingId !== task.id && (
          <span className="task-text">
            {task.title}{" "}
            {task.dueDate && (
              <span className={`task-date ${isOverdue(task.dueDate) ? "overdue" : ""}`}>
                （截止：{task.dueDate}）
              </span>
            )}
            {task.category && (
              <span className={`tag tag-${task.category}`}>
                {task.category}
              </span>
            )}
            {streak > 0 && (
              <span className="streak-badge">
                🔥 {streak} 天
              </span>
            )}
          </span>
        )}
      </label>

      {editingId === task.id && (
        <div className="edit-inputs">
          <input
            type="text"
            className="edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleEditKey}
            autoFocus
          />
          <input
            type="date"
            className="edit-input"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            onKeyDown={handleEditKey}
          />
        </div>
      )}

      <div className="btn-group">
        {editingId !== task.id ? (
          <>
            <button
              onClick={() => onStartEdit(task)}
              className="edit-btn"
            >
              編輯
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="delete-btn"
            >
              刪除
            </button>
          </>
        ) : (
          <button
            onClick={onFinishEdit}
            className="save-btn"
          >
            儲存
          </button>
        )}
      </div>
    </li>
  );
};

export default TaskItem;
