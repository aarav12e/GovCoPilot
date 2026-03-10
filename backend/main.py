from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from routers import auth, documents, chat, speech, constituency, scheduler

app = FastAPI(title="GovCoPilot API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
os.makedirs("data", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router,         prefix="/api/auth",         tags=["Auth"])
app.include_router(documents.router,    prefix="/api/documents",    tags=["Documents"])
app.include_router(chat.router,         prefix="/api/chat",         tags=["Chat"])
app.include_router(speech.router,       prefix="/api/speech",       tags=["Speech"])
app.include_router(constituency.router, prefix="/api/constituency", tags=["Constituency"])
app.include_router(scheduler.router,    prefix="/api/scheduler",    tags=["Scheduler"])

@app.get("/")
def root():
    return {"status": "GovCoPilot API running", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "ok"}
