import plusIcon from "../../assets/icons/plusIcon.webp";
import HomeHeading from "../../components/homeHeading/HomeHeading";
import "./home.css";
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
import { db } from "../../config/firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ChildCardHome from "../../components/childCardHome/ChildCardHome";
import NoKidsCard from "../../components/noKidsCard/NoKidsCard";

export default function Home() {
  const auth = getAuth();
  const navigate = useNavigate();
  const user = auth.currentUser;
  const userId = auth.currentUser?.uid;
  console.log("User ID:", user);
  const [children, setChildren] = useState([]); // empty array for children

  /* const userId = auth.currentUser?.uid;
  if (!userId) {
    // Handle the case when the user is not authenticated
    return <p>User not authenticated</p>;
  } */

  const modal = document.querySelector(".addChildModal");

  // Function to open the modal for adding a child
  function openModal() {
    modal.style.display = "block";
  }

  // Function to close the modal for adding a child
  function closeModal() {
    modal.style.display = "none";
  }

  // Function to handle the form submission for adding a new child
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
      user?.uid,
      "children",
      addedChildUid,
      "items"
    );
    await addDoc(itemsCollectionRef, {}); // You can add any initial data if needed

    // Navigate to the child added success page
    navigate(`/homeChildAdded/${addedChildUid}`);
  }

  useEffect(() => {
    //console.log("ChildrenRef:", childrenRef(auth.currentUser?.uid));
    // Get a reference to the user's "children" subcollection
    if (auth.currentUser?.uid) {
      console.log("User ID:", auth.currentUser.uid);
      const userChildrenCollectionRef = collection(
        db,
        "users",
        auth.currentUser.uid,
        "children"
      );
      const q = query(userChildrenCollectionRef, orderBy("createdAt", "desc")); // order by: lastest child first
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
    }
  }, [auth.currentUser?.uid]);

  return (
    <>
      {userId ? (
        <section className="page">
          <HomeHeading />

          <h4 className="homeQuote">
            "Small clothes, big hearts, sustainable starts."
          </h4>

          <section className="childCardsContainer">
            {children.length > 0 ? (
              children.map((child) => (
                <ChildCardHome key={child.id} child={child} />
              ))
            ) : (
              <NoKidsCard onClick={openModal} onKeyDown={openModal} />
            )}
          </section>

          <img
            className="HomePlusIcon"
            src={plusIcon}
            alt="plus button to add a child"
            onClick={openModal}
            onKeyDown={openModal}
            aria-label="Add a child"
          />
          {/*modal to add a child*/}
          <div className="addChildModal">
            <div className="addChildModalContent">
              <div className="closeModal">
                <img
                  src={close}
                  alt="Close icon"
                  onClick={closeModal}
                  onKeyDown={closeModal}
                  aria-label="Close pop-up"
                />
              </div>
              <ModalHeading text="Add a child" />
              <ChildForm saveChild={handleSubmit} />
            </div>
          </div>
        </section>
      ) : (
        <p>User not authenticated</p>
      )}
    </>
  );
}
