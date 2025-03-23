
import { toast } from "sonner";

// Sample hotel booking data structure
export interface HotelBooking {
  id: string;
  hotelName: string;
  hotelType: 'Resort Hotel' | 'City Hotel';
  arrivalDate: string;
  departureDate: string;
  staysInWeekendNights: number;
  staysInWeekNights: number;
  adults: number;
  children: number;
  babies: number;
  meal: string;
  country: string;
  marketSegment: string;
  reservationStatus: 'Canceled' | 'Check-Out' | 'No-Show';
  reservationStatusDate: string;
  adr: number; // Average Daily Rate
  requiredCarParkingSpaces: number;
  totalOfSpecialRequests: number;
  leadTime: number;
  isRepeatedGuest: boolean;
  previousCancellations: number;
  previousBookingsNotCanceled: number;
}

export interface ProcessedData {
  bookings: HotelBooking[];
  totalBookings: number;
  avgStayLength: number;
  cancellationRate: number;
  avgDailyRate: number;
  revenueByMonth: { month: string; revenue: number }[];
  topCountries: { country: string; bookings: number }[];
  cancellationsByMarketSegment: { segment: string; cancellations: number }[];
}

export const demoData: HotelBooking[] = [
  {
    id: "1",
    hotelName: "Resort Hotel",
    hotelType: "Resort Hotel",
    arrivalDate: "2022-07-01",
    departureDate: "2022-07-05",
    staysInWeekendNights: 1,
    staysInWeekNights: 3,
    adults: 2,
    children: 0,
    babies: 0,
    meal: "BB",
    country: "PRT",
    marketSegment: "Direct",
    reservationStatus: "Check-Out",
    reservationStatusDate: "2022-07-05",
    adr: 75.0,
    requiredCarParkingSpaces: 0,
    totalOfSpecialRequests: 1,
    leadTime: 30,
    isRepeatedGuest: false,
    previousCancellations: 0,
    previousBookingsNotCanceled: 0
  },
  {
    id: "2",
    hotelName: "City Hotel",
    hotelType: "City Hotel",
    arrivalDate: "2022-07-10",
    departureDate: "2022-07-12",
    staysInWeekendNights: 0,
    staysInWeekNights: 2,
    adults: 1,
    children: 0,
    babies: 0,
    meal: "HB",
    country: "GBR",
    marketSegment: "Online TA",
    reservationStatus: "Check-Out",
    reservationStatusDate: "2022-07-12",
    adr: 98.0,
    requiredCarParkingSpaces: 1,
    totalOfSpecialRequests: 2,
    leadTime: 45,
    isRepeatedGuest: false,
    previousCancellations: 0,
    previousBookingsNotCanceled: 0
  },
  {
    id: "3",
    hotelName: "Resort Hotel",
    hotelType: "Resort Hotel",
    arrivalDate: "2022-07-15",
    departureDate: "2022-07-20",
    staysInWeekendNights: 2,
    staysInWeekNights: 3,
    adults: 2,
    children: 1,
    babies: 0,
    meal: "FB",
    country: "USA",
    marketSegment: "Direct",
    reservationStatus: "Canceled",
    reservationStatusDate: "2022-07-01",
    adr: 120.0,
    requiredCarParkingSpaces: 0,
    totalOfSpecialRequests: 3,
    leadTime: 60,
    isRepeatedGuest: true,
    previousCancellations: 1,
    previousBookingsNotCanceled: 2
  },
  {
    id: "4",
    hotelName: "City Hotel",
    hotelType: "City Hotel",
    arrivalDate: "2022-08-01",
    departureDate: "2022-08-05",
    staysInWeekendNights: 1,
    staysInWeekNights: 3,
    adults: 2,
    children: 0,
    babies: 0,
    meal: "BB",
    country: "ESP",
    marketSegment: "Groups",
    reservationStatus: "Check-Out",
    reservationStatusDate: "2022-08-05",
    adr: 85.0,
    requiredCarParkingSpaces: 0,
    totalOfSpecialRequests: 0,
    leadTime: 15,
    isRepeatedGuest: false,
    previousCancellations: 0,
    previousBookingsNotCanceled: 0
  },
  {
    id: "5",
    hotelName: "Resort Hotel",
    hotelType: "Resort Hotel",
    arrivalDate: "2022-08-10",
    departureDate: "2022-08-17",
    staysInWeekendNights: 2,
    staysInWeekNights: 5,
    adults: 2,
    children: 2,
    babies: 0,
    meal: "HB",
    country: "FRA",
    marketSegment: "Online TA",
    reservationStatus: "Check-Out",
    reservationStatusDate: "2022-08-17",
    adr: 140.0,
    requiredCarParkingSpaces: 1,
    totalOfSpecialRequests: 4,
    leadTime: 90,
    isRepeatedGuest: false,
    previousCancellations: 0,
    previousBookingsNotCanceled: 0
  },
  {
    id: "6",
    hotelName: "City Hotel",
    hotelType: "City Hotel",
    arrivalDate: "2022-08-15",
    departureDate: "2022-08-16",
    staysInWeekendNights: 0,
    staysInWeekNights: 1,
    adults: 1,
    children: 0,
    babies: 0,
    meal: "BB",
    country: "DEU",
    marketSegment: "Corporate",
    reservationStatus: "No-Show",
    reservationStatusDate: "2022-08-15",
    adr: 95.0,
    requiredCarParkingSpaces: 0,
    totalOfSpecialRequests: 1,
    leadTime: 2,
    isRepeatedGuest: false,
    previousCancellations: 0,
    previousBookingsNotCanceled: 0
  },
  {
    id: "7",
    hotelName: "Resort Hotel",
    hotelType: "Resort Hotel",
    arrivalDate: "2022-09-01",
    departureDate: "2022-09-10",
    staysInWeekendNights: 3,
    staysInWeekNights: 6,
    adults: 2,
    children: 1,
    babies: 1,
    meal: "FB",
    country: "ITA",
    marketSegment: "Direct",
    reservationStatus: "Check-Out",
    reservationStatusDate: "2022-09-10",
    adr: 160.0,
    requiredCarParkingSpaces: 1,
    totalOfSpecialRequests: 2,
    leadTime: 120,
    isRepeatedGuest: true,
    previousCancellations: 0,
    previousBookingsNotCanceled: 1
  },
  {
    id: "8",
    hotelName: "City Hotel",
    hotelType: "City Hotel",
    arrivalDate: "2022-09-05",
    departureDate: "2022-09-07",
    staysInWeekendNights: 0,
    staysInWeekNights: 2,
    adults: 2,
    children: 0,
    babies: 0,
    meal: "HB",
    country: "JPN",
    marketSegment: "Online TA",
    reservationStatus: "Canceled",
    reservationStatusDate: "2022-08-20",
    adr: 110.0,
    requiredCarParkingSpaces: 0,
    totalOfSpecialRequests: 1,
    leadTime: 30,
    isRepeatedGuest: false,
    previousCancellations: 1,
    previousBookingsNotCanceled: 0
  },
  {
    id: "9",
    hotelName: "Resort Hotel",
    hotelType: "Resort Hotel",
    arrivalDate: "2022-09-15",
    departureDate: "2022-09-20",
    staysInWeekendNights: 2,
    staysInWeekNights: 3,
    adults: 2,
    children: 0,
    babies: 0,
    meal: "BB",
    country: "CAN",
    marketSegment: "Direct",
    reservationStatus: "Check-Out",
    reservationStatusDate: "2022-09-20",
    adr: 130.0,
    requiredCarParkingSpaces: 0,
    totalOfSpecialRequests: 0,
    leadTime: 45,
    isRepeatedGuest: false,
    previousCancellations: 0,
    previousBookingsNotCanceled: 0
  },
  {
    id: "10",
    hotelName: "City Hotel",
    hotelType: "City Hotel",
    arrivalDate: "2022-09-25",
    departureDate: "2022-09-30",
    staysInWeekendNights: 1,
    staysInWeekNights: 4,
    adults: 1,
    children: 0,
    babies: 0,
    meal: "HB",
    country: "CHN",
    marketSegment: "Online TA",
    reservationStatus: "Check-Out",
    reservationStatusDate: "2022-09-30",
    adr: 100.0,
    requiredCarParkingSpaces: 0,
    totalOfSpecialRequests: 2,
    leadTime: 60,
    isRepeatedGuest: false,
    previousCancellations: 0,
    previousBookingsNotCanceled: 0
  }
];

