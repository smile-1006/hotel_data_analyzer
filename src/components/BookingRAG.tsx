
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, SendIcon } from 'lucide-react';
import { toast } from "sonner";
import { ProcessedData } from '@/utils/dataProcessing';
// Updated import from refactored files
import { createEmbeddings, findSimilarDocuments, generateResponse } from '@/utils/ragUtils';
import * as tf from '@tensorflow/tfjs';

interface BookingRAGProps {
  data: ProcessedData;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const BookingRAG: React.FC<BookingRAGProps> = ({ data }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [embeddings, setEmbeddings] = useState<{
    embeddings: Float32Array[];
    documents: string[];
  }>({ embeddings: [], documents: [] });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<tf.GraphModel | null>(null);

  // Generate example queries
  const exampleQueries = [
    "Show me total revenue for July 2022.",
    "Which locations had the highest booking cancellations?",
    "What is the average price of a hotel booking?"
  ];

  // Load model and create embeddings
  useEffect(() => {
    const loadModelAndCreateEmbeddings = async () => {
      try {
        setLoading(true);
        
        // Load TensorFlow.js
        await tf.ready();
        console.log("TensorFlow.js is ready");
        
        // Load the Universal Sentence Encoder model
        modelRef.current = await tf.loadGraphModel(
          'https://tfhub.dev/tensorflow/universal-sentence-encoder/4/default/1',
          { fromTFHub: true }
        );
        console.log("Model loaded successfully");
        
        // Create embeddings for the hotel booking data
        const embeddingsData = await createEmbeddings(data.bookings);
        setEmbeddings(embeddingsData);
        
        setModelLoaded(true);
        
        // Add welcome message
        setMessages([
          {
            id: 'welcome',
            content: 'Welcome to Hotel Analytics Assistant! Ask me anything about the hotel bookings data.',
            sender: 'assistant',
            timestamp: new Date(),
          },
        ]);
      } catch (error) {
        console.error('Error loading model or creating embeddings:', error);
        toast.error('Error loading AI model. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (data.bookings.length > 0) {
      loadModelAndCreateEmbeddings();
    }
  }, [data.bookings]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    if (!query.trim() || loading || !modelLoaded || !modelRef.current) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: query,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    try {
      console.log("Processing query:", query);
      
      // Create query embedding with tensor operations
      const inputTensor = tf.tensor([query]);
      console.log("Input tensor created");
      
      // Generate embedding
      const queryEmbeddingTensor = await modelRef.current.predict(inputTensor) as tf.Tensor;
      console.log("Query embedding tensor generated");
      
      // Get the embedding values as a Float32Array
      const queryEmbeddingArray = await queryEmbeddingTensor.data();
      const queryEmbedding = new Float32Array(queryEmbeddingArray);
      console.log("Query embedding extracted");
      
      // Clean up tensors to avoid memory leaks
      tf.dispose([inputTensor, queryEmbeddingTensor]);
      
      // Find similar documents
      const retrievedDocuments = findSimilarDocuments(
        query,
        queryEmbedding,
        embeddings.embeddings,
        embeddings.documents,
        5
      );
      console.log("Retrieved similar documents:", retrievedDocuments.length);
      
      // Generate response
      const response = generateResponse(query, retrievedDocuments, data);
      console.log("Generated response");
      
      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing query:', error);
      toast.error('Error processing your query. Please try again.');
      
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: 'Sorry, I encountered an error processing your query. Please try again.',
          sender: 'assistant',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  const handleExampleQuery = (example: string) => {
    setQuery(example);
  };

  return (
    <Card className="w-full rounded-xl shadow-md overflow-hidden bg-white">
      <div className="p-4 bg-blue-50 border-b border-blue-100">
        <h2 className="text-lg font-semibold text-blue-900">Hotel Booking Assistant (RAG)</h2>
        <p className="text-sm text-blue-700">
          Ask questions about bookings, revenue, cancellations, and more
        </p>
      </div>
      
      <div className="h-[400px] overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-gray-400 mb-4">No messages yet</div>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.sender === 'user' ? 'ml-auto max-w-[75%]' : 'mr-auto max-w-[75%]'
            }`}
          >
            <div
              className={`rounded-xl p-3 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}
            >
              {message.content}
            </div>
            <div
              className={`text-xs mt-1 text-gray-500 ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              {message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-200">
        {!modelLoaded && (
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Loader2 className="animate-spin h-4 w-4 text-blue-500" />
            <p className="text-sm text-gray-500">Loading AI model...</p>
          </div>
        )}
        
        <div className="mb-2 overflow-x-auto whitespace-nowrap pb-2">
          <p className="text-xs text-gray-500 mb-1">Try asking:</p>
          <div className="flex space-x-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleQuery(example)}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors whitespace-nowrap"
                disabled={loading || !modelLoaded}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex">
          <Input
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about hotel bookings..."
            className="mr-2"
            disabled={loading || !modelLoaded}
          />
          <Button 
            onClick={handleSendQuery}
            disabled={loading || !query.trim() || !modelLoaded}
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
    </Card>
  );
};

export default BookingRAG;
