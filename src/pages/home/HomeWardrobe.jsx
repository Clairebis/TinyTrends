import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  addDoc,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../config/firebase";
import HeadingWithImage from "../../components/headingWithImage/headingWithImage";
import allClothes from "../../assets/allClothes.webp";
import tops from "../../assets/tops.webp";
import bottoms from "../../assets/bottoms.webp";
import fullBody from "../../assets/fullBody.webp";
import outdoors from "../../assets/outdoors.webp";
import "./home.css";
import SearchBar from "../../components/searchBar/searchBar";
import AgeDropdown from "../../components/dropdowns/ageDropdown";
import plusIcon from "../../assets/icons/plusIcon.webp";
import ModalHeading from "../../components/modalHeading/ModalHeading";
import ItemForm from "../../components/itemForm/ItemForm";
import close from "../../assets/icons/close.svg";
import ItemCard from "../../components/itemCard/ItemCard";

export default function HomeWardrobe() {
  const auth = getAuth();
  // const navigate = useNavigate();
  const userId = auth.currentUser?.uid;
  const { childId } = useParams();
  console.log(childId);
  const [childData, setChildData] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [items, setItems] = useState([]);

  const modal = document.querySelector(".addItemModal");

  function openModal() {
    modal.style.display = "block";
  }

  function closeModal() {
    modal.style.display = "none";
  }

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

  // function to handle submit of the item form
  async function handleSubmit(newItem) {
    newItem.createdAt = serverTimestamp(); // timestamp (now)
    newItem.uid = auth.currentUser.uid; // uid of auth user / signed in user

    // Get a reference to the user's child's "items" subcollection
    const userChildItemsCollectionRef = collection(
      db,
      "users",
      auth.currentUser.uid,
      "children",
      childId,
      "items"
    );

    // Add the new item to the "items" subcollection
    const addedItemRef = await addDoc(userChildItemsCollectionRef, newItem);

    // Retrieve the auto-generated UID of the added item
    const addedItemUid = addedItemRef.id;

    console.log(addedItemUid);

    // Navigate to the child added success page
    // navigate(`/home-item-added/${childId}/${addedItemUid}`);
  }

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
      const q = query(
        userChildItemsCollectionRef,
        orderBy("createdAt", "desc")
      ); // order by: lastest child first
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
        unsubscribe(); // tell the post component to unsubscribe from listen on changes from firestore
      };
    }
  }, [auth.currentUser?.uid, childId]); // Make sure to include userId as a dependency if it's used inside the useEffect

  // Use child data to render the wardrobe for the correct child
  return (
    <section className="page">
      {childData ? (
        <>
          <HeadingWithImage
            childImage={childData.image}
            childFirstName={childData.firstName}
          />

          {/* Render the child's wardrobe items here */}
        </>
      ) : (
        <p>Loading...</p>
      )}

      <section className="wardrobeFilterOptions">
        <div className="wardrobeInputFilters">
          <div className="wardrobeSearchBar">
            <SearchBar
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
          </div>
          <div className="wardrobeAgeDropdown">
            <AgeDropdown />
          </div>
        </div>
        <div className="wardrobeSortOptions">
          <div className="wardrobeSortOption">
            <img
              src={allClothes}
              alt="show all items"
              className="wardrobeSortImage"
            />
            <p className="small">All</p>
          </div>
          <div className="wardrobeSortOption">
            <img src={tops} alt="show tops" className="wardrobeSortImage" />
            <p className="small">Tops</p>
          </div>
          <div className="wardrobeSortOption">
            <img
              src={bottoms}
              alt="show bottoms"
              className="wardrobeSortImage"
            />
            <p className="small">Bottoms</p>
          </div>
          <div className="wardrobeSortOption">
            <img
              src={fullBody}
              alt="show full body items"
              className="wardrobeSortImage"
            />
            <p className="small">Full Body</p>
          </div>
          <div className="wardrobeSortOption">
            <img
              src={outdoors}
              alt="show outdoor items"
              className="wardrobeSortImage"
            />
            <p className="small">Outdoors</p>
          </div>
        </div>

        <section>
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </section>
      </section>
      <img
        className="HomePlusIcon"
        src={plusIcon}
        alt="plus button to add a child"
        onClick={openModal}
      />
      {/*modal to add an item*/}
      <div className="addItemModal">
        <div className="addChildModalContent">
          <div className="closeModal">
            <img src={close} alt="" onClick={closeModal} />
          </div>
          <ModalHeading text="Add an item" />
          <ItemForm saveItem={handleSubmit} />
        </div>
      </div>
    </section>
  );
}
