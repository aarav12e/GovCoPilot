from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from services.speech_service import transcribe_audio
from services.ai_service import summarize_transcript

router = APIRouter()

@router.post("/transcribe")
async def transcribe(
    file: UploadFile = File(...),
    language: Optional[str] = Form(None),
    generate_summary: bool = Form(True)
):
    result = await transcribe_audio(file, language)
    transcript_text = result["text"]
    summary_data = {}
    if generate_summary and transcript_text:
        summary_data = await summarize_transcript(transcript_text)
    return {
        "transcript": transcript_text,
        "language_detected": result.get("language", "unknown"),
        "duration_seconds": result.get("duration", 0.0),
        "summary": summary_data.get("summary", ""),
        "action_items": summary_data.get("action_items", [])
    }
