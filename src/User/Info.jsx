import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_ENDPOINT } from "../constants/api";

function Info() {
  const [userInfo, setUserInfo] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        navigate("/login");
      } else {
        try {
          const response = await axios.get(`${API_ENDPOINT}/user/info`, {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm token vào header
            },
          });
          console.log(response.data.user);
          setUserInfo(response.data.user);
        } catch (error) {
          console.error("Error fetching User:", error);
        }
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleLogOut = () => {
    return (
      localStorage.removeItem('userToken'),
      navigate('/login')
    )
  }

  return (
    <div className="info-card">
      <div className="card-body">
        <div className="user-avatar">
          <button className="btn btn-secondary avatar">
            <img
              className="avatar-img"
              src="https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png"
              alt="User Avatar"
              height="100"
              width="100"
            />
          </button>
        </div>

        <Link to="/user/edit" className="edit-profile-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-4"
          >
            <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
            <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
          </svg>
        </Link>

        <h5 className="user-name">
          {userInfo.firstName} {userInfo.lastName}
        </h5>
        <p className="user-email reset-css">{userInfo.email}</p>
        <Link to="/user/change-password" id="changePassword">
          Change Password
        </Link>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button className="log-out-btn" onClick={handleLogOut}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-4"
            >
              <path
                fillRule="evenodd"
                d="M14 4.75A2.75 2.75 0 0 0 11.25 2h-3A2.75 2.75 0 0 0 5.5 4.75v.5a.75.75 0 0 0 1.5 0v-.5c0-.69.56-1.25 1.25-1.25h3c.69 0 1.25.56 1.25 1.25v6.5c0 .69-.56 1.25-1.25 1.25h-3c-.69 0-1.25-.56-1.25-1.25v-.5a.75.75 0 0 0-1.5 0v.5A2.75 2.75 0 0 0 8.25 14h3A2.75 2.75 0 0 0 14 11.25v-6.5Zm-9.47.47a.75.75 0 0 0-1.06 0L1.22 7.47a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 1 0 1.06-1.06l-.97-.97h7.19a.75.75 0 0 0 0-1.5H3.56l.97-.97a.75.75 0 0 0 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Info;
