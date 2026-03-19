"use client";

import { expenseCategoryOptions } from "@/Interfaces/expensesInterface";
import { addExpenses } from "@/lib/allApiRequest/expensesRequest/expensesRequest";
import React, { useState } from "react";

interface Props {
  onSuccess: () => void;
}

const AddExpenseForm = ({ onSuccess }: Props) => {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "others",
    note: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      amount: Number(form.amount),
    };

    console.log("Expense Data:", payload);

    const res= await addExpenses(payload)

    // 🔥 later API call দিবি এখানে

    onSuccess(); // modal close
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Title */}
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      {/* Amount */}
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

   {/* Category */}
<select
  name="category"
  value={form.category}
  onChange={handleChange}
  className="w-full border p-2 rounded"
>
  {expenseCategoryOptions.map((item) => (
    <option key={item.value} value={item.value}>
      {item.label}
    </option>
  ))}
</select>

      {/* Note */}
      <input
        type="text"
        name="note"
        placeholder="Note (optional)"
        value={form.note}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded"
      >
        Add Expense
      </button>
    </form>
  );
};

export default AddExpenseForm;