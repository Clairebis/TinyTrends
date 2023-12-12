import Button from "../../../components/button/Button";
import PartyPopper from "../../../assets/icons/PartyPopper.svg";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { useEffect, useState } from "react";

export default function HomeThanks() {
  const auth = getAuth();

  const [userData, setUserData] = useState("");

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
      });

      return () => {
        unsubscribe(); // tell the child component to unsubscribe from listen on changes from firestore
      };
    }
  }, [auth.currentUser?.uid]);

  return (
    <section className="page">
      <section className="thanksContent">
        <h1 className="thanksHeading">Thanks!</h1>

        <img
          src={PartyPopper}
          alt="Party Popper emoji"
          className="thanksPartyPopper"
        />
        <p className="thanksPara1">
          Your efforts have contributed to making fashion more sustainable!{" "}
        </p>
        <p className="thanksPara2">You’ve reached a total of </p>
        <p className="thanksPara3">{userData.itemsDonated}</p>
        <p className="thanksPara4">donated items</p>
        <Button text="Home" link={"/"} />
      </section>
    </section>
  );
}
