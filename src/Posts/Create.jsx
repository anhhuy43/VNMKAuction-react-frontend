import React, { useState } from "react";
import apiClient from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    images: [],
    startingPrice: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: e.target.files });
    console.log("🚀 ~ handleFileChange ~ e.target.files:", e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.images || formData.images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    if (formData.images.length !== 5) {
      setError("Please upload 5 images.");
      return;
    }

    if (
      !formData.startingPrice ||
      isNaN(formData.startingPrice) ||
      formData.startingPrice < 0
    ) {
      setError("Starting price must be greater than 0");
      return;
    }

    setError("");

    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("description", formData.description);
    formPayload.append("startTime", formData.startTime);
    formPayload.append("endTime", formData.endTime);
    formPayload.append("startingPrice", formData.startingPrice);

    Array.from(formData.images).forEach((file) => {
      formPayload.append("images", file);
    });

    try {
      const token = localStorage.getItem("userToken");
      const response = await apiClient.post("/posts/create-post", formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Post created:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-post">
      <div className="create-post-form">
        <h1>Create Your Bid</h1>
        <input
          className="title-input"
          type="text"
          name="name"
          placeholder="Title"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <hr />
        <textarea
          className="form-input"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
        ></textarea>
        <input
          className="starting-price-input"
          type="number"
          name="startingPrice"
          placeholder="Starting Price"
          value={formData.startingPrice}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="files-upload" className="file-upload-label">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
          >
            <path d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z" />
            <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
          </svg>
        </label>
        <input
          type="file"
          id="files-upload"
          className="files-upload"
          multiple
          onChange={handleFileChange}
        />
        <input
          className="startTime-input"
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={handleInputChange}
          required
        />
        <input
          className="endTime-input"
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          onChange={handleInputChange}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" className="create-post-button-submit">
          CREATE
        </button>
      </div>
    </form>
  );
};

export default CreatePost;
