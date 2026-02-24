"use client";

import React from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ProductFormData } from "@/Interfaces/productInterface";
import ProductForm from "@/Components/Products/ProductForm";

const AddProduct = () => {
  const router = useRouter();

  // Submit handler
  const handleSubmit = async (data: ProductFormData) => {
    try {
      // Example API call
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to add product");

      toast.success("Product added successfully!");
      router.push("/dashboard/products"); // redirect after add
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Add New Product
      </h1>

      {/* Product Form */}
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddProduct;