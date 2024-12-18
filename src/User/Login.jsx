import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_ENDPOINT } from "../constants/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_ENDPOINT}/user/login`, {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("userToken", response.data.token);

        console.log("LoginSucess");
        navigate("/");
      } else {
        setError(response.data.message || "Login failed");
        console.log(error);
      }
    } catch (err) {
      setError("User not found or wrong password");
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin} className="login-form">
        <h1>LOGIN</h1>
        <div className="form-group">
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <button className="login-button" type="submit">
            Login
        </button>
        <Link to="/user/create" className="create-user-button">
          Create account
        </Link>
        
      </form>
    </div>
  );
};


export default Login;
