"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/loading";
import { getOverview } from "@/lib/allApiRequest/overviewRequest/overviewRequest";
import {  Overview, OverviewFilter } from "@/Interfaces/overviewInterface";
import OverviewFilterComponent from "@/Components/Overview/OverviewFilter";
import OverviewContent from "@/Components/Overview/OverviewContent";

const OverviewPage = () => {
  const [filter, setFilter] = useState<OverviewFilter>({ type: "today" });


   const { data, isLoading } = useQuery({
     queryKey: ["overview", filter],
      queryFn: async () => {
     const response = await getOverview({ filter });
     return response;
      },
      placeholderData: (prev) => prev, // keep old data while fetching new
    });
const overviewData = data?.data as Overview;

  if (isLoading) return <Loading />;
console.log(overviewData)
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Overview Dashboard</h2>

      {/* 🔹 Filter */}
      <OverviewFilterComponent filter={filter} onChange={setFilter} />

      {isLoading ? (
        <Loading />
      ) : (
        <OverviewContent data={overviewData} />
      )}
    </div>
  );
};

export default OverviewPage;