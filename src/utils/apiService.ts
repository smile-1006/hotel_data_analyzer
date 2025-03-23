
import { ProcessedData, HotelBooking } from "./dataProcessing";
import { toast } from "sonner";
// Updated import from refactored files
import { createEmbeddings, findSimilarDocuments, generateResponse } from "./ragUtils";
import { evaluateModelAccuracy, testQueries } from "./accuracyMetrics";
import * as tf from '@tensorflow/tfjs';

/**
 * Mock API service that simulates a REST API
 * This can be replaced with actual API calls when a backend is implemented
 */
export class ApiService {
  private static instance: ApiService;
  private model: tf.GraphModel | null = null;
  private embeddings: {
    embeddings: Float32Array[],
    documents: string[]
  } = { embeddings: [], documents: [] };
  private data: ProcessedData | null = null;
  private modelLoaded = false;
  private performanceMetrics: {
    averageResponseTime: number;
    lastResponseTime: number;
    totalQueries: number;
    accuracyScore?: number;
  } = {
    averageResponseTime: 0,
    lastResponseTime: 0,
    totalQueries: 0
  };

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public async initialize(data: ProcessedData): Promise<boolean> {
    try {
      // Store the data
      this.data = data;
      
      // Load TensorFlow.js
      await tf.ready();
      console.log("TensorFlow.js loaded");
      
      // Use memory-efficient loading
      const startTime = performance.now();
      
      // Set TensorFlow.js flags for optimization
      tf.env().set('WEBGL_CPU_FORWARD', false); // Disable CPU forward pass
      tf.env().set('WEBGL_PACK', true); // Enable tensor packing
      
      // Use the correct model URL for Universal Sentence Encoder
      this.model = await tf.loadGraphModel(
        'https://tfhub.dev/tensorflow/universal-sentence-encoder/4/default/1',
        { fromTFHub: true }
      );
      console.log("Model loaded in", performance.now() - startTime, "ms");
      
      // Create embeddings for the hotel booking data
      if (data.bookings.length > 0) {
        const embeddingStartTime = performance.now();
        this.embeddings = await createEmbeddings(data.bookings);
        console.log(`Created ${this.embeddings.embeddings.length} embeddings in ${performance.now() - embeddingStartTime} ms`);
      }
      
      this.modelLoaded = true;
      
      // Run accuracy evaluation
      await this.evaluateAccuracy();
      
      return true;
    } catch (error) {
      console.error('Error initializing API service:', error);
      toast.error('Error initializing API. Please try again later.');
      return false;
    }
  }

  /**
   * Run accuracy evaluation against benchmark queries
   */
  private async evaluateAccuracy(): Promise<void> {
    if (!this.data || !this.modelLoaded) return;
    
    try {
      const askFunction = async (query: string): Promise<string> => {
        const result = await this.askQuestion({ query });
        return result.answer;
      };
      
      const accuracyResults = await evaluateModelAccuracy(askFunction, this.data);
      this.performanceMetrics.accuracyScore = accuracyResults.overallAccuracy;
      
      console.log("Model accuracy evaluation:", accuracyResults);
      console.log(`Overall accuracy: ${(accuracyResults.overallAccuracy * 100).toFixed(2)}%`);
      console.log(`Average response time: ${accuracyResults.averageResponseTime.toFixed(2)}ms`);
    } catch (error) {
      console.error("Error evaluating model accuracy:", error);
    }
  }

  /**
   * POST /analytics endpoint
   * @param params Analytics parameters
   * @returns Analytics report
   */
  public async getAnalytics(params: { 
    type: 'revenue' | 'cancellations' | 'bookings' | 'leadTime' | 'performance', 
    timeframe?: string 
  }): Promise<any> {
    if (!this.data) {
      throw new Error('Data not initialized');
    }

    // Start performance measurement
    const startTime = performance.now();

    // Simulate API latency (reduced for optimization)
    await this.simulateLatency(50, 150);

    let result;
    switch (params.type) {
      case 'revenue':
        result = {
          data: this.data.revenueByMonth,
          summary: {
            total: this.data.revenueByMonth.reduce((sum, item) => sum + item.revenue, 0),
            average: this.data.revenueByMonth.reduce((sum, item) => sum + item.revenue, 0) / this.data.revenueByMonth.length
          }
        };
        break;
      
      case 'cancellations':
        result = {
          data: this.data.cancellationsByMarketSegment,
          summary: {
            rate: this.data.cancellationRate,
            total: this.data.bookings.filter(b => b.reservationStatus === 'Canceled').length,
            byCountry: this.getTopCancellationsByCountry(5)
          }
        };
        break;
      
      case 'bookings':
        result = {
          data: this.data.bookings,
          summary: {
            total: this.data.totalBookings,
            avgStayLength: this.data.avgStayLength,
            avgDailyRate: this.data.avgDailyRate
          }
        };
        break;
      
      case 'leadTime':
        result = {
          data: this.processLeadTimeData(),
          summary: {
            averageLeadTime: this.data.bookings.reduce((sum, b) => sum + b.leadTime, 0) / this.data.bookings.length
          }
        };
        break;
      
      case 'performance':
        result = {
          data: this.performanceMetrics,
          summary: {
            averageResponseTime: this.performanceMetrics.averageResponseTime,
            totalQueries: this.performanceMetrics.totalQueries,
            accuracyScore: this.performanceMetrics.accuracyScore || 0,
            modelStatus: this.modelLoaded ? 'Ready' : 'Not Loaded'
          }
        };
        break;
      
      default:
        throw new Error(`Unknown analytics type: ${params.type}`);
    }

    // End performance measurement
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    // Update performance metrics
    this.updatePerformanceMetrics(responseTime);
    
    return result;
  }

