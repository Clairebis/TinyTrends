import "./SearchBar.css";

export default function SearchBar({
  searchValue,
  setSearchValue,
  placeholder,
}) {
  return (
    <div className="searchBar">
      <input
        className="searchBarInput"
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value.toLowerCase())}
      />
    </div>
  );
}
