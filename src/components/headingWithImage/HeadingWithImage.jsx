import ArrowBack from "../../assets/icons/ArrowBack.svg";
import "./headingWithImage.css";
import { useNavigate } from "react-router-dom";

export default function HeadingWithImage(props) {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // This will navigate one page back
  };

  return (
    <div className="headingWithImageHeading">
      <img
        src={ArrowBack}
        alt="Back Arrow"
        onClick={goBack}
        onKeyDown={goBack}
        className="backArrow"
      />
      <h1>{props.pageTitle}</h1>
      <img
        src={props.childImage}
        alt={`Image of ${props.childFirstName}`}
        className="smallImageChild"
      />
    </div>
  );
}
