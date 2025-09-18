# app/schemas.py
from pydantic import BaseModel, EmailStr
from datetime import date, time

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int

    class Config:
        orm_mode = True

class EventBase(BaseModel):
    title: str
    description: str
    date: date
    time: time
    image_url: str

class EventCreate(EventBase):
    pass

class EventOut(EventBase):
    id: int
    created_at: str
    updated_at: str

    class Config:
        orm_mode = True
