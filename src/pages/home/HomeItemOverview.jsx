import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { getAuth } from "firebase/auth";
import Button from "../../components/button/button";
import HomeItemEdit from "./HomeItemEdit";

export default function HomeItemOverview() {
  const auth = getAuth();
  const { itemId, childId } = useParams();
  const [itemData, setItemData] = useState(null);
  const userId = auth.currentUser?.uid;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        console.log("Item ID from URL:", itemId);
        console.log("Child ID from URL:", childId);

        //Reference to the user document
        const userDocRef = doc(db, "users", userId);

        //Reference to the children subcollection
        const childrenCollectionRef = collection(userDocRef, "children");

        //Reference to the child document
        const childDocRef = doc(childrenCollectionRef, childId);

        //Reference to the items subcollection
        const itemsCollectionRef = collection(childDocRef, "items");

        //Query to get the item document based on documentId
        const itemQuery = query(
          itemsCollectionRef,
          where("__name__", "==", itemId)
        );

        //Fetch the data of the item document
        const itemSnapshot = await getDocs(itemQuery);

        //Log the item snapshot
        console.log(
          "Item Snapshot:",
          itemSnapshot.docs.map((doc) => doc.data())
        );

        // Check if there are documents in the snapshot
        if (itemSnapshot.docs.length > 0) {
          // Get the first document and set the child data state with its data
          setItemData(itemSnapshot.docs[0].data());
        } else {
          console.log("Item not found");
        }
      } catch (error) {
        console.error("Error fetching item data", error.message);
      }
    };

    // Call the fetchItemDetails function
    fetchItemData();
  }, [itemId, userId, childId]);

  async function deleteItem(childId, itemId, event) {
    event.preventDefault(); // Prevent the default buttonLink behaviour
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    ); // Ask the user to confirm the deletion
    if (confirmDelete && userId && childId && itemId) {
      try {
        const docRef = doc(
          db,
          "users",
          userId,
          "children",
          childId,
          "items",
          itemId
        ); // Reference to the item document
        await deleteDoc(docRef); // Delete the item document
        navigate(`/home-wardrobe/${childId}`); // Navigate to the home page
      } catch (error) {
        console.error("Error deleting item", error.message);
      }
    }
  }

  async function handleOptionClick(option) {
    if (auth.currentUser?.uid) {
      try {
        console.log("Option:", option);
        // Get a reference to the user's child's "items" subcollection
        const userChildItemsCollectionRef = collection(
          db,
          "users",
          auth.currentUser.uid,
          "children",
          childId,
          "items"
        );
        // Create a document reference for the specific item based on itemId
        const docRef = doc(userChildItemsCollectionRef, itemId);

        // Update the item status in the Firestore database using the docRef and status option
        await updateDoc(docRef, { status: option });

        // Update the itemData state with the new status
        setItemData((prevItemData) => ({
          ...prevItemData,
          status: option,
        }));
      } catch (error) {
        console.error("Error updating item status", error.message);
      }
    }
  }

  return (
    <section className="page">
      {itemData ? (
        <>
          <div>
            <h2>{itemData.caption}</h2>
          </div>
          <div className="itemOverviewImageContainer">
            <img
              className="itemOverviewImage"
              src={itemData.image}
              alt={itemData.caption}
            />
            <div className="itemOptionsContainer">
              <button
                className="itemOverviewButton"
                onClick={() => handleOptionClick("donate")}
              >
                Donate
              </button>

              <button
                className="itemOverviewButton"
                onClick={() => handleOptionClick("sell")}
              >
                Sell
              </button>
              <button
                className="itemOverviewButton"
                onClick={() => handleOptionClick("recycle")}
              >
                Recycle
              </button>
            </div>
          </div>

          <div className="itemOverviewButtons">
            <button
              className="buttonSecondary itemOverviewButton deleteItemButton"
              onClick={(event) => deleteItem(childId, itemId, event)}
            >
              Delete item
            </button>

            <Button
              text="Edit item"
              link={`/home-item-edit/${childId}/${itemId}`}
              className="itemOverviewButton"
            >
              <HomeItemEdit itemData={itemData} />
            </Button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </section>
  );
}
