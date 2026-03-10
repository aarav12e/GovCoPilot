import uuid, os
from datetime import datetime
from tinydb import TinyDB, Query

os.makedirs("data", exist_ok=True)
_users = TinyDB("data/users.json")
_docs  = TinyDB("data/documents.json")
_evs   = TinyDB("data/events.json")
_tasks = TinyDB("data/tasks.json")
_const = TinyDB("data/constituency.json")
Q = Query()

# Users
def create_user(d):
    d["user_id"] = str(uuid.uuid4()); d["created_at"] = datetime.utcnow().isoformat()
    _users.insert(d); return d

def get_user_by_email(email):
    r = _users.search(Q.email == email); return r[0] if r else None

def get_user_by_id(uid):
    r = _users.search(Q.user_id == uid); return r[0] if r else None

# Documents
def save_doc_meta(meta):
    meta["created_at"] = datetime.utcnow().isoformat(); _docs.insert(meta); return meta

def get_doc(doc_id):
    r = _docs.search(Q.doc_id == doc_id); return r[0] if r else None

def list_docs():
    return _docs.all()

def update_doc_summary(doc_id, summary):
    _docs.update({"summary": summary, "summarized_at": datetime.utcnow().isoformat()}, Q.doc_id == doc_id)

# Events
def create_event(d):
    d["event_id"] = str(uuid.uuid4()); d["created_at"] = datetime.utcnow().isoformat()
    _evs.insert(d); return d

def list_events():
    return sorted(_evs.all(), key=lambda x: x.get("date", ""))

def delete_event(event_id):
    _evs.remove(Q.event_id == event_id)

# Tasks
def create_task(d):
    d["task_id"] = str(uuid.uuid4()); d["status"] = "pending"; d["created_at"] = datetime.utcnow().isoformat()
    _tasks.insert(d); return d

def list_tasks():
    return _tasks.all()

def update_task(task_id, status):
    _tasks.update({"status": status, "updated_at": datetime.utcnow().isoformat()}, Q.task_id == task_id)

# Constituency
SEED = {
    "name": "North Delhi Constituency", "total_population": 450000, "total_wards": 10,
    "wards": [
        {"id":"W01","name":"Rohini Sector 1", "pop":48000,"coverage":82,"complaints":12,"issues":["Water supply","Street lights"]},
        {"id":"W02","name":"Pitampura",       "pop":41000,"coverage":91,"complaints":5, "issues":["Parking","Road repair"]},
        {"id":"W03","name":"Shalimar Bagh",   "pop":53000,"coverage":67,"complaints":18,"issues":["Drainage","Garbage"]},
        {"id":"W04","name":"Ashok Vihar",     "pop":38000,"coverage":88,"complaints":9, "issues":["Schools","Healthcare"]},
        {"id":"W05","name":"Model Town",      "pop":44000,"coverage":59,"complaints":22,"issues":["Sewage","Footpaths"]},
        {"id":"W06","name":"Azadpur",         "pop":51000,"coverage":45,"complaints":31,"issues":["Roads","Waterlogging"]},
        {"id":"W07","name":"Mukherjee Nagar", "pop":46000,"coverage":85,"complaints":7, "issues":["Traffic","Noise"]},
        {"id":"W08","name":"Shakti Nagar",    "pop":39000,"coverage":38,"complaints":27,"issues":["Electricity","Waterlogging"]},
        {"id":"W09","name":"Kamla Nagar",     "pop":50000,"coverage":74,"complaints":14,"issues":["Markets","Waste"]},
        {"id":"W10","name":"Civil Lines",     "pop":40000,"coverage":96,"complaints":3, "issues":["Heritage","Greenery"]},
    ],
    "schemes": [
        {"name":"Ayushman Bharat","beneficiaries":82000,"coverage":74},
        {"name":"PM Awas Yojana","beneficiaries":14500,"coverage":61},
        {"name":"Jan Dhan Yojana","beneficiaries":210000,"coverage":93},
        {"name":"PM Ujjwala","beneficiaries":38000,"coverage":68},
        {"name":"Scholarship SC/ST","beneficiaries":9200,"coverage":55},
    ]
}

def get_constituency():
    existing = _const.all()
    if not existing:
        _const.insert(SEED)
        return SEED
    return existing[0]
