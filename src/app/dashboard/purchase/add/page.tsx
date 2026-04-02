import PurchaseForm from "@/Components/Purchase/PurchaseForm";
import { Purchase } from "@/Interfaces/purchaseInterface";

export const AddPurchase = () => {
  const handleAdd = (data: Purchase) => {
    console.log("ADD:", data);
  };

  return <PurchaseForm onSubmit={handleAdd} />;
};

// 🔹 Example Edit Page
export const EditPurchase = ({ data }: { data: Purchase }) => {
  const handleEdit = (updated: Purchase) => {
    console.log("UPDATE:", updated);
  };

  return <PurchaseForm initialData={data} onSubmit={handleEdit} />;
};
