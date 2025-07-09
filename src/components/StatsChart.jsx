import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function StatsChart({ tasks }) {
    const doneCount = tasks.filter((t) => t.done).length;
    const undoneCount = tasks.length - doneCount;

    const data = [
        { name: "完成", value: doneCount },
        { name: "未完成", value: undoneCount },
    ];

    const COLORS = ["#38A169", "#E53E3E"]; // 綠紅配色

    return (
        <PieChart width={300} height={300}>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    );
}
