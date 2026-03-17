"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchBoxProps {
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
  onSearch: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = "Search...",
  value,
  setValue,
  onSearch,
}) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none"
      />

      <button
        onClick={onSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        <Search className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SearchBox;