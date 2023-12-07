import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import { getAuth } from "firebase/auth";
import Button from "../../components/button/button";

export default function HomeItemOverview() {
  const auth = getAuth();
  const { itemId, childId } = useParams();
  const [itemData, setItemData] = useState(null);
  const userId = auth.currentUser?.uid;

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

  return (
    <section className="page">
      {itemData ? (
        <>
          <div>
            <h2>{itemData.caption}</h2>
          </div>
          <div className="itemOverviewButtons">
            <Button
              className="buttonSecondary itemOverviewButton"
              text="Delete item"
              link="/"
            ></Button>
            <Button
              text="Edit item"
              link="/"
              className="itemOverviewButton"
            ></Button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </section>
  );
}
