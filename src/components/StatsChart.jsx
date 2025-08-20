import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { calculateStreak } from "../utils/dateUtils";

export default function StatsChart({ tasks, taskHistory }) {
    const doneCount = tasks.filter((t) => t.done).length;
    const undoneCount = tasks.length - doneCount;
    const completionRate = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

    const pieData = [
        { name: "完成", value: doneCount },
        { name: "未完成", value: undoneCount },
    ];

    // 分類統計
    const categoryStats = tasks.reduce((acc, task) => {
        const category = task.category || "其他";
        if (!acc[category]) {
            acc[category] = { total: 0, completed: 0 };
        }
        acc[category].total++;
        if (task.done) {
            acc[category].completed++;
        }
        return acc;
    }, {});

    const categoryData = Object.entries(categoryStats).map(([category, stats]) => ({
        category,
        total: stats.total,
        completed: stats.completed,
        rate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
    }));

    // 連續天數統計
    const streakStats = tasks.map(task => ({
        title: task.title,
        streak: calculateStreak(taskHistory[task.id] || [])
    })).sort((a, b) => b.streak - a.streak).slice(0, 5);

    const COLORS = ["#38A169", "#E53E3E"]; // 綠紅配色
    const CATEGORY_COLORS = {
        "健康": "#10b981",
        "學習": "#3b82f6", 
        "工作": "#f59e0b",
        "其他": "#8b5cf6"
    };

    return (
        <div className="stats-container">
            <div className="stats-grid">
                {/* 總體完成率 */}
                <div className="stat-card">
                    <h3>今日完成率</h3>
                    <div className="completion-rate">
                        <span className="rate-number">{completionRate}%</span>
                        <span className="rate-text">{doneCount}/{tasks.length} 個任務</span>
                    </div>
                </div>

                {/* 圓餅圖 */}
                <div className="stat-card">
                    <h3>完成狀況</h3>
                    <div className="pie-chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={false}
                                    outerRadius={90}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value, name) => [`${value} 個`, name]}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36}
                                    formatter={(value, entry) => `${value}: ${entry.payload.value} 個`}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 分類統計 */}
                {categoryData.length > 0 && (
                    <div className="stat-card">
                        <h3>分類完成率</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={categoryData}>
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip 
                                    formatter={(value, name) => [
                                        name === 'completed' ? `${value} 個` : `${value}%`,
                                        name === 'completed' ? '已完成' : '完成率'
                                    ]}
                                />
                                <Bar dataKey="completed" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* 連續天數排行 */}
                {streakStats.some(s => s.streak > 0) && (
                    <div className="stat-card">
                        <h3>連續天數排行</h3>
                        <div className="streak-list">
                            {streakStats.map((item, index) => (
                                <div key={index} className="streak-item">
                                    <span className="streak-title">{item.title}</span>
                                    <span className="streak-count">🔥 {item.streak} 天</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
