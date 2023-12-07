import { useState } from "react";

export default function CategoryDropdown({ onCategoryChange }) {
  const [selectedCategory, setSelectedCategory] = useState(""); // state to manage the selected option

  const handleChange = (event) => {
    setSelectedCategory(event.target.value); // update the state with the selected option
    onCategoryChange(event.target.value); // call the onCategoryChange prop with the selected option (notify the parent component about the selected category)
  };
  return (
    <div className="dropDownWithLabel">
      <label htmlFor="category">Category:</label>
      <select
        className="categoryDropdown"
        value={selectedCategory}
        onChange={handleChange}
      >
        <option value="">Select category</option>
        <option value="Tops">Tops</option>
        <option value="Bottoms">Bottoms</option>
        <option value="Full body">Full body</option>
        <option value="Outdoor">Outdoor</option>
      </select>
    </div>
  );
}
