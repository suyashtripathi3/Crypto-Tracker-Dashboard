import { useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import debounce from "lodash.debounce";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        onSearch(value);
      }, 300), // 300ms delay
    [onSearch]
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="relative w-72 md:w-96">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          className="input input-bordered bg-gray-900/80 text-gray-100 border-gray-700 pl-10 w-full focus:border-yellow-400 focus:outline-none transition duration-300 placeholder-gray-500"
          type="text"
          placeholder="Search cryptocurrency..."
          value={query}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
