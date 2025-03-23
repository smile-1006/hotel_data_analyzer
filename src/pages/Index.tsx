
import React, { useState } from 'react';
import { Navbar } from '@/components';
import DataUpload from '@/components/DataUpload';
import Dashboard from '@/components/Dashboard';
import { ProcessedData, demoData, processData } from '@/utils/dataProcessing';

const Index = () => {
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);

  const handleDataProcessed = (data: ProcessedData) => {
    setProcessedData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto page-transition">
        {!processedData ? (
          <div className="py-12 space-y-10">
            <div className="text-center space-y-4 max-w-3xl mx-auto animate-slide-down">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-blue-50 text-blue-700 mb-2">
                Hotel Data Analytics
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Visualize Your Hotel Booking Data
              </h1>
              <p className="text-xl text-gray-500">
                Upload your dataset to analyze revenue trends, cancellation patterns, and geographical distribution.
              </p>
            </div>
            
            <DataUpload onDataProcessed={handleDataProcessed} />
          </div>
        ) : (
          <Dashboard data={processedData} />
        )}
      </main>
    </div>
  );
};

export default Index;
