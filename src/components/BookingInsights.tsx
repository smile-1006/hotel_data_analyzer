
import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

interface BookingInsightsProps {
  data: Array<any>;
}

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff'];

const BookingInsights: React.FC<BookingInsightsProps> = ({ data }) => {
  // Calculate guest composition
  const calculateGuestComposition = () => {
    const totalGuests = data.reduce((sum, booking) => 
      sum + booking.adults + (booking.children || 0) + (booking.babies || 0), 0);
    
    const adults = data.reduce((sum, booking) => sum + booking.adults, 0);
    const children = data.reduce((sum, booking) => sum + (booking.children || 0), 0);
    const babies = data.reduce((sum, booking) => sum + (booking.babies || 0), 0);
    
    return [
      { name: 'Adults', value: adults },
      { name: 'Children', value: children },
      { name: 'Babies', value: babies }
    ];
  };

  // Calculate meal preferences
  const calculateMealPreferences = () => {
    const mealCounts: Record<string, number> = {};
    
    data.forEach(booking => {
      const meal = booking.meal;
      mealCounts[meal] = (mealCounts[meal] || 0) + 1;
    });
    
    return Object.entries(mealCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  // Calculate repeated guests percentage
  const repeatedGuestsPercentage = () => {
    const repeatedGuests = data.filter(booking => booking.isRepeatedGuest).length;
    return (repeatedGuests / data.length) * 100;
  };

  const guestComposition = calculateGuestComposition();
  const mealPreferences = calculateMealPreferences();
  const repeatedGuests = repeatedGuestsPercentage();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
          <p className="font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-blue-600 font-semibold">
            Count: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-medium mb-4 text-center">Guest Composition</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={guestComposition}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {guestComposition.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4 text-center">Meal Preferences</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mealPreferences}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="md:col-span-2">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-lg font-medium mb-2 text-blue-700">Key Insights</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><span className="font-semibold">Repeated Guests:</span> {repeatedGuests.toFixed(1)}% of bookings come from returning customers</li>
            <li><span className="font-semibold">Most Popular Meal Plan:</span> {mealPreferences[0]?.name} ({((mealPreferences[0]?.value / data.length) * 100).toFixed(1)}% of bookings)</li>
            <li><span className="font-semibold">Special Requests:</span> Average of {(data.reduce((sum, booking) => sum + booking.totalOfSpecialRequests, 0) / data.length).toFixed(2)} special requests per booking</li>
            <li><span className="font-semibold">Parking Needs:</span> {(data.filter(booking => booking.requiredCarParkingSpaces > 0).length / data.length * 100).toFixed(1)}% of guests require parking</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingInsights;
