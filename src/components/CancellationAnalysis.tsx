
import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell 
} from 'recharts';

interface CancellationData {
  segment: string;
  cancellations: number;
}

interface CancellationAnalysisProps {
  data: CancellationData[];
}

const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
        <p className="font-medium text-gray-900 mb-1">{label}</p>
        <p className="text-blue-600 font-semibold">
          Cancellations: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const CancellationAnalysis: React.FC<CancellationAnalysisProps> = ({ data }) => {
  // Sort the data by cancellations (descending)
  const sortedData = [...data].sort((a, b) => b.cancellations - a.cancellations);

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          barSize={40}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey="segment" 
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={{ stroke: '#cbd5e1' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={{ stroke: '#cbd5e1' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ bottom: 0 }} />
          <Bar 
            dataKey="cancellations" 
            name="Cancellations" 
            radius={[4, 4, 0, 0]}
          >
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CancellationAnalysis;
