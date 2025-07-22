import React, { useState } from "react";

const jobTitles = [
  "Software Engineer", "Data Scientist", "Software Engineer Manager", "Data Analyst",
  "Senior Project Engineer", "Product Manager", "Full Stack Engineer", "Marketing Manager",
  "Senior Software Engineer", "Back end Developer", "Front end Developer", "Marketing Coordinator",
  "Junior Sales Associate", "Financial Manager", "Marketing Analyst", "Software Developer",
  "Operations Manager", "Human Resources Manager", "Director of Marketing", "Web Developer",
  "Product Designer", "Research Director", "Content Marketing Manager", "Sales Associate",
  "Senior Product Marketing Manager", "Director of HR", "Research Scientist", "Marketing Director",
  "Sales Director", "Senior Data Scientist", "Junior HR Generalist", "Junior Software Developer",
  "Receptionist", "Director of Data Science", "Sales Manager", "Digital Marketing Manager",
  "Junior Marketing Manager", "Junior Software Engineer", "Human Resources Coordinator",
  "Senior Research Scientist", "Senior Human Resources Manager", "Junior Web Developer",
  "Senior HR Generalist", "Junior Sales Representative", "Financial Analyst", "Sales Representative",
  "Sales Executive", "Other"
];

const JobTitleSelect = ({ value, onChange }) => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredTitles = jobTitles.filter((title) =>
    title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (title) => {
    setQuery(title);
    onChange(title);
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
        placeholder="Type to search job title..."
        className="p-2 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      {showDropdown && query && (
        <ul className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow max-h-60 overflow-y-auto">
          {filteredTitles.length > 0 ? (
            filteredTitles.map((title, index) => (
              <li
                key={index}
                onClick={() => handleSelect(title)}
                className="p-2 hover:bg-indigo-100 cursor-pointer"
              >
                {title}
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

export default JobTitleSelect;
