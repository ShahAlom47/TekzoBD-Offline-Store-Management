"use client";

import CustomModal from "@/Components/CommonComponents/CustomModal";
import AddExpenseForm from "@/Components/Expenses/AddExpenses";
import { getExpenses } from "@/lib/allApiRequest/expensesRequest/expensesRequest";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

const Expenses = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const { data, isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const res = await getExpenses();
      return res;
    },
  });
  const expenses= data?.data 

  return (
    <div className="p-5">
      {/* 🔹 Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Expenses</h1>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add Expense
        </button>
      </div>

      {/* 🔹 Table */}
      <div className="bg-white shadow rounded p-3">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
         <div>
            </div>
        )}
      </div>

      {/* 🔹 Modal */}
      <CustomModal
        title="Add Expense"
        open={openModal}
        onOpenChange={setOpenModal}
      >
        <AddExpenseForm onSuccess={() => setOpenModal(false)} />
      </CustomModal>
    </div>
  );
};

export default Expenses;