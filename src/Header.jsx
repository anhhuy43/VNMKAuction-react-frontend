import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/images/123.png";

export default function Header() {
  const [isLogin, setIsLogin] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("userToken");
      setIsLogin(!!token);
    };

    checkToken();

    const handleStorageChange = () => {
      checkToken();
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Đóng ô input khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("userToken");
    setIsLogin(false);
    document.getElementById("menu-icon").checked = false;
    navigate("/");
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm(""); // Reset ô input
      setIsSearchOpen(false); // Đóng ô input
    }
  };

  return (
    <div className="header">
      <Link to="/">
        <img className="header-logo" src={logo} alt="Logo" />
      </Link>
      <div
        ref={searchRef}
        className="search-container"
        style={{ position: "relative", marginTop: "10px" }}
      >
        {isSearchOpen ? (
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ width: "200px", padding: "5px", borderRadius: "4px" }}
            />
            <button type="submit" style={{ marginLeft: "5px" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.75 9.25a.75.75 0 0 0 0 1.5h4.59l-2.1 1.95a.75.75 0 0 0 1.02 1.1l3.5-3.25a.75.75 0 0 0 0-1.1l-3.5-3.25a.75.75 0 1 0-1.02 1.1l2.1 1.95H6.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsSearchOpen(true)}
            className="search-button"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
      <input
        className="menu-icon"
        type="checkbox"
        id="menu-icon"
        name="menu-icon"
      />
      <label htmlFor="menu-icon"></label>
      <nav className="nav">
        <ul className="pt-5">
          <li>
            <Link
              to="/"
              onClick={() =>
                (document.getElementById("menu-icon").checked = false)
              }
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/create-post"
              onClick={() =>
                (document.getElementById("menu-icon").checked = false)
              }
            >
              Create
            </Link>
          </li>
          {!isLogin && (
            <li>
              <Link
                to="/login"
                onClick={() =>
                  (document.getElementById("menu-icon").checked = false)
                }
              >
                Log In
              </Link>
            </li>
          )}
          {isLogin && (
            <>
              <li>
                <Link
                  to="/my-posts"
                  onClick={() =>
                    (document.getElementById("menu-icon").checked = false)
                  }
                >
                  My Post
                </Link>
              </li>
              <li>
                <Link
                  to="/info"
                  onClick={() =>
                    (document.getElementById("menu-icon").checked = false)
                  }
                >
                  Information
                </Link>
              </li>
              <li>
                <Link onClick={handleLogOut}>Log Out</Link>
              </li>
            </>
          )}
          <li>
            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} style={{ display: "flex" }}>
              <input
                type="text"
                className="inputSearch"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                style={{ padding: "5px", borderRadius: "4px" }}
              />
              <button
                type="submit"
                style={{
                  padding: "5px 10px",
                  marginLeft: "5px",
                  cursor: "pointer",
                }}
              >
                Search
              </button>
            </form>
          </li>
        </ul>
      </nav>
    </div>
  );
}
