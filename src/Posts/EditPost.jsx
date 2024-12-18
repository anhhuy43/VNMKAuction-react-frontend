import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINT } from "../constants/api";

const EditPost = () => {
  const { id } = useParams(); // Lấy ID bài viết từ URL
  const navigate = useNavigate();
  const [post, setPost] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  const formatDateTime = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    // Fetch dữ liệu bài viết hiện tại
    const fetchPost = async () => {
      const token = localStorage.getItem("userToken");
      try {
        const response = await axios.get(`${API_ENDPOINT}/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.post;
        setPost({
          name: data.name,
          description: data.description,
          startingPrice: data.startingPrice,
          startTime: formatDateTime(data.startTime),
          endTime: formatDateTime(data.endTime),
        });
        console.log(
          "🚀 ~ fetchPost ~ formatDateTime(data.endTime):",
          formatDateTime(data.endTime)
        );
      } catch (error) {
        console.error("Error fetching post:", error);
        alert("Failed to load post!");
        navigate("/my-posts");
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
    console.log(`Updated ${name}:`, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("userToken");

    try {
      await axios.put(
        `${API_ENDPOINT}/posts/${id}`,
        { ...post },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Post updated successfully!");
      navigate("/my-posts"); // Điều hướng về trang danh sách bài viết
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post!");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="create-post">
        <h1>Update Post</h1>
        <div>
          <input
            name="name"
            placeholder="Title"
            value={post.name}
            onChange={handleChange}
            className="title-input"
          ></input>
        </div>
        <hr />
        <div style={{ margin: "10px auto"}}>
          <textarea
            name="description"
            placeholder="Description"
            value={post.description}
            onChange={handleChange}
            className="form-input"
          ></textarea>
        </div>
        <hr />
        <div style={{ padding: "20px"}}>
          <h2 style={{ color: "white"}}>Start Price:</h2>
          <input
            type="text"
            name="startingPrice"
            value={post.startingPrice}
            onChange={handleChange}
            className="starting-price-input"
          />
        </div>
        <div>
          <input
            className="startTime-input"
            type="datetime-local"
            name="startTime"
            value={post.startTime}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="datetime-local"
            name="endTime"
            value={post.endTime}
            onChange={handleChange}
            className="endTime-input"
          />
        </div>
        <button type="submit" className="create-post-button-submit">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditPost;
