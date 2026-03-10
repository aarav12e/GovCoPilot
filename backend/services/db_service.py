import uuid, os, json
from datetime import datetime
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from tinydb import TinyDB, Query
from config import MONGO_URI

os.makedirs("data", exist_ok=True)
_users_db = TinyDB("data/users.json")
_docs_db  = TinyDB("data/documents.json")
_evs_db   = TinyDB("data/events.json")
_tasks_db = TinyDB("data/tasks.json")
_const_db = TinyDB("data/constituency.json")
Q = Query()

USE_MONGO = False
db = None

if MONGO_URI:
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
        client.admin.command('ping') # Force connection check
        db = client['govcopilot']
        USE_MONGO = True
        print("✅ Successfully connected to MongoDB Atlas.")
    except Exception as e:
        print(f"⚠️ MongoDB connection failed: {e}. Falling back to local TinyDB.")

if USE_MONGO:
    _users = db['users']
    _docs  = db['documents']
    _evs   = db['events']
    _tasks = db['tasks']
    _const = db['constituency']

def clean_mongo_output(doc):
    if doc and '_id' in doc:
        del doc['_id']
    return doc

# Users
def create_user(d):
    d["user_id"] = str(uuid.uuid4()); d["created_at"] = datetime.utcnow().isoformat()
    if USE_MONGO:
        _users.insert_one(d.copy()); return clean_mongo_output(d)
    _users_db.insert(d); return d

def get_user_by_email(email):
    if USE_MONGO: return clean_mongo_output(_users.find_one({"email": email}))
    r = _users_db.search(Q.email == email); return r[0] if r else None

def get_user_by_id(uid):
    if USE_MONGO: return clean_mongo_output(_users.find_one({"user_id": uid}))
    r = _users_db.search(Q.user_id == uid); return r[0] if r else None

# Documents
def save_doc_meta(meta):
    meta["created_at"] = datetime.utcnow().isoformat()
    if USE_MONGO:
        _docs.insert_one(meta.copy()); return clean_mongo_output(meta)
    _docs_db.insert(meta); return meta

def get_doc(doc_id):
    if USE_MONGO: return clean_mongo_output(_docs.find_one({"doc_id": doc_id}))
    r = _docs_db.search(Q.doc_id == doc_id); return r[0] if r else None

def list_docs():
    if USE_MONGO: return [clean_mongo_output(d) for d in _docs.find()]
    return _docs_db.all()

def update_doc_summary(doc_id, summary):
    timestamp = datetime.utcnow().isoformat()
    if USE_MONGO:
        _docs.update_one({"doc_id": doc_id}, {"$set": {"summary": summary, "summarized_at": timestamp}})
    else:
        _docs_db.update({"summary": summary, "summarized_at": timestamp}, Q.doc_id == doc_id)

# Events
def create_event(d):
    d["event_id"] = str(uuid.uuid4()); d["created_at"] = datetime.utcnow().isoformat()
    if USE_MONGO:
        _evs.insert_one(d.copy()); return clean_mongo_output(d)
    _evs_db.insert(d); return d

def list_events():
    if USE_MONGO:
        return sorted([clean_mongo_output(d) for d in _evs.find()], key=lambda x: x.get("date", ""))
    return sorted(_evs_db.all(), key=lambda x: x.get("date", ""))

def delete_event(event_id):
    if USE_MONGO: _evs.delete_one({"event_id": event_id})
    else: _evs_db.remove(Q.event_id == event_id)

# Tasks
def create_task(d):
    d["task_id"] = str(uuid.uuid4()); d["status"] = "pending"; d["created_at"] = datetime.utcnow().isoformat()
    if USE_MONGO:
        _tasks.insert_one(d.copy()); return clean_mongo_output(d)
    _tasks_db.insert(d); return d

def list_tasks():
    if USE_MONGO: return [clean_mongo_output(d) for d in _tasks.find()]
    return _tasks_db.all()

def update_task(task_id, status):
    timestamp = datetime.utcnow().isoformat()
    if USE_MONGO:
        _tasks.update_one({"task_id": task_id}, {"$set": {"status": status, "updated_at": timestamp}})
    else:
        _tasks_db.update({"status": status, "updated_at": timestamp}, Q.task_id == task_id)

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
    if USE_MONGO:
        existing = _const.find_one()
        if not existing:
            _const.insert_one(SEED.copy())
            return SEED
        return clean_mongo_output(existing)
    else:
        existing = _const_db.all()
        if not existing:
            _const_db.insert(SEED)
            return SEED
        return existing[0]

def parse_tinydb_json(filepath):
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
            if "_default" in data:
                return list(data["_default"].values())
    except Exception: pass
    return []

def run_migration():
    if not USE_MONGO: return
    print("Checking database migration status...")
    collections = [
        (_users, "data/users.json", "users"),
        (_docs, "data/documents.json", "documents"),
        (_evs, "data/events.json", "events"),
        (_tasks, "data/tasks.json", "tasks")
    ]
    for col, path, name in collections:
        if col.count_documents({}) == 0:
            local_pts = parse_tinydb_json(path)
            if local_pts:
                col.insert_many(local_pts)
                print(f"✅ Migrated {len(local_pts)} {name} to MongoDB.")
    print("Migration check complete.")

try: run_migration()
except Exception as e: print("Migration failed:", e)
