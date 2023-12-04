import "./App.css";

import CategoryDropdown from "./components/dropdowns/CategoryDropdown";
import AgeDropdown from "./components/dropdowns/ageDropdown";

function App() {
  return (
    <>
      <h1>The project</h1>
      <AgeDropdown />
      <CategoryDropdown />
    </>
  );
}

export default App;
