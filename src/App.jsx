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
import HomeDeclutter from "./pages/home/HomeDeclutter";
import EditChild from "./pages/editChild/EditChild";
import HomeItemAdded from "./pages/home/HomeItemAdded";
import HomeItemOverview from "./pages/home/HomeItemOverview";
import HomeItemEdit from "./pages/home/HomeItemEdit";
import HomeItemUpdated from "./pages/home/HomeItemUpdated";
import HomeItemDeleted from "./pages/home/HomeItemDeleted";
import HomeDonate from "./pages/home/itemOptionPages/HomeDonate";
import HomeRecycle from "./pages/home/itemOptionPages/HomeRecycle";
import HomeSell from "./pages/home/itemOptionPages/HomeSell";
import HomeThanks from "./pages/home/itemOptionPages/HomeThanks";
import ChildUpdated from "./pages/editChild/ChildUpdated";
import ChildDeleted from "./pages/editChild/ChildDeleted";
import Error404 from "./pages/Error404/Error404";
import WishlistAddList from "./pages/wishlist/WishlistAddList";
import WishlistDetails from "./pages/wishlist/WishlistDetails";

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
        <Route path="/home-item-added/:childId" element={<HomeItemAdded />} />
        <Route
          path="/home-item-overview/:childId/:itemId"
          element={<HomeItemOverview />}
        />
        <Route
          path="home-item-edit/:childId/:itemId"
          element={<HomeItemEdit />}
        />
        <Route
          path="/home-item-updated/:childId"
          element={<HomeItemUpdated />}
        />
        <Route
          path="/home-item-deleted/:childId"
          element={<HomeItemDeleted />}
        />
        <Route path="/home-declutter/:childId" element={<HomeDeclutter />} />
        <Route path="/home-donate/:childId" element={<HomeDonate />} />
        <Route path="/home-recycle/:childId" element={<HomeRecycle />} />
        <Route path="/home-sell/:childId" element={<HomeSell />} />
        <Route path="home-thanks/:actionType" element={<HomeThanks />} />
        <Route path="/edit-child/:childId" element={<EditChild />} />
        <Route path="/home-child-updated/:childId" element={<ChildUpdated />} />
        <Route path="/child-deleted" element={<ChildDeleted />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/wishlist-add-list" element={<WishlistAddList />} />
        <Route
          path="/wishListDetails/:addedListUid"
          element={<WishlistDetails />}
        />
        <Route path="/blog" element={<Blog />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/error-404" element={<Error404 />} />
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
