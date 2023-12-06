import { getAuth } from "firebase/auth";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../config/firebase";

export default function HomeWardrobe() {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const { childId } = useParams();
  console.log(childId);
  const [childData, setChildData] = useState(null);

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

  // Use child data to render the wardrobe for the correct child
  return (
    <section className="page">
      {childData ? (
        <>
          <h1>{childData.firstName}'s Wardrobe</h1>
          {/* Render the child's wardrobe items here */}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </section>
  );
}
