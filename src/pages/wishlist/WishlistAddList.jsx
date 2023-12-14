import ArrowBack from "../../assets/icons/ArrowBack.svg";
import "./wishlist.css";
import { useNavigate } from "react-router-dom";
import Hanger from "../../assets/Hanger.webp";
import { useState } from "react";
import { TextField } from "@mui/material";
import Button from "../../components/button/Button";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";

export default function WishlistAddList() {
  const navigate = useNavigate();
  const [listTitle, setListTitle] = useState(""); // empty string for list title user inputs
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const goBack = () => {
    navigate(-1);
  };

  async function createList() {
    // Check if this function is being called
    console.log("createList function called");
    // Check if listTitle is not empty before creating the list
    if (listTitle.trim() === "") {
      alert("List title cannot be empty");
      return;
    }

    console.log("Creating list with title:", listTitle);

    const newList = {
      title: listTitle,
      createdAt: serverTimestamp(),
      uid: auth.currentUser.uid,
    };

    console.log("New list object:", newList);

    // Get a reference to the user's "lists" subcollection
    const userListCollectionRef = collection(db, "users", userId, "lists");

    // Add the new list to the "lists" subcollection
    const addedListRef = await addDoc(userListCollectionRef, newList);

    // Retrieve the auto-generated UID of the added list
    const addedListUid = addedListRef.id;

    // Update the list to include the addedListUid
    await updateDoc(addedListRef, { addedListUid });

    // Create an empty "items" subcollection within the list document
    const itemsCollectionRef = collection(
      db,
      "users",
      auth.currentUser.uid,
      "lists",
      addedListUid,
      "items"
    );
    await addDoc(itemsCollectionRef, {}); // You can add any initial data if needed

    // Navigate to the list overview page
    navigate(`/wishListDetails/${addedListUid}`);
  }

  return (
    <section className="page">
      <div className="addListHeadingContainer" onClick={goBack}>
        <img src={ArrowBack} alt="back arrow" className="backArrow" />
      </div>

      <div className="addListContainer">
        <img src={Hanger} alt="hanger" className="wishlistHanger" />
      </div>

      <TextField
        className="addListTitle"
        label="New list"
        value={listTitle}
        onChange={(e) => setListTitle(e.target.value)}
      />

      <p className="wishlistSuggestionHeading">Suggestions </p>
      <div className="wishlistSuggestionContainer">
        <div className="wishlistSuggestionItem">
          <p className="wishlistSuggestionItemText small">Summer 2024</p>
        </div>
        <div className="wishlistSuggestionItem">
          <p className="wishlistSuggestionItemText small">Emma's birthday</p>
        </div>
        <div className="wishlistSuggestionItem">
          <p className="wishlistSuggestionItemText small">Ski holiday</p>
        </div>
      </div>

      <Button
        text="Create list"
        className="createlistButton"
        onClick={createList}
      />
    </section>
  );
}
