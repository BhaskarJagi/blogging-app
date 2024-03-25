import React from "react";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <div className="nav-bar">
      <div className="gradient-effect"></div>
      <div className="links">
        <Link to="/authentication" className={currentPath === "/" ? "active" : ""}>
          Register/Login
        </Link>
        <Link
          to="/blogs"
          className={currentPath.includes("blogs") ? "active" : ""}
        >
          Blogs
        </Link>
        <Link
          to="/create-blog"
          className={currentPath === "/create-blog" ? "active" : ""}
        >
          Create Blog
        </Link>
        <Link
          to="/profile"
          className={currentPath === "/profile" ? "active" : ""}
        >
          Profile
        </Link>
      </div>
    </div>
  );
}

export default Header;
