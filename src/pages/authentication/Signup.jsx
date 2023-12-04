import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import { doc, setDoc } from "@firebase/firestore";
import { usersRef } from "../../config/firebase";

export default function Signup() {
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const auth = getAuth();

  function handleSignUp(event) {
    event.preventDefault();
    const mail = event.target.mail.value; // mail value from input field in sign in form
    const password = event.target.password.value; // password value from input field in sign in form

    createUserWithEmailAndPassword(auth, mail, password)
      .then((userCredential) => {
        // Created and signed in
        const user = userCredential.user;
        const docRef = doc(usersRef, user.uid); // create reference to the user in firestore
        setDoc(docRef, { name }); // set the user in firestore with the values from values from input fields
      })
      .catch((error) => {
        let code = error.code; // saving error code in variable
        console.log(code);
        code = code.replaceAll("-", " "); //JS to display error message from console
        code = code.replaceAll("auth/", "");
        setErrorMessage(code);
      });
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
        <input type="email" name="mail" placeholder="Type your mail" />
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
