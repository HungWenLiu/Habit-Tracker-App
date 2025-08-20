// 本地存儲工具函數

export const STORAGE_KEYS = {
  TASKS: 'habit_tracker_tasks',
  TASK_HISTORY: 'habit_tracker_history'
};

// 保存任務到本地存儲
export const saveTasks = (tasks) => {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

// 從本地存儲讀取任務
export const loadTasks = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
  return saved ? JSON.parse(saved) : [];
};

// 保存任務歷史記錄
export const saveTaskHistory = (history) => {
  localStorage.setItem(STORAGE_KEYS.TASK_HISTORY, JSON.stringify(history));
};

// 讀取任務歷史記錄
export const loadTaskHistory = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.TASK_HISTORY);
  return saved ? JSON.parse(saved) : {};
};

// 更新特定任務的歷史記錄
export const updateTaskHistory = (taskId, date, completed) => {
  const history = loadTaskHistory();
  
  if (!history[taskId]) {
    history[taskId] = [];
  }
  
  // 查找是否已有該日期的記錄
  const existingRecordIndex = history[taskId].findIndex(record => record.date === date);
  
  if (existingRecordIndex >= 0) {
    // 更新現有記錄
    history[taskId][existingRecordIndex].completed = completed;
  } else {
    // 添加新記錄
    history[taskId].push({ date, completed });
  }
  
  saveTaskHistory(history);
  return history;
};
