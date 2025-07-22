import React, { useState } from "react";

const educationLevels = [
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "High School"
];

const EducationSelect = ({ value, onChange }) => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredOptions = educationLevels.filter((level) =>
    level.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (level) => {
    setQuery(level);
    onChange(level);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full col-span-2">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder="Type to search education level..."
        className="p-2 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      {showDropdown && query && (
        <ul className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((level, index) => (
              <li
                key={index}
                onClick={() => handleSelect(level)}
                className="p-2 hover:bg-indigo-100 cursor-pointer"
              >
                {level}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">No matches found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default EducationSelect;
