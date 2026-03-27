import { CustomTable } from "../CommonComponents/CustomTable";
import { Expense } from "@/Interfaces/expensesInterface";

interface PropsType {
  expenses: Expense[];
}

const ExpensesTable = ({ expenses }: PropsType) => {
  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Category", accessor: "category" },
    { header: "Amount (৳)", accessor: "amount" },
    { header: "Date", accessor: "date" },
    { header: "Note", accessor: "note" },
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
    };
  });

  return (
    <div className="p-4 bg-white rounded-2xl shadow overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        💸 Expenses
      </h2>

      <CustomTable columns={columns} data={data} />
    </div>
  );
};

export default ExpensesTable;