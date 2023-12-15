import "./noKidsCard.css";
import noKidsPlaceholder from "../../assets/noKidsPlaceholder.webp";

export default function NoKidsCard({ onClick, onKeyDown }) {
  return (
    <article
      className="childCardContainer"
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <div className="childCardContent">
        <div className="childCardImageContainer">
          <img
            src={noKidsPlaceholder}
            alt="image placeholder"
            className="childCardImage"
          />
        </div>
        <p>Add a child to start managing their wardrobe</p>
      </div>
    </article>
  );
}
