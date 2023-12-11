import { useState } from "react";
import "./dropdown.css";

export default function SizeDropdown({ onSizeChange, hideLabel = false }) {
  const [selectedOption, setSelectedOption] = useState(""); // state to manage the selected option

  const handleChange = (event) => {
    setSelectedOption(event.target.value); // update the state with the selected option
    onSizeChange(event.target.value); // call the onSizeChange prop with the selected option (notify the parent component about the selected size)
  };
  return (
    <div className="dropDownWithLabel">
      {!hideLabel && <label htmlFor="size">Size:</label>}
      <select
        className="ageDropdown"
        value={selectedOption}
        onChange={handleChange}
      >
        <option value="">Select age</option>
        <option value="0 - 3 months">0 - 3 months</option>
        <option value="3 - 6 months">3 - 6 months</option>
        <option value="6 - 9 months">6 - 9 months</option>
        <option value="9 - 12 months">9 - 12 months</option>
        <option value="12 - 18 months">12 - 18 months</option>
        <option value="18 - 24 months">18 - 24 months</option>
        <option value="2 - 3 years">2 - 3 years</option>
        <option value="3 - 4 years">3 - 4 years</option>
        <option value="4 - 5 years">4 - 5 years</option>
        <option value="5 - 6 years">5 - 6 years</option>
        <option value="6 - 7 years">6 - 7 years</option>
        <option value="7 - 8 years">7 - 8 years</option>
      </select>
    </div>
  );
}
