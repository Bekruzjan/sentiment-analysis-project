from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext

from database import Base, engine, SessionLocal
from models import Review, User

app = FastAPI(
    title="Sentiment Analysis API",
    description="AI Based Sentiment Analysis System",
    version="1.0.0"
)

# =========================
# DATABASE
# =========================

Base.metadata.create_all(bind=engine)

# =========================
# PASSWORD HASH
# =========================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# REQUEST MODELS
# =========================

class ReviewRequest(BaseModel):
    text: str


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class ProfileUpdateRequest(BaseModel):
    full_name: str
    phone: str
    city: str
    bio: str


# =========================
# HOME
# =========================

@app.get("/")
def home():
    return {
        "message": "Sentiment Analysis API ishlayapti"
    }


# =========================
# ANALYZE
# =========================

@app.post("/analyze")
def analyze(review: ReviewRequest):

    text = review.text.lower()

    positive_words = [
        "yaxshi", "zo'r", "ajoyib", "mukammal", "super",
        "zor", "fantastic", "great", "excellent",
        "awesome", "perfect", "love", "happy",
        "beautiful", "cool", "best", "amazing",
        "wonderful", "brilliant", "nice", "success",
        "good", "strong", "smart", "helpful",
        "professional", "fast", "powerful",
        "positive", "creative", "outstanding",
        "impressive", "talented", "friendly",
        "easy", "effective"
    ]

    negative_words = [
        "yomon", "dahshat", "terrible",
        "awful", "worst", "bad", "hate",
        "ugly", "slow", "problem", "error",
        "bug", "stupid", "boring", "weak",
        "annoying", "negative", "useless",
        "failure", "hard", "poor",
        "broken", "difficult", "sad",
        "angry", "disappointed", "stress",
        "disaster", "wrong"
    ]

    positive_emojis = [
        "😊", "😁", "😍", "❤️", "👍",
        "🔥", "🥳", "😎", "🤩", "🎉"
    ]

    negative_emojis = [
        "😡", "😢", "😭", "👎",
        "💔", "😠", "🤮", "😞"
    ]

    score = 0
    matched_positive = []
    matched_negative = []

    for word in positive_words:
        if word in text:
            score += 1
            matched_positive.append(word)

    for word in negative_words:
        if word in text:
            score -= 1
            matched_negative.append(word)

    for emoji in positive_emojis:
        if emoji in review.text:
            score += 1

    for emoji in negative_emojis:
        if emoji in review.text:
            score -= 1

    if score > 0:
        sentiment = "Positive"
    elif score < 0:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"

    confidence = min(
        100,
        abs(score) * 15 + 50
    )

    db = SessionLocal()

    new_review = Review(
        text=review.text,
        sentiment=sentiment
    )

    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    result = {
        "id": new_review.id,
        "text": review.text,
        "sentiment": sentiment,
        "confidence": confidence,
        "positive_keywords": matched_positive,
        "negative_keywords": matched_negative
    }

    db.close()

    return result


# =========================
# HISTORY
# =========================

@app.get("/history")
def get_history():

    db = SessionLocal()

    reviews = db.query(Review).all()

    result = []

    for review in reviews:
        result.append({
            "id": review.id,
            "text": review.text,
            "sentiment": review.sentiment
        })

    db.close()

    return result


# =========================
# STATS
# =========================

@app.get("/stats")
def get_stats():

    db = SessionLocal()

    reviews = db.query(Review).all()

    total = len(reviews)

    positive = len(
        [r for r in reviews if r.sentiment == "Positive"]
    )

    negative = len(
        [r for r in reviews if r.sentiment == "Negative"]
    )

    neutral = len(
        [r for r in reviews if r.sentiment == "Neutral"]
    )

    db.close()

    return {
        "total": total,
        "positive": positive,
        "negative": negative,
        "neutral": neutral
    }


# =========================
# LATEST
# =========================

@app.get("/latest")
def latest_reviews():

    db = SessionLocal()

    reviews = (
        db.query(Review)
        .order_by(Review.id.desc())
        .limit(5)
        .all()
    )

    result = []

    for review in reviews:
        result.append({
            "id": review.id,
            "text": review.text,
            "sentiment": review.sentiment
        })

    db.close()

    return result


# =========================
# REGISTER
# =========================

@app.post("/register")
def register(user: RegisterRequest):

    db = SessionLocal()

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        db.close()
        return {
            "message": "Email already exists"
        }

    hashed_password = pwd_context.hash(
        user.password
    )

    new_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    db.close()

    return {
        "message": "User registered successfully"
    }


# =========================
# LOGIN
# =========================

@app.post("/login")
def login(user: LoginRequest):

    db = SessionLocal()

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:
        db.close()
        return {
            "message": "User not found"
        }

    if not pwd_context.verify(
        user.password,
        existing_user.password
    ):
        db.close()
        return {
            "message": "Wrong password"
        }

    result = {
        "message": "Login successful",
        "id": existing_user.id,
        "username": existing_user.username,
        "email": existing_user.email
    }

    db.close()

    return result


# =========================
# GET PROFILE
# =========================

@app.get("/profile/{user_id}")
def get_profile(user_id: int):

    db = SessionLocal()

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        db.close()
        return {
            "message": "User not found"
        }

    result = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "phone": user.phone,
        "city": user.city,
        "bio": user.bio,
        "image": user.image
    }

    db.close()

    return result


# =========================
# UPDATE PROFILE
# =========================

@app.put("/profile/{user_id}")
def update_profile(
    user_id: int,
    profile: ProfileUpdateRequest
):

    db = SessionLocal()

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        db.close()
        return {
            "message": "User not found"
        }

    user.full_name = profile.full_name
    user.phone = profile.phone
    user.city = profile.city
    user.bio = profile.bio

    db.commit()
    db.refresh(user)

    db.close()

    return {
        "message": "Profile updated successfully"
    }