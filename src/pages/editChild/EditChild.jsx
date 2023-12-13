import "../../pages/home/home.css";
import ChildForm from "../../components/childForm/ChildForm";
import { getAuth } from "firebase/auth";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import "./editChild.css";

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

  async function deleteChild(childId, event) {
    event.preventDefault(); // Prevent the default buttonLink behaviour
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${child.firstName}’s profile and all the information connected with it?`
    ); // Ask the user to confirm the deletion
    if (confirmDelete && userId && childId) {
      try {
        const docRef = doc(db, "users", userId, "children", childId); // Reference to the child document
        await deleteDoc(docRef); // Delete the item document
        navigate(`/`); // Navigate to the home page
      } catch (error) {
        console.error("Error deleting child", error.message);
      }
    }
  }
  return (
    <section className="page editChildPage">
      <h1 className="editChildHeader">Edit Child</h1>
      {child !== null ? (
        <>
          <ChildForm saveChild={handleSubmit} child={child} />
          <button
            className="buttonSecondary  deleteChildButton"
            onClick={(event) => deleteChild(childId, event)}
          >
            <p className="deleteChildButtonText"> Delete child</p>
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </section>
  );
}
