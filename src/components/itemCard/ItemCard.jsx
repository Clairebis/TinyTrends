import "./itemCard.css";
import { useNavigate } from "react-router-dom";

export default function ItemCard({ item, childId }) {
  const navigate = useNavigate();

  function handleClick() {
    console.log("Clicked on item ID:", item.id); //for debugging
    navigate(`/home-item-overview/${childId}/${item.id}`);
  }

  return (
    <article className="itemCardContainer">
      <div onClick={handleClick}>
        <img src={item.image} alt={item.caption} className="itemCardImage" />
      </div>
    </article>
  );
}
