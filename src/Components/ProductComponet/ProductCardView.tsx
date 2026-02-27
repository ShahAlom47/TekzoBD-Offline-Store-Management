'use client'

import { Product } from "@/Interfaces/productInterface";
import Link from "next/link";

interface Props {
  products: Product[];
}

const ProductCardView = ({ products }: Props) => {

  return (
    <div className="space-y-4">
      {products.map((item) => (

        <div
          key={item._id.toString()}
          className="border rounded-xl p-4 shadow-sm bg-white"
        >
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">
              {item.name}
            </h2>
            <span className={
              item.status === "ACTIVE"
                ? "text-green-600 text-sm"
                : "text-gray-400 text-sm"
            }>
              {item.status}
            </span>
          </div>

          <p className="text-xs text-gray-500">
            SKU: {item.sku}
          </p>

          <div className="flex justify-between mt-3">
            <span>
              💰 {item.sellingPrice} TK
            </span>

            <span className={
              item.currentStock <= (item.reorderLevel || 0)
                ? "text-red-500 font-semibold"
                : ""
            }>
              📦 {item.currentStock} {item.unit}
            </span>
          </div>

          <Link
            href={`/dashboard/products/${item._id}`}
            className="block text-center mt-4 text-blue-500 text-sm"
          >
            View & Edit
          </Link>

        </div>
      ))}
    </div>
  );
};

export default ProductCardView;