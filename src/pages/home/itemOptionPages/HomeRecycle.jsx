import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
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
import HeadingWithImage from "../../../components/headingWithImage/HeadingWithImage";

export default function HomeRecycle() {
  const { childId } = useParams();
  console.log("ChildId:", childId);
  const auth = getAuth();
  const navigate = useNavigate();
  const userId = auth.currentUser?.uid;
  const [childData, setChildData] = useState(null);
  const [items, setItems] = useState([]);

  //Fetch child data using childId from Firebase
  useEffect(() => {
    const fetchChildData = async () => {
      try {
        console.log("Child ID from URL:", childId);
        //Reference to the user document
        const userDocRef = doc(db, "users", userId);

        //Reference to the children subcollection
        const childrenCollectionRef = collection(userDocRef, "children");

        //Query to get the specific child document based on documentId
        const childQuery = query(
          childrenCollectionRef,
          where("__name__", "==", childId)
        );

        //Fetch the data of the specified child
        const childSnapshot = await getDocs(childQuery);

        //Log the child snapshot
        console.log(
          "Child Snapshot:",
          childSnapshot.docs.map((doc) => doc.data())
        );

        // Check if there are documents in the snapshot
        if (childSnapshot.docs.length > 0) {
          // Get the first document and set the child data state with its data
          setChildData(childSnapshot.docs[0].data());
        } else {
          console.log("Child not found");
        }
      } catch (error) {
        console.error("Error fetching child data", error.message);
      }
    };

    // Call the fetchChildData function
    fetchChildData();
  }, [childId, userId]);

  // Fetch all child's items from firestore
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

      // Query where items are filtered by status "recycle"
      const q = query(
        userChildItemsCollectionRef,
        where("status", "==", "recycle"), // only retrieve items with status "recycle"
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
      navigate("/home-thanks");
    } catch (error) {
      console.error("Error deleting selected items:", error.message);
    }
  };

  return (
    <section className="page">
      {childData ? (
        <>
          <HeadingWithImage
            childImage={childData.image}
            childFirstName={childData.firstName}
            pageTitle="Recycle"
          />
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
        </>
      ) : (
        <p>Loading...</p>
      )}
    </section>
  );
}
