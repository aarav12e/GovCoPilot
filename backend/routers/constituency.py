from fastapi import APIRouter
from models.schemas import ConstituencyQueryRequest
from services.db_service import get_constituency
from services.ai_service import answer_constituency_query

router = APIRouter()

@router.get("/overview")
def overview():
    data = get_constituency()
    total_complaints = sum(w["complaints"] for w in data["wards"])
    avg_coverage = sum(w["coverage"] for w in data["wards"]) / len(data["wards"])
    return {**data, "total_complaints": total_complaints, "avg_coverage_pct": round(avg_coverage, 1)}

@router.get("/wards")
def wards():
    return get_constituency()["wards"]

@router.get("/schemes")
def schemes():
    return get_constituency()["schemes"]

@router.post("/query")
async def query(body: ConstituencyQueryRequest):
    data = get_constituency()
    result = await answer_constituency_query(body.question, data)
    return {"question": body.question, "answer": result.get("answer", ""), "chart_type": result.get("chart_type", "table"), "data": data}
