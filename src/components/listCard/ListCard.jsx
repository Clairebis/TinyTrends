import "./listCard.css";
import { useNavigate } from "react-router-dom";

// Defining the ListCard functional component, which takes 'props' as its parameter
export default function ListCard(props) {
  const navigate = useNavigate();

  // Handling the click event on the ListCard to navigate to the wishList-details page
  const handleClick = () => {
    navigate(`/wishList-details/${props.addedListUid}`);
  };
  return (
    <section
      className="listCardContainer"
      onClick={handleClick}
      onKeyDown={handleClick}
    >
      <div className="listCardHeadingContainer">
        <h2>{props.list.title}</h2>
        <div
          className="listCardMenuContainer"
          aria-label="menu options selector"
        >
          <div className="listCardMenuButton"></div>
          <div className="listCardMenuButton"></div>
          <div className="listCardMenuButton"></div>
        </div>
      </div>
      <div className="listCardProgressContainer">
        <div className="progressBar" aria-label="progress bar"></div>
        <p>0/2</p>
      </div>
    </section>
  );
}
