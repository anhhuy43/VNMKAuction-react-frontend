import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_ENDPOINT, WS_ENDPOINT } from "../constants/api";
import Modal from "../components/Modal/Modal";
import {
  differenceInMilliseconds,
  isBefore,
  formatDuration,
  intervalToDuration,
} from "date-fns";

function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAuctionStarted, setIsAuctionStarted] = useState(false);
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken"); // Lấy token từ localStorage

    const socketInstance = io(WS_ENDPOINT, {
      auth: { token },
    });

    setSocket(socketInstance);

    socketInstance.on(`postUpdate:${id}`, (data) => {
      console.log("📡 Real-time update received:", data);
      setPost((prevPost) => ({
        ...prevPost,
        topBid: data.topBid, // Cập nhật giá cao nhất
        highestBidder: data.highestBidder, // Cập nhật người đặt giá cao nhất
      }));
    });

    // Dọn dẹp kết nối khi component bị unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [id]);

  // Lấy chi tiết bài post và comment
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postResponse = await axios.get(`${API_ENDPOINT}/posts/${id}`);
        const postData = postResponse.data.post;

        setPost({
          ...postData,
          topBid: postResponse.data.highestBid || null,
          highestBidder: postResponse.data.highestBidder || null,
        });
        setComments(postResponse.data.comments);

        // Xác định trạng thái đấu giá ban đầu
        const now = new Date();
        const startTime = new Date(postData.startTime);
        const endTime = new Date(postData.endTime);

        setIsAuctionStarted(isBefore(startTime, now)); // startTime <= now
        setIsAuctionEnded(isBefore(endTime, now)); // endTime <= now
      } catch (error) {
        console.error("Error fetching post and comments:", error);
      }
    };

    fetchPostAndComments();
  }, [id]);

  // Cập nhật trạng thái đấu giá và đồng hồ đếm ngược
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (post) {
        setIsAuctionStarted(isBefore(new Date(post.startTime), now));
        setIsAuctionEnded(isBefore(new Date(post.endTime), now));
      }
      setCurrentTime(now);
    }, 1000);

    return () => clearInterval(timer);
  }, [post]);

  // Thêm comment mới
  const handleAddComment = async (e) => {
    e.preventDefault();
    const bidValue = parseInt(newComment);

    if (bidValue <= post.startPrice) {
      showAlert(
        `Your bid must be higher than the starting price (${post.startPrice} đ).`
      );
      return;
    }

    if (post.topBid && bidValue <= post.topBid) {
      showAlert(
        `Your bid must be higher than the current top bid (${post.topBid} đ).`
      );
      return;
    }

    try {
      const token = localStorage.getItem("userToken");
      await axios.post(
        `${API_ENDPOINT}/posts/${id}/comments`,
        { contentBid: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  useEffect(() => {
    if (socket) {
      console.log("🚀 ~ useEffect ~ socket:", socket);
      const handleNewComment = (data) => {
        console.log("🚀 ~ handleNewComment ~ data:", data);
        setComments((prevComments) => [data.comment, ...prevComments]);

        // Cập nhật topBid và highestBidder nếu cần
        if (data.highestBid !== null) {
          setPost((prevPost) => ({
            ...prevPost,
            topBid: data.highestBid,
            highestBidder: data.highestBidder,
          }));
        }
      };

      socket.on("newComment", handleNewComment);

      const handleJoinPostRoomSuccess = (roomId) => {
        console.log(`🎉 Successfully joined room: ${roomId}`);
      };

      socket.on("joinPostRoomSuccess", handleJoinPostRoomSuccess);

      console.log(`🔗 Emitting joinPostRoom with postId: ${id}`);
      socket.emit("joinPostRoom", id);

      // Cleanup listener khi component unmount hoặc socket thay đổi
      return () => {
        socket.off("newComment", handleNewComment);
        socket.off("joinPostRoomSuccess", handleJoinPostRoomSuccess);
      };
    }
  }, [socket, id]);

  // Tính toán thời gian đếm ngược
  const getCountdownTime = (targetTime) => {
    const diff = differenceInMilliseconds(new Date(targetTime), currentTime);
    if (diff <= 0) return "00:00:00";

    const duration = intervalToDuration({
      start: new Date(),
      end: new Date(targetTime),
    });
    return formatDuration(duration, {
      format: ["hours", "minutes", "seconds"],
      delimiter: " : ",
    });
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setIsAlertVisible(true);
  };

  const closeAlert = () => {
    setIsAlertVisible(false);
  };

  return (
    <div>
      {post && (
        <div
          className={`post-detail ${isAuctionStarted ? "" : "blur-content"}`}
          style={{ position: "relative" }}
        >
          <div className="post-bid">
            <div className="user-post">
              <h2>
                {post.userId.firstName} {post.userId.lastName}
              </h2>
              <span>{post.userId.email}</span>
            </div>
            {/* Thông tin bài đấu giá */}
            <div className="post-info">
              <h1>{post.name}</h1>
              <p className="description">{post.description}</p>
              <p>
                <strong>Starting Price:</strong> {post.startingPrice} đ
              </p>
              <span>{post.createAtFormatted}</span>
            </div>
            {/* Hình ảnh */}
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

          <div className="comment-area">
            {/* Đếm ngược trước khi đấu giá bắt đầu */}
            {!isAuctionStarted && (
              <div className="countdown">
                Auction starts in: {getCountdownTime(post.startTime)}
              </div>
            )}

            {/* Đếm ngược khi đấu giá đang diễn ra */}
            {isAuctionStarted && !isAuctionEnded && (
              <div className="countdown">
                <strong className="countdown-text">
                  {getCountdownTime(post.endTime)}
                </strong>
              </div>
            )}

            {/* Thông báo khi đấu giá kết thúc */}
            {isAuctionEnded && (
              <div className="auction-ended">
                <p>The auction has ended.</p>
                <p>
                  Top bid: {post.topBid ? `${post.topBid} đ` : "No bids yet."}
                </p>
                {post.highestBidder && (
                  <p>
                    Winner: {post.highestBidder.firstName}{" "}
                    {post.highestBidder.lastName}
                  </p>
                )}
              </div>
            )}

            {isAuctionStarted && !isAuctionEnded && (
              <div className="current-bid">
                <h2>
                  <strong>
                    Top Price:{" "}
                    {post.topBid ? `${post.topBid} đ` : "No bids yet."}
                  </strong>
                </h2>
              </div>
            )}

            {/* Danh sách comment */}
            <div className="comment-list">
              {comments.length > 0 &&
                comments.map((comment, index) => (
                  <div key={index} className="comment-item">
                    <p>
                      <strong>
                        {comment.user?.firstName} {comment.user?.lastName}:
                      </strong>{" "}
                      {comment.contentBid}đ
                    </p>
                    <span className="bid-time">
                      {new Date(comment.createAt).toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>

            {/* Form thêm comment đấu giá */}
            {isAuctionStarted && !isAuctionEnded && (
              <form onSubmit={handleAddComment} className="form-input-bid">
                <input
                  type="number"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Enter your bid..."
                  required
                />
                <button type="submit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      <Modal
        message={alertMessage}
        isVisible={isAlertVisible}
        onClose={closeAlert}
      />
    </div>
  );
}

export default PostDetailPage;
