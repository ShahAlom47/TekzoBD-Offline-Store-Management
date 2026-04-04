'use client'

import { useState } from "react";
import PurchaseForm from "@/Components/Purchase/PurchaseForm";
import { Purchase } from "@/Interfaces/purchaseInterface";
import toast from "react-hot-toast";

interface Props {
  initialData: Purchase | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: (updated: Purchase) => void;
}

const EditPurchaseModal = ({ initialData, isOpen, onClose, onUpdated }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleEdit = async (data: Purchase) => {
    // if (!initialData) return;
    // try {
    //   setLoading(true);
    //   const res = await editPurchase(initialData._id, data); // assume your Purchase has _id
    //   if (!res?.success) {
    //     toast.error(res?.message || "Failed to update purchase");
    //   } else {
    //     toast.success("Purchase updated successfully");
    //     onUpdated?.(res.data); // callback to parent to update list
    //     onClose(); // close modal after success
    //   }
    // } finally {
    //   setLoading(false);
    // }
  };

  if (!isOpen) return null; // don't render if modal is closed

  return (

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-2 relative">
    


        <PurchaseForm
          initialData={initialData}
          onSubmit={handleEdit}
        />
      </div>
  
  );
};

export default EditPurchaseModal;