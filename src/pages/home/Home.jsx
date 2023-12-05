import Button from "../../components/button/button";
import AgeDropdown from "../../components/dropdowns/ageDropdown";
import CategoryDropdown from "../../components/dropdowns/CategoryDropdown";
import plusIcon from "../../assets/icons/plusIcon.webp";

export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <AgeDropdown />
      <CategoryDropdown />
      <Button text="Wishlist" link="/wishlist" />
      <Button className="buttonSecondary" text="Blog" link="/blog" />
      <img src={plusIcon} />
    </>
  );
}
