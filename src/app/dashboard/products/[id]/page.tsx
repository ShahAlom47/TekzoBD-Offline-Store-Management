"use client";

import React from "react";
import { toast } from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Product, ProductFormData } from "@/Interfaces/productInterface";
import ProductForm from "@/Components/Products/ProductForm";
import {
  getSingleProduct,
  updateProduct,
} from "@/lib/allApiRequest/productRequest/productRequest";

const EditProduct = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  // ✅ Fetch product using useQuery
  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getSingleProduct(productId),
    enabled: !!productId,
  });

  // ✅ Update mutation
  const mutation = useMutation({
    mutationFn: (formData: ProductFormData) =>
      updateProduct(productId, formData),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error("Failed to update product");
        return;
      }

      toast.success("Product updated successfully!");
      router.push("/dashboard/products");
    },
    onError: (err: any) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (isError || !data?.success)
    return <p className="p-6 text-red-500">Failed to load product</p>;

  const product: Product = data.data;

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Edit Product
      </h1>

      <ProductForm
        product={product}
        onSubmit={(formData) => mutation.mutate(formData)}
      />
    </div>
  );
};

export default EditProduct;