import Button from "../../../components/button/Button";
import PartyPopper from "../../../assets/icons/PartyPopper.svg";

export default function HomeThanks() {
  return (
    <section className="page">
      <section className="thanksContent">
        <h1 className="thanksHeading">Thanks!</h1>

        <img
          src={PartyPopper}
          alt="Party Popper emoji"
          className="thanksPartyPopper"
        />
        <p className="thanksPara1">
          Your efforts have contributed to making fashion more sustainable!{" "}
        </p>
        <p className="thanksPara2">You’ve reached a total of </p>
        <p className="thanksPara3">10</p>
        <p className="thanksPara4">donated items</p>
        <Button text="Home" link={"/"} />
      </section>
    </section>
  );
}
