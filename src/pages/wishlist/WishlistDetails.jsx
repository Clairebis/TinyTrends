import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/button/Button";
import Hanger from "../../assets/Hanger.webp";
import ArrowBack from "../../assets/icons/ArrowBack.svg";

export default function WishlistDetails() {
  const listId = useParams();
  console.log("listId:", listId);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <section className="page wishlistDetailsPage">
        <div className="wishlistDetailsContentContainer">
          <img
            src={ArrowBack}
            alt="Back arrow"
            className="wishlistBackArrow"
            onClick={goBack}
            onKeyDown={goBack}
          />
          <h1>My Lists</h1>
        </div>

        <div className="hangerImageContainer">
          <img src={Hanger} alt="Hanger logo" className="wishlistHangerImage" />
        </div>
        <h2>What do you need?</h2>
        <p className="wishlistPara">
          Tap the button below to start adding items.
        </p>
      </section>

      <Button
        text="+ ADD ITEMS"
        className="wishlistAddButton"
        link="/error-404"
      />
    </>
  );
}
