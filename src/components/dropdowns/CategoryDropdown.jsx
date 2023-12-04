import { useState } from "react";

export default function CategoryDropdown() {
  const [selectedCategory, setSelectedCategory] = useState(""); // state to manage the selected option

  const handleChange = (event) => {
    setSelectedCategory(event.target.value); // update the state with the selected option
  };
  return (
    <div>
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
