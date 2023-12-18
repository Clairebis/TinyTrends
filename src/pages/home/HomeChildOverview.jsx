import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { doc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import HeadingWithImage from "../../components/headingWithImage/HeadingWithImage";
import Wardrobe from "../../assets/Wardrobe.webp";
import Reuse from "../../assets/icons/Reuse.svg";
import Edit from "../../assets/icons/Edit.svg";

export default function HomeChildOverview() {
  const { childId } = useParams();
  console.log("ChildId:", childId);
  const navigate = useNavigate();
  const [childData, setChildData] = useState(null);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

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

  // Handler for navigating to the wardrobe page
  function handleWardrobeClick() {
    navigate(`/home-wardrobe/${childId}`);
  }

  // Handler for navigating to the declutter page
  function handleDeclutterClick() {
    navigate(`/home-declutter/${childId}`);
  }

  // Handler for navigating to the edit child page
  function handleEditClick() {
    navigate(`/edit-child/${childId}`);
  }

  return (
    <section className="page">
      {childData ? (
        <>
          <HeadingWithImage
            childImage={childData.image}
            pageTitle={childData.firstName}
          />
          <section className="childOverviewSection">
            <article
              onClick={handleWardrobeClick}
              onKeyDown={handleWardrobeClick}
              className="childOverviewArticleContainer childOverviewArticleContainerWardrobe"
            >
              <div
                className="childOverviewArticleImageContainer"
                aria-hidden="true"
              >
                <img
                  src={Wardrobe}
                  alt="Wardrobe"
                  className="childOverviewArticleImageWardrobe"
                />
              </div>
              <h2 className="childOverviewArticleHeading">
                Explore {childData.firstName}'s wardrobe
              </h2>
            </article>
            <article
              onClick={handleDeclutterClick}
              onKeyDown={handleDeclutterClick}
              className="childOverviewArticleContainer childOverviewArticleContainerDeclutter"
            >
              <div
                className="childOverviewArticleImageContainer"
                aria-hidden="true"
              >
                <img src={Reuse} alt="Reuse" className="reuseImage" />
              </div>
              <h2 className="childOverviewArticleHeading">Declutter</h2>
            </article>
            <article
              onClick={handleEditClick}
              onKeyDown={handleEditClick}
              className="childOverviewArticleContainer childOverviewArticleContainerEdit"
            >
              <div
                className="childOverviewArticleImageContainer"
                aria-hidden="true"
              >
                <img
                  src={childData.image}
                  alt="Edit"
                  className="childOverviewArticleImageEdit"
                />
                <img
                  src={Edit}
                  alt="Edit icon"
                  className="childOverviewArticleImageEditIcon"
                />
              </div>
              <h2 className="childOverviewArticleHeading">
                Edit {childData.firstName}'s details
              </h2>
            </article>
          </section>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </section>
  );
}
