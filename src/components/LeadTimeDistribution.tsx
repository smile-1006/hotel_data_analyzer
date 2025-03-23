
import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

interface LeadTimeData {
  range: string;
  count: number;
}

interface LeadTimeDistributionProps {
  data: { leadTime: number }[];
}

const LeadTimeDistribution: React.FC<LeadTimeDistributionProps> = ({ data }) => {
  // Process the data to create lead time ranges
  const processLeadTimeData = (): LeadTimeData[] => {
    const ranges = [
      { min: 0, max: 7, label: '0-7 days' },
      { min: 8, max: 30, label: '8-30 days' },
      { min: 31, max: 90, label: '31-90 days' },
      { min: 91, max: 180, label: '91-180 days' },
      { min: 181, max: 365, label: '181-365 days' },
      { min: 366, max: Number.MAX_SAFE_INTEGER, label: '365+ days' }
    ];

    const leadTimeCounts = ranges.map(range => ({
      range: range.label,
      count: data.filter(booking => 
        booking.leadTime >= range.min && booking.leadTime <= range.max
      ).length
    }));

    return leadTimeCounts;
  };

  const chartData = processLeadTimeData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
          <p className="font-medium text-gray-900 mb-1">{label}</p>
          <p className="text-blue-600 font-semibold">
            Bookings: {payload[0].value}
          </p>
          <p className="text-gray-500 text-sm">
            {((payload[0].value / data.length) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barSize={40}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey="range" 
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={{ stroke: '#cbd5e1' }}
          />
          <YAxis 
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={{ stroke: '#cbd5e1' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ bottom: 0 }} />
          <Bar 
            dataKey="count" 
            name="Number of Bookings" 
            fill="#60a5fa" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeadTimeDistribution;
