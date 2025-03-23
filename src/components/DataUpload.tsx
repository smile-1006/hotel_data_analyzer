
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { parseCSV, demoData, processData, type HotelBooking, type ProcessedData } from "@/utils/dataProcessing";

interface DataUploadProps {
  onDataProcessed: (data: ProcessedData) => void;
}

const DataUpload: React.FC<DataUploadProps> = ({ onDataProcessed }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      handleFile(selectedFile);
    }
  };

  const handleFile = (file: File) => {
    // Check if the file is a CSV
    if (!file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }
    
    setFile(file);
  };

  const processFile = async () => {
    setIsLoading(true);
    
    try {
      if (file) {
        const text = await file.text();
        const bookings = parseCSV(text);
        const processedData = processData(bookings);
        onDataProcessed(processedData);
        toast.success("Data processed successfully");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Error processing file");
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemoData = () => {
    setIsLoading(true);
    
    try {
      // Use demo data from our utility
      const processedData = processData(demoData);
      onDataProcessed(processedData);
      toast.success("Demo data loaded successfully");
    } catch (error) {
      console.error("Error loading demo data:", error);
      toast.error("Error loading demo data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <div 
        className={`
          relative p-8 rounded-xl border-2 border-dashed transition-all duration-300
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3-3m0 0l3 3m-3-3v12"
              />
            </svg>
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-1">
              {file ? file.name : 'Upload Your Dataset'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop a CSV file, or click to browse
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="transition-all duration-300 hover:shadow"
                disabled={isLoading}
              >
                Browse Files
              </Button>
              
              {file && (
                <Button
                  onClick={processFile}
                  variant="outline"
                  className="transition-all duration-300 hover:shadow"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Process Data'}
                </Button>
              )}
              
              <Button
                onClick={loadDemoData}
                variant="ghost"
                className="transition-all duration-300 hover:shadow"
                disabled={isLoading}
              >
                Use Demo Data
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Upload hotel booking data to visualize revenue trends, cancellations, and geographical insights.</p>
        <p className="mt-1">Supported format: CSV</p>
      </div>
    </div>
  );
};

export default DataUpload;
