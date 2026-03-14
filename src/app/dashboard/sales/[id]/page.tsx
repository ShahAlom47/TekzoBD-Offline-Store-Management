"use client";

import { useCustomer } from "@/hook/useCustomer";
import { Sale, SaleProduct } from "@/Interfaces/saleInterfaces";
import { getSaleById } from "@/lib/allApiRequest/salesRequest/salesRequest";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";

const SaleDetails = () => {
  const params = useParams();
  const id = params?.id as string;



  const { data, isLoading, isError } = useQuery({
    queryKey: ["sale", id],
    queryFn: async () => {
      const res = await getSaleById(id);
      return res;
    },
    enabled: !!id,
  });

const sale= data?.data as Sale
  const {data:customer}=useCustomer(sale?.customerId ?? "")

  console.log(customer)

  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading Sale Details...
      </div>
    );
  }

  if (isError || !sale) {
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load sale details
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* HEADER */}
      <div className="bg-white shadow rounded-xl p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Sale Details</h1>
          <p className="text-gray-500">
            Sale Number: {sale.saleNumber ?? "N/A"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-medium">
            {sale.createdAt
              ? new Date(sale.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      {/* PAYMENT INFO */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* CUSTOMER */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="font-semibold text-lg mb-3">Customer</h2>

          {sale.customerId ? (
            <p className="text-gray-700">
              Customer ID: {sale.customerId}
              <span className="block text-sm text-gray-500">
                Customer Name: {customer?.customer?.name ?? "N/A"}
              </span>
            </p>
          ) : (
            <p className="text-gray-500">Walk-in Customer</p>
          )}
        </div>

        {/* PAYMENT */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="font-semibold text-lg mb-3">Payment Info</h2>

          <div className="space-y-2 text-sm">

            <div className="flex justify-between">
              <span>Total Amount</span>
              <span className="font-medium">
                ৳ {sale.totalAmount}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Paid</span>
              <span className="text-green-600 font-medium">
                ৳ {sale.paidAmount}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Due</span>
              <span className="text-red-500 font-medium">
                ৳ {sale.dueAmount}
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* PRODUCT TABLE */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="font-semibold text-lg">Products</h2>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">Product ID</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-center">Sell Price</th>
              <th className="p-3 text-center">Cost</th>
              <th className="p-3 text-center">Total</th>
              <th className="p-3 text-center">Profit</th>
            </tr>
          </thead>

          <tbody>
            {sale.products?.map((item: SaleProduct, index: number) => (
              <tr key={index} className="border-t hover:bg-gray-50">

                <td className="p-3">
                  {item.productId}
                </td>

                <td className="p-3 text-center">
                  {item.quantity}
                </td>

                <td className="p-3 text-center">
                  ৳ {item.sellingPrice}
                </td>

                <td className="p-3 text-center">
                  ৳ {item.costPrice}
                </td>

                <td className="p-3 text-center font-medium">
                  ৳ {item.totalPrice}
                </td>

                <td className="p-3 text-center text-green-600 font-medium">
                  ৳ {item.profit}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SUMMARY */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="font-semibold text-lg mb-4">
          Sale Summary
        </h2>

        <div className="grid md:grid-cols-4 gap-4 text-sm">

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Total Sales</p>
            <p className="text-xl font-bold">
              ৳ {sale.totalAmount}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Total Cost</p>
            <p className="text-xl font-bold">
              ৳ {sale.totalCost}
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-gray-500">Total Profit</p>
            <p className="text-xl font-bold text-green-600">
              ৳ {sale.totalProfit}
            </p>
          </div>

          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-gray-500">Discount</p>
            <p className="text-xl font-bold text-red-500">
              ৳ {sale.discount ?? 0}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default SaleDetails;