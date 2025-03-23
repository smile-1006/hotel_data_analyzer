
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, SendIcon, BarChart4, Clock, CheckCircle } from 'lucide-react';
import { toast } from "sonner";
import { ProcessedData } from '@/utils/dataProcessing';
import { ApiService } from '@/utils/apiService';
import { getAccuracyGrade, getPerformanceGrade } from '@/utils/accuracyMetrics';

interface ApiInterfaceProps {
  data: ProcessedData;
}

const ApiInterface: React.FC<ApiInterfaceProps> = ({ data }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const [activeTab, setActiveTab] = useState('ask');
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    responseTimeMs?: number;
    confidence?: number;
    accuracyScore?: number;
    averageResponseTime?: number;
  }>({});

  useEffect(() => {
    const initializeApi = async () => {
      setLoading(true);
      try {
        const apiService = ApiService.getInstance();
        const success = await apiService.initialize(data);
        setApiReady(success);
        if (success) {
          toast.success("API service initialized successfully");
          // Get initial metrics
          await fetchPerformanceMetrics();
        }
      } catch (error) {
        console.error("Error initializing API service:", error);
        toast.error("Failed to initialize API service");
      } finally {
        setLoading(false);
      }
    };

    if (data.bookings.length > 0) {
      initializeApi();
    }
  }, [data]);

  const fetchPerformanceMetrics = async () => {
    if (!apiReady) return;
    
    try {
      const apiService = ApiService.getInstance();
      const result = await apiService.getAnalytics({ type: 'performance' });
      setPerformanceMetrics({
        averageResponseTime: result.summary.averageResponseTime,
        accuracyScore: result.summary.accuracyScore
      });
    } catch (error) {
      console.error("Error fetching performance metrics:", error);
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  const handleSendQuery = async () => {
    if (!query.trim() || loading || !apiReady) return;

    setLoading(true);
    setResponse(null);
    
    try {
      const apiService = ApiService.getInstance();
      
      if (activeTab === 'ask') {
        // Call the /ask endpoint
        const result = await apiService.askQuestion({ query });
        setResponse(result.answer);
        
        // Update metrics
        setPerformanceMetrics(prev => ({
          ...prev,
          responseTimeMs: result.responseTimeMs,
          confidence: result.confidence
        }));
      } else {
        // Call the /analytics endpoint
        let type: 'revenue' | 'cancellations' | 'bookings' | 'leadTime' = 'revenue';
        
        // Try to determine the type of analytics from the query
        const queryLower = query.toLowerCase();
        if (queryLower.includes('revenue') || queryLower.includes('money') || queryLower.includes('income')) {
          type = 'revenue';
        } else if (queryLower.includes('cancel') || queryLower.includes('no-show')) {
          type = 'cancellations';
        } else if (queryLower.includes('lead') || queryLower.includes('advance') || queryLower.includes('days before')) {
          type = 'leadTime';
        } else if (queryLower.includes('book') || queryLower.includes('reservation')) {
          type = 'bookings';
        }
        
        const startTime = performance.now();
        const result = await apiService.getAnalytics({ type });
        const endTime = performance.now();
        
        setResponse(JSON.stringify(result.summary, null, 2));
        
        // Update metrics
        setPerformanceMetrics(prev => ({
          ...prev,
          responseTimeMs: endTime - startTime
        }));
      }
      
      // Refresh overall metrics
      await fetchPerformanceMetrics();
    } catch (error) {
      console.error("Error calling API:", error);
      toast.error("Error processing request");
      setResponse("Sorry, an error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyticsRequest = async (type: 'revenue' | 'cancellations' | 'bookings' | 'leadTime' | 'performance') => {
    if (loading || !apiReady) return;

    setLoading(true);
    setResponse(null);
    
    try {
      const apiService = ApiService.getInstance();
      const startTime = performance.now();
      const result = await apiService.getAnalytics({ type });
      const endTime = performance.now();
      
      setResponse(JSON.stringify(result.summary, null, 2));
      
      // Update metrics
      setPerformanceMetrics(prev => ({
        ...prev,
        responseTimeMs: endTime - startTime
      }));
      
      // Refresh overall metrics
      await fetchPerformanceMetrics();
    } catch (error) {
      console.error("Error calling API:", error);
      toast.error("Error processing analytics request");
      setResponse("Sorry, an error occurred while processing your analytics request.");
    } finally {
      setLoading(false);
    }
  };

  // Example queries for the Ask endpoint
  const exampleQueries = [
    "Show me total revenue for July 2022",
    "Which locations had the highest booking cancellations?",
    "What is the average price of a hotel booking?"
  ];

  return (
    <Card className="w-full rounded-xl shadow-md overflow-hidden bg-white">
      <div className="p-4 bg-blue-50 border-b border-blue-100">
        <h2 className="text-lg font-semibold text-blue-900">Hotel Booking API</h2>
        <p className="text-sm text-blue-700">
          Simulated REST API for hotel booking analytics
        </p>
      </div>
      
      <Tabs defaultValue="ask" className="w-full" onValueChange={setActiveTab}>
        <div className="px-4 pt-4">
          <TabsList className="w-full">
            <TabsTrigger value="ask" className="flex-1">POST /ask</TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1">POST /analytics</TabsTrigger>
            <TabsTrigger value="performance" className="flex-1">Metrics</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="ask" className="p-4 pt-2">
          <div className="text-sm text-gray-600 mb-4">
            The /ask endpoint answers booking-related questions using RAG technology.
          </div>
          
          <div className="mb-2 overflow-x-auto whitespace-nowrap pb-2">
            <p className="text-xs text-gray-500 mb-1">Example queries:</p>
            <div className="flex space-x-2">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(example)}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors whitespace-nowrap"
                  disabled={loading || !apiReady}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="p-4 pt-2">
          <div className="text-sm text-gray-600 mb-4">
            The /analytics endpoint provides structured reports on booking data.
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleAnalyticsRequest('revenue')}
              disabled={loading || !apiReady}
            >
              Revenue
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleAnalyticsRequest('cancellations')}
              disabled={loading || !apiReady}
            >
              Cancellations
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleAnalyticsRequest('bookings')}
              disabled={loading || !apiReady}
            >
              Bookings
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleAnalyticsRequest('leadTime')}
              disabled={loading || !apiReady}
            >
              Lead Time
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleAnalyticsRequest('performance')}
              disabled={loading || !apiReady}
            >
              Performance
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="p-4 pt-2">
          <div className="text-sm text-gray-600 mb-4">
            API performance and accuracy metrics.
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card className="p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Response Time</h3>
                <Clock className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {performanceMetrics.averageResponseTime?.toFixed(2) || '---'} ms
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {performanceMetrics.averageResponseTime 
                  ? `Grade: ${getPerformanceGrade(performanceMetrics.averageResponseTime)}`
                  : 'No data yet'}
              </div>
            </Card>
            
            <Card className="p-4 border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Accuracy</h3>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-700">
                {performanceMetrics.accuracyScore 
                  ? `${(performanceMetrics.accuracyScore * 100).toFixed(1)}%` 
                  : '---'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {performanceMetrics.accuracyScore 
                  ? `Grade: ${getAccuracyGrade(performanceMetrics.accuracyScore)}`
                  : 'No data yet'}
              </div>
            </Card>
            
            <Card className="p-4 border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Last Query</h3>
                <BarChart4 className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-purple-700">
                {performanceMetrics.responseTimeMs?.toFixed(2) || '---'} ms
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {performanceMetrics.confidence 
                  ? `Confidence: ${(performanceMetrics.confidence * 100).toFixed(1)}%` 
                  : 'No queries yet'}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="p-4 border-t border-gray-100">
        <div className="flex">
          <Input
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            placeholder={activeTab === 'ask' ? "Ask a question..." : "Request analytics..."}
            className="mr-2"
            disabled={loading || !apiReady || activeTab === 'performance'}
          />
          <Button 
            onClick={handleSendQuery}
            disabled={loading || !query.trim() || !apiReady || activeTab === 'performance'}
            className="px-3"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {(response || loading) && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Response:</h3>
          
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
            </div>
          ) : (
            <pre className="whitespace-pre-wrap bg-white p-3 rounded-md border border-gray-200 text-sm overflow-x-auto">
              {response}
            </pre>
          )}
          
          {performanceMetrics.responseTimeMs && !loading && (
            <div className="mt-2 text-xs text-gray-500 flex justify-between">
              <span>
                Response time: {performanceMetrics.responseTimeMs.toFixed(2)}ms
                {' '}
                ({getPerformanceGrade(performanceMetrics.responseTimeMs)})
              </span>
              {performanceMetrics.confidence && (
                <span>
                  Confidence: {(performanceMetrics.confidence * 100).toFixed(1)}%
                </span>
              )}
            </div>
          )}
        </div>
      )}
      
      {!apiReady && !loading && data.bookings.length > 0 && (
        <div className="p-4 text-center text-sm text-red-500">
          API service is not ready. Please refresh the page and try again.
        </div>
      )}
    </Card>
  );
};

export default ApiInterface;
