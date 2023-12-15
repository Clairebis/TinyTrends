import Button from "../../components/button/Button";
import { useParams } from "react-router-dom";
import "./editChild.css";
import Checkmark from "../../assets/icons/Checkmark.svg";

export default function ChildUpdated() {
  const { childId } = useParams();

  return (
    <section className="page childDeletedPage">
      <h1 className="deletedChildHeading">Great!</h1>
      <img
        src={Checkmark}
        alt="Checkmark"
        className="childDeletedCheckmark"
        aria-hidden="true"
      />
      <p className="childUpdatedPara1">
        This child's information has been updated.
      </p>
      <p className="childUpdatedPara2">What would you like to do now?</p>
      <Button
        className="childUpdatedButton"
        text="Go to their wardrobe"
        link={`/home-wardrobe/${childId}`}
      ></Button>
      <Button
        className="buttonSecondary childUpdatedButton"
        text="Go home"
        link="/"
      ></Button>
    </section>
  );
}
