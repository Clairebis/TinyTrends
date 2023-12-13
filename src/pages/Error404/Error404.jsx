import wool from "../../assets/wool.webp";
import "./error404.css";
import Button from "../../components/button/Button";

export default function Error404() {
  return (
    <section className="page error404Page">
      <h1 className="errorHeading">TinyTrends</h1>
      <div className="errorImageContainer">
        <img src={wool} alt="wool" />
      </div>
      <p>
        Uh-oh! Lost in the threads. Let's stitch you back to the right page!
      </p>
      <Button text="Home" link="/" className="errorButton" />
    </section>
  );
}
