import { CustomTable } from "../CommonComponents/CustomTable";
import { Expense } from "@/Interfaces/expensesInterface";
import { useState } from "react";
import CustomModal from "../CommonComponents/CustomModal";
import { useQueryClient } from "@tanstack/react-query";
import EditExpenseForm from "./EditExpenseForm";

interface PropsType {
  expenses: Expense[];
}

const ExpensesTable = ({ expenses }: PropsType) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
    const queryClient = useQueryClient();

    const handleEdit = (expense: Expense) => {
        setSelectedExpense(expense);
        setOpenModal(true);
    }   

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Category", accessor: "category" },
    { header: "Amount (৳)", accessor: "amount" },
    { header: "Date", accessor: "date" },
    { header: "Note", accessor: "note" },
    { header: "Action", accessor: "action" },
  ];

  // 🔹 format data
  const data = expenses.map((item: Expense) => {
    return {
      title: item.title || "-",
      category: item.category
        ? item.category.replaceAll("_", " ")
        : "-",
      amount: item.amount?.toLocaleString() || "0",
      date: item.expenseDate
        ? new Date(item.expenseDate).toLocaleDateString()
        : "-",
      note: item.note || "-",
      action:(
          <div className="flex gap-2 justify-center">
          <button
            className="bg-yellow-400 text-white px-2 py-1 rounded"
            onClick={() => handleEdit(item)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded"
            // onClick={() => handleDelete(row.original._id)}
          >
            Delete
          </button>
        </div>
      )
      
    };
  });

  return (
    <div className="p-4 bg-white rounded-2xl shadow overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        💸 Expenses
      </h2>

      <CustomTable columns={columns} data={data} />

         {/* 🔹 Modal */}
      <CustomModal
        title="Add Expense"
        open={openModal}
        onOpenChange={setOpenModal}
      >
        <EditExpenseForm
        initialData={selectedExpense}
      
        
        />
      </CustomModal>

    </div>
  );
};

export default ExpensesTable;