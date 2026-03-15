"use client";

import { CustomTable } from "@/Components/CommonComponents/CustomTable";
import { useConfirm } from "@/hook/useConfirm";
import { Sale } from "@/Interfaces/saleInterfaces";
import { saleDelete } from "@/lib/allApiRequest/salesRequest/salesRequest";
import { queryClient } from "@/Providers/QueryProvider";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast/headless";

interface Props {
  sales: Sale[];
}

const SalesDataTable = ({ sales }: Props) => {
  const { confirm, ConfirmModal } = useConfirm();
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async (saleId: string | undefined) => {
    const ok = await confirm({
      title: "Delete Sale",
      message: "Are you sure you want to delete this sale?",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
    });

    if (!ok) return;

    try {
      setLoading(true);

      const res = await saleDelete(saleId || "");

      if (res?.success) {
        toast.success("Product deleted!");
        setLoading(false);

        // ✅ Invalidate products query
        queryClient.invalidateQueries({
          queryKey: ["sales"],
        });
      } else {
        toast.error("Failed to delete Customer");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: "Sale No", accessor: "saleNumber" },
    { header: "Date", accessor: "date" },
    { header: "Products", accessor: "products" },
    { header: "Total", accessor: "totalAmount" },
    { header: "Paid", accessor: "paidAmount" },
    { header: "Due", accessor: "dueAmount" },
    { header: "Profit", accessor: "profit" },
    { header: "Action", accessor: "action" },
  ];

  const data = sales.map((sale) => ({
    saleNumber: <h1 className="font-medium">{sale.saleNumber || "N/A"}</h1>,

    date: new Date(sale.createdAt).toLocaleDateString(),

    products: sale.products.length,

    totalAmount: <span className="font-semibold">৳ {sale.totalAmount}</span>,

    paidAmount: (
      <span className="text-green-600 font-medium">৳ {sale.paidAmount}</span>
    ),

    dueAmount: (
      <span
        className={`font-semibold ${
          sale.dueAmount > 0 ? "text-red-500" : "text-green-600"
        }`}
      >
        ৳ {sale.dueAmount}
      </span>
    ),

    profit: (
      <span className="text-blue-600 font-medium">৳ {sale.totalProfit}</span>
    ),

    action: (
      <div className="flex gap-2 justify-center">
        <Link
          href={`/dashboard/sales/${sale?._id?.toString()}`}
          className="bg-blue-600 text-white px-3 py-1 rounded-lg"
        >
          View
        </Link>

        <button
          disabled={loading}
          onClick={() => handleDelete(sale._id?.toString())}
          className="bg-red-600 text-white px-3 py-1 rounded-lg"
        >
         {loading?" Deleting....":" Delete"}
        </button>
      </div>
    ),
  }));

  return (
    <div>
      <CustomTable columns={columns} data={data} />
      {ConfirmModal}
    </div>
  );
};

export default SalesDataTable;
