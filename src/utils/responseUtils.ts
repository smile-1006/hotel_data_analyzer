
import { ProcessedData } from "./dataProcessing";

// Generate response for queries using extracted information
export const generateResponse = (query: string, retrievedDocuments: string[], data: ProcessedData): string => {
  // Simple rule-based response generation
  const queryLower = query.toLowerCase();
  
  // Check for revenue queries
  if (queryLower.includes('revenue') || queryLower.includes('income')) {
    const monthYear = extractMonthYear(queryLower);
    if (monthYear) {
      const relevantData = data.revenueByMonth.find(item => 
        item.month.toLowerCase().includes(monthYear.toLowerCase())
      );
      if (relevantData) {
        return `The total revenue for ${monthYear} was $${relevantData.revenue.toFixed(2)}.`;
      } else {
        return `I couldn't find revenue data specifically for ${monthYear}. Available months are: ${data.revenueByMonth.map(m => m.month).join(', ')}`;
      }
    }
    
    // General revenue info
    const totalRevenue = data.revenueByMonth.reduce((sum, item) => sum + item.revenue, 0);
    return `Total revenue across all available data is $${totalRevenue.toFixed(2)}. For specific periods, please specify a month and year.`;
  }
  
  // Check for cancellation queries
  if (queryLower.includes('cancellation') || queryLower.includes('canceled')) {
    if (queryLower.includes('location') || queryLower.includes('country')) {
      // Group cancellations by country
      const countryMap: Record<string, number> = {};
      data.bookings.forEach(booking => {
        if (booking.reservationStatus === 'Canceled') {
          countryMap[booking.country] = (countryMap[booking.country] || 0) + 1;
        }
      });
      
      // Sort countries by cancellation count
      const sortedCountries = Object.entries(countryMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      
      if (sortedCountries.length > 0) {
        return `The locations with the highest booking cancellations are: ${sortedCountries.map(([country, count]) => `${country} (${count} cancellations)`).join(', ')}.`;
      }
    }
    
    return `The overall cancellation rate is ${data.cancellationRate.toFixed(2)}%. ${data.cancellationsByMarketSegment.length > 0 
      ? `The market segment with the highest cancellations is ${data.cancellationsByMarketSegment[0].segment} with ${data.cancellationsByMarketSegment[0].cancellations} cancellations.` 
      : ''}`;
  }
  
  // Check for average price queries
  if (queryLower.includes('average price') || queryLower.includes('avg price') || 
      queryLower.includes('average cost') || queryLower.includes('average rate')) {
    return `The average daily rate for hotel bookings is $${data.avgDailyRate.toFixed(2)}.`;
  }
  
  // General stats response
  return `Based on the available data, there were ${data.totalBookings} bookings with an average stay length of ${data.avgStayLength.toFixed(2)} nights. The average daily rate was $${data.avgDailyRate.toFixed(2)} and the cancellation rate was ${data.cancellationRate.toFixed(2)}%.`;
};

// Helper function to extract month and year from a query
export const extractMonthYear = (query: string): string | null => {
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  const years = ['2016', '2017', '2018', '2019', '2020', '2021', '2022'];
  
  let foundMonth = null;
  let foundYear = null;
  
  // Look for month names
  for (const month of months) {
    if (query.includes(month)) {
      foundMonth = month;
      break;
    }
  }
  
  // Look for years
  for (const year of years) {
    if (query.includes(year)) {
      foundYear = year;
      break;
    }
  }
  
  if (foundMonth && foundYear) {
    // Capitalize first letter of month
    const capitalizedMonth = foundMonth.charAt(0).toUpperCase() + foundMonth.slice(1);
    return `${capitalizedMonth} ${foundYear}`;
  } else if (foundMonth) {
    const capitalizedMonth = foundMonth.charAt(0).toUpperCase() + foundMonth.slice(1);
    return capitalizedMonth;
  } else if (foundYear) {
    return foundYear;
  }
  
  return null;
};
