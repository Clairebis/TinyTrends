import "./SearchBar.css";

export default function SearchBar({ searchValue, setSearchValue }) {
  return (
    <div className="searchBar">
      <input
        className="searchBarInput"
        type="text"
        placeholder="Search wardrobe"
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value.toLowerCase())}
      />
    </div>
  );
}
