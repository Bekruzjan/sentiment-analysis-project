const API_URL = "http://127.0.0.1:8000";

export const analyzeText = async (text) => {
  const response = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  return response.json();
};

export const getHistory = async () => {
  const response = await fetch(`${API_URL}/history`);
  return response.json();
};

export const getStats = async () => {
  const response = await fetch(`${API_URL}/stats`);
  return response.json();
};
@app.put("/profile/update")
def update_profile(profile: ProfileUpdateRequest):

    db = SessionLocal()

    user = db.query(User).filter(
        User.email == profile.email
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

    db.close()

    return {
        "message": "Profile updated successfully"
    }