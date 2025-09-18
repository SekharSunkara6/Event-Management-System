# app/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from app.database import SessionLocal, create_tables
from app import models, crud, schemas, auth

app = FastAPI()

# Create tables on startup
@app.on_event("startup")
def on_startup():
    create_tables()

# OAuth2 scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dependency: extract current user info from token
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = auth.decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    email = payload.get("sub")
    role = payload.get("role")
    user = crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return {"email": email, "role": role}

# Dependency: requires admin role
def require_admin(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

# Signup endpoint
@app.post("/signup", response_model=schemas.UserOut)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user.password = auth.hash_password(user.password)
    new_user = crud.create_user(db=db, user=user)
    return new_user

# Login endpoint (OAuth2 password flow)
@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, form_data.username)
    if not user or not auth.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

# Public: List all events
@app.get("/events", response_model=list[schemas.EventOut])
def list_events(db: Session = Depends(get_db)):
    events = crud.get_events(db)
    return events

# Admin: Create new event
@app.post("/events", response_model=schemas.EventOut)
def add_event(event: schemas.EventCreate, db: Session = Depends(get_db), current_user: dict = Depends(require_admin)):
    return crud.create_event(db, event)

# Admin: Update an event
@app.put("/events/{event_id}", response_model=schemas.EventOut)
def update_event(event_id: int, event: schemas.EventCreate, db: Session = Depends(get_db), current_user: dict = Depends(require_admin)):
    updated_event = crud.update_event(db, event_id, event)
    if not updated_event:
        raise HTTPException(status_code=404, detail="Event not found")
    return updated_event

# Admin: Delete an event
@app.delete("/events/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db), current_user: dict = Depends(require_admin)):
    deleted_event = crud.delete_event(db, event_id)
    if not deleted_event:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"detail": "Event deleted"}
