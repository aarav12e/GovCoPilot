# 🏛️ GovCoPilot — AI Co-Pilot for Public Leaders
### India Innovates 2026 | Bharat Mandapam, New Delhi

---

## 🚀 QUICK START & DEPLOYMENT

### 💻 Local Development

**1. Backend (FastAPI):**
```powershell
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**2. Frontend (React/Vite):**
```powershell
cd frontend
npm install
npm run dev
```

Then open → **http://localhost:3000**

---

### 🌐 Cloud Deployment (Vercel & Render)

**1. Backend Deployment (Render.com)**
- Create a new **Web Service** on Render.
- Connect your GitHub repository.
- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables:** Add your `GEMINI_API_KEY`, etc.

**2. Frontend Deployment (Vercel)**
- Import your repository to Vercel.
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Environment Variables:**
  - Add `VITE_API_URL` and set it to your Render backend URL (e.g., `https://your-backend.onrender.com/api`).
- Click **Deploy**!

---

## 🔑 Add Your API Key (Gemini — FREE)

1. Get free API key: https://aistudio.google.com/app/apikey
2. Open `backend/.env` (for local) or your Render dashboard (for production)
3. Replace `your_gemini_api_key_here` with your key

> **Without API key:** App still works in demo mode with pre-built responses.

---

## 📁 Project Structure

```
GovCoPilot/
├── backend/
│   ├── main.py            ← FastAPI app
│   ├── requirements.txt   ← Python dependencies
│   ├── routers/           ← API endpoints
│   ├── services/          ← AI & Business logic
│   └── models/            ← Database Schemas
│
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── services/api.js    ← All backend API calls
    │   └── components/        ← Pages & Layout
    └── package.json
```

---

## 🎬 Demo Flow (10 mins on stage)

1. **Dashboard** → Show live ward coverage charts
2. **Documents** → Upload real govt PDF → instant AI summary
3. **Draft** → "Speech for school inauguration in Rohini" → done in 2s
4. **AI Chat** → "Which ward has most complaints?" → precise answer
5. **Constituency** → Ward table + coverage heatmap
6. **Meeting Notes** → Upload audio → transcript + action items
7. **Scheduler** → Add event → AI brief auto-generates

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/documents/upload | Upload PDF/DOCX/TXT/XLSX |
| POST | /api/documents/summarize | AI summarize document |
| POST | /api/documents/draft | Generate speech/letter/etc |
| POST | /api/chat/message | Conversational AI |
| POST | /api/speech/transcribe | Transcribe audio |
| GET | /api/constituency/overview | Ward data + stats |
| POST | /api/constituency/query | NL query on ward data |
| POST | /api/scheduler/events | Create event + AI brief |
| POST | /api/scheduler/tasks | Create task |

Full docs: **http://localhost:8000/docs**

---

## ⚙️ Requirements

- Python 3.9–3.13
- Node.js 18+
- pip & npm

for hackthon
