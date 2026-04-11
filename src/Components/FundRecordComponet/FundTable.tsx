"use client";

import { CustomTable } from "../CommonComponents/CustomTable";
import { FundRecord } from "@/Interfaces/fundRecordInterface";
import { useState } from "react";
import CustomModal from "../CommonComponents/CustomModal";
import FundForm from "./FundForm";
import { useConfirm } from "@/hook/useConfirm";
import { deleteFundRecord, updateFundRecord } from "@/lib/allApiRequest/fundRecordRequest/fundRecordRequest";
import toast from "react-hot-toast/headless";
import { useQueryClient } from "@tanstack/react-query";

interface PropsType {
  fundRecords: FundRecord[];
}

const FundTable = ({ fundRecords }: PropsType) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<FundRecord | null>(null);

  const { confirm, ConfirmModal } = useConfirm();
  const queryClient = useQueryClient();

  // ✅ Edit
  const handleEdit = (record: FundRecord) => {
    setSelectedRecord(record);
    setOpenModal(true);
  };

  // ✅ Submit
  const handleSubmit = async (data: FundRecord) => {
    const id = selectedRecord?.id;
    if (!id) {
      toast.error("ID is missing!");
      return;
    }
    const res= await updateFundRecord(id.toString(),data);
    if(res.success){
      toast.success("Record updated!");
    }
    queryClient.invalidateQueries({
      queryKey: ["fundRecords"],
    });
    setOpenModal(false);
    setSelectedRecord(null);
  };

  // ✅ Delete
  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete Fund Record",
      message: "Are you sure you want to delete this record?",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
    });

    if (ok) {
      const res = await deleteFundRecord(id);

      if (res.success) {
        toast.success("Record deleted!");
        queryClient.invalidateQueries({
          queryKey: ["fundRecords"],
        });
      } else {
        toast.error("Failed to delete.");
      }
    }
  };

  // ✅ Columns
  const columns = [
    { header: "Source", accessor: "source" },
    { header: "Type", accessor: "type" },
    { header: "Amount (৳)", accessor: "amount" },
    { header: "Category", accessor: "category" },
    { header: "Date", accessor: "date" },
    { header: "Note", accessor: "note" },
    { header: "Action", accessor: "action" },
  ];

  // ✅ Format Data
  const data = fundRecords.map((item: FundRecord) => {
    return {
      source: item.source || "-",
      type: (
        <span
          className={`px-2 py-1 rounded text-white ${
            item.type === "IN" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {item.type}
        </span>
      ),
      amount: item.amount?.toLocaleString() || "0",
      category: item.category || "-",
      date: item.date
        ? new Date(item.date).toLocaleDateString()
        : "-",
      note: item.note || "-",
      action: (
        <div className="flex gap-2 justify-center">
          <button
            className="bg-yellow-400 text-white px-2 py-1 rounded"
            onClick={() => handleEdit(item)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded"
            onClick={() =>
              item.id && handleDelete(item.id.toString())
            }
          >
            Delete
          </button>
        </div>
      ),
    };
  });

  return (
    <div className="p-4 bg-white rounded-2xl shadow overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        💰 Fund Records
      </h2>

      <CustomTable columns={columns} data={data} />

      {/* ✅ Modal */}
      <CustomModal
        title="Edit Fund"
        open={openModal}
        onOpenChange={setOpenModal}
      >
        <FundForm
          initialData={selectedRecord || undefined}
          onSubmit={handleSubmit}
          onClose={() => setOpenModal(false)}
        />
      </CustomModal>

      {ConfirmModal}
    </div>
  );
};

export default FundTable;