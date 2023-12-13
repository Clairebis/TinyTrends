import "./blog.css";
import SearchBar from "../../components/searchBar/SearchBar";
import "../../components/searchBar/SearchBar.css";
import { db } from "../../config/firebase";
import { collection, query, onSnapshot, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import BlogCard from "../../components/blogCard/blogCard";

export default function Blog() {
  const auth = getAuth();
  const [searchValue, setSearchValue] = useState("");
  const [blogArticles, setBlogArticles] = useState([]);

  useEffect(() => {
    // Get a reference to the blog collection
    if (auth.currentUser?.uid) {
      console.log("User ID:", auth.currentUser.uid);
      const blogArticlesCollectionRef = collection(db, "blogArticles");
      console.log("Blog Articles Collection Ref:", blogArticlesCollectionRef);
      const q = query(blogArticlesCollectionRef); // order by: lastest child first

      const fetchData = async () => {
        try {
          const data = await getDocs(q);
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

          if (blogArticlesData.length > 0) {
            setBlogArticles(blogArticlesData);
          }
        },
        (error) => {
          console.error("Error fetching blog articles:", error);
        }
      );

      return () => {
        unsubscribe(); // tell the  component to unsubscribe from listen on changes from firestore
      };
    }
  }, [auth.currentUser?.uid]);

  return (
    <section className="page">
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

      <section className="blogArticleCardsContainer">
        {blogArticles.map((blogArticle) => (
          <BlogCard key={blogArticle.id} blogArticle={blogArticle} />
        ))}
      </section>
    </section>
  );
}
