import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    if (!email || !password) {
      toast.error("Fill all fields");
      return;
    }

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/login",
        {
          email: email.trim(),
          password: password
        }
      );

      console.log(response.data);

      if (response.data.message === "Login successful") {

        localStorage.setItem(
          "user",
          JSON.stringify(response.data)
        );

        toast.success("Login successful");

        navigate("/dashboard");

      } else {

        toast.error(response.data.message);

      }

    } catch (error) {

      console.log(error);

      toast.error("Server error");

    }

  };

  return (
    <div className="page-container">

      <div className="auth-card">

        <h1>Login</h1>

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

        <button onClick={handleLogin}>
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;