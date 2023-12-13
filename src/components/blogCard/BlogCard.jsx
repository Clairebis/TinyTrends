import "./blogCard.css";
import { useNavigate } from "react-router-dom";

export default function BlogCard({ blogArticle }) {
  const navigate = useNavigate();
  const handleBlogCardClick = () => {
    console.log("Clicked on blog card:", blogArticle.id); //for debugging
    navigate(`/blog-post-full/${blogArticle.id}`);
  };

  return (
    <article className="blogCard" onClick={handleBlogCardClick}>
      <div className="blogCardImageContainer">
        <img src={blogArticle.image} alt={blogArticle.title} />
      </div>
      <div className="blogCardText">
        <h3 className="blogCardHeading">{blogArticle.title}</h3>
        <p className="blogCardPara small">{blogArticle.publishedDate}</p>
      </div>
    </article>
  );
}
