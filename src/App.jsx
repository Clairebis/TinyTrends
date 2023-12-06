import "./App.css";
import { useState, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Home from "./pages/home/Home";
import Wishlist from "./pages/wishlist/Wishlist";
import Blog from "./pages/blog/Blog";
import ProfilePage from "./pages/profile/ProfilePage";
import Landing from "./pages/authentication/Landing";
import Signup from "./pages/authentication/Signup";
import Login from "./pages/authentication/Login";
import Nav from "./components/nav/Nav";
import HomeChildAdded from "./pages/home/HomeChildAdded";
import HomeWardrobe from "./pages/home/HomeWardrobe";
import HomeChildOverview from "./pages/home/HomeChildOverview";

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth")); // default value comes from localStorage

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        //user is authenticated / signed in
        console.log(user);
        setIsAuth(true); // set isAuth to true
        localStorage.setItem("isAuth", true); // also, save isAuth in localStorage
      } else {
        // user is not authenticated / not signed in
        setIsAuth(false); // set isAuth to false
        localStorage.removeItem("isAuth"); // remove isAuth from localStorage
      }
    });
  }, []);

  // variable holding all private routes including the nav bar
  const privateRoutes = (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/homeChildAdded/:childId" element={<HomeChildAdded />} />
        <Route path="/home-wardrobe/:childId" element={<HomeWardrobe />} />
        <Route
          path="/home-child-overview/:childId"
          element={<HomeChildOverview />}
        />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );

  // variable holding all public routes without nav bar
  const publicRoutes = (
    <Routes>
      <Route path="/landing" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/landing" />} />
    </Routes>
  );

  // if user is authenticated, show privateRoutes, else show publicRoutes
  return <main>{isAuth ? privateRoutes : publicRoutes}</main>;
}

export default App;
