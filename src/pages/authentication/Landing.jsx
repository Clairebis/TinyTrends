import Button from "../../components/button/Button";
import Hanger from "../../assets/Hanger.webp";
import "./authentication.css";

export default function Landing() {
  return (
    <>
      <section className="page landingPage">
        <img src={Hanger} alt="Hanger" className="landingHanger" />
        <h1 className="landingTitle">TinyTrends</h1>
        <section className="landingText">
          <p className="landingPara">Revamp your child's closet sustainably!</p>
          <p className="landingPara">
            Organise, donate, sell, and recycle old clothes with ease.
          </p>
          <p className="landingPara">
            {" "}
            Create wishlists and embrace a world of sustainable fashion fun!
          </p>
        </section>

        <section className="landingButtons">
          <Button text="Login" link="/login" className="landingButton" />
          <Button
            text="Sign up"
            link="/signup"
            className="buttonSecondary landingButton"
          />
        </section>
      </section>
    </>
  );
}
