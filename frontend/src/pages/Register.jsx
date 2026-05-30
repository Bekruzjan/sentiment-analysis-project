import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    if (!username || !email || !password) {
      toast.error("Fill all fields");
      return;
    }

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/register",
        {
          username: username.trim(),
          email: email.trim(),
          password: password
        }
      );

      toast.success(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {

      console.log(error);

      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Server error");
      }

    }

  };

  return (
    <div className="page-container">

      <div className="auth-card">

        <h1>Register</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRegister}
        >
          Register
        </motion.button>

      </div>

    </div>
  );
}

export default Register;