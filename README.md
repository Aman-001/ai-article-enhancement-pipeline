# Web Scraper & AI Content Editor

A full-stack web application that scrapes articles from the web and processes them through an AI-assisted content enhancement pipeline with graceful fallback handling.

## 🎯 Project Overview

This project consists of three main components:
- **Backend API** - Node.js/Express server with MongoDB
- **Frontend** - React application to view and manage articles
- **Phase 2 Script** - Automation script that processes articles through an AI-assisted pipeline using Google Gemini API with fallback support.


## 📋 Table of Contents

- [Local Setup Instructions](#local-setup-instructions)
- [Architecture Diagram](#architecture-diagram)
- [Data Flow](#data-flow)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

---

## 🚀 Local Setup Instructions

### Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or Atlas) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)
- **Google Gemini API Key** - [Get API Key](https://ai.google.dev/)

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd Web\ Scrapper
```

### Step 2: Install Dependencies

#### Backend Setup
```bash
cd backend
npm install
```

#### Frontend Setup
```bash
cd ../frontend
npm install
```

#### Phase 2 Script Setup
```bash
cd ../phase2-script
npm install
```

### Step 3: Configure Environment Variables

#### Backend (.env)
Create a `.env` file in the `backend/` directory:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/beyondchats
NODE_ENV=development
PORT=5000
```

#### Phase 2 Script (.env)
Create a `.env` file in the `phase2-script/` directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### Step 4: Start MongoDB

```bash
# On Windows (if MongoDB is installed locally)
mongod

# Or if using MongoDB Atlas, ensure your connection string is correct in backend/.env
```

### Step 5: Start the Backend Server

```bash
cd backend
npm start
# or
node server.js
```

Expected output:
```
Server running on port 5000
MongoDB connected
```

### Step 6: Start the Frontend

In a new terminal:
```bash
cd frontend
npm start
```

The frontend will open at `http://localhost:3000`

### Step 7: Run the Content Rewrite Script (Optional)

In a new terminal:
```bash
cd phase2-script
node index.js
```

This script will:
1. Fetch articles from the backend
2. Scrape reference content from blogs
3. Use Gemini AI to rewrite the articles
4. Display the updated content

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  React Frontend (Port 3000)                                     │
│  ├─ Article List View                                           │
│  ├─ Original Article Display                                    │
│  ├─ Updated Article Display                                     │
│  └─ └─ Article Visualization (List & Detail View)               │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP Requests (axios)
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                      API LAYER                                  │
├─────────────────────────────────────────────────────────────────┤
│  Express.js Backend (Port 5000)                                 │
│  ├─ GET /articles                                               │
│  ├─ GET /articles/:id                                           │
│  ├─ POST /articles                                              │
│  ├─ PUT /articles/:id                                           │
│  └─ DELETE /articles/:id                                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Mongoose ODM
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                    DATABASE LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  MongoDB (localhost:27017 or Atlas)                             │
│  Database: beyondchats                                          │
│  Collection: articles                                           │
│  Fields: title, link, content, references, isUpdated, createdAt │
└─────────────────────────────────────────────────────────────────┘

                    ┌────────────────────────────┐
                    │   AUTOMATION LAYER         │
                    ├────────────────────────────┤
                    │ Phase 2 Script (Node.js)   │
                    │ ├─ Scrape reference URLs   │
                    │ ├─ Call Gemini API         │
                    │ └─ Update articles         │
                    └────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
    ┌───────▼────┐  ┌───────▼────┐  ┌──────▼──────┐
    │  Gemini    │  │ Cheerio    │  │  Axios      │
    │  AI API    │  │ (Scraper)  │  │ (HTTP)      │
    └────────────┘  └────────────┘  └─────────── ─┘
```

---

## 📊 Data Flow

### 1. **Article Scraping Flow**
```
Backend Server
    ↓
Puppeteer/Cheerio Scraper
    ↓
Extract Article Data (title, link, content)
    ↓
MongoDB Storage
```

### 2. **Article Rewrite Flow**
```
Phase 2 Script
    ↓
Fetch Articles from Backend API
    ↓
Scrape Reference Content (FreeCodeCamp, LogRocket)
    ↓
Create Gemini Prompt
    ↓
Call Google Generative AI API
    ↓
Receive rewritten content OR fallback response
(In case of LLM API unavailability or quota limits, the system safely falls back without breaking the pipeline)
    ↓
Update Article in MongoDB (isUpdated: true)
    ↓
Return Updated Article
```

### 3. **Frontend Display Flow**
```
React App (Port 3000)
    ↓
User Opens Article List
    ↓
Fetch Articles from Backend API
    ↓
Display Original vs Updated Status
    ↓
User Views Single Article
    ↓
Display Updated Content and References
```

---

## 📁 Project Structure

```
Web Scrapper/
├── backend/
│   ├── config/
│   │   └── db.js             
│   ├── model/
│   │   └── article.js        
│   ├── server.js              
│   ├── scraper.js             
│   └── .env                   
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Article.jsx    
│   │   │   └── Home.jsx          
│   │   ├── services/ 
|   |   |   ├── api.js
|   |   |
│   │   ├── App.js            
│   │   └── index.js          
│   ├── public/                
│   ├── package.json           
│   └── .env                   
│
├── phase2-script/
│   ├── index.js               
│   ├── package.json           
│   └── .env                  
│
└── README.md                  
```

---

## 🔌 API Endpoints

### Articles Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/articles` | Fetch all articles |
| GET | `/articles/:id` | Fetch single article by ID |
| POST | `/articles` | Create new article |
| PUT | `/articles/:id` | Update article |
| DELETE | `/articles/:id` | Delete article |

### Request/Response Examples

#### Get All Articles
```
GET http://localhost:5000/articles

Response:
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k",
    "title": "Chatbots Magic: Beginner's Guidebook",
    "link": "https://example.com/article",
    "content": "Article content here...",
    "isUpdated": false,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Create New Article
```
POST http://localhost:5000/articles

Body:
{
  "title": "Article Title",
  "link": "https://example.com",
  "content": "Article content..."
}
```

---

## 🔑 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://127.0.0.1:27017/beyondchats
NODE_ENV=development
PORT=5000
```

### Phase 2 Script (.env)
```env
GEMINI_API_KEY=your_api_key_here
```

---

## 🌐 Deployment

### Frontend Deployment (Netlify / Vercel)

1. Build the React app:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `build/` folder to:
   - **Netlify**: Drag & drop the `build/` folder
   - **Vercel**: Connect your GitHub repo and deploy

3. Update the backend API URL in frontend code if deploying to different domain

### Backend Deployment (Heroku / Railway / Render)

1. Set up MongoDB Atlas for cloud database
2. Deploy backend code to your chosen platform
3. Set environment variables on the hosting platform
4. Update frontend API endpoints to match deployed backend URL

### Live Demo

Once deployed:
- **Frontend**: `https://your-frontend-domain.com`

> Note: Backend APIs are currently configured for local execution.
> The frontend is deployed to demonstrate UI, architecture, and data flow.
---

## 🛠️ Troubleshooting

### MongoDB Connection Error
```
Error: MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running (`mongod` command) or update `.env` with MongoDB Atlas connection string.

### Gemini API 404 Error
```
GoogleGenerativeAIFetchError: [404 Not Found] models/gemini-1.5-flash is not found
```
**Solution**: 
- Ensure your API key is valid in `.env`
- The project includes a fallback mechanism to handle unsupported models or API limitations gracefully

## ⚠️ AI Fallback Handling

This project is designed with production reliability in mind.  
If the AI service is unavailable due to API limitations, model restrictions, or quota exhaustion, the system:

- Logs the failure
- Uses a predefined fallback response
- Continues the article enhancement pipeline without crashing

This ensures uninterrupted execution and reflects real-world system design practices.

---

## 📝 License

This project is open source and available under the MIT License.

---

## 📧 Support

For issues or questions, please create an issue in the repository.

**Last Updated**: December 31, 2025
