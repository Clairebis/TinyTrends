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
import ArrowBack from "../../assets/icons/ArrowBack.svg";

export default function EditChild() {
  const auth = getAuth();

  // Getting childId from the URL parameters and initializing state variables
  const { childId } = useParams();
  const [child, setChild] = useState(null);
  const userId = auth.currentUser?.uid;
  const navigate = useNavigate();
  console.log("UserId:", userId);

  // useEffect hook to fetch the child data based on childId
  useEffect(() => {
    async function getChild() {
      if (auth.currentUser?.uid) {
        try {
          if (auth.currentUser?.uid) {
            console.log("User ID:", auth.currentUser.uid);
            // Reference to the user's children subcollection
            const userChildrenCollectionRef = collection(
              db,
              "users",
              auth.currentUser.uid,
              "children"
            );
            // Document reference for the specific child based on childId
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

  // Function to delete a child based on childId
  async function deleteChild(childId, event) {
    event.preventDefault(); // Prevent the default buttonLink behaviour
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${child.firstName}’s profile and all the information connected with it?`
    ); // Ask the user to confirm the deletion
    if (confirmDelete && userId && childId) {
      try {
        // Document reference to the child document
        const docRef = doc(db, "users", userId, "children", childId); // Reference to the child document
        await deleteDoc(docRef); // Delete the item document
        navigate(`/child-deleted`); // Navigate to the home page
      } catch (error) {
        console.error("Error deleting child", error.message);
      }
    }
  }

  // Function to navigate back one page
  const goBack = () => {
    navigate(-1); // This will navigate one page back
  };

  return (
    <section className="page editChildPage">
      <div className="editChildHeader">
        <img
          src={ArrowBack}
          alt="back arrow"
          onClick={goBack}
          onKeyDown={goBack}
        />
        <h1>Edit Child</h1>
      </div>
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
