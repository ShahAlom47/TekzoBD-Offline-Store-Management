import { CustomTable } from "../CommonComponents/CustomTable";
import { Purchase } from "@/Interfaces/purchaseInterface";

interface PropsType {
  purchases: Purchase[];
}

const PurchaseDataTable = ({ purchases }: PropsType) => {
  const columns = [
    { header: "Date", accessor: "date" },
    { header: "Total (৳)", accessor: "grandTotal" },
    { header: "Products (৳)", accessor: "productTotal" },
    { header: "Transport (৳)", accessor: "transportCost" },
    { header: "Other (৳)", accessor: "otherCost" },
    { header: "Memos", accessor: "memos" },
    { header: "Note", accessor: "note" },
  ];

  // ✅ format data
  const data = purchases.map((item: Purchase) => {
    return {
      date: item.date
        ? new Date(item.date).toLocaleDateString()
        : "-",

      grandTotal: item.grandTotal?.toLocaleString() || "0",
      productTotal: item.productTotal?.toLocaleString() || "0",
      transportCost: item.transportCost?.toLocaleString() || "0",
      otherCost: item.otherCost?.toLocaleString() || "0",

      // 👉 memo count or short info
      memos: item.memos?.length
        ? `${item.memos.length} memo`
        : "0",

      note: item.note || "-",
    };
  });

  return (
    <div className="p-4 bg-white rounded-2xl shadow overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        🧾 Purchases
      </h2>

      <CustomTable columns={columns} data={data} />
    </div>
  );
};

export default PurchaseDataTable;