import { useParams, useNavigate } from "react-router-dom";

export default function HomeDeclutter() {
  const { childId } = useParams();
  console.log("ChildId:", childId);
  const navigate = useNavigate();

  function handleDonateClick() {
    navigate(`/home-donate/${childId}`);
  }

  function handleSellClick() {
    navigate(`/home-sell/${childId}`);
  }

  function handleRecycleClick() {
    navigate(`/home-recycle/${childId}`);
  }

  return (
    <section className="page">
      <article onClick={handleDonateClick}>
        <h2>Donate</h2>
      </article>
      <article onClick={handleSellClick}>
        <h2>Sell</h2>
      </article>
      <article onClick={handleRecycleClick}>
        <h2>Recycle</h2>
      </article>
    </section>
  );
}
