import Checkmark from "../../assets/icons/Checkmark.svg";
import Button from "../../components/button/Button";
import "../editChild/editChild.css";
import { useParams } from "react-router-dom";
import "../../components/button/button.css";

export default function HomeItemDeleted() {
  const { childId } = useParams();

  return (
    <section className="page childDeletedPage">
      <h1 className="deletedChildHeading">Confirmation</h1>
      <img src={Checkmark} alt="Checkmark" className="childDeletedCheckmark" />
      <p>This item has now been deleted.</p>
      <Button
        text="Back to the wardrobe"
        link={`/home-wardrobe/${childId}`}
        className="deletedItemButton1"
      />
      <Button
        text="Go home"
        link="/"
        className="buttonSecondary deletedItemButton2"
      />
    </section>
  );
}
