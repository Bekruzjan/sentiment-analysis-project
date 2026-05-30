from sqlalchemy import Column, Integer, String
from database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)

    text = Column(String, nullable=False)

    sentiment = Column(String, nullable=False)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String)

    email = Column(String, unique=True)

    password = Column(String)

    full_name = Column(String, default="")

    phone = Column(String, default="")

    city = Column(String, default="")

    bio = Column(String, default="")

    image = Column(String, default="")