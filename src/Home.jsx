import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "./constants/api";
import { Link } from "react-router-dom";
import Logo from "./assets/images/123.png";

function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINT}/posts/list-posts`); // Sử dụng axios để lấy dữ liệu
        setPosts(response.data);
        console.log("🚀 ~ fetchPosts ~ response:", response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="list-posts">
      {posts.map((post, index) => (
        <Link className="post-bid" key={index} to={`posts/${post._id}`}>
          <div className="list-post-image">
            {post.images[0] && <img src={post.images[0]} alt="" />}
          </div>

          <div className="post-info">
            <h1>{post.name}</h1>
            <p className="description">{post.description}</p>
            <span>{post.createAtFormatted}</span>
          </div>
          
          <div className="user-post">
            <h2>
              {post.userId.firstName} {post.userId.lastName}
            </h2>
            <span>{post.userId.email}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default HomePage;
