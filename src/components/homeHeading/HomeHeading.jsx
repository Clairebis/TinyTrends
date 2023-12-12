import Logo from "../../assets/Logo.webp";
import "./homeHeading.css";

export default function HomeHeading() {
  return (
    <div className="homeHeadingContainer">
      <img className="homeLogo" src={Logo} alt="Logo" />
    </div>
  );
}
