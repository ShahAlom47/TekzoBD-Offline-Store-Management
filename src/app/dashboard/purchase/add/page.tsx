'use client'

import PurchaseForm from "@/Components/Purchase/PurchaseForm";
import { Purchase } from "@/Interfaces/purchaseInterface";

 const AddPurchase = () => {
  const handleAdd = (data: Purchase) => {
    console.log("ADD:", data);
  };

  return <PurchaseForm onSubmit={handleAdd} />;
};

export default AddPurchase;

