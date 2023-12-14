import { useParams } from "react-router-dom";

export default function WishlistDetails() {
  const listId = useParams().listId;
  console.log("listId:", listId);

  return <div>HomeListDetails</div>;
}
