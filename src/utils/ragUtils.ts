
// This is now just a barrel file that re-exports from the other utility files
// This maintains backward compatibility with existing imports

import { createEmbeddings } from './embeddingUtils';
import { findSimilarDocuments, cosineSimilarity, getTopKIndices } from './similarityUtils';
import { generateResponse, extractMonthYear } from './responseUtils';

export {
  createEmbeddings,
  findSimilarDocuments,
  cosineSimilarity,
  getTopKIndices,
  generateResponse,
  extractMonthYear
};
