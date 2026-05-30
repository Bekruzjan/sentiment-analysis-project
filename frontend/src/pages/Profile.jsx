import { useState, useEffect } from "react";
import axios from "axios";

function Profile() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadProfile();

  }, []);

  const loadProfile = async () => {

    try {

      const response = await axios.get(
        `http://127.0.0.1:8000/profile/${user.id}`
      );

      setFullName(
        response.data.full_name || ""
      );

      setPhone(
        response.data.phone || ""
      );

      setCity(
        response.data.city || ""
      );

      setBio(
        response.data.bio || ""
      );

    } catch (error) {

      console.log(
        "Profile Load Error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };

  const saveProfile = async () => {

    try {

      await axios.put(

        `http://127.0.0.1:8000/profile/${user.id}`,

        {
          full_name: fullName,
          phone: phone,
          city: city,
          bio: bio
        }

      );

      alert(
        "Profile Saved Successfully"
      );

    } catch (error) {

      console.log(
        "Profile Save Error:",
        error
      );

      alert(
        "Error Saving Profile"
      );

    }

  };

  if (loading) {

    return (
      <div className="profile-page">
        <h2>Loading Profile...</h2>
      </div>
    );

  }

  return (

    <div className="profile-page">

      <div className="profile-card">

        <h1>
          My Profile
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) =>
            setFullName(
              e.target.value
            )
          }
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) =>
            setPhone(
              e.target.value
            )
          }
        />

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) =>
            setCity(
              e.target.value
            )
          }
        />

        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) =>
            setBio(
              e.target.value
            )
          }
        />

        <button
          onClick={saveProfile}
        >
          Save Profile
        </button>

      </div>

    </div>

  );

}

export default Profile;