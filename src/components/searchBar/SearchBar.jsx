import "./SearchBar.css";

export default function SearchBar({
  searchValue,
  setSearchValue,
  placeholder,
}) {
  return (
    <div className="searchBar" aria-label="search bar">
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
