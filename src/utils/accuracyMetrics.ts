
import { ProcessedData } from './dataProcessing';

// Expected responses for specific question types
type ExpectedResponse = {
  query: string;
  expectedAnswer: string;
};

// Benchmarking test cases
export const testQueries: ExpectedResponse[] = [
  { 
    query: "What was the total revenue for July 2022?", 
    expectedAnswer: "The total revenue for July 2022 was $"
  },
  { 
    query: "What is the cancellation rate?", 
    expectedAnswer: "The overall cancellation rate is"
  },
  { 
    query: "What is the average stay length?", 
    expectedAnswer: "with an average stay length of"
  },
  { 
    query: "Which country has the most cancellations?", 
    expectedAnswer: "The locations with the highest booking cancellations are"
  },
  { 
    query: "What is the average daily rate?", 
    expectedAnswer: "The average daily rate for hotel bookings is $"
  }
];

// Function to calculate fuzzy match score between model output and expected answer
export const calculateMatchScore = (modelOutput: string, expectedContent: string): number => {
  // Simple substring match - gives 1.0 if the expected content is in the model output
  if (modelOutput.toLowerCase().includes(expectedContent.toLowerCase())) {
    return 1.0;
  }
  
  // Calculate word overlap for partial matches
  const modelWords = modelOutput.toLowerCase().split(/\s+/);
  const expectedWords = expectedContent.toLowerCase().split(/\s+/);
  
  let matchCount = 0;
  for (const expectedWord of expectedWords) {
    if (modelWords.includes(expectedWord)) {
      matchCount++;
    }
  }
  
  return matchCount / expectedWords.length;
};

// Function to run all test queries and return accuracy metrics
export const evaluateModelAccuracy = async (
  askFunction: (query: string) => Promise<string>,
  data: ProcessedData
): Promise<{
  overallAccuracy: number;
  results: Array<{
    query: string;
    expectedContent: string;
    modelOutput: string;
    matchScore: number;
    responseTimeMs: number;
  }>;
  averageResponseTime: number;
}> => {
  const results = [];
  let totalAccuracy = 0;
  let totalResponseTime = 0;
  
  for (const testCase of testQueries) {
    const startTime = performance.now();
    const modelOutput = await askFunction(testCase.query);
    const endTime = performance.now();
    const responseTimeMs = endTime - startTime;
    
    const matchScore = calculateMatchScore(modelOutput, testCase.expectedAnswer);
    
    results.push({
      query: testCase.query,
      expectedContent: testCase.expectedAnswer,
      modelOutput,
      matchScore,
      responseTimeMs
    });
    
    totalAccuracy += matchScore;
    totalResponseTime += responseTimeMs;
  }
  
  const overallAccuracy = totalAccuracy / testQueries.length;
  const averageResponseTime = totalResponseTime / testQueries.length;
  
  return {
    overallAccuracy,
    results,
    averageResponseTime
  };
};

// Function to get performance grades
export const getPerformanceGrade = (responseTimeMs: number): string => {
  if (responseTimeMs < 100) return 'Excellent';
  if (responseTimeMs < 300) return 'Good';
  if (responseTimeMs < 500) return 'Fair';
  if (responseTimeMs < 1000) return 'Slow';
  return 'Very Slow';
};

// Function to get accuracy grades
export const getAccuracyGrade = (score: number): string => {
  if (score >= 0.9) return 'Excellent';
  if (score >= 0.7) return 'Good';
  if (score >= 0.5) return 'Fair';
  if (score >= 0.3) return 'Poor';
  return 'Very Poor';
};
