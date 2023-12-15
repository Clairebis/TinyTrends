import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { getAuth } from "firebase/auth";
import Button from "../../components/button/Button";
import HomeItemEdit from "./HomeItemEdit";
import Info from "../../assets/icons/Info.svg";
import close from "../../assets/icons/close.svg";
import ModalHeading from "../../components/modalHeading/ModalHeading";
import "./home.css";
import HeadingWithImage from "../../components/headingWithImage/HeadingWithImage";
import DonateSmall from "../../assets/icons/DonateSmall.svg";
import ShopSmall from "../../assets/icons/ShopSmall.svg";
import RecycleSmall from "../../assets/icons/RecycleSmall.svg";
import Bear from "../../assets/Bear.webp";

export default function HomeItemOverview() {
  const auth = getAuth();
  const { itemId, childId } = useParams();
  const [itemData, setItemData] = useState(null);
  const [childData, setChildData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null); // ["donate", "sell", "recycle"]
  console.log("Selected option:", selectedOption || "none");
  const userId = auth.currentUser?.uid;
  const navigate = useNavigate();

  // Get a reference to the modal for adding an item
  const modal = document.querySelector(".infoModal");

  // Function to open the modal
  function openModal() {
    modal.style.display = "block";
  }

  // Function to close the modal
  function closeModal() {
    modal.style.display = "none";
  }

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        console.log("Item ID from URL:", itemId);
        console.log("Child ID from URL:", childId);

        //Reference to the user document
        const userDocRef = doc(db, "users", userId);

        //Reference to the children subcollection
        const childrenCollectionRef = collection(userDocRef, "children");

        //Reference to the child document
        const childDocRef = doc(childrenCollectionRef, childId);

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
          return; // Exit the function early if the child is not found
        }
        //Reference to the items subcollection
        const itemsCollectionRef = collection(childDocRef, "items");

        //Query to get the item document based on documentId
        const itemQuery = query(
          itemsCollectionRef,
          where("__name__", "==", itemId)
        );

        //Fetch the data of the item document
        const itemSnapshot = await getDocs(itemQuery);

        //Log the item snapshot
        console.log(
          "Item Snapshot:",
          itemSnapshot.docs.map((doc) => doc.data())
        );

        // Check if there are documents in the snapshot
        if (itemSnapshot.docs.length > 0) {
          // Get the first document and set the child data state with its data
          setItemData(itemSnapshot.docs[0].data());
        } else {
          console.log("Item not found");
        }
      } catch (error) {
        console.error("Error fetching item data", error.message);
      }
    };

    // Call the fetchItemDetails function
    fetchItemData();
  }, [itemId, userId, childId]);

  async function deleteItem(childId, itemId, event) {
    event.preventDefault(); // Prevent the default buttonLink behaviour
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    ); // Ask the user to confirm the deletion
    if (confirmDelete && userId && childId && itemId) {
      try {
        const docRef = doc(
          db,
          "users",
          userId,
          "children",
          childId,
          "items",
          itemId
        ); // Reference to the item document
        await deleteDoc(docRef); // Delete the item document
        navigate(`/home-item-deleted/${childId}`); // Navigate to the home page
      } catch (error) {
        console.error("Error deleting item", error.message);
      }
    }
  }

  async function handleOptionClick(option) {
    if (auth.currentUser?.uid) {
      try {
        console.log("Option:", option);

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

        let newOption;

        // If the selected option is the same as the clicked option, set the new option to an empty string (deselect)
        if (itemData && itemData.status === option) {
          newOption = ""; // Deselect the option
        } else {
          newOption = option; // Select the option
        }

        // Update the item status in the Firestore database using the docRef and status option
        await updateDoc(docRef, { status: newOption });

        // Update the itemData state with the new status
        setItemData((prevItemData) => ({
          ...prevItemData,
          status: newOption,
        }));

        // Update the selected option in the state
        setSelectedOption(option);

        // Toggle the color of the SVG icon based on the selected option
        toggleSVGColor(newOption);
      } catch (error) {
        console.error("Error updating item status", error.message);
      }
    }
  }

  // Function to toggle the color of the SVG path based on the selected option
  function toggleSVGColor(option) {
    const svgPathId = getSvgIconId(option);
    const svgPath = document.getElementById(svgPathId);

    // Define the colors for selected and not selected states
    const selectedColor = "var(--white) !important";
    const notSelectedColor = "var(--forestGreen)";

    // Toggle the color based on the current color
    if (svgPath) {
      const currentColor = svgPath.getAttribute("fill") || notSelectedColor;
      svgPath.setAttribute(
        "fill",
        currentColor === notSelectedColor ? selectedColor : notSelectedColor
      );
    }
  }

  // Helper function to get the SVG icon ID based on the selected option
  function getSvgIconId(option) {
    switch (option) {
      case "donate":
        return "donateIcon";
      case "sell":
        return "sellIcon";
      case "recycle":
        return "recycleIcon";
      default:
        console.error("Unexpected option:", option);
        return null;
    }
  }

  return (
    <section className="page">
      {childData ? (
        <>
          <HeadingWithImage
            childImage={childData.image}
            childFirstName={childData.firstName}
          />

          {itemData ? (
            <>
              <section className="itemOverviewContent">
                <div>
                  <h2 className="itemOverviewHeading">{itemData.caption}</h2>
                </div>
                <div className="itemOverviewImageContainer">
                  <div
                    className="infoContainer"
                    onClick={openModal}
                    onKeyDown={openModal}
                  >
                    <img className="infoIcon" src={Info} alt="info icon" />
                  </div>
                  <img
                    className="itemOverviewImage"
                    src={itemData.image}
                    alt={itemData.caption}
                  />
                  <div className="itemOptionsContainer">
                    <button
                      className={`itemOptionButton ${
                        itemData.status === "donate" ? "selected" : ""
                      }`}
                      onClick={() => handleOptionClick("donate")}
                      onKeyDown={() => handleOptionClick("donate")}
                    >
                      <img
                        src={DonateSmall}
                        alt="donate icon"
                        id="donateIcon"
                      />
                      Donate
                    </button>

                    <button
                      className={`itemOptionButton ${
                        itemData.status === "sell" ? "selected" : ""
                      }`}
                      onClick={() => handleOptionClick("sell")}
                      onKeyDown={() => handleOptionClick("sell")}
                    >
                      <img src={ShopSmall} alt="sell icon" id="sellIcon" />
                      Sell
                    </button>
                    <button
                      className={`itemOptionButton ${
                        itemData.status === "recycle" ? "selected" : ""
                      }`}
                      onClick={() => handleOptionClick("recycle")}
                      onKeyDown={() => handleOptionClick("recycle")}
                    >
                      <img
                        src={RecycleSmall}
                        alt="recycle icon"
                        id="recycleIcon"
                      />
                      Recycle
                    </button>
                  </div>
                </div>
              </section>

              <section className="itemOverviewDetails">
                <div className="itemOverviewInfoContainer">
                  <p className="itemOverviewInfoHeading">Brand:</p>
                  <p>{itemData.brand}</p>
                </div>

                <div className="itemOverviewInfoContainer">
                  <p className="itemOverviewInfoHeading">Size:</p>
                  <p>{itemData.size}</p>
                </div>

                <div className="itemOverviewInfoContainer">
                  <p className="itemOverviewInfoHeading">Category:</p>
                  <p>{itemData.category}</p>
                </div>
              </section>

              <div className="itemOverviewButtons">
                <button
                  className="buttonSecondary itemOverviewButton deleteItemButton"
                  onClick={(event) => deleteItem(childId, itemId, event)}
                  onKeyDown={(event) => deleteItem(childId, itemId, event)}
                >
                  Delete item
                </button>

                <Button
                  text="Edit item"
                  link={`/home-item-edit/${childId}/${itemId}`}
                  className="itemOverviewButton"
                >
                  <HomeItemEdit itemData={itemData} />
                </Button>
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}

          {/*info modal*/}
          <div className="infoModal">
            <div className="addChildModalContent">
              <div className="closeModal">
                <img
                  src={close}
                  alt="close icon"
                  onClick={closeModal}
                  onKeyDown={closeModal}
                  aria-label="close information pop-up"
                />
              </div>
              <ModalHeading
                text="Choose the next chapter for your child's old clothes"
                className="infoHeading"
              />
              <div className="infoIntro">
                <div className="infoImageContainer" aria-hidden="true">
                  <img
                    src={Bear}
                    alt="illustration of a bear"
                    className="infoImage"
                  />
                </div>
                <p className="infoIntroText">
                  If your child has outgrown this item, mark it to donate, sell,
                  or recycle to track items and contribute to circular fashion.
                </p>
              </div>
              <section className="infoOptions">
                <p>Choose an option for this item:</p>
                <ul>
                  <li>
                    Donate: Give this item a new life by donating it to those in
                    need.
                  </li>
                  <br />
                  <li>Sell: Earn some extra income by selling this item.</li>
                  <br />
                  <li>
                    Recycle: Responsibly recycle this item, and contribute to a
                    more sustainable lifestyle.
                  </li>
                </ul>
                <p>
                  Your choice makes a positive impact. Thanks for being part of
                  the circular fashion movement!
                </p>
              </section>
              <p className="infoTip">
                Tip: When an item is selected, it's added to your child’s
                <span className="infoColour">“declutter”</span>
                collection. Visit later to view marked items and learn how to
                reuse them and track your progress.
              </p>
              <Button
                text="Back to the wardrobe"
                link={`/home-wardrobe/${childId}`}
                className="infoButton"
              ></Button>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </section>
  );
}
