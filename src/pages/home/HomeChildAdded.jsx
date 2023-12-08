import { useParams } from "react-router-dom";
import Button from "../../components/button/Button";
import "./home.css";

export default function HomeItemAdded() {
  const { childId } = useParams();

  return (
    <>
      <Button
        text="Start adding to their wardrobe"
        link={`/home-wardrobe/${childId}`}
      ></Button>
      <Button className="buttonSecondary" text="Return home" link="/"></Button>
    </>
  );
}
