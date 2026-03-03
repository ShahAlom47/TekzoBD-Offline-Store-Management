"use client";

import { useState } from "react";
import { GetAllProductParams, SortOptions } from "@/Interfaces/productInterface";

interface Props {
  onFilterChange: (filters: Partial<GetAllProductParams>) => void;
}

export default function ProductFilter({ onFilterChange }: Props) {
  const [filters, setFilters] = useState({
    searchTrim: "",
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
    stock: "",
  });

  const handleChange = (field: string, value: string) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleReset = () => {
    const resetData = {
      searchTrim: "",
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sort: "",
      stock: "",
    };
    setFilters(resetData);
    onFilterChange(resetData);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm space-y-4 mb-5">
      <div className="grid md:grid-cols-3 gap-4">

        {/* Search */}
        <input
          type="text"
          placeholder="Search product..."
          value={filters.searchTrim}
          onChange={(e) => handleChange("searchTrim", e.target.value)}
          className="border px-3 py-2 rounded-lg w-full"
        />

        {/* Category */}
        <input
          type="text"
          placeholder="Category ID"
          value={filters.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className="border px-3 py-2 rounded-lg w-full"
        />

      

        {/* Min Price */}
        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => handleChange("minPrice", e.target.value)}
          className="border px-3 py-2 rounded-lg w-full"
        />

        {/* Max Price */}
        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => handleChange("maxPrice", e.target.value)}
          className="border px-3 py-2 rounded-lg w-full"
        />

        {/* Stock */}
        <select
          value={filters.stock}
          onChange={(e) => handleChange("stock", e.target.value)}
          className="border px-3 py-2 rounded-lg w-full"
        >
          <option value="">All Stock</option>
          <option value="in-stock">In Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>

        {/* Sort */}
        <select
          value={filters.sort}
          onChange={(e) =>
            handleChange("sort", e.target.value as SortOptions)
          }
          className="border px-3 py-2 rounded-lg w-full"
        >
          <option value="">Sort</option>
          <option value="asc">Price Low → High</option>
          <option value="desc">Price High → Low</option>
          <option value="newest">Newest</option>
          <option value="popular">Popular</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleReset}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}