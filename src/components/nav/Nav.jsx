import { NavLink, useLocation } from "react-router-dom";
import Home from "../../assets/icons/nav/Home.svg";
import Wishlist from "../../assets/icons/nav/Wishlist.svg";
import Profile from "../../assets/icons/nav/Profile.svg";
import Blog from "../../assets/icons/nav/Blog.svg";
import "./nav.css";

//React component for nav bar
export default function Nav() {
  // Get the current location using the useLocation hook from React Router
  const location = useLocation();

  // Determine if the "Home" link should be marked as active based on the current URL
  const isHomeActive =
    location.pathname === "/" || location.pathname.includes("/home");

  // Determine if the "Wishlist" link should be marked as active based on the current URL
  const isWishlistActive =
    location.pathname === "/wishlist" ||
    location.pathname.includes("/wishlist");

  // Determine if the "Blog" link should be marked as active based on the current URL
  const isBlogActive =
    location.pathname === "/blog" || location.pathname.includes("/blog");

  // Determine if the "Profile" link should be marked as active based on the current URL
  const isProfileActive =
    location.pathname === "/profile" || location.pathname.includes("/profile");

  return (
    // Navigation bar JSX structure
    <nav className="bottomNav" aria-label="navigation">
      <NavLink to="/home" className={`navLink ${isHomeActive ? "active" : ""}`}>
        <img src={Home} alt="Home" aria-hidden="true" className="homeIcon" />
        <span className="small">Home</span>
      </NavLink>

      <NavLink
        to="/wishlist"
        className={`navLink ${isWishlistActive ? "active" : ""}`}
      >
        <img
          src={Wishlist}
          alt="Wishlist"
          aria-hidden="true"
          className="wishlistIcon"
        />
        <span className="small">Wishlist</span>
      </NavLink>

      <NavLink to="/blog" className={`navLink ${isBlogActive ? "active" : ""}`}>
        <img src={Blog} alt="Blog" aria-hidden="true" className="blogIcon" />
        <span className="small">Blog</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={`navLink ${isProfileActive ? "active" : ""}`}
      >
        <img
          src={Profile}
          alt="Profile"
          aria-hidden="true"
          className="profileIcon"
        />
        <span className="small">Profile</span>
      </NavLink>
    </nav>
  );
}
