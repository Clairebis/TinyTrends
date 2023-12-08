import "../pages/home/home.css";
import ChildForm from "../components/childForm/ChildForm";
import { getAuth } from "firebase/auth";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, collection } from "firebase/firestore";
import { childrenRef } from "../config/firebase";
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
          const docRef = doc(childrenRef, childId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const docData = docSnap.data();
            if (docData && typeof docData === "object") {
              setChild(docData); // set child state with the data from the document
            } else {
              console.log("Invalid document data");
            }
          } else {
            console.log("Document does not exist");
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
      // Get a reference to the user's children subcollection
      const userChildrenCollectionRef = collection(
        db,
        "users",
        auth.currentUser.uid,
        "children"
      );
      // Create a document reference for the specific child based on childId
      const docRef = doc(userChildrenCollectionRef, childId);

      // Update the child using the docRef and childToUpdate object
      await updateDoc(docRef, childToUpdate);
      navigate(`/home-child-updated/${childId}`); // navigate to success page
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
