import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import ChildCardHome from "../../components/childCardHome/ChildCardHome";
import ProfileBackground from "../../assets/ProfileBackground.webp";
import userImagePlaceholder from "../../assets/userImagePlaceholder.webp";
import Edit from "../../assets/icons/Edit.svg";

export default function ProfilePage() {
  const auth = getAuth();
  const navigate = useNavigate();
  const userId = auth.currentUser?.uid;
  const [userData, setUserData] = useState("");
  const [children, setChildren] = useState([]);

  useEffect(() => {
    //console.log("ChildrenRef:", childrenRef(auth.currentUser?.uid));
    // Get a reference to the user's "children" subcollection
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
            <section className="userProfileDetails">
              <div className="userProfileImageContainer">
                <img
                  src={userData.image || userImagePlaceholder}
                  alt="User Profile image"
                  className="userProfileImage"
                />
                <img src={Edit} alt="Edit" className="profileEditIcon" />
              </div>
              <h2>{userData.name}</h2>
            </section>
            <section className="userProfileStats">
              <p>Your contribution to sustainable fashion</p>
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
            <h2>My Children</h2>
            <section className="childCardsContainer">
              {children.map((child) => (
                <ChildCardHome key={child.id} child={child} />
              ))}
            </section>
          </section>
        </>
      ) : (
        navigate("/login")
      )}
    </>
  );
}
