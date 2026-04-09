"use client";

import React, { useState } from "react";
import CustomModal from "@/Components/CommonComponents/CustomModal";
import { FundRecord } from "@/Interfaces/fundRecordInterface";
import FundForm from "@/Components/FundRecordComponet/FundForm";





// ✅ Main FundRecord Page
const FundRecordPage = () => {
  const [openModal, setModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FundRecord | null>(null);
  const [fundRecords, setFundRecords] = useState<FundRecord[]>([]);

  const handleAdd = () => {
    setEditingRecord(null);
    setModal(true);
  };

  const handleEdit = (record: FundRecord) => {
    setEditingRecord(record);
    setModal(true);
  };

  const handleSubmit = (data: FundRecord) => {
    setFundRecords((prev) => {
      const exists = prev.find((r) => r.id === data.id);
      if (exists) {
        return prev.map((r) => (r.id === data.id ? data : r));
      } else {
        return [...prev, data];
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Fund Records</h1>
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Fund
        </button>
      </div>

      <table className="w-full border rounded overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Source</th>
            <th className="p-2">Type</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Category</th>
            <th className="p-2">Date</th>
            <th className="p-2">Note</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fundRecords.map((record) => (
            <tr key={record.id} className="border-b">
              <td className="p-2">{record.source}</td>
              <td className="p-2">{record.type}</td>
              <td className="p-2">{record.amount} ৳</td>
              <td className="p-2">{record.category}</td>
              <td className="p-2">{record.date}</td>
              <td className="p-2">{record.note}</td>
              <td className="p-2">
                <button
                  onClick={() => handleEdit(record)}
                  className="bg-yellow-500 px-2 py-1 rounded text-white hover:bg-yellow-600"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CustomModal open={openModal} onOpenChange={setModal}>
        <FundForm
          initialData={editingRecord || undefined}
          onSubmit={handleSubmit}
          onClose={() => setModal(false)}
        />
      </CustomModal>
    </div>
  );
};

export default FundRecordPage;