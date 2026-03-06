
"use client";

import React from "react";
import { Search } from 'lucide-react';

interface SearchBoxProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = "Search...",
  value,
  onChange,
}) => {
  return (
    <div className="relative  flex-grow">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchBox;