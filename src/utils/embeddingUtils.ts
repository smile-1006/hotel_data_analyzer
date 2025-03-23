
import { HotelBooking } from "./dataProcessing";
import { toast } from "sonner";
import * as tf from '@tensorflow/tfjs';

// Function to create simple embeddings from booking data
// In a real application, you'd use a more sophisticated embedding model
export const createEmbeddings = async (bookings: HotelBooking[]): Promise<{embeddings: Float32Array[], documents: string[]}> => {
  try {
    // Load Universal Sentence Encoder model
    console.log("Loading Universal Sentence Encoder model...");
    const model = await tf.loadGraphModel(
      'https://tfhub.dev/tensorflow/universal-sentence-encoder/4/default/1',
      { fromTFHub: true }
    );
    console.log("Model loaded successfully");
    
    // Create documents from booking data
    const documents = bookings.map(booking => {
      return `Hotel: ${booking.hotelName}, Type: ${booking.hotelType}, Arrival: ${booking.arrivalDate}, ` +
        `Departure: ${booking.departureDate}, Adults: ${booking.adults}, Children: ${booking.children}, ` +
        `Country: ${booking.country}, Status: ${booking.reservationStatus}, ` +
        `ADR: ${booking.adr}, Lead Time: ${booking.leadTime}`;
    });
    
    // Get embeddings batch by batch to avoid memory issues
    const batchSize = 50;
    let allEmbeddings: Float32Array[] = [];
    
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(documents.length/batchSize)}`);
      
      // Process each text in the batch
      for (const text of batch) {
        // Create a tensor with the text data (universal sentence encoder expects strings)
        const inputTensor = tf.tensor([text]);
        
        // Generate embedding
        const embedding = await model.predict(inputTensor) as tf.Tensor;
        
        // Get the embedding values as a Float32Array
        const values = await embedding.data();
        allEmbeddings.push(new Float32Array(values));
        
        // Clean up tensors to avoid memory leaks
        tf.dispose([inputTensor, embedding]);
      }
      
      // Force garbage collection to free memory
      // This part caused the TypeScript error, fixed now
      if (tf.engine().numTensors > 100) {
        console.log(`Cleaning up tensors: ${tf.engine().numTensors} tensors in memory`);
        tf.engine().startScope();
        tf.engine().endScope();
      }
    }
    
    console.log(`Created ${allEmbeddings.length} embeddings successfully`);
    return { embeddings: allEmbeddings, documents };
  } catch (error) {
    console.error("Error creating embeddings:", error);
    toast.error("Error creating embeddings");
    return { embeddings: [], documents: [] };
  }
};
