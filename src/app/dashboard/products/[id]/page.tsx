"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import { Product, ProductFormData } from "@/Interfaces/productInterface";
import ProductForm from "@/Components/Products/ProductForm";
import { 
  getSingleProduct, 
  updateProduct 
} from "@/lib/allApiRequest/productRequest/productRequest";

const EditProduct = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [initialData, setInitialData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Load existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getSingleProduct(productId);\

        console.log(res)

        if (!res.success) throw new Error("Failed to fetch product");

        setInitialData(res.data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  // 🔹 Update handler
  const handleSubmit = async (data: ProductFormData) => {
    try {
      const res = await updateProduct(productId, data);

      if (!res.success) throw new Error("Failed to update product");

      toast.success("Product updated successfully!");
      router.push("/dashboard/products");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Edit Product
      </h1>

      {initialData && (
        <ProductForm 
          onSubmit={handleSubmit} 
          product={initialData}  
        />
      )}
    </div>
  );
};

export default EditProduct;