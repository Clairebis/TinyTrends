import { useParams } from "react-router-dom";
import Button from "../../components/button/Button";

export default function HomeItemUpdated() {
  const { childId } = useParams();

  return (
    <>
      <Button
        text="Return to the wardrobe"
        link={`/home-wardrobe/${childId}`}
      ></Button>
      <Button className="buttonSecondary" text="Go home" link="/"></Button>
    </>
  );
}
