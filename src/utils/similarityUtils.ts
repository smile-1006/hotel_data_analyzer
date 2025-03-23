
// Function to perform similarity search
export const findSimilarDocuments = (
  query: string,
  queryEmbedding: Float32Array,
  documentEmbeddings: Float32Array[],
  documents: string[],
  topK = 5
): string[] => {
  // Calculate cosine similarity between query and all documents
  const similarities = documentEmbeddings.map(docEmbedding => {
    return cosineSimilarity(queryEmbedding, docEmbedding);
  });
  
  // Get indices of top K similar documents
  const topIndices = getTopKIndices(similarities, topK);
  
  // Return the top K similar documents
  return topIndices.map(idx => documents[idx]);
};

// Function to calculate cosine similarity
export const cosineSimilarity = (a: Float32Array, b: Float32Array): number => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  
  return dotProduct / (normA * normB);
};

// Function to get indices of top K values
export const getTopKIndices = (arr: number[], k: number): number[] => {
  return arr
    .map((val, idx) => ({ val, idx }))
    .sort((a, b) => b.val - a.val)
    .slice(0, k)
    .map(item => item.idx);
};
