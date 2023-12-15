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
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import HeadingWithImage from "../../components/headingWithImage/HeadingWithImage";
import allClothes from "../../assets/allClothes.webp";
import tops from "../../assets/tops.webp";
import bottoms from "../../assets/bottoms.webp";
import fullBody from "../../assets/fullBody.webp";
import outdoors from "../../assets/outdoors.webp";
import "./home.css";
import SearchBar from "../../components/searchBar/SearchBar";
import SizeDropdown from "../../components/dropdowns/SizeDropdown";
import plusIcon from "../../assets/icons/plusIcon.webp";
import ModalHeading from "../../components/modalHeading/ModalHeading";
import ItemForm from "../../components/itemForm/ItemForm";
import close from "../../assets/icons/close.svg";
import ItemCard from "../../components/itemCard/ItemCard";

export default function HomeWardrobe() {
  // Initialize authentication and navigation functions
  const auth = getAuth();
  const navigate = useNavigate();

  // Get the current user's ID
  const userId = auth.currentUser?.uid;

  // Get the childId from the URL parameters
  const { childId } = useParams();
  console.log(childId);

  // Initialize state variables for child data and items
  const [childData, setChildData] = useState(null);
  const [items, setItems] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const [selectedSize, setSelectedSize] = useState("");
  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (value) => {
    setSearchValue(value.toLowerCase()); // Convert the search term to lowercase for case-insensitive matching
  };

  const filteredItemsBySizeAndCategoryAndSearch = items.filter((item) => {
    console.log("Item:", item);
    console.log("Selected Size:", selectedSize);
    console.log("Selected Category:", selectedCategory);

    const sizeCondition = selectedSize === "" || item.size === selectedSize;
    const categoryCondition =
      selectedCategory === "all" || item.category === selectedCategory;
    const searchCondition =
      !searchValue ||
      item.caption.toLowerCase().includes(searchValue) ||
      item.brand.toLowerCase().includes(searchValue) ||
      item.category.toLowerCase().includes(searchValue) ||
      item.size.toLowerCase().includes(searchValue);

    console.log("Size Condition:", sizeCondition);
    console.log("Category Condition:", categoryCondition);
    console.log("Search Condition:", searchCondition);

    return sizeCondition && categoryCondition && searchCondition;
  });

  // Get a reference to the modal for adding an item
  const modal = document.querySelector(".addItemModal");

  // Function to open the modal
  function openModal() {
    modal.style.display = "block";
  }

  // Function to close the modal
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
    if (auth.currentUser?.uid) {
      // Add timestamp and user ID to the new item
      newItem.createdAt = serverTimestamp();
      newItem.uid = auth.currentUser.uid;

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
      navigate(`/home-item-added/${childId}`);
    }
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
        unsubscribe(); // tell the component to unsubscribe from listen on changes from firestore
      };
    }
  }, [auth.currentUser?.uid, childId]); // Dependancies

  // Use child data to render the wardrobe for the correct child
  return (
    <section className="page">
      {childData ? (
        <>
          <HeadingWithImage
            childImage={childData.image}
            childFirstName={childData.firstName}
            pageTitle="Wardrobe"
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
              onSearchChange={handleSearchChange}
              placeholder={"Search wardrobe"}
            />
          </div>
          <div className="wardrobeAgeDropdown">
            <SizeDropdown onSizeChange={handleSizeClick} hideLabel={true} />
          </div>
        </div>
        <div className="wardrobeSortOptions">
          <div
            className="wardrobeSortOption"
            onClick={() => handleCategoryClick("all")}
            style={{
              fontWeight:
                selectedCategory === "all"
                  ? "var(--fontWeightBold)"
                  : "var(--fontWeightRegular))",
            }}
          >
            <img
              src={allClothes}
              alt="show all items"
              className="wardrobeSortImage"
            />
            <p className="small">All</p>
          </div>
          <div
            className="wardrobeSortOption"
            onClick={() => handleCategoryClick("Tops")}
          >
            <img src={tops} alt="show tops" className="wardrobeSortImage" />
            <p className="small">Tops</p>
          </div>
          <div
            className="wardrobeSortOption"
            onClick={() => handleCategoryClick("Bottoms")}
          >
            <img
              src={bottoms}
              alt="show bottoms"
              className="wardrobeSortImage"
            />
            <p className="small">Bottoms</p>
          </div>
          <div
            className="wardrobeSortOption"
            onClick={() => handleCategoryClick("Full body")}
          >
            <img
              src={fullBody}
              alt="show full body items"
              className="wardrobeSortImage"
            />
            <p className="small">Full Body</p>
          </div>
          <div
            className="wardrobeSortOption"
            onClick={() => handleCategoryClick("Outdoors")}
          >
            <img
              src={outdoors}
              alt="show outdoor items"
              className="wardrobeSortImage"
            />
            <p className="small">Outdoors</p>
          </div>
        </div>

        <section className="wardrobeItemsContainer">
          {filteredItemsBySizeAndCategoryAndSearch.length > 0 ? (
            filteredItemsBySizeAndCategoryAndSearch.map((item) => (
              <ItemCard key={item.id} item={item} childId={childId} />
            ))
          ) : (
            <p className="wardrobeNoItems">
              No items found for the selected age, category, or search term.
              <br /> If you haven't added any items yet, click the plus icon
              below to get started!
            </p>
          )}
        </section>
      </section>
      <img
        className="HomePlusIcon"
        src={plusIcon}
        alt="plus button to add an item of clothing"
        onClick={openModal}
        onKeyDown={openModal}
        aria-label="Add an item of clothing"
      />
      {/*modal to add an item*/}
      <div className="addItemModal">
        <div className="addChildModalContent">
          <div className="closeModal">
            <img
              src={close}
              alt="Close icon"
              onClick={closeModal}
              onKeyDown={closeModal}
              aria-label="Close pop-up"
            />
          </div>
          <ModalHeading text="Add an item" />
          <ItemForm saveItem={handleSubmit} />
        </div>
      </div>
    </section>
  );
}
