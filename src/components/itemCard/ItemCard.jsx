import "./ItemCard.css";
import { useNavigate } from "react-router-dom";

export default function ItemCard({ item, childId }) {
  const navigate = useNavigate();

  function handleClick() {
    console.log("Clicked on item ID:", item.id); //for debugging
    navigate(`/home-item-overview/${childId}/${item.id}`);
  }

  return (
    <article>
      <div onClick={handleClick}>
        <h2>{item.caption}</h2>
      </div>
    </article>
  );
}
