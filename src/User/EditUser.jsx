import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API_ENDPOINT } from '../constants/api';

const EditUser = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        navigate("/login");
      } else {
        try {
          const response = await axios.get(`${API_ENDPOINT}/user/edit-user`, {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm token vào header
            },
          });
          console.log(response.data.user);
          setUser(response.data.user);
        } catch (error) {
          console.error("Error fetching User:", error);
        }
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_ENDPOINT}/user/update-user`,
        { ...user },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      navigate('/info');
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };
  
  
  return (
    <div className="info-card user-edit">
      <div className="card-body">
        <h1>EDIT PROFILE</h1>
        <form onSubmit={handleUpdate}>
          <div>First Name:</div>
          <div className="mb-3 form-group">
            <input
              className="form-control"
              id="firstName"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>Last Name:</div>
          <div className="mb-3 form-group">
            <input
              className="form-control"
              id="lastName"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div>Email:</div>
          <div className="mb-3 form-group">
            <input
              className="form-control"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="wrapper">
            <button type="submit" className="button">UPDATE</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditUser