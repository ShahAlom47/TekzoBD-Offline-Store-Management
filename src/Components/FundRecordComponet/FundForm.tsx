"use client";

import React, { useState } from "react";
import { FundRecord } from "@/Interfaces/fundRecordInterface";



// ✅ FundForm Component
const FundForm: React.FC<{
  initialData?: FundRecord;
  onSubmit: (data: FundRecord) => void;
  onClose: () => void;
}> = ({ initialData, onSubmit, onClose }) => {
  const [source, setSource] = useState(initialData?.source || "");
  const [type, setType] = useState<"IN" | "OUT">(initialData?.type || "IN");
  const [amount, setAmount] = useState(initialData?.amount || 0);
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState(initialData?.category || "Others");
  const [note, setNote] = useState(initialData?.note || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.id || Date.now().toString(),
      source,
      type,
      amount,
      date,
      category,
      note,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <input
        type="text"
        placeholder="Source (e.g., Investor A)"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <select value={type} onChange={(e) => setType(e.target.value as "IN" | "OUT")} className="border p-2 rounded">
        <option value="IN">IN</option>
        <option value="OUT">OUT</option>
      </select>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        required
        className="border p-2 rounded"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <select value={category} onChange={(e) => setCategory(e.target.value as "Investment" | "Loan" | "Expense" | "Profit" | "Others")} className="border p-2 rounded">
        <option value="Investment">Investment</option>
        <option value="Loan">Loan</option>
        <option value="Expense">Expense</option>
        <option value="Profit">Profit</option>
        <option value="Others">Others</option>
      </select>
      <textarea
        placeholder="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="border p-2 rounded"
      />
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onClose} className="bg-gray-400 px-4 py-2 rounded hover:bg-gray-500">
          Cancel
        </button>
        <button type="submit" className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600">
          {initialData ? "Update" : "Add"} Fund
        </button>
      </div>
    </form>
  );
};


export default FundForm;

