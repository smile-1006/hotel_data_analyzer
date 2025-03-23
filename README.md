# Hotel Data Analyzer

## 📌 Overview
The **Hotel Data Analyzer** is an AI-powered system that processes hotel booking data, extracts insights, and enables retrieval-augmented question answering (RAG). The system provides analytics on revenue trends, cancellations, geographical distribution, and booking lead times, making data-driven decision-making more efficient.

---

## 🛠️ Features
- **Data Preprocessing & Cleaning**: Handles missing values, formats inconsistencies, and structures data efficiently.
- **Advanced Analytics**:
  - Revenue trends over time
  - Cancellation rate as a percentage of total bookings
  - Geographical distribution of users
  - Booking lead time distribution
- **Retrieval-Augmented Generation (RAG)**:
  - Utilizes FAISS/ChromaDB for storing vector embeddings.
  - Integrates an open-source LLM (Llama 2, Falcon, GPT-Neo, Mistral) for natural language Q&A.
  - Enables users to ask booking-related questions like:
    - "What was the total revenue for July 2017?"
    - "Which locations had the highest booking cancellations?"
    - "What is the average price of a hotel booking?"
- **REST API for Seamless Interaction**
- **Performance Optimization**: Fast query retrieval with API response optimization.
- **Optional Enhancements**: Real-time data updates, query history tracking.

---

## 🚀 Technologies Used
- **Backend**: Python, FastAPI/Django/Flask
- **Data Processing**: Pandas, NumPy, Matplotlib, Seaborn
- **Vector Database**: FAISS, ChromaDB, Weaviate
- **Machine Learning & NLP**: Open-source LLMs (Llama 2, Falcon, GPT-Neo, Mistral)
- **Database**: SQLite/PostgreSQL
- **Deployment**: vercel 

---

## 📌 REST API Endpoints

### 1️⃣ Analytics API
#### `POST /analytics`
- Description: Fetches hotel booking insights.
- Response:
```json
{
  "revenue_trends": [...],
  "cancellation_rate": ...,
  "geographical_distribution": [...],
  "booking_lead_time": ...
}
```

### 2️⃣ Question Answering API
#### `POST /ask`
- Description: Answers booking-related queries using RAG.
- Request Body:
```json
{
  "question": "What was the total revenue for July 2017?"
}
```
- Response:
```json
{
  "answer": "The total revenue for July 2017 was $XXX,XXX."
}
```

### 3️⃣ Health Check API
#### `GET /health`
- Description: Checks system status.
- Response:
```json
{
  "status": "Healthy",
  "database": "Connected",
  "LLM": "Available"
}
```

---

## 📂 Installation & Setup
### Step 1: Clone the Repository
```sh
git clone https://github.com/smile-1006/hotel_data_analyzer.git
cd hotel_data_analyzer
```

###  Step 2: Intall the Packages 
```sh
npm install
```
### Step 2: Run the Hotel Analyser  
```sh
npm run dev
```

---

## 🤖 How RAG is Implemented
- Data Storage: Booking records are embedded and stored in a **vector database** (FAISS, ChromaDB, Weaviate).
- Query Processing: When a user asks a question, the system retrieves relevant booking data using vector similarity search.
- LLM Integration: An open-source LLM processes the retrieved data to generate a contextual answer.

---

## 📜 License
This project is open-source and licensed under the **MIT License**.

---

## 🔗 GitHub Repository
[Hotel Data Analyzer](https://github.com/smile-1006/hotel_data_analyzer.git)

---

## 📞 Contact
For any issues or contributions, feel free to raise an **Issue** or create a **Pull Request**.

