"use client";

import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from "recharts";

export default function ItemSellingChart({ data }) {
  // Vibrant multi-color palette from the original design
  const COLORS = ["#6366f1", "#f97316", "#eab308", "#06b6d4", "#22c55e", "#ec4899"];

  // Filter out items with 0 value to clean up the chart
  const filteredData = data.filter(item => item.value > 0);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '16px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              fontSize: '12px',
              fontWeight: 600
            }}
          />
          <Legend 
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            formatter={(value) => <span className="text-gray-500 text-xs font-bold ml-2">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
