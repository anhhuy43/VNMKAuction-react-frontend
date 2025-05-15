import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "./constants/api";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINT}/posts/list-posts`);
        setPosts([...response.data].reverse());
        console.log("🚀 ~ fetchPosts ~ response:", response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const latestFivePosts = posts.slice(0, 5);

  return (
    <div>
      {/* Carousel */}
      <div className="carousel-container container mx-auto w-full h-[700px]">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          loop={true}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          className="h-full"
        >
          {latestFivePosts.map((post) => (
            <SwiperSlide key={post._id}>
              <Link
                to={`posts/${post._id}`}
                className="relative w-full h-full block"
              >
                <img
                  src={post.images[0]}
                  alt={post.name}
                  className="object-cover w-full h-full brightness-75 transition-opacity duration-700"
                />
                <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                  <div className="absolute bottom-10 left-10 text-white z-10">
                    <h2 className="text-3xl font-bold">{post.name}</h2>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="title mt-10">
        <h1 className="text-center text-white text-3xl font-bold">
          LASTEST AUCTIONS
        </h1>
      </div>
      <div className="list-posts container mx-auto grid grid-cols-5 gap-10 py-10">
        {posts.map((post, index) => (
          <Link
            className="post-bid w-full bg-slate-900 rounded-xl overflow-hidden h-[400px]"
            key={index}
            to={`posts/${post._id}`}
          >
            <div className="product-image aspect-[4/3]">
              {post.images[0] && (
                <img
                  src={post.images[0]}
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

export default HomePage;
