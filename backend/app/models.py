# app/models.py
from sqlalchemy import Column, Integer, String, Date, Time, Text, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    password = Column(String(255))
    role = Column(String(10))  # "admin" or "normal"

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    description = Column(Text)
    date = Column(Date)
    time = Column(Time)
    image_url = Column(Text)
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)