  /**
   * POST /ask endpoint
   * @param params Question parameters
   * @returns Answer to the question
   */
  public async askQuestion(params: { query: string }): Promise<{ 
    answer: string, 
    responseTimeMs: number,
    confidence?: number 
  }> {
    if (!this.data || !this.modelLoaded || !this.model) {
      throw new Error('API not initialized or model not loaded');
    }

    // Start performance measurement
    const startTime = performance.now();

    try {
      console.log("Processing query:", params.query);
      
      // Create query embedding
      const inputTensor = tf.tensor([params.query]);
      
      // Generate embedding
      const queryEmbeddingTensor = await this.model.predict(inputTensor) as tf.Tensor;
      
      // Get the embedding values as a Float32Array
      const queryEmbeddingArray = await queryEmbeddingTensor.data();
      const queryEmbedding = new Float32Array(queryEmbeddingArray);
      
      // Clean up tensors to avoid memory leaks
      tf.dispose([inputTensor, queryEmbeddingTensor]);
      
      // Find similar documents
      const retrievedDocuments = findSimilarDocuments(
        params.query,
        queryEmbedding,
        this.embeddings.embeddings,
        this.embeddings.documents,
        5
      );
      
      // Generate response
      const answer = generateResponse(params.query, retrievedDocuments, this.data);
      
      // End performance measurement
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      // Update performance metrics
      this.updatePerformanceMetrics(responseTime);
      
      // Calculate confidence score based on similarity with test queries
      const confidence = this.calculateConfidence(params.query);
      
      return { 
        answer, 
        responseTimeMs: responseTime,
        confidence 
      };
    } catch (error) {
      console.error('Error processing question:', error);
      throw new Error('Error processing question');
    }
  }

  /**
   * Calculate confidence score based on similarity to known test queries
   */
  private calculateConfidence(query: string): number {
    const queryLower = query.toLowerCase();
    
    // Check for exact matches with test queries
    for (const testQuery of testQueries) {
      if (testQuery.query.toLowerCase() === queryLower) {
        return 1.0;
      }
    }
    
    // Check for word overlap with test queries
    const queryWords = queryLower.split(/\s+/);
    let maxOverlap = 0;
    
    for (const testQuery of testQueries) {
      const testWords = testQuery.query.toLowerCase().split(/\s+/);
      let overlap = 0;
      
      for (const word of queryWords) {
        if (testWords.includes(word)) {
          overlap++;
        }
      }
      
      const overlapScore = overlap / Math.max(queryWords.length, testWords.length);
      maxOverlap = Math.max(maxOverlap, overlapScore);
    }
    
    return maxOverlap;
  }

  /**
   * Update performance metrics with a new response time
   */
  private updatePerformanceMetrics(responseTime: number): void {
    this.performanceMetrics.lastResponseTime = responseTime;
    this.performanceMetrics.totalQueries++;
    
    // Recalculate the running average
    this.performanceMetrics.averageResponseTime = (
      (this.performanceMetrics.averageResponseTime * (this.performanceMetrics.totalQueries - 1)) + 
      responseTime
    ) / this.performanceMetrics.totalQueries;
  }

  private async simulateLatency(min: number, max: number): Promise<void> {
    const latency = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, latency));
  }

  public getPerformanceMetrics() {
    return this.performanceMetrics;
  }

  private getTopCancellationsByCountry(limit: number = 5): Array<{country: string, count: number}> {
    if (!this.data) return [];
    
    const countryMap: Record<string, number> = {};
    this.data.bookings.forEach(booking => {
      if (booking.reservationStatus === 'Canceled') {
        countryMap[booking.country] = (countryMap[booking.country] || 0) + 1;
      }
    });
    
    return Object.entries(countryMap)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  private processLeadTimeData(): Array<{range: string, count: number}> {
    if (!this.data) return [];
    
    const ranges = [
      { min: 0, max: 7, label: '0-7 days' },
      { min: 8, max: 30, label: '8-30 days' },
      { min: 31, max: 90, label: '31-90 days' },
      { min: 91, max: 180, label: '91-180 days' },
      { min: 181, max: 365, label: '181-365 days' },
      { min: 366, max: Number.MAX_SAFE_INTEGER, label: '365+ days' }
    ];

    return ranges.map(range => ({
      range: range.label,
      count: this.data!.bookings.filter(booking => 
        booking.leadTime >= range.min && booking.leadTime <= range.max
      ).length
    }));
  }
}
