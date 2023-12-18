import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import Hanger from "../../assets/Hanger.webp";
import "./authentication.css";
import TextField from "@mui/material/TextField";

export default function Login() {
  // State variables for error message, authentication instance, email, and password
  const [errorMessage, setErrorMessage] = useState("");
  const auth = getAuth(); //  from firebase/auth package
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle user login
  function signIn(event) {
    event.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Successful login
        const user = userCredential.user;
        console.log(user); // test: logging the authenticated user
      })
      .catch((error) => {
        // Handling login errors
        let code = error.code; // saving error code in variable
        console.log(code);
        code = code.replaceAll("-", " "); // Formatting the error code for display
        code = code.replaceAll("auth/", "");
        setErrorMessage(code);
      });
  }
  return (
    <>
      <section className="page loginPage">
        <img
          src={Hanger}
          alt="Hanger"
          className="loginHanger"
          aria-hidden="true"
        />
        <h1 className="landingTitle">TinyTrends</h1>

        <form onSubmit={signIn} className="logInForm">
          <div className="loginInputContainer">
            <TextField
              id="email-address"
              className="loginInput"
              type="email"
              name="mail"
              placeholder="Type your mail"
              required
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="loginInputContainer">
            <TextField
              className="loginInput"
              id="password"
              type="password"
              name="password"
              placeholder="Type your password"
              required
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <p className="text-error">{errorMessage}</p>
          <button className="buttonForestGreen loginButton">Log in</button>
        </form>
        <div className="loginSignupLink">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="signUpLink">
              Sign Up
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
