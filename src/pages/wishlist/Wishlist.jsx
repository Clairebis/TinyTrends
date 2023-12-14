import ListBear from "../../assets/ListBear.webp";
import Button from "../../components/button/Button";
import "./wishlist.css";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../../config/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import ListCard from "../../components/listCard/ListCard";

export default function Wishlist() {
  const auth = getAuth();
  const [lists, setLists] = useState([]); // empty array for lists

  useEffect(() => {
    //console.log("ListsRef:", ListsRef(auth.currentUser?.uid));
    // Get a reference to the user's "lists" subcollection
    if (auth.currentUser?.uid) {
      console.log("User ID:", auth.currentUser.uid);
      const userListsCollectionRef = collection(
        db,
        "users",
        auth.currentUser.uid,
        "lists"
      );
      const q = query(userListsCollectionRef, orderBy("createdAt", "desc")); // order by: lastest list first
      const unsubscribe = onSnapshot(q, (data) => {
        // map through all docs (object) from lists collection
        // changing the data structure so it's all gathered in one object
        const listsData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLists(listsData);
      });
      return () => {
        unsubscribe(); // tell the post component to unsubscribe from listen on changes from firestore
      };
    }
  }, [auth.currentUser?.uid]); // Make sure to include userId as a dependency if it's used inside the useEffect
  return (
    <section className="page">
      <div className="wishlistContentContainer">
        <h1>My Lists</h1>
      </div>

      <section className="listCardsContainer">
        {lists.length > 0 ? (
          lists.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              addedListUid={list.addedListUid}
            />
          ))
        ) : (
          <>
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
          </>
        )}
      </section>

      <Button
        text="+ NEW LIST"
        className="wishlistAddButton"
        link="/wishlist-add-list"
      />
    </section>
  );
}
