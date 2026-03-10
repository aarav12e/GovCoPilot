from pydantic import BaseModel
from typing import Optional, List, Any

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "leader"

class UserLogin(BaseModel):
    email: str
    password: str

class SummarizeRequest(BaseModel):
    doc_id: str
    language: str = "english"
    summary_length: str = "medium"
    focus: Optional[str] = None

class DraftRequest(BaseModel):
    doc_type: str
    topic: str
    context: Optional[str] = None
    tone: str = "formal"
    language: str = "english"
    length: str = "medium"
    recipient: Optional[str] = None

class TranslateRequest(BaseModel):
    text: str
    source_lang: str = "english"
    target_lang: str = "hindi"

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[Message] = []
    context_doc_id: Optional[str] = None
    language: str = "english"

class ConstituencyQueryRequest(BaseModel):
    question: str

class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    date: str
    time: str
    duration_minutes: int = 60
    location: Optional[str] = None
    priority: str = "normal"

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[str] = None
    priority: str = "normal"
