"use client";

import React, { useState } from "react";
import CustomModal from "@/Components/CommonComponents/CustomModal";
import { FundRecord } from "@/Interfaces/fundRecordInterface";
import FundForm from "@/Components/FundRecordComponet/FundForm";
import { addFundRecord, getAllFundRecords } from "@/lib/allApiRequest/fundRecordRequest/fundRecordRequest";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import FundTable from "@/Components/FundRecordComponet/FundTable";
import { DashPaginationButton } from "@/Components/CommonComponents/DashPaginationButton";

// ✅ Main FundRecord Page
const FundRecordPage = () => {
  const [openModal, setModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FundRecord | null>(null);
    const [page, setPage] = useState(1);
  const limit = 10;

  const queryClient = useQueryClient();

const {data}= useQuery({
  queryKey:[],
  queryFn: async()=>{
    const res = await getAllFundRecords({currentPage:1,limit:100});
    return res
  }
})
const fundRecords = data ?.data as FundRecord[] || [];
const totalPages = data?.totalPages || 1;


console.log(data)
  const handleAdd = () => {
    setEditingRecord(null);
    setModal(true);
  };

  

  // ✅ FIXED SUBMIT FUNCTION
  const handleSubmit = async (data: FundRecord) => {
    try {
        setModal(true);
      const res = await addFundRecord(data);

      if (res?.success) {
        toast.success("Fund record saved successfully! 🎉");
             setModal(false);
   queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });
            }
      
       
    } catch (error) {
      console.error(error);
      alert("Error occurred ❌");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Fund Records</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Fund
        </button>
      </div>

     <FundTable fundRecords={fundRecords}></FundTable>
     <DashPaginationButton currentPage={page} totalPages={totalPages} onPageChange={setPage}></DashPaginationButton>

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
