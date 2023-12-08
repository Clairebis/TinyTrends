import "../pages/home/home.css";
import ChildForm from "../components/childForm/ChildForm";
import { getAuth } from "firebase/auth";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase";

export default function EditChild() {
  const auth = getAuth();
  const { childId } = useParams();
  const [child, setChild] = useState(null);
  const userId = auth.currentUser?.uid;
  const navigate = useNavigate();
  console.log("UserId:", userId);

  useEffect(() => {
    async function getChild() {
      if (auth.currentUser?.uid) {
        try {
          if (auth.currentUser?.uid) {
            console.log("User ID:", auth.currentUser.uid);
            const userChildrenCollectionRef = collection(
              db,
              "users",
              auth.currentUser.uid,
              "children"
            );
            // Get a reference to the specific child based on childId
            const childDocRef = doc(userChildrenCollectionRef, childId);

            // Retrieve the child document
            const childDoc = await getDoc(childDocRef);

            if (childDoc.exists()) {
              const childData = childDoc.data();
              setChild(childData);
            } else {
              console.log("Child document does not exist");
            }
          }
        } catch (error) {
          console.error("Error fetching child data", error.message);
        }
      }
    }

    getChild();
  }, [childId, auth.currentUser?.uid]); // called every time childId changes

  /**
   * handleSubmit updates an existing child based on a childId
   * handleSubmit is called by the ChildForm component
   */
  async function handleSubmit(childToUpdate) {
    if (auth.currentUser?.uid && childId) {
      try {
        // Get a reference to the user's children subcollection
        const userCollectionRef = collection(db, "users");
        const userDocRef = doc(userCollectionRef, auth.currentUser.uid);
        const userChildrenCollectionRef = collection(userDocRef, "children");

        // Create a document reference for the specific child based on childId
        const childDocRef = doc(userChildrenCollectionRef, childId);

        // Update the child using the docRef and childToUpdate object
        await updateDoc(childDocRef, childToUpdate);
        navigate(`/home-child-updated/${childId}`); // navigate to success page
      } catch (error) {
        console.error("Error updating child", error.message);
      }
    } else {
      console.log("Invalid user or childId");
    }
  }

  return (
    <section className="page">
      <h1>Edit Child</h1>
      {child !== null ? (
        <ChildForm saveChild={handleSubmit} child={child} />
      ) : (
        <p>Loading...</p>
      )}
    </section>
  );
}
