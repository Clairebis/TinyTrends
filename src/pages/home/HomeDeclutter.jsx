import { useParams, useNavigate } from "react-router-dom";
import HeadingWithImage from "../../components/headingWithImage/HeadingWithImage";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { doc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function HomeDeclutter() {
  const { childId } = useParams();
  console.log("ChildId:", childId);
  const navigate = useNavigate();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

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
  }, [childId, auth.currentUser?.uid, userId]);

  function handleDonateClick() {
    navigate(`/home-donate/${childId}`);
  }

  function handleSellClick() {
    navigate(`/home-sell/${childId}`);
  }

  function handleRecycleClick() {
    navigate(`/home-recycle/${childId}`);
  }

  return (
    <section className="page">
      {childData ? (
        <>
          <HeadingWithImage
            childImage={childData.image}
            childFirstName={childData.firstName}
            pageTitle="Declutter"
          />
        </>
      ) : (
        <p>Loading...</p>
      )}

      <article onClick={handleDonateClick}>
        <h2>Donate</h2>
      </article>
      <article onClick={handleSellClick}>
        <h2>Sell</h2>
      </article>
      <article onClick={handleRecycleClick}>
        <h2>Recycle</h2>
      </article>
    </section>
  );
}
