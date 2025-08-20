import { format, subDays, isToday, parseISO, differenceInDays } from 'date-fns';

// 格式化日期為 YYYY-MM-DD
export const formatDate = (date) => {
  return format(date, 'yyyy-MM-dd');
};

// 獲取今天的日期字符串
export const getTodayString = () => {
  return formatDate(new Date());
};

// 計算習慣的連續完成天數
export const calculateStreak = (taskHistory) => {
  if (!taskHistory || taskHistory.length === 0) return 0;
  
  const today = new Date();
  let streak = 0;
  
  // 從今天開始往前檢查
  for (let i = 0; i <= 365; i++) { // 最多檢查一年
    const checkDate = formatDate(subDays(today, i));
    const dayRecord = taskHistory.find(record => record.date === checkDate);
    
    if (dayRecord && dayRecord.completed) {
      streak++;
    } else if (i === 0 && !dayRecord) {
      // 今天還沒有記錄，不中斷連續天數
      continue;
    } else {
      // 如果某一天沒完成，中斷連續天數
      break;
    }
  }
  
  return streak;
};

// 生成熱力圖數據
export const generateHeatmapData = (taskHistory, startDate = null) => {
  const endDate = new Date();
  const start = startDate || subDays(endDate, 365); // 默認顯示一年的數據
  
  const heatmapData = [];
  
  for (let d = new Date(start); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateString = formatDate(d);
    const dayRecord = taskHistory.find(record => record.date === dateString);
    
    heatmapData.push({
      date: dateString,
      count: dayRecord ? (dayRecord.completed ? 1 : 0) : 0
    });
  }
  
  return heatmapData;
};

// 檢查是否為今天
export const isDateToday = (dateString) => {
  try {
    return isToday(parseISO(dateString));
  } catch {
    return false;
  }
};

// 檢查日期是否過期
export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  const today = formatDate(new Date());
  return dueDate < today;
};
