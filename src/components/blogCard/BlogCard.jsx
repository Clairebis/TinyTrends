import "./blogCard.css";
import { useNavigate } from "react-router-dom";

// Defining the BlogCard functional component, which takes a prop 'blogArticle'
export default function BlogCard({ blogArticle }) {
  const navigate = useNavigate();

  // Handling the click event on the BlogCard
  const handleBlogCardClick = () => {
    console.log("Clicked on blog card:", blogArticle.id); //for debugging
    //navigate(`/blog-post-full/${blogArticle.id}`);
    navigate(`/error-404`);
  };

  return (
    <article
      className="blogCard"
      onClick={handleBlogCardClick}
      onKeyDown={handleBlogCardClick}
    >
      <div className="blogCardImageContainer" aria-hidden="true">
        <img
          src={blogArticle.image}
          alt={blogArticle.title}
          className="blogCardImage"
        />
      </div>
      <div className="blogCardText">
        <h3 className="blogCardHeading">{blogArticle.title}</h3>
        <p className="blogCardPara small">{blogArticle.publishedDate}</p>
      </div>
    </article>
  );
}
