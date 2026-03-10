from fastapi import APIRouter
from models.schemas import ChatRequest
from services.ai_service import chat_response
from services.db_service import get_doc
from services.document_service import extract_text

router = APIRouter()

@router.post("/message")
async def chat(body: ChatRequest):
    doc_context = ""
    if body.context_doc_id:
        doc = get_doc(body.context_doc_id)
        if doc:
            try:
                doc_context = extract_text(doc["filepath"], doc["extension"])[:4000]
            except Exception:
                pass
    history = [{"role": m.role, "content": m.content} for m in body.history]
    reply = await chat_response(body.message, history, doc_context, body.language)
    return {"reply": reply, "language": body.language}
