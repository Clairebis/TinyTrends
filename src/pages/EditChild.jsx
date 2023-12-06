import "../pages/home/home.css";
import ChildForm from "../components/childForm/ChildForm";

export default function EditChild() {
  function handleSubmit(editChild) {
    console.log("New child:", editChild);
  }

  return (
    <section className="page">
      <h2>Edit Child</h2>
      <ChildForm saveChild={handleSubmit} />
    </section>
  );
}
