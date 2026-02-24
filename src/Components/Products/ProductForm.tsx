/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ProductFormData } from "@/Interfaces/productInterface";
import { useForm, Controller } from "react-hook-form";

interface ProductFormProps {
  product?: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
}

export default function ProductForm({ product, onSubmit }: ProductFormProps) {
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<ProductFormData>({
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
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl shadow-md space-y-4">

      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Product Name" {...register("name", { required: "Product Name required" })} error={errors.name?.message} />
        <Input label="SKU" {...register("sku", { required: "SKU required" })} error={errors.sku?.message} />
        <Input label="Barcode" {...register("barcode")} />
        <Select label="Category" {...register("categoryId", { required: "Select category" })} options={[]} error={errors.categoryId?.message} />
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

/* Reusable Input Component */
function Input({ label, error, ...props }: any) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input
        {...props}
        className={`w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition ${error ? "border-red-500" : "border-gray-300"}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

/* Reusable Select Component */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Select({ label, options, error, ...props }: any) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <select
        {...props}
        className={`w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition ${error ? "border-red-500" : "border-gray-300"}`}
      >
        <option value="">Select {label}</option>
        {options.map((opt: any, i: number) => (
          <option key={i} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}