import ListBear from "../../assets/ListBear.webp";
import Button from "../../components/button/Button";
import "./wishlist.css";

export default function Wishlist() {
  return (
    <section className="page">
      <div className="wishlistContentContainer">
        <h1>My Lists</h1>
        <div className="listBearImageContainer">
          <img
            src={ListBear}
            alt="Bear writing a list"
            className="listBearImage"
          />
        </div>
        <h2>Let’s plan your wishlists!</h2>
        <p className="wishlistPara">
          Tap the button below to create a list. You can then share it with
          friends and family.
        </p>
      </div>
      <Button text="+ NEW LIST" className="wishlistAddButton" />
    </section>
  );
}
