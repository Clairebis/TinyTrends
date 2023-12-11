import { useParams } from "react-router-dom";
import Button from "../../components/button/Button";
import Checkmark from "../../assets/icons/checkmark.svg";
import "./home.css";

export default function HomeItemAdded() {
  const { childId } = useParams();

  return (
    <section className="page successPage">
      <h1>Congratulations!</h1>
      <div className="successPageContent">
        <img src={Checkmark} alt="checkmark" />
        <p>Your child has now been added to your profile.</p>
        <p>What would you like to do now?</p>
        <div className="successPageButtons">
          <Button
            text="Start adding to their wardrobe"
            link={`/home-wardrobe/${childId}`}
            className="successPageButton"
          ></Button>
          <Button
            className="buttonSecondary successPageButton"
            text="Return home"
            link="/"
          ></Button>
        </div>
      </div>
    </section>
  );
}
