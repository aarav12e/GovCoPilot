import uuid, os, json
from datetime import datetime
from pymongo import MongoClient
from config import MONGO_URI

# Connect to MongoDB Atlas
client = MongoClient(MONGO_URI)
db = client['govcopilot']

_users = db['users']
_docs  = db['documents']
_evs   = db['events']
_tasks = db['tasks']
_const = db['constituency']

# Remove MongoDB's internal `_id` so frontend doesn't break
def clean_mongo_output(doc):
    if doc and '_id' in doc:
        del doc['_id']
    return doc

# Users
def create_user(d):
    d["user_id"] = str(uuid.uuid4())
    d["created_at"] = datetime.utcnow().isoformat()
    _users.insert_one(d.copy())
    return clean_mongo_output(d)

def get_user_by_email(email):
    return clean_mongo_output(_users.find_one({"email": email}))

def get_user_by_id(uid):
    return clean_mongo_output(_users.find_one({"user_id": uid}))

# Documents
def save_doc_meta(meta):
    meta["created_at"] = datetime.utcnow().isoformat()
    _docs.insert_one(meta.copy())
    return clean_mongo_output(meta)

def get_doc(doc_id):
    return clean_mongo_output(_docs.find_one({"doc_id": doc_id}))

def list_docs():
    return [clean_mongo_output(d) for d in _docs.find()]

def update_doc_summary(doc_id, summary):
    _docs.update_one(
        {"doc_id": doc_id},
        {"$set": {"summary": summary, "summarized_at": datetime.utcnow().isoformat()}}
    )

# Events
def create_event(d):
    d["event_id"] = str(uuid.uuid4())
    d["created_at"] = datetime.utcnow().isoformat()
    _evs.insert_one(d.copy())
    return clean_mongo_output(d)

def list_events():
    events = [clean_mongo_output(d) for d in _evs.find()]
    return sorted(events, key=lambda x: x.get("date", ""))

def delete_event(event_id):
    _evs.delete_one({"event_id": event_id})

# Tasks
def create_task(d):
    d["task_id"] = str(uuid.uuid4())
    d["status"] = "pending"
    d["created_at"] = datetime.utcnow().isoformat()
    _tasks.insert_one(d.copy())
    return clean_mongo_output(d)

def list_tasks():
    return [clean_mongo_output(d) for d in _tasks.find()]

def update_task(task_id, status):
    _tasks.update_one(
        {"task_id": task_id},
        {"$set": {"status": status, "updated_at": datetime.utcnow().isoformat()}}
    )

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
    existing = _const.find_one()
    if not existing:
        _const.insert_one(SEED.copy())
        return SEED
    return clean_mongo_output(existing)


# =========================================================================
# 🔄 TINYDB TO MONGODB LOCAL DATA MIGRATION
# =========================================================================
def parse_tinydb_json(filepath):
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
            # TinyDB stores lists inside {"_default": {"1": {...}, "2": {...}}}
            if "_default" in data:
                return list(data["_default"].values())
    except Exception:
        pass
    return []

def run_migration():
    print("Checking database migration status...")
    if _users.count_documents({}) == 0:
        local_pts = parse_tinydb_json("data/users.json")
        if local_pts:
            _users.insert_many(local_pts)
            print(f"Migrated {len(local_pts)} users to MongoDB.")
            
    if _docs.count_documents({}) == 0:
        local_pts = parse_tinydb_json("data/documents.json")
        if local_pts:
            _docs.insert_many(local_pts)
            print(f"Migrated {len(local_pts)} documents to MongoDB.")
            
    if _evs.count_documents({}) == 0:
        local_pts = parse_tinydb_json("data/events.json")
        if local_pts:
            _evs.insert_many(local_pts)
            print(f"Migrated {len(local_pts)} events to MongoDB.")
            
    if _tasks.count_documents({}) == 0:
        local_pts = parse_tinydb_json("data/tasks.json")
        if local_pts:
            _tasks.insert_many(local_pts)
            print(f"Migrated {len(local_pts)} tasks to MongoDB.")
            
    print("Migration check complete.")

# Attempt runtime migration
try:
    run_migration()
except Exception as e:
    print("Migration failed:", e)
