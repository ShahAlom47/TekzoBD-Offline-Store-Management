"use client";
import { DashPaginationButton } from "@/Components/CommonComponents/DashPaginationButton";
import SaleFilter from "@/Components/Sales/SaleFilter";
import SalesDataTable from "@/Components/Sales/SalesDataTable";
import { Sale } from "@/Interfaces/saleInterfaces";
import { getAllSales } from "@/lib/allApiRequest/salesRequest/salesRequest";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Sales = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const clearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setStatus("");
  };

  console.log(search,startDate,endDate)

  const { data, isLoading } = useQuery({
    queryKey: ["sales", page],
    queryFn: async () => {
      return await getAllSales({
        currentPage: page,
    limit,
    searchTrim: search,
    startDate,
    endDate,
    status
      });
    },
    placeholderData: (prev) => prev, // keep old data while fetching new
  });

  if (isLoading) return <p>Loading...</p>;
  const totalPages = data?.totalPages || 0;
  const salesData = (data?.data as Sale[]) || [];

  return (
    <div>
      <SaleFilter
        search={search}
        setSearch={setSearch}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        status={status}
        setStatus={setStatus}
        clearFilters={clearFilters}
      />
      <SalesDataTable sales={salesData}></SalesDataTable>
      <DashPaginationButton
        totalPages={totalPages}
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
};

export default Sales;
