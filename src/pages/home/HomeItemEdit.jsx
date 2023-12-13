import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc, collection } from "firebase/firestore";
import { itemsRef } from "../../config/firebase";
import ItemForm from "../../components/itemForm/ItemForm";
import { db } from "../../config/firebase";
import "./home.css";
import ArrowBack from "../../assets/icons/ArrowBack.svg";

export default function HomeItemEdit() {
  const auth = getAuth();
  const { itemId, childId } = useParams();
  const [item, setItem] = useState(null);
  const userId = auth.currentUser?.uid;
  const navigate = useNavigate();
  console.log("UserId:", userId);

  useEffect(() => {
    async function getItem() {
      try {
        const docRef = doc(itemsRef(childId), itemId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const docData = docSnap.data();
          if (docData && typeof docData === "object") {
            setItem(docData); // set item state with the data from the document
          } else {
            console.log("Invalid document data");
          }
        } else {
          console.log("Document does not exist");
        }
      } catch (error) {
        console.error("Error fetching item data", error.message);
      }
    }

    getItem();
  }, [itemId, childId]); // called every time itemId changes

  /**
   * handleSubmit updates an existing item based on an itemId
   * handleSubmit is called by the ItemForm component
   */
  async function handleSubmit(itemToUpdate) {
    if (auth.currentUser?.uid) {
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

      // Update the item using the docRef and itemToUpdate object
      await updateDoc(docRef, itemToUpdate);
      navigate(`/home-item-updated/${childId}`); // navigate to success page
    }
  }

  return (
    <section className="page">
      <img
        src={ArrowBack}
        alt="Back"
        onClick={() => navigate(-1)}
        className="editItemArrowBack"
      />
      {item !== null ? (
        <ItemForm item={item} saveItem={handleSubmit} />
      ) : (
        <p>Loading...</p>
      )}
    </section>
  );
}
