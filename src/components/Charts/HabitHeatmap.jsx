import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { generateHeatmapData } from '../../utils/dateUtils';
import { subDays } from 'date-fns';
import 'react-calendar-heatmap/dist/styles.css';
import './HabitHeatmap.css';

const HabitHeatmap = ({ tasks, taskHistory }) => {
  // 為每個任務生成熱力圖數據
  const getHeatmapDataForTask = (taskId) => {
    const history = taskHistory[taskId] || [];
    return generateHeatmapData(history);
  };

  // 獲取所有任務的總體完成情況
  const getOverallHeatmapData = () => {
    const allData = {};
    
    // 收集所有任務的完成記錄
    Object.keys(taskHistory).forEach(taskId => {
      const history = taskHistory[taskId] || [];
      history.forEach(record => {
        if (!allData[record.date]) {
          allData[record.date] = { completed: 0, total: 0 };
        }
        allData[record.date].total++;
        if (record.completed) {
          allData[record.date].completed++;
        }
      });
    });

    // 轉換為熱力圖格式
    const endDate = new Date();
    const startDate = subDays(endDate, 365);
    const heatmapData = [];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      const dayData = allData[dateString];
      
      let count = 0;
      if (dayData && dayData.total > 0) {
        // 計算完成率，轉換為 0-4 的等級
        const completionRate = dayData.completed / dayData.total;
        count = Math.ceil(completionRate * 4);
      }

      heatmapData.push({
        date: dateString,
        count: count
      });
    }

    return heatmapData;
  };

  const overallData = getOverallHeatmapData();
  const endDate = new Date();
  const startDate = subDays(endDate, 365);

  const getTooltipDataAttrs = (value) => {
    if (!value || !value.date) return null;
    
    const taskCount = Object.keys(taskHistory).length;
    const dayData = Object.keys(taskHistory).reduce((acc, taskId) => {
      const history = taskHistory[taskId] || [];
      const record = history.find(r => r.date === value.date);
      if (record) {
        acc.total++;
        if (record.completed) acc.completed++;
      }
      return acc;
    }, { completed: 0, total: 0 });

    return {
      'data-tip': `${value.date}: ${dayData.completed}/${dayData.total} 個習慣完成`
    };
  };

  return (
    <div className="habit-heatmap">
      <h3>習慣完成熱力圖</h3>
      <div className="heatmap-container">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={overallData}
          classForValue={(value) => {
            if (!value) return 'color-empty';
            return `color-scale-${value.count}`;
          }}
          tooltipDataAttrs={getTooltipDataAttrs}
          showWeekdayLabels={true}
        />
      </div>
      
      <div className="heatmap-legend">
        <span className="legend-label">少</span>
        <div className="legend-colors">
          <div className="color-empty"></div>
          <div className="color-scale-1"></div>
          <div className="color-scale-2"></div>
          <div className="color-scale-3"></div>
          <div className="color-scale-4"></div>
        </div>
        <span className="legend-label">多</span>
      </div>

      {tasks.length > 0 && (
        <div className="individual-heatmaps">
          <h4>個別習慣熱力圖</h4>
          {tasks.slice(0, 3).map(task => (
            <div key={task.id} className="individual-heatmap">
              <h5>{task.title}</h5>
              <CalendarHeatmap
                startDate={subDays(endDate, 90)} // 顯示最近3個月
                endDate={endDate}
                values={getHeatmapDataForTask(task.id)}
                classForValue={(value) => {
                  if (!value || value.count === 0) return 'color-empty';
                  return 'color-completed';
                }}
                showWeekdayLabels={false}
                showMonthLabels={true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HabitHeatmap;
