import Button from "../../components/button/button";
import AgeDropdown from "../../components/dropdowns/ageDropdown";
import CategoryDropdown from "../../components/dropdowns/CategoryDropdown";
import plusIcon from "../../assets/icons/plusIcon.webp";
import HomeHeading from "../../components/homeHeading/HomeHeading";
import "./Home.css";
import ModalHeading from "../../components/modalHeading/ModalHeading";
import close from "../../assets/icons/close.svg";
import ChildForm from "../../components/childForm/ChildForm";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const auth = getAuth();
  const navigate = useNavigate();

  const modal = document.querySelector(".addChildModal");

  function openModal() {
    modal.style.display = "block";
  }

  function closeModal() {
    modal.style.display = "none";
  }

  async function handleSubmit(newChild) {
    newChild.createdAt = serverTimestamp(); // timestamp (now)
    newChild.uid = auth.currentUser.uid; // uid of auth user / signed in user

    // Get a reference to the user's "children" subcollection
    const userChildrenCollectionRef = collection(
      db,
      "users",
      auth.currentUser.uid,
      "children"
    );

    // Add the new child to the "children" subcollection
    const addedChildRef = await addDoc(userChildrenCollectionRef, newChild);

    // Retrieve the auto-generated UID of the added child
    const addedChildUid = addedChildRef.id;

    navigate(`/homeChildAdded/${addedChildUid}`);
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
            <ChildForm saveChild={handleSubmit} />
          </div>
        </div>
      </section>
    </>
  );
}
