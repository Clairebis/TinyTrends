import Button from "../../components/button/Button";
import { useParams } from "react-router-dom";

export default function ChildUpdated() {
  const { childId } = useParams();
  return (
    <section className="page">
      <Button
        text="Return to the wardrobe"
        link={`/home-wardrobe/${childId}`}
      ></Button>
      <Button className="buttonSecondary" text="Go home" link="/"></Button>
    </section>
  );
}
