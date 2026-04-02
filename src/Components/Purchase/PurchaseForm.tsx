"use client";

import { Purchase } from "@/Interfaces/purchaseInterface";
import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";



interface Props {
  initialData?: Purchase | null; // for edit
  onSubmit: (data: Purchase) => void;
}

const PurchaseForm = ({ initialData, onSubmit }: Props) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
  } = useForm<Purchase>({
    defaultValues: {
      date: new Date(),
      memos: [{ shopName: "", memoNumber: "", amount: 0 }],
      productTotal: 0,
      transportCost: 0,
      otherCost: 0,
      grandTotal: 0,
      note: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "memos",
  });

  const memos = watch("memos");
  const transportCost = watch("transportCost") || 0;
  const otherCost = watch("otherCost") || 0;

  // 🔹 calculate totals
  useEffect(() => {
    const productTotal = memos.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const grandTotal = productTotal + Number(transportCost) + Number(otherCost);

    setValue("productTotal", productTotal);
    setValue("grandTotal", grandTotal);
  }, [memos, transportCost, otherCost, setValue]);

  // 🔹 set initial data for edit
  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setValue(key as keyof Purchase, (initialData as any)[key]);
      });
    }
  }, [initialData, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Date */}
      <input
        type="date"
        {...register("date", { required: true })}
        className="border p-2 w-full"
      />

      {/* Memo List */}
      <div>
        <h2 className="font-bold">Memos</h2>
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-3 gap-2 mb-2">
            <input
              placeholder="Shop Name"
              {...register(`memos.${index}.shopName`)}
              className="border p-2"
            />

            <input
              placeholder="Memo Number"
              {...register(`memos.${index}.memoNumber`, { required: true })}
              className="border p-2"
            />

            <input
              type="number"
              placeholder="Amount"
              {...register(`memos.${index}.amount`, { required: true, valueAsNumber: true })}
              className="border p-2"
            />

            <button type="button" onClick={() => remove(index)} className="text-red-500">
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ shopName: "", memoNumber: "", amount: 0 })}
          className="bg-blue-500 text-white px-3 py-1"
        >
          + Add Memo
        </button>
      </div>

      {/* Costs */}
      <input
        type="number"
        placeholder="Transport Cost"
        {...register("transportCost", { valueAsNumber: true })}
        className="border p-2 w-full"
      />

      <input
        type="number"
        placeholder="Other Cost"
        {...register("otherCost", { valueAsNumber: true })}
        className="border p-2 w-full"
      />

      {/* Totals */}
      <input
        type="number"
        {...register("productTotal")}
        readOnly
        className="border p-2 w-full bg-gray-100"
        placeholder="Product Total"
      />

      <input
        type="number"
        {...register("grandTotal")}
        readOnly
        className="border p-2 w-full bg-gray-100"
        placeholder="Grand Total"
      />

      {/* Note */}
      <textarea
        placeholder="Note"
        {...register("note")}
        className="border p-2 w-full"
      />

      {/* Submit */}
      <button type="submit" className="bg-green-600 text-white px-4 py-2">
        {initialData ? "Update Purchase" : "Add Purchase"}
      </button>
    </form>
  );
};

export default PurchaseForm;

