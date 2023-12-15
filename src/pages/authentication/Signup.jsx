import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import { doc, setDoc, collection, addDoc } from "@firebase/firestore";
import { usersRef } from "../../config/firebase";
import { db } from "../../config/firebase";
import "./authentication.css";
import TextField from "@mui/material/TextField";
import Hanger from "../../assets/Hanger.webp";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // password state
  const [errorMessage, setErrorMessage] = useState("");

  const auth = getAuth();

  async function handleSignUp(event) {
    event.preventDefault();
    const email = event.target.email.value; // mail value from input field in sign in form
    const password = event.target.password.value; // password value from input field in sign in form

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create a reference to the user in Firestore
      const userDocRef = doc(usersRef, user.uid);

      // Set the user in Firestore with the values from input fields
      await setDoc(userDocRef, {
        name,
        email,
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

      // Create an empty "lists" subcollection within the user document
      const listsCollectionRef = collection(db, "users", user.uid, "lists");

      await addDoc(listsCollectionRef, {}); // You can add any initial data if needed
    } catch (error) {
      let code = error.code;
      console.log(code);
      code = code.replaceAll("-", " ");
      code = code.replaceAll("auth/", "");
      setErrorMessage(code);
    }
  }

  return (
    <section className="page signupPage">
      <img
        src={Hanger}
        alt="Hanger"
        className="loginHanger"
        aria-hidden="true"
      />
      <h1 className="landingTitle">TinyTrends</h1>
      <form onSubmit={handleSignUp} className="signupForm">
        <div className="loginInputContainer">
          <TextField
            className="loginInput"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            placeholder="Type your name"
            required
          />
        </div>

        <div className="loginInputContainer">
          <TextField
            className="loginInput"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            placeholder="Type your mail"
            required
          />
        </div>

        <div className="loginInputContainer">
          <TextField
            className="loginInput"
            type="password"
            name="password"
            placeholder="Type your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <p className="text-error">{errorMessage}</p>
        <button className="signupButton buttonForestGreen">Sign Up</button>
      </form>

      <div className="loginSignupLink">
        <p>
          Already have an account?{" "}
          <Link to="/login" className="signUpLink">
            Log In
          </Link>
        </p>
      </div>
    </section>
  );
}
