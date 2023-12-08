import { /* useNavigate ,*/ useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../config/firebase";
import ItemCard from "../../../components/itemCard/ItemCard";

export default function HomeSell() {
  const { childId } = useParams();
  console.log("ChildId:", childId);
  //const navigate = useNavigate();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const [items, setItems] = useState([]);

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

      // Query where items are filtered by status "sell"
      const q = query(
        userChildItemsCollectionRef,
        where("status", "==", "sell"), // only retrieve items with status "sell"
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

  return (
    <section className="page">
      <section>
        {items.map((item) => (
          <ItemCard key={item.id} item={item} childId={childId} />
        ))}
      </section>
    </section>
  );
}
