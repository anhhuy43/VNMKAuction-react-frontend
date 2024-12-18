import { useState, useEffect } from "react";
import { API_ENDPOINT } from "../constants/api";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const MyPost = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return; // Nếu người dùng không xác nhận, không thực hiện hành động
    }

    const token = localStorage.getItem("userToken");

    try {
      const response = await axios.delete(`${API_ENDPOINT}/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Kiểm tra phản hồi từ API
      if (response.status === 200) {
        alert("Post deleted successfully!");
        setPosts(posts.filter((post) => post._id !== postId)); // Cập nhật lại danh sách bài viết
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post!");
    }
  };

  useEffect(() => {
    const fetchMyPosts = async () => {
      const token = localStorage.getItem("userToken");
      console.log("🚀 ~ fetchMyPosts ~ token:", token);
      if (!token) {
        navigate("/login");
      } else {
        try {
          const response = await axios.get(`${API_ENDPOINT}/posts/my-posts`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setPosts(response.data.myListPosts);
          console.log("🚀 ~ fetchPosts ~ response:", response.data.myListPosts);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      }
    };

    fetchMyPosts();
  }, [navigate]);

  return (
    <>
      <ul className="myListPost">
        {posts.map((post) => (
          <li key={post.id} className="post-item">
            <div className="myPostMenu">
              <div className="myPost">
                <h1>{post.name}</h1>
                <p>{post.createAtFormatted}</p>
              </div>
              <div>
                <ul className="menu-button">
                  {/* Edit post */}
                  <li>
                    <Link to={`/posts/edit/${post.id}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                        />
                      </svg>
                    </Link>
                  </li>
                  {/* Delete Post */}
                  <li>
                    <a href="#" onClick={() => handleDelete(post._id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            {/* <b className="hr anim"></b> */}
          </li>
        ))}
      </ul>
    </>
  );
};

export default MyPost;
