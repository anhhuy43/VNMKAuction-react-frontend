import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINT } from "../constants/api";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErr("Password does not match!");
      return;
    }

    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.put(
        `${API_ENDPOINT}/user/update-password`,
        {
          password,
          newPassword,
          confirmPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.data.success) {
        alert("Password changed successfully!");
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErr("");
        navigate('/info')
      } else {
        setErr(response.data.message);
      }
    } catch (err) {
      setErr("Error Pass");
    }
  };

  return (
    <div className="info-card user-edit">
      <div className="card-body">
        <h1>Change Password</h1>
        <form onSubmit={handleChangePassword}>
          <div>Current Password:</div>
          <div className="mb-3 form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>New Password:</div>
          <div className="mb-3 form-group">
            <input
              type="password"
              className="form-control"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div>Confirm Password:</div>
          <div className="mb-3 form-group">
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <span>{err}</span>
          <div className="wrapper">
            <button type="submit" className="button">
              CHANGE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
