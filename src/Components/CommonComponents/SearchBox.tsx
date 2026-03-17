"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchBoxProps {
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = "Search...",
  value,
  setValue
}) => {
  return (
    <div className="relative flex-grow">
      
      {/* Left icon যখন button নাই */}
      {!btn && (
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      )}

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          btn ? "pl-4 pr-12" : "pl-9 pr-4"
        }`}
      />

      {/* Right side button */}
      {btn && (
        <button
          onClick={() => onSearch?.(value)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          <Search className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBox;