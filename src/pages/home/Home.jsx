import Button from "../../components/button/button";
import AgeDropdown from "../../components/dropdowns/ageDropdown";
import CategoryDropdown from "../../components/dropdowns/CategoryDropdown";
import plusIcon from "../../assets/icons/plusIcon.webp";
import HomeHeading from "../../components/homeHeading/HomeHeading";
import "./Home.css";
import ModalHeading from "../../components/modalHeading/ModalHeading";
import close from "../../assets/icons/close.svg";
import ChildForm from "../../components/childForm/ChildForm";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { childrenRef, db } from "../../config/firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ChildCardHome from "../../components/childCardHome/ChildCardHome";

export default function Home() {
  const auth = getAuth();
  const navigate = useNavigate();
  const user = auth.currentUser?.uid;
  console.log("User ID:", user);
  const [children, setChildren] = useState([]); // empty array for children

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

    // Create an empty "items" subcollection within the child document
    const itemsCollectionRef = collection(
      db,
      "users",
      user.uid,
      "children",
      addedChildUid,
      "items"
    );
    await addDoc(itemsCollectionRef, {}); // You can add any initial data if needed

    // Navigate to the child added success page
    navigate(`/homeChildAdded/${addedChildUid}`);
  }

  /* useEffect(() => {
    console.log("ChildrenRef:", childrenRef());
    const q = query(childrenRef, orderBy("createdAt", "desc")); // order by: lastest child first
    const unsubscribe = onSnapshot(q, (data) => {
      // map through all docs (object) from children collection
      // changing the data structure so it's all gathered in one object
      const childrenData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChildren(childrenData);
    });
    return () => {
      unsubscribe(); // tell the post component to unsubscribe from listen on changes from firestore
    };
  }, []); // Make sure to include userId as a dependency if it's used inside the useEffect */

  return (
    <>
      <section className="page">
        <HomeHeading />

        <h4 className="homeQuote">
          "Small clothes, big hearts, sustainable starts."
        </h4>

        <section>
          {children.map((child) => (
            <ChildCardHome key={child.id} child={child} />
          ))}
        </section>

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
