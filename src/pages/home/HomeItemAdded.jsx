import { useParams } from "react-router-dom";
import Button from "../../components/button/button";
import "./home.css";

export default function HomeChildAdded() {
  const { childId } = useParams();

  return (
    <>
      <Button text="Add more items" link={`/home-wardrobe/${childId}`}></Button>
      <Button className="buttonSecondary" text="Go home" link="/"></Button>
    </>
  );
}
