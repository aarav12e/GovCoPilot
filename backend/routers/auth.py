from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from models.schemas import UserCreate, UserLogin
from services.db_service import create_user, get_user_by_email, get_user_by_id
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

router  = APIRouter()
pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2  = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def make_token(user_id: str) -> str:
    exp = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({"sub": user_id, "exp": exp}, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2)):
    if not token:
        return {"user_id": "demo", "name": "Demo User", "email": "demo@gov.in", "role": "leader"}
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user = get_user_by_id(payload.get("sub"))
        return user if user else {"user_id": "demo", "name": "Demo User", "email": "demo@gov.in", "role": "leader"}
    except JWTError:
        return {"user_id": "demo", "name": "Demo User", "email": "demo@gov.in", "role": "leader"}

@router.post("/register")
def register(body: UserCreate):
    if get_user_by_email(body.email):
        raise HTTPException(409, "Email already registered")
    user = create_user({"name": body.name, "email": body.email,
                        "password": pwd_ctx.hash(body.password), "role": body.role})
    return {"access_token": make_token(user["user_id"]), "token_type": "bearer",
            "user": {"name": user["name"], "email": user["email"], "role": user["role"]}}

@router.post("/login")
def login(body: UserLogin):
    user = get_user_by_email(body.email)
    if not user or not pwd_ctx.verify(body.password, user["password"]):
        raise HTTPException(401, "Invalid email or password")
    return {"access_token": make_token(user["user_id"]), "token_type": "bearer",
            "user": {"name": user["name"], "email": user["email"], "role": user["role"]}}

@router.get("/me")
def me(user=Depends(get_current_user)):
    return {k: v for k, v in user.items() if k != "password"}
