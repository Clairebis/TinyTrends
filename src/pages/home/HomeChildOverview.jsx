import { useParams } from "react-router-dom";

export default function HomeChildOverview() {
  const { childId } = useParams();
  console.log(childId);

  return <div>HomeChildOverview</div>;
}
