import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [errorMessage, setErrorMessage] = useState("");
  const auth = getAuth(); // getAuth() is a function from firebase/auth package

  function signIn(event) {
    event.preventDefault();
    const mail = event.target.mail.value; // mail value from input field in sign in form
    const password = event.target.password.value; // password value from input field in sign in form

    signInWithEmailAndPassword(auth, mail, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user); // tes: logging the authenticated user
      })
      .catch((error) => {
        let code = error.code; // saving error code in variable
        console.log(code);
        code = code.replaceAll("-", " "); // some JS to display the error message from the console
        code = code.replaceAll("auth/", "");
        setErrorMessage(code);
      });
  }
  return (
    <section className="page">
      <h1>Log In</h1>
      <form onSubmit={signIn}>
        <input type="email" name="mail" placeholder="Type your mail" />
        <input
          type="password"
          name="password"
          placeholder="Type your password"
        />
        <p className="text-error">{errorMessage}</p>
        <button>Log in</button>
      </form>
      <p className="text-center">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </section>
  );
}