export const processData = (data: HotelBooking[]): ProcessedData => {
  try {
    if (!data || data.length === 0) {
      throw new Error("No data available to process");
    }

    // Calculate total bookings
    const totalBookings = data.length;

    // Calculate average stay length
    const totalNights = data.reduce((sum, booking) => {
      return sum + booking.staysInWeekendNights + booking.staysInWeekNights;
    }, 0);
    const avgStayLength = totalNights / totalBookings;

    // Calculate cancellation rate
    const canceledBookings = data.filter(booking => booking.reservationStatus === "Canceled").length;
    const cancellationRate = (canceledBookings / totalBookings) * 100;

    // Calculate average daily rate
    const totalADR = data.reduce((sum, booking) => sum + booking.adr, 0);
    const avgDailyRate = totalADR / totalBookings;

    // Calculate revenue by month
    const revenueByMonth: { [key: string]: number } = {};
    data.forEach(booking => {
      if (booking.reservationStatus === "Check-Out") {
        const month = booking.arrivalDate.substring(0, 7); // Format: YYYY-MM
        const stayLength = booking.staysInWeekendNights + booking.staysInWeekNights;
        const revenue = booking.adr * stayLength;
        
        if (revenueByMonth[month]) {
          revenueByMonth[month] += revenue;
        } else {
          revenueByMonth[month] = revenue;
        }
      }
    });
    
    const revenueByMonthArray = Object.entries(revenueByMonth)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Calculate top countries
    const countryBookings: { [key: string]: number } = {};
    data.forEach(booking => {
      if (countryBookings[booking.country]) {
        countryBookings[booking.country]++;
      } else {
        countryBookings[booking.country] = 1;
      }
    });
    
    const topCountries = Object.entries(countryBookings)
      .map(([country, bookings]) => ({ country, bookings }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);

    // Calculate cancellations by market segment
    const cancellationsBySegment: { [key: string]: number } = {};
    data.filter(booking => booking.reservationStatus === "Canceled")
      .forEach(booking => {
        if (cancellationsBySegment[booking.marketSegment]) {
          cancellationsBySegment[booking.marketSegment]++;
        } else {
          cancellationsBySegment[booking.marketSegment] = 1;
        }
      });
    
    const cancellationsByMarketSegment = Object.entries(cancellationsBySegment)
      .map(([segment, cancellations]) => ({ segment, cancellations }))
      .sort((a, b) => b.cancellations - a.cancellations);

    return {
      bookings: data,
      totalBookings,
      avgStayLength,
      cancellationRate,
      avgDailyRate,
      revenueByMonth: revenueByMonthArray,
      topCountries,
      cancellationsByMarketSegment
    };
  } catch (error) {
    console.error("Error processing data:", error);
    toast.error("Error processing data");
    throw error;
  }
};

export const parseCSV = (csvText: string): HotelBooking[] => {
  try {
    // Basic CSV parsing logic - in a real app, you might want to use a library
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    const bookings: HotelBooking[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(value => value.trim());
      if (values.length !== headers.length) continue;
      
      const bookingData: any = {};
      
      for (let j = 0; j < headers.length; j++) {
        let value: any = values[j];
        
        // Try to convert numerical values
        if (!isNaN(Number(value)) && value !== '') {
          value = Number(value);
        }
        
        // Convert boolean values
        if (value === 'true' || value === 'True') value = true;
        if (value === 'false' || value === 'False') value = false;
        
        bookingData[headers[j]] = value;
      }
      
      // Generate an ID if missing
      if (!bookingData.id) {
        bookingData.id = `booking-${i}`;
      }
      
      bookings.push(bookingData as HotelBooking);
    }
    
    return bookings;
  } catch (error) {
    console.error("Error parsing CSV:", error);
    toast.error("Error parsing CSV file");
    throw error;
  }
};

export const downloadProcessedData = (data: ProcessedData) => {
  try {
    // Create a JSON representation of the processed data
    const jsonData = JSON.stringify(data, null, 2);
    
    // Create a Blob containing the data
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'processed_hotel_data.json';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Data exported successfully");
  } catch (error) {
    console.error("Error downloading data:", error);
    toast.error("Error exporting data");
  }
};
