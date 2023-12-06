import { useParams, useNavigate } from "react-router-dom";

export default function HomeChildOverview() {
  const { childId } = useParams();
  console.log("ChildId:", childId);
  const navigate = useNavigate();

  function handleWardrobeClick() {
    navigate(`/home-wardrobe/${childId}`);
  }

  function handleDeclutterClick() {
    navigate(`/home-declutter/${childId}`);
  }

  function handleEditClick() {
    navigate(`/edit-child/${childId}`);
  }

  return (
    <section className="page">
      <article onClick={handleWardrobeClick}>
        <h2>Explore wardrobe</h2>
      </article>
      <article onClick={handleDeclutterClick}>
        <h2>Declutter</h2>
      </article>
      <article onClick={handleEditClick}>
        <h2>Edit</h2>
      </article>
    </section>
  );
}
