import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import ChildCardHome from "../../components/childCardHome/ChildCardHome";
import ProfileBackground from "../../assets/ProfileBackground.webp";
import userImagePlaceholder from "../../assets/userImagePlaceholder.webp";
import Edit from "../../assets/icons/Edit.svg";
import "./profile.css";
import plusIcon from "../../assets/icons/plusIcon.webp";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import ArrowForward from "../../assets/icons/ArrowForward.svg";

export default function ProfilePage() {
  const auth = getAuth();
  const navigate = useNavigate();
  const userId = auth.currentUser?.uid;
  const [userData, setUserData] = useState({});
  const [children, setChildren] = useState([]);

  useEffect(() => {
    // Get a reference to the user and their "children" subcollection
    if (auth.currentUser?.uid) {
      console.log("User ID:", auth.currentUser.uid);

      const userDocRef = doc(db, "users", auth.currentUser.uid);

      const unsubscribe = onSnapshot(userDocRef, (userDoc) => {
        const userData = userDoc.exists()
          ? { id: userDoc.id, ...userDoc.data() }
          : null;
        setUserData(userData);

        const userChildrenCollectionRef = collection(userDocRef, "children");
        const q = query(
          userChildrenCollectionRef,
          orderBy("createdAt", "desc")
        ); // order by: lastest child first
        const childrenUnsubscribe = onSnapshot(q, (childrenData) => {
          // map through all docs (object) from children collection
          // changing the data structure so it's all gathered in one object
          const formattedChildrenData = childrenData.docs.map((childDoc) => ({
            id: childDoc.id,
            ...childDoc.data(),
          }));
          setChildren(formattedChildrenData);
        });

        return () => {
          childrenUnsubscribe(); // tell the child component to unsubscribe from listen on changes from firestore
        };
      });

      return () => {
        unsubscribe(); // tell the user component to unsubscribe from listen on changes from firestore
      };
    }
  }, [auth.currentUser?.uid]); // Make sure to include userId as a dependency if it's used inside the useEffect

  // Function to handle editing the user profile
  const handleEditProfile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        uploadImage(file);
      }
    };
    input.click();
  };

  // Function to upload the selected image
  const uploadImage = async (imageFile) => {
    if (imageFile) {
      const storage = getStorage();
      const storageRef = ref(storage, `users/${auth.currentUser.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          console.error("Error uploading image", error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            updateProfileImage(downloadURL);
          } catch (error) {
            console.error("Error getting download URL", error);
          }
        }
      );
    }
  };

  const updateProfileImage = async (downloadURL) => {
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    try {
      // Log the userDocRef to check its structure
      console.log("userDocRef:", userDocRef);

      // Check if the document exists before attempting to update
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        // Update the user's image in Firestore
        await updateDoc(userDocRef, {
          image: downloadURL,
        });
        console.log("User image updated successfully");
      } else {
        console.error("User document does not exist");
      }
    } catch (error) {
      console.error("Error updating user image", error);
    }
  };

  // Function to handle user logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out", error);
      });
  };

  return (
    <>
      {userId ? (
        <>
          <div className="profileBackgroundImageContainer">
            <img
              src={ProfileBackground}
              alt="Profile Background"
              className="profileBackgroundImage"
            />
          </div>

          <section className="page">
            <div className="profileOrder">
              <section className="userProfileDetails">
                <div
                  className="userProfileImageContainer"
                  onClick={handleEditProfile}
                  onKeyDown={handleEditProfile}
                >
                  <img
                    src={userData.image || userImagePlaceholder}
                    alt="User Profile image"
                    className="userProfileImage"
                  />
                  <img src={Edit} alt="Edit" className="profileEditIcon" />
                </div>
                <h2 className="userProfileName">{userData.name}</h2>

                <p className="userProfilePara">
                  Your contribution to sustainable fashion
                </p>
                <div className="userProfileStatsContainer">
                  <div className="userProfileStat">
                    <h2>{userData.itemsDonated}</h2>
                    <p className="small">DONATED</p>
                  </div>
                  <div className="userProfileStat">
                    <h2>{userData.itemsSold}</h2>
                    <p className="small">SOLD</p>
                  </div>
                  <div className="userProfileStat">
                    <h2>{userData.itemsRecycled}</h2>
                    <p className="small">RECYCLED</p>
                  </div>
                </div>
              </section>

              <section className="userProfileChildren">
                <div className="userProfileChildrenHeader">
                  <h2>My Children</h2>
                  <img src={plusIcon} alt="Add Child" className="profilePlus" />
                </div>
                <section className="childCardsContainer">
                  {children.map((child) => (
                    <ChildCardHome key={child.id} child={child} />
                  ))}
                </section>
              </section>

              <div
                className="settingsContainer"
                onClick={handleLogout}
                onKeyDown={handleLogout}
              >
                <h3 className="settingsHeader">
                  Settings <span className="settingsLogout">(Log out)</span>
                </h3>
                <img src={ArrowForward} alt="forward arrow" />
              </div>
            </div>
          </section>
        </>
      ) : (
        navigate("/login")
      )}
    </>
  );
}
