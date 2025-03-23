
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart,
  PieChart,
  LineChart,
  Activity, 
  Users, 
  Calendar, 
  DollarSign, 
  Download
} from 'lucide-react';
import RevenueChart from './RevenueChart';
import CancellationAnalysis from './CancellationAnalysis';
import GeoDistribution from './GeoDistribution';
import LeadTimeDistribution from './LeadTimeDistribution';
import BookingInsights from './BookingInsights';
import BookingRAG from './BookingRAG';
import { downloadProcessedData, ProcessedData } from '@/utils/dataProcessing';

interface DashboardProps {
  data: ProcessedData;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  if (!data) return null;

  const { 
    totalBookings, 
    avgStayLength, 
    cancellationRate, 
    avgDailyRate 
  } = data;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() => downloadProcessedData(data)}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Hotel reservations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Daily Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgDailyRate.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per night</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancellation Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cancellationRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Of total bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Stay Length</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgStayLength.toFixed(1)} nights</div>
            <p className="text-xs text-muted-foreground">Per booking</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">
            <LineChart className="h-4 w-4 mr-2" />
            Revenue Trends
          </TabsTrigger>
          <TabsTrigger value="cancellations">
            <PieChart className="h-4 w-4 mr-2" />
            Cancellations
          </TabsTrigger>
          <TabsTrigger value="geography">
            <BarChart className="h-4 w-4 mr-2" />
            Geography
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Activity className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="assistant">
            <Users className="h-4 w-4 mr-2" />
            AI Assistant
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <RevenueChart data={data.revenueByMonth} />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Lead Time Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <LeadTimeDistribution data={data.bookings} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="cancellations">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Cancellations by Market Segment</CardTitle>
              </CardHeader>
              <CardContent>
                <CancellationAnalysis data={data.cancellationsByMarketSegment} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="geography">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <GeoDistribution data={data.topCountries} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="insights">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Booking Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingInsights data={data.bookings} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="assistant">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
            <BookingRAG data={data} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
