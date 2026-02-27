"use client";

import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { ProductFormData } from "@/Interfaces/productInterface";
import { useCategories } from "@/hook/useCategory";
import Input from "../CommonComponents/Input";
import Select from "../CommonComponents/Select";

/* Reusable Input Component */


/* Reusable Select Component */


interface ProductFormProps {
  product?: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
}

export default function ProductForm({ product, onSubmit }: ProductFormProps) {
  const { categories } = useCategories();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: product || {
      name: "",
      sku: "",
      barcode: "",
      categoryId: "",
      brand: "",
      costPrice: 0,
      sellingPrice: 0,
      discountPrice: 0,
      vatPercentage: 0,
      openingStock: 0,
      currentStock: 0,
      reorderLevel: 0,
      unit: "PCS",
      supplierId: "",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (product) reset(product);
  }, [product, reset]);

  // 🔥 Category dropdown options
  const categoryOptions = useMemo(() => {
    return categories.map((cat) => ({
      value: cat._id,
      label: cat.name,
    }));
  }, [categories]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl shadow-md space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Product Name" {...register("name", { required: "Product Name required" })} error={errors.name?.message} />
        <Input label="SKU" {...register("sku", { required: "SKU required" })} error={errors.sku?.message} />
        <Input label="Barcode" {...register("barcode")} />
        <Select label="Category" {...register("categoryId", { required: "Select category" })} options={categoryOptions} error={errors.categoryId?.message} />
        <Input label="Brand" {...register("brand")} />

        <Input label="Cost Price" type="number" {...register("costPrice", { required: true, min: 0 })} />
        <Input label="Selling Price" type="number" {...register("sellingPrice", { required: true, min: 0 })} />
        <Input label="Discount Price" type="number" {...register("discountPrice")} />
        <Input label="VAT (%)" type="number" {...register("vatPercentage")} />

        <Input label="Opening Stock" type="number" {...register("openingStock")} />
        <Input label="Current Stock" type="number" {...register("currentStock")} />
        <Input label="Reorder Level" type="number" {...register("reorderLevel")} />

        <Select label="Unit" {...register("unit")} options={["PCS","KG","LITER","BOX"]} />

        <Select label="Supplier" {...register("supplierId")} options={[]} />

        <Select label="Status" {...register("status")} options={["ACTIVE","INACTIVE"]} />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button type="reset" onClick={() => reset()} className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
          Reset
        </button>
        <button type="submit" className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
          {product ? "Update Product" : "Add Product"}
        </button>
      </div>
    </form>
  );
}