from fastapi import APIRouter, HTTPException
from models.schemas import EventCreate, TaskCreate
from services.db_service import create_event, list_events, delete_event, create_task, list_tasks, update_task
from services.ai_service import generate_event_brief

router = APIRouter()

@router.post("/events")
async def add_event(body: EventCreate):
    brief = await generate_event_brief(body.title, body.description or "")
    data = body.model_dump()
    data["ai_brief"] = brief
    return create_event(data)

@router.get("/events")
def get_events():
    return list_events()

@router.delete("/events/{event_id}")
def remove_event(event_id: str):
    delete_event(event_id)
    return {"message": "Event deleted"}

@router.post("/tasks")
def add_task(body: TaskCreate):
    return create_task(body.model_dump())

@router.get("/tasks")
def get_tasks():
    return list_tasks()

@router.patch("/tasks/{task_id}")
def update_task_status(task_id: str, status: str):
    if status not in ("pending", "in_progress", "done"):
        raise HTTPException(400, "Status must be: pending, in_progress, or done")
    update_task(task_id, status)
    return {"message": "Task updated"}
