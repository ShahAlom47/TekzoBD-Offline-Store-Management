"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AddCustomerFormInputs } from "@/Interfaces/customerInterface";



const AddCustomer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddCustomerFormInputs>({
    defaultValues: {
      isActive: true,
      customerType: "REGULAR",
    },
  });

  const onSubmit: SubmitHandler<AddCustomerFormInputs> = async (data) => {
    try {
      // Backend API call (example)
      const response = await fetch("/api/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, createdAt: new Date(), updatedAt: new Date() }),
      });

      if (!response.ok) throw new Error("Failed to add customer");

      alert("Customer added successfully!");
      reset(); // Clear form
    } catch (err) {
      console.error(err);
      alert("Error adding customer");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow space-y-4">
      <h2 className="text-xl font-semibold">Add New Customer</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full border p-2 rounded-lg"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            {...register("phone", { required: "Phone is required" })}
            className="w-full border p-2 rounded-lg"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            {...register("email")}
            type="email"
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1 font-medium">Address</label>
          <textarea
            {...register("address")}
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* Customer Type */}
        <div>
          <label className="block mb-1 font-medium">Customer Type</label>
          <select
            {...register("customerType")}
            className="w-full border p-2 rounded-lg"
          >
            <option value="REGULAR">Regular</option>
            <option value="WHOLESALE">Wholesale</option>
            <option value="VIP">VIP</option>
          </select>
        </div>

        {/* Opening Balance */}
        <div>
          <label className="block mb-1 font-medium">Opening Balance</label>
          <input
            {...register("openingBalance", { valueAsNumber: true })}
            type="number"
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* Credit Limit */}
        <div>
          <label className="block mb-1 font-medium">Credit Limit</label>
          <input
            {...register("creditLimit", { valueAsNumber: true })}
            type="number"
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* Is Active */}
        <div className="flex items-center space-x-2">
          <input
            {...register("isActive")}
            type="checkbox"
            defaultChecked
          />
          <label className="font-medium">Active</label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Add Customer
        </button>
      </form>
    </div>
  );
};

export default AddCustomer;