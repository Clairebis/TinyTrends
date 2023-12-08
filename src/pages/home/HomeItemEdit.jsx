import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { itemsRef } from "../../config/firebase";
import ItemForm from "../../components/itemForm/ItemForm";

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
    const docRef = doc(itemsRef, itemId); // create item ref based on itemId
    await updateDoc(docRef, itemToUpdate); // update item using the docRef and itemToUpdate object (coming from ItemForm)
    navigate("/");
  }

  return (
    <section className="page">
      <h1>Edit Item</h1>
      {item !== null ? (
        <ItemForm item={item} saveItem={handleSubmit} />
      ) : (
        <p>Loading...</p>
      )}
    </section>
  );
}
