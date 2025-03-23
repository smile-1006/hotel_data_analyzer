
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface CountryData {
  country: string;
  bookings: number;
}

interface GeoDistributionProps {
  data: CountryData[];
}

// Map of country codes to country names
const countryNames: Record<string, string> = {
  'PRT': 'Portugal',
  'GBR': 'Great Britain',
  'USA': 'United States',
  'ESP': 'Spain',
  'FRA': 'France',
  'DEU': 'Germany',
  'ITA': 'Italy',
  'JPN': 'Japan',
  'CAN': 'Canada',
  'CHN': 'China',
  // Add more mappings as needed
};

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
        <p className="font-medium text-gray-900">
          {countryNames[payload[0].name] || payload[0].name}
        </p>
        <p className="text-blue-600 font-semibold">
          Bookings: {payload[0].value}
        </p>
        <p className="text-gray-500 text-sm">
          {(payload[0].payload.percent * 100).toFixed(1)}% of total
        </p>
      </div>
    );
  }
  return null;
};

const GeoDistribution: React.FC<GeoDistributionProps> = ({ data }) => {
  // Calculate the total number of bookings
  const totalBookings = data.reduce((sum, country) => sum + country.bookings, 0);
  
  // Process data with percentages
  const chartData = data.map((country) => ({
    name: country.country,
    value: country.bookings,
    percent: country.bookings / totalBookings,
  }));

  // Format the country names for the legend
  const formatCountryName = (code: string) => {
    return countryNames[code] || code;
  };

  return (
    <div className="w-full">
      <div className="mb-4 text-center text-sm text-gray-500">
        Top {data.length} countries by number of bookings
      </div>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${formatCountryName(name)} ${(percent * 100).toFixed(1)}%`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => formatCountryName(value)} 
              iconType="circle"
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GeoDistribution;
