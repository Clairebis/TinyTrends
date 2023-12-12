import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import { doc, setDoc, collection, addDoc } from "@firebase/firestore";
import { usersRef } from "../../config/firebase";
import { db } from "../../config/firebase";

export default function Signup() {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const auth = getAuth();

  async function handleSignUp(event) {
    event.preventDefault();
    const mail = event.target.mail.value; // mail value from input field in sign in form
    const password = event.target.password.value; // password value from input field in sign in form

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        mail,
        password
      );
      const user = userCredential.user;

      // Create a reference to the user in Firestore
      const userDocRef = doc(usersRef, user.uid);

      // Set the user in Firestore with the values from input fields
      await setDoc(userDocRef, {
        name,
        mail,
        itemsDonated: 0,
        itemsSold: 0,
        itemsRecycled: 0,
        image: "",
      });

      // Create an empty "children" subcollection within the user document
      const childrenCollectionRef = collection(
        db,
        "users",
        user.uid,
        "children"
      );
      await addDoc(childrenCollectionRef, {}); // You can add any initial data if needed
    } catch (error) {
      let code = error.code;
      console.log(code);
      code = code.replaceAll("-", " ");
      code = code.replaceAll("auth/", "");
      setErrorMessage(code);
    }
  }

  return (
    <section className="page">
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          name="name"
          placeholder="Type your name"
        />
        <input
          type="email"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          name="mail"
          placeholder="Type your mail"
        />
        <input
          type="password"
          name="password"
          placeholder="Type your password"
        />
        <p className="text-error">{errorMessage}</p>
        <button>Sign Up</button>
      </form>
      <p className="text-center">
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </section>
  );
}
