"use client";

import { FilterType, OverviewFilter } from "@/Interfaces/overviewInterface";



interface Props {
  filter: OverviewFilter;
  onChange: (filter: OverviewFilter) => void;
}

const OverviewFilterComponent = ({ filter, onChange }: Props) => {
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {/* Quick Buttons */}
      {(["today", "week", "month"] as FilterType[]).map((type) => (
        <button
          key={type}
          onClick={() => onChange({ type })}
          className={`px-3 py-1 rounded ${
            filter.type === type ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {type === "today"
            ? "Today"
            : type === "week"
            ? "This Week"
            : "This Month"}
        </button>
      ))}

      {/* Month Picker */}
      <input
        type="month"
        value={filter.month || ""}
        onChange={(e) => onChange({ type: "month", month: e.target.value })}
        className="border p-1 rounded"
      />

      {/* Custom Date (optional, show only if type === custom) */}
      {filter.type === "custom" && (
        <>
          <input
            type="date"
            value={filter.startDate || ""}
            onChange={(e) =>
              onChange({ ...filter, type: "custom", startDate: e.target.value })
            }
            className="border p-1 rounded"
          />
          <input
            type="date"
            value={filter.endDate || ""}
            onChange={(e) =>
              onChange({ ...filter, type: "custom", endDate: e.target.value })
            }
            className="border p-1 rounded"
          />
        </>
      )}
    </div>
  );
};

export default OverviewFilterComponent;