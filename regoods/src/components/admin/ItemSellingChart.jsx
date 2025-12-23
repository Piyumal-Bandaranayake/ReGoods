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
  // Filter out items with 0 value to clean up the chart
  const filteredData = data.filter(item => item.value > 0);

  return (
    <div className="w-full h-full min-h-[300px] flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Popular Categories</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              formatter={(value) => <span className="text-gray-600 text-sm font-medium">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
