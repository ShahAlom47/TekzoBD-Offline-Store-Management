"use client";

import CustomerSaleHistoryTable from "@/Components/CustomerComponet/CustomerSaleHistoryTable";
import { useCustomer } from "@/hook/useCustomer";
import { Customer } from "@/Interfaces/customerInterface";
import { useParams } from "next/navigation";
import { Phone, Mail, MapPin, Wallet } from "lucide-react";

const CustomerDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useCustomer(id?.toString() || "");

  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-500 animate-pulse">
        Loading customer data...
      </div>
    );
  }

  const customer = data?.customer as Customer;
  const sales = data?.sales || [];
  const summary = data?.summary;

  console.log(data)

  return (
    <div className="p-2 md:p-4 space-y-6 max-w-7xl mx-auto">

      {/* Customer Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        <div>
          <h2 className="text-2xl md:text-3xl font-bold">{customer?.name}</h2>

          <div className="space-y-1 mt-2 text-sm opacity-90">

            <p className="flex items-center gap-2">
              <Phone size={16}/> {customer?.phone}
            </p>

            <p className="flex items-center gap-2">
              <Mail size={16}/> {customer?.email}
            </p>

            <p className="flex items-center gap-2">
              <MapPin size={16}/> {customer?.address}
            </p>

          </div>

          <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur">
            {customer?.customerType}
          </span>
        </div>

        <div className="text-right">
          <p className="text-sm opacity-80">Current Due</p>

          <p className="text-3xl font-bold flex items-center gap-2 justify-end">
            <Wallet size={20}/> ৳ {summary?.currentDue || 0}
          </p>
        </div>
      </div>


      {/* Financial Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-xs text-gray-500">Total Purchase</p>
          <p className="text-lg font-semibold text-indigo-600">
            ৳ {summary?.totalPurchase || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-xs text-gray-500">Total Paid</p>
          <p className="text-lg font-semibold text-green-600">
            ৳ {summary?.totalPaid || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-xs text-gray-500">Total Due</p>
          <p className="text-lg font-semibold text-red-500">
            ৳ {summary?.totalDue || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-xs text-gray-500">Opening Balance</p>
          <p className="text-lg font-semibold text-gray-700">
            ৳ {summary?.openingBalance || 0}
          </p>
        </div>

      </div>


      {/* Sales History */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-4">
          Sales History
        </h3>

        <CustomerSaleHistoryTable saleData={sales} />
      </div>

    </div>
  );
};

export default CustomerDetails;