import { useNavigate } from "react-router-dom";
import "./ChildCardHome.css";

export default function ChildCardHome({ child }) {
  const navigate = useNavigate();

  function handleClick() {
    console.log("Clicked on child ID:", child.id); //for debugging
    navigate(`/home-child-overview/${child.id}`);
  }

  return (
    <article>
      <div onClick={handleClick}>
        <h2>{child.firstName}</h2>
      </div>
    </article>
  );
}
