"use client";

import CustomModal from "@/Components/CommonComponents/CustomModal";
import AddExpenseForm from "@/Components/Expenses/AddExpenses";
import { Expense } from "@/Interfaces/expensesInterface";
import { getExpenses } from "@/lib/allApiRequest/expensesRequest/expensesRequest";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

const Expenses = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const res = await getExpenses();
      return res;
    },
  });

  const expenses = data?.data  as Expense[] || []

  return (
    <div className="p-5">
      {/* 🔹 Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Expenses</h1>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Expense
        </button>
      </div>

      {/* 🔹 Table */}
      <div className="bg-white shadow rounded p-3 overflow-x-auto">
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p className="text-red-500">Something went wrong!</p>
        ) : expenses.length === 0 ? (
          <p className="text-gray-500 text-center py-5">
            No expenses found 😐
          </p>
        ) : (
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Note</th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((exp: Expense) => (
                <tr key={exp._id?.toString()} className="text-center">
                  <td className="p-2 border">{exp.title}</td>
                  <td className="p-2 border capitalize">
                    {exp.category.replaceAll("_", " ")}
                  </td>
                  <td className="p-2 border text-red-500 font-semibold">
                    ৳ {exp.amount}
                  </td>
                  <td className="p-2 border">
                    {new Date(exp.expenseDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">
                    {exp.note || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔹 Modal */}
      <CustomModal
        title="Add Expense"
        open={openModal}
        onOpenChange={setOpenModal}
      >
        <AddExpenseForm
          onSuccess={() => {
            setOpenModal(false);
          }}
        />
      </CustomModal>
    </div>
  );
};

export default Expenses;