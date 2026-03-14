"use client";

import { CustomTable } from "@/Components/CommonComponents/CustomTable";
import { Sale } from "@/Interfaces/saleInterfaces";
import Link from "next/link";

interface Props {
  sales: Sale[];
}

const SalesDataTable = ({ sales }: Props) => {
  console.log(sales);

  const handleDelete = (saleId: string | undefined) => {
    console.log(saleId);
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
          onClick={() => handleDelete(sale._id?.toString())}
          className="bg-red-600 text-white px-3 py-1 rounded-lg"
        >
          Delete
        </button>
      </div>
    ),
  }));

  return (
    <div>
      <CustomTable columns={columns} data={data} />
    </div>
  );
};

export default SalesDataTable;
