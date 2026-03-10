import time
from fastapi import APIRouter, UploadFile, File, HTTPException
from models.schemas import SummarizeRequest, DraftRequest, TranslateRequest
from services.document_service import save_upload, extract_text
from services.db_service import save_doc_meta, get_doc, list_docs, update_doc_summary
from services.ai_service import summarize_document, generate_draft, translate_text

router = APIRouter()

@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    info = await save_upload(file)
    save_doc_meta({"doc_id": info["doc_id"], "filename": info["filename"],
                   "filepath": info["filepath"], "size_mb": info["size_mb"], "extension": info["extension"]})
    return {"doc_id": info["doc_id"], "filename": info["filename"], "size_mb": info["size_mb"],
            "message": "Uploaded successfully. Use doc_id to summarize."}

@router.post("/summarize")
async def summarize(body: SummarizeRequest):
    doc = get_doc(body.doc_id)
    if not doc:
        raise HTTPException(404, "Document not found. Upload first.")
    t0 = time.time()
    text = extract_text(doc["filepath"], doc["extension"])
    result = await summarize_document(text, body.language, body.summary_length, body.focus)
    ms = int((time.time() - t0) * 1000)
    update_doc_summary(body.doc_id, result)
    return {"doc_id": body.doc_id, "filename": doc["filename"],
            "summary": result.get("summary", ""), "key_points": result.get("key_points", []),
            "action_items": result.get("action_items", []), "word_count": len(text.split()), "processing_time_ms": ms}

@router.post("/draft")
async def draft(body: DraftRequest):
    content = await generate_draft(body.doc_type, body.topic, body.context or "",
                                   body.tone, body.language, body.length, body.recipient or "")
    return {"content": content, "doc_type": body.doc_type, "language": body.language, "word_count": len(content.split())}

@router.post("/translate")
async def translate(body: TranslateRequest):
    result = await translate_text(body.text, body.source_lang, body.target_lang)
    return {"translated_text": result, "source_lang": body.source_lang, "target_lang": body.target_lang}

@router.get("/")
def list_documents():
    return list_docs()
