import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_ENDPOINT } from "../constants/api";

const SignUp = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_ENDPOINT}/user/create`, {
        firstName,
        lastName,
        email,
        password,
      },
      {
        validateStatus: (status) => status < 500,
      });
      if (response.data.success) {
        // Đăng ký thành công, chuyển hướng hoặc thực hiện hành động khác
        console.log("Sign up successful");
        navigate("/login");
      } else {
        setError(response.data.message || "Sign up failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Email already used");
    }
  };

  return (
    <div>
      <form className="login-form" onSubmit={handleSignUp}>
        <h1>Sign Up</h1>
        <div className="form-group">
          <input
            type="text"
            className="form-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
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
        <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
        <button type="submit" className="signup-button">
          Sign Up
        </button>
        <p style={{color: 'grey'}}>
          Already have an account? <Link to="/login"><strong style={{color: "white"}}>Log In</strong></Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
