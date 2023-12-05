import "./modalHeading.css";

export default function modalHeading(props) {
  return <h1 className="modalHeading">{props.text || "Heading"}</h1>;
}
