import { FaSearch } from "react-icons/fa";

import "./searchbar.css";

export const Searchbar = (): JSX.Element => {
  return (
    <div className="searchbar">
      <FaSearch />
      <input
        type="text"
        placeholder="Search"
        className="searchbar-input"
      ></input>
    </div>
  );
};
