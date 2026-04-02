"use client";

import Loading from "@/app/loading";
import { DashPaginationButton } from "@/Components/CommonComponents/DashPaginationButton";
import { getPurchases } from "@/lib/allApiRequest/purchaseRequest/purchaseRequest";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

// 👉 create this like PaymentDataTable later
import PurchaseDataTable from "@/Components/Purchase/PurchaseDataTable";
import { Purchase } from "@/Interfaces/purchaseInterface";

const PurchasePage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const clearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
  };

  const { data, isLoading } = useQuery({
    queryKey: ["purchases", page, search, startDate, endDate],
    queryFn: async () => {
      const res = await getPurchases({
        currentPage: page,
        limit,
        searchTrim: search,
        startDate,
        endDate,
      });
      return res;
    },
    placeholderData: (prev) => prev,
  });

  if (isLoading) return <Loading />;

  const totalPages = data?.totalPages || 0;
  const purchaseData = (data?.data as Purchase[]) || [];

  return (
    <div className="p-6 space-y-4">
      
      {/* 🔹 Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Purchase History</h2>
        <Link
          href="/dashboard/purchase/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Purchase
        </Link>
      </div>

      {/* 🔹 Filters */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg"
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded-lg"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded-lg"
        />

        <button
          onClick={clearFilters}
          className="bg-gray-500 text-white px-3 rounded-lg"
        >
          Clear
        </button>
      </div>

      {/* 🔹 Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <PurchaseDataTable purchases={purchaseData} />

        <DashPaginationButton
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default PurchasePage;