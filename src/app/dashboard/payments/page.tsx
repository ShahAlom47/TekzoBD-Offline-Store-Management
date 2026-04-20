"use client";
import Loading from "@/app/loading";
import { DashPaginationButton } from "@/Components/CommonComponents/DashPaginationButton";
import PaymentDataTable from "@/Components/PaymentComponent/PaymentDataTable";
import PaymentHeader from "@/Components/PaymentComponent/PaymentHeader";
import { Payment } from "@/Interfaces/paymentInterface";
import { getPayments } from "@/lib/allApiRequest/paymentRequest/paymentRequest";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Payments = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [month, setMonth] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setStatus("");
  };

  const { data, isLoading } = useQuery({
    queryKey: ["sales", page, startDate, endDate, month],
    queryFn: async () => {
      const res = await getPayments({
        currentPage: page,
        limit,
        startDate,
        endDate,
        status,
        month,
      });
      return res;
    },
    placeholderData: (prev) => prev, // keep old data while fetching new
  });

  if (isLoading) return <Loading></Loading>;
  const totalPages = data?.totalPages || 0;
  const paymentData = (data?.data as Payment[]) || [];
  const totalPaymentAmount = data?.summary?.totalAmount || 0; // 🔥 important

  console.log(paymentData);
  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <PaymentHeader
          month={month}
          setMonth={setMonth}
          totalAmount={totalPaymentAmount}
          clearFilters={clearFilters}
        />
        <PaymentDataTable payments={paymentData}></PaymentDataTable>
        <DashPaginationButton
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
        ></DashPaginationButton>
      </div>
    </div>
  );
};

export default Payments;
