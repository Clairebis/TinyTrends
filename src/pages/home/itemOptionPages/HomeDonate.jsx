import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../config/firebase";
import ItemCard from "../../../components/itemCard/ItemCard";
import SelectTick from "../../../assets/icons/SelectTick.svg";

export default function HomeDonate() {
  const { childId } = useParams();
  console.log("ChildId:", childId);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const [items, setItems] = useState([]);

  // Fetch all child's items from firestore marked as donate
  useEffect(() => {
    // Get a reference to the user's child's "items" subcollection
    if (auth.currentUser?.uid) {
      console.log("User ID:", auth.currentUser.uid);
      const userChildDocRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "children",
        childId
      );
      const userChildItemsCollectionRef = collection(userChildDocRef, "items");

      // Query where items are filtered by status "donate"
      const q = query(
        userChildItemsCollectionRef,
        where("status", "==", "donate"), // only retrieve items with status "donate"
        orderBy("createdAt", "desc")
      ); // order by: latest item first
      const unsubscribe = onSnapshot(q, (data) => {
        // map through all docs (object) from items collection
        // changing the data structure so it's all gathered in one object
        const itemsData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(itemsData);
      });
      return () => {
        unsubscribe(); // tell the component to unsubscribe from listen on changes from firestore
      };
    }
  }, [userId, childId, auth.currentUser?.uid]); // Dependancies

  // Function to handle item selection toggle
  const handleToggleStatus = async (itemId, currentSelected) => {
    try {
      const itemDocRef = doc(
        db,
        "users",
        userId,
        "children",
        childId,
        "items",
        itemId
      );

      // Toggle the item's selected between "selected" and "not selected"
      const newSelected =
        currentSelected === "selected" ? "not selected" : "selected";

      // Update the item's selected field in firestore
      await updateDoc(itemDocRef, {
        selected: newSelected,
      });
    } catch (error) {
      console.error("Error toggling item selected field:", error.message);
    }
  };

  // Function to handle selecting all items
  const handleSelectAll = async () => {
    try {
      // Iterate through the items and update the selected status
      const updatePromises = items.map(async (item) => {
        const itemDocRef = doc(
          db,
          "users",
          userId,
          "children",
          childId,
          "items",
          item.id
        );

        // Update the item's selected field in firestore
        // The updateDoc function, which interacts with Firestore, returns a promise.
        await updateDoc(itemDocRef, {
          selected: "selected",
        });
      });

      // Wait for all updates to complete
      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error selecting all items:", error.message);
    }
  };

  // Function to handle deleting all selected items
  const handleDeleteSelected = async () => {
    try {
      // Filter out only the selected items
      const selectedItems = items.filter(
        (item) => item.selected === "selected"
      );

      // Iterate through the selected items and delete them
      const deletePromises = selectedItems.map(async (item) => {
        const itemDocRef = doc(
          db,
          "users",
          userId,
          "children",
          childId,
          "items",
          item.id
        );

        // Delete the item from Firestore
        await deleteDoc(itemDocRef);
      });

      // Wait for all deletes to complete
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error deleting selected items:", error.message);
    }
  };

  return (
    <section className="page">
      <section>
        <div>
          <button onClick={handleSelectAll}>Select all</button>
          <button onClick={handleDeleteSelected}>Donated</button>
        </div>
        {items.map((item) => (
          <div key={item.id} className="itemContainer">
            <ItemCard item={item} childId={childId} />
            <div className="selectItemCheckmark">
              <img
                src={SelectTick}
                alt="Select Checkmark"
                className={`selectCheckmark ${
                  item.selected === "selected" ? "selected" : ""
                }`}
                onClick={() => handleToggleStatus(item.id, item.selected)}
              />
            </div>
          </div>
        ))}
      </section>
    </section>
  );
}
