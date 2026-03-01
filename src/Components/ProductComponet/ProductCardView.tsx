"use client";

import { useCategories } from "@/hook/useCategory";
import { Product } from "@/Interfaces/productInterface";
import Link from "next/link";

interface Props {
  products: Product[];
}

const ProductCardView = ({ products }: Props) => {
  const { categories } = useCategories();
  const catName = (catId: string) => {
    const category = categories.find((cat) => cat._id === catId);
    return category ? category.name : "N/A";
  }
  return (
    <div className="space-y-4">
      {products.map((item) => {
        const stockValue = item.currentStock * item.costPrice;
        const isOutOfStock = item.currentStock === 0;
        const isLowStock = item.currentStock > 0 && item.currentStock < 5;

        return (
          <div
            key={item._id.toString()}
            className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">{item.name}</h2>
              <h1 className="text-sm font-medium">
                category: {catName(item.categoryId) || "N/A"}
            </h1>

              <span
                className={
                  item.status === "ACTIVE"
                    ? "text-green-600 text-sm font-medium"
                    : "text-gray-400 text-sm"
                }
              >
                {item.status}
              </span>
            </div>

            {/* Product Code */}
            <p className="text-xs text-gray-500 mt-1">
              Code: {item.productCode || "N/A"}
            </p>

            {/* Pricing & Stock */}
            <div className="flex justify-between mt-3 text-sm">
              <span className="font-medium">
                💰 {item.sellingPrice} TK
              </span>

              <span
                className={
                  isOutOfStock
                    ? "text-red-500 font-semibold"
                    : isLowStock
                    ? "text-yellow-600 font-medium"
                    : ""
                }
              >
                📦 {item.currentStock} {item.unit}
              </span>
            </div>

            {/* Stock Value */}
            <p className="text-xs text-gray-500 mt-1">
              Stock Value: {stockValue} TK
            </p>

            {/* Action */}
            <Link
              href={`/dashboard/products/${item._id}`}
              className="block text-center mt-4 text-blue-600 text-sm hover:underline"
            >
              View & Edit
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default ProductCardView;