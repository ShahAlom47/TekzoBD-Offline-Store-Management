"use client";

import { useState } from "react";
import {
  GetAllProductParams,
  SortOptions,
} from "@/Interfaces/productInterface";
import { useCategories } from "@/hook/useCategory";
import CategorySelect from "../Categories/CategorySelect";

interface Props {
  onFilterChange: (filters: Partial<GetAllProductParams>) => void;
}

export default function ProductFilter({ onFilterChange }: Props) {

    const {categories}=useCategories();
  const [filters, setFilters] =
    useState<Partial<GetAllProductParams>>({
      searchTrim: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: undefined,
      stock: undefined,
    });

  const handleChange = (
    field: keyof GetAllProductParams,
    value: string
  ) => {
    const updated: Partial<GetAllProductParams> = {
      ...filters,
      [field]: value || undefined, // empty হলে undefined
    };

    setFilters(updated);
    onFilterChange(updated);
  };

  const handleReset = () => {
    const resetData: Partial<GetAllProductParams> = {};
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
          value={filters.searchTrim || ""}
          onChange={(e) =>
            handleChange("searchTrim", e.target.value)
          }
          className="border px-3 py-2 rounded-lg w-full"
        />

        {/* Category */}
        {/* <input
          type="text"
          placeholder="Category ID"
          value={filters.category || ""}
          onChange={(e) =>
            handleChange("category", e.target.value)
          }
          className="border px-3 py-2 rounded-lg w-full"
        /> */}
        {/* CategorySelect use করা হচ্ছে */}
        <CategorySelect
          value={filters.category || ""}
          onChange={(value) => handleChange("category", value || "")}
          allowNone={true}
        />


        {/* Stock */}
        <select
          value={filters.stock || ""}
          onChange={(e) =>
            handleChange("stock", e.target.value)
          }
          className="border px-3 py-2 rounded-lg w-full"
        >
          <option value="">All Stock</option>
          <option value="in-stock">In Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>

        {/* Sort */}
        <select
          value={filters.sort || ""}
          onChange={(e) =>
            handleChange(
              "sort",
              e.target.value as SortOptions
            )
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