import Button from "../../components/button/Button";
import "./editChild.css";
import Checkmark from "../../assets/icons/Checkmark.svg";

export default function ChildDeleted() {
  return (
    <section className="page childDeletedPage">
      <h1 className="deletedChildHeading">Confirmation</h1>
      <img src={Checkmark} alt="Checkmark" className="childDeletedCheckmark" />
      <p>This child's profile has now been deleted.</p>
      <Button text="Go home" link="/" className="deletedChildButton"></Button>;
    </section>
  );
}
