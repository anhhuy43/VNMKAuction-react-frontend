import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/images/123.png";

export default function Header() {
  const [isLogin, setIsLogin] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
      setSearchTerm("");
      setIsSearchOpen(false);
    }
  };

  return (
    <div className="topbar container mx-auto justify-between flex py-10">
      <Link className="w-1/3 flex items-center" to="/">
        <img className="topbar-logo w-1/3" src={logo} alt="Logo" />
      </Link>

      <div className="search-container bg-zinc-800 rounded-xl p-2 w-1/3 hover:bg-zinc-700">
        <form
          onSubmit={handleSearchSubmit}
          className="search-form rounded-sm flex w-full justify-between"
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input py-2 pl-3 w-full text-sm text-white focus:outline-none bg-transparent"
          />
          <button
            type="submit"
            className="p-1 focus:outline-none focus:shadow-outline text-white"
          >
            <svg
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              class="w-6 h-6"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
        </form>
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
        </ul>
      </nav>
    </div>
  );
}
