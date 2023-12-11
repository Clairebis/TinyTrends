import { useParams } from "react-router-dom";
import Button from "../../components/button/Button";
import "./home.css";
import Checkmark from "../../assets/icons/checkmark.svg";

export default function HomeItemUpdated() {
  const { childId } = useParams();

  return (
    <section className="page successPage">
      <h1>Great!</h1>
      <div className="successPageContent">
        <img src={Checkmark} alt="checkmark" />
        <p>This item has been updated.</p>
        <p>What would you like to do now?</p>
        <div className="successPageButtons">
          <Button
            text="Return to the wardrobe"
            link={`/home-wardrobe/${childId}`}
            className="successPageButton"
          ></Button>
          <Button
            className="buttonSecondary successPageButton"
            text="Go home"
            link="/"
          ></Button>
        </div>
      </div>
    </section>
  );
}
