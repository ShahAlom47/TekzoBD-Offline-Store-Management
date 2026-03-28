"use client";

import { ExpenseCategory, expenseCategoryOptions } from "@/Interfaces/expensesInterface";
import { useState } from "react";

interface GetExpensesParams {
  searchTrim?: string;
  category?: ExpenseCategory;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
  sort?: string;
}

interface Props {
  onFilterChange: (filters: Partial<GetExpensesParams>) => void;
}

export default function ExpenseFilter({ onFilterChange }: Props) {
  const [filters, setFilters] = useState<Partial<GetExpensesParams>>({
    searchTrim: "",
    category: undefined,
    minAmount: undefined,
    maxAmount: undefined,
    startDate: "",
    endDate: "",
    sort: undefined,
  });

  const handleChange = (
    field: keyof GetExpensesParams,
    value: string
  ) => {
    const updated: Partial<GetExpensesParams> = {
      ...filters,
      [field]: value || undefined,
    };

    setFilters(updated);
    onFilterChange(updated);
  };

  const handleReset = () => {
    const resetData: Partial<GetExpensesParams> = {};
    setFilters(resetData);
    onFilterChange(resetData);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-gray-200 
    rounded-2xl p-5 shadow-sm mb-6">

      <div className="flex flex-col gap-4">

        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Search */}
          <input
            type="text"
            placeholder="Search expenses..."
            value={filters.searchTrim || ""}
            onChange={(e) =>
              handleChange("searchTrim", e.target.value)
            }
            className="w-full border border-gray-200 
            focus:border-black focus:ring-1 focus:ring-black
            px-4 py-2.5 rounded-xl text-sm outline-none"
          />

          {/* Category */}
          <select
            value={filters.category || ""}
            onChange={(e) =>
              handleChange("category", e.target.value)
            }
            className="w-full border border-gray-200
            focus:border-black focus:ring-1 focus:ring-black
            px-4 py-2.5 rounded-xl text-sm outline-none"
          >
            <option value="">All Categories</option>
            {expenseCategoryOptions.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Min Amount */}
          <input
            type="number"
            placeholder="Min Amount"
            value={filters.minAmount || ""}
            onChange={(e) =>
              handleChange("minAmount", e.target.value)
            }
            className="w-full border border-gray-200 
            focus:border-black focus:ring-1 focus:ring-black
            px-4 py-2.5 rounded-xl text-sm outline-none"
          />

          {/* Max Amount */}
          <input
            type="number"
            placeholder="Max Amount"
            value={filters.maxAmount || ""}
            onChange={(e) =>
              handleChange("maxAmount", e.target.value)
            }
            className="w-full border border-gray-200 
            focus:border-black focus:ring-1 focus:ring-black
            px-4 py-2.5 rounded-xl text-sm outline-none"
          />

          {/* Start Date */}
          <input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) =>
              handleChange("startDate", e.target.value)
            }
            className="w-full border border-gray-200 
            focus:border-black focus:ring-1 focus:ring-black
            px-4 py-2.5 rounded-xl text-sm outline-none"
          />

          {/* End Date */}
          <input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) =>
              handleChange("endDate", e.target.value)
            }
            className="w-full border border-gray-200 
            focus:border-black focus:ring-1 focus:ring-black
            px-4 py-2.5 rounded-xl text-sm outline-none"
          />

          {/* Sort */}
          <select
            value={filters.sort || ""}
            onChange={(e) =>
              handleChange("sort", e.target.value)
            }
            className="w-full border border-gray-200
            focus:border-black focus:ring-1 focus:ring-black
            px-4 py-2.5 rounded-xl text-sm outline-none"
          >
            <option value="">Sort</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="high">Amount High → Low</option>
            <option value="low">Amount Low → High</option>
          </select>

        </div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">

          <p className="text-xs text-gray-500">
            Filter and manage your expenses efficiently
          </p>

          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium
            border border-gray-300 rounded-xl
            hover:bg-black hover:text-white
            transition-all duration-200"
          >
            Reset Filters
          </button>
        </div>

      </div>
    </div>
  );
}