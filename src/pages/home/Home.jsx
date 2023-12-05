import Button from "../../components/button/button";
import AgeDropdown from "../../components/dropdowns/ageDropdown";
import CategoryDropdown from "../../components/dropdowns/CategoryDropdown";
import plusIcon from "../../assets/icons/plusIcon.webp";
import HomeHeading from "../../components/homeHeading/HomeHeading";
import "./Home.css";
import ModalHeading from "../../components/modalHeading/ModalHeading";

export default function Home() {
  const modal = document.querySelector(".addChildModal");

  function openModal() {
    modal.style.display = "block";
  }

  function closeModal() {
    modal.style.display = "none";
  }

  return (
    <>
      <section className="page">
        <HomeHeading />

        <h4 className="homeQuote">
          "Small clothes, big hearts, sustainable starts."
        </h4>
        <AgeDropdown />
        <CategoryDropdown />
        <Button text="Wishlist" link="/wishlist" />
        <Button className="buttonSecondary" text="Blog" link="/blog" />
        <img
          className="HomePlusIcon"
          src={plusIcon}
          alt="plus button to add a child"
          onClick={openModal}
        />
        {/*modal to add a child*/}
        <div className="addChildModal">
          <div className="addChildModalContent">
            <div className="closeModal">
              <img src={close} alt="" onClick={closeModal} />
            </div>
            <ModalHeading text="Add a child" />
          </div>
        </div>
      </section>
    </>
  );
}
