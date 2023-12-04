import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <>
      <div>Landing</div>
      <Link to="/login">Log In</Link>
      <Link to="/signup">Sign Up</Link>
    </>
  );
}
