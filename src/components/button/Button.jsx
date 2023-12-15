import "./button.css";
import { Link } from "react-router-dom";

export default function Button(props) {
  return (
    <Link
      to={props.link}
      className={`buttonForestGreen ${props.className || "buttonForestGreen"}`}
      type={props.type}
      onClick={props.onClick}
      onKeyDown={props.onKeyDown}
    >
      {props.text || "Button"}
    </Link>
  );
}
