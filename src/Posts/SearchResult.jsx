import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";


export default function SearchResult() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = searchParams.get("query"); // Lấy tham số "query" từ URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/posts/search?query=${query}`
        );
        setResults(response.data.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchData();
    }
  }, [query]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {results.map((post, index) => (
        <div className="post-bid" key={index}>
          <div className="post-info">
            <Link to={`posts/${post._id}`}>
              <h1>{post.name}</h1>
            </Link>
            <p>{post.description}</p>
            <span>{post.createAtFormatted}</span>
          </div>

          <div className="post-image">
            <div className="image-child1">
              {post.images[0] && <img src={post.images[0]} alt="" />}
            </div>
            <div className="image-child2">
              <div>
                {post.images[1] && <img src={post.images[1]} alt="" />}
                {post.images[2] && <img src={post.images[2]} alt="" />}
              </div>
              <div>
                {post.images[3] && <img src={post.images[3]} alt="" />}
                {post.images[4] && <img src={post.images[4]} alt="" />}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
