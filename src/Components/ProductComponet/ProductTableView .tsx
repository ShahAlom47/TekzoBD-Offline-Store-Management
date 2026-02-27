'use client'

import Link from "next/link";
import { CustomTable } from "../CommonComponents/CustomTable";
import { Product } from "@/Interfaces/productInterface";

interface Props {
  products: Product[];
}

const ProductTableView = ({ products }: Props) => {

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "SKU", accessor: "sku" },
    { header: "Stock", accessor: "stock" },
    { header: "Sell Price", accessor: "sell" },
    { header: "Cost", accessor: "cost" },
    { header: "Stock Value", accessor: "stockValue" },
    { header: "Status", accessor: "status" },
    { header: "Action", accessor: "action" },
  ];

  const data = products.map((item) => ({
    name: item.name,
    sku: item.sku,
    stock: (
      <span className={
        item.currentStock <= (item.reorderLevel || 0)
          ? "text-red-500 font-semibold"
          : ""
      }>
        {item.currentStock} {item.unit}
      </span>
    ),
    sell: `${item.sellingPrice} TK`,
    cost: `${item.costPrice} TK`,
    stockValue: `${item.currentStock * item.costPrice} TK`,
    status: (
      <span className={
        item.status === "ACTIVE"
          ? "text-green-600"
          : "text-gray-400"
      }>
        {item.status}
      </span>
    ),
    action: (
      <div className="flex gap-3">
        <Link href={`/dashboard/products/${item._id}`}>
          Edit
        </Link>
        <button className="text-red-500">
            Delete
        </button>
      </div>
    ),
  }));

  return <CustomTable columns={columns} data={data} />;
};

export default ProductTableView;