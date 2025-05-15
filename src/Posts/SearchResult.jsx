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
        console.log("🚀 ~ fetchData ~ response:", response)
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
    <div>
      <div className="title mt-10">
        <h1 className="text-center text-white text-3xl font-bold">
          LASTEST AUCTIONS
        </h1>
      </div>
      <div className="list-posts container mx-auto grid grid-cols-5 gap-10 py-10">
        {results.map((post, index) => (
          <Link
            className="post-bid w-full bg-slate-900 rounded-xl overflow-hidden h-[400px]"
            key={index}
            to={`posts/${post._id}`}
          >
            <div className="product-image aspect-[4/3]">
              {post.fullImages[0] && (
                <img
                  src={post.fullImages[0]}
                  alt=""
                  className="object-cover w-full h-full"
                />
              )}
            </div>

            <div className="post-info p-4">
              <h1 className="font-bold text-center text-3xl mb-2 h-[60px] overflow-hidden">
                {post.name}
              </h1>
              <p className="text-base text-center h-[60px] overflow-hidden text-gray-300">
                Starting Price: <b>{post.startingPrice}</b>
              </p>
              <span className="text-sm text-center text-gray-400 block mt-2">
                {post.createAtFormatted}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
