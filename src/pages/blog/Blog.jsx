import "./blog.css";
import SearchBar from "../../components/searchBar/SearchBar";
import "../../components/searchBar/SearchBar.css";
import { db } from "../../config/firebase";
import { collection, query, onSnapshot, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import BlogCard from "../../components/blogCard/BlogCard";

export default function Blog() {
  const auth = getAuth();
  const [searchValue, setSearchValue] = useState("");
  const [blogArticles, setBlogArticles] = useState([]);

  // useEffect hook to fetch blog articles from firestore
  useEffect(() => {
    if (auth.currentUser?.uid) {
      console.log("User ID:", auth.currentUser.uid);

      // Reference to the blog collection
      const blogArticlesCollectionRef = collection(db, "blogArticles");
      console.log("Blog Articles Collection Ref:", blogArticlesCollectionRef);

      // Query to get blog articles
      const q = query(blogArticlesCollectionRef); // order by: lastest child first

      // Function to fetch data from Firestore
      const fetchData = async () => {
        try {
          const data = await getDocs(q);
          // Map through the documents and structure the data
          const blogArticlesData = data.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("Blog Articles Data:", blogArticlesData);
          setBlogArticles(blogArticlesData);
        } catch (error) {
          console.error("Error fetching blog articles:", error);
        }
      };

      fetchData();

      // Subscribe to changes in the blog collection using onSnapshot
      const unsubscribe = onSnapshot(
        q,
        (data) => {
          console.log("onSnapshot triggered!");
          console.log("Data from Firestore:", data.docs); // Log the received data
          // map through all docs (object) from blogArticles collection
          // changing the data structure so it's all gathered in one object
          const blogArticlesData = data.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("Blog Articles Data:", blogArticlesData);

          // Update state with the latest blog articles data
          if (blogArticlesData.length > 0) {
            setBlogArticles(blogArticlesData);
          }
        },
        (error) => {
          console.error("Error fetching blog articles:", error);
        }
      );

      // Cleanup function to unsubscribe from Firestore changes when the component unmounts
      return () => {
        unsubscribe();
      };
    }
  }, [auth.currentUser?.uid]);

  return (
    <section className="page">
      <section className="blogTop">
        <h1 className="blogHeading">Blog</h1>
        <p className="blogPara">
          Explore eco-conscious parenting tips for a sustainable and stylish
          children's wardrobe.
        </p>
        <SearchBar
          className="blogSearchBar"
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          placeholder={"Search our blog"}
        />
      </section>

      <section className="blogArticleCardsContainer">
        {blogArticles.map((blogArticle, index) => (
          <BlogCard
            key={blogArticle.id}
            blogArticle={blogArticle}
            style={{
              marginBottom: index === blogArticles.length - 1 ? 0 : "50px",
            }}
          />
        ))}
      </section>
    </section>
  );
}
