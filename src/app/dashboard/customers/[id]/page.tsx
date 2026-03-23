"use client";

import { useState } from "react";
import CustomerSaleHistoryTable from "@/Components/CustomerComponet/CustomerSaleHistoryTable";
import { useCustomer } from "@/hook/useCustomer";
import { Customer } from "@/Interfaces/customerInterface";
import { useParams } from "next/navigation";
import { Phone, Mail, MapPin, Wallet } from "lucide-react";
interface FormType{
  amount:number;
  method:"CASH"|"CASH"|"BANK"|"CARD";
  note?:string;
  transactionId:string;
  paymentDate:string;
}

const CustomerDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useCustomer(id?.toString() || "");

  const [openPayment, setOpenPayment] = useState(false);
  const [formData, setFormData] = useState<FormType>({
  amount: 0,
  method: "CASH",
  note: "",
  transactionId:'',
  paymentDate:'',
});

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

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handlePayDue = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    // 🔴 basic validation
    if (!formData.amount || Number(formData.amount) <= 0) {
      alert("Enter valid amount");
      return;
    }

    if (!id) {
      alert("Customer not found");
      return;
    }

    const payload = {
      customerId: id,
      amount: Number(formData.amount),
      method: formData.method,
      note: formData.note,

      // ✅ only if not CASH
      transactionId:
        formData.method !== "CASH"
          ? formData.transactionId
          : undefined,

      // ✅ payment date (fallback today)
      paymentDate: formData.paymentDate
        ? new Date(formData.paymentDate)
        : new Date(),
    };

    console.log("PAYLOAD:", payload);

    // 🔥 API CALL
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Payment failed");
    }

    // ✅ success
    alert("✅ Payment added successfully");

    // 🔄 reset form (correct way)
    setFormData({
      amount: 0,
      method: "CASH",
      note: "",
      transactionId: "",
      paymentDate: new Date().toISOString().split("T")[0],
    });

    // ❌ close modal AFTER success
    setOpenPayment(false);

    // 🔄 optional refetch
    // refetchCustomer();
    // refetchSummary();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    alert(error.message || "Something went wrong");
  }
};

  return (
    <div className="p-2 md:p-4 space-y-6 max-w-7xl mx-auto">

      {/* 🔹 Customer Header */}
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

        {/* 🔹 Due + Button */}
        <div className="text-right space-y-2">
          <p className="text-sm opacity-80">Current Due</p>

          <p className="text-3xl font-bold flex items-center gap-2 justify-end">
            <Wallet size={20}/> ৳ {summary?.currentDue || 0}
          </p>

          {/* ✅ Modern Button */}
          <button
            onClick={() => setOpenPayment(true)}
            className="mt-2 flex items-center gap-2 bg-white text-indigo-600 font-semibold px-4 py-2 rounded-xl shadow hover:shadow-lg hover:scale-95 transition"
          >
            <Wallet size={18} />
            Pay Due
          </button>
        </div>
      </div>


      {/* 🔹 Financial Summary */}
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


      {/* 🔹 Sales History */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-4">
          Sales History
        </h3>

        <CustomerSaleHistoryTable saleData={sales} />
      </div>


{/* 🔥 PAYMENT MODAL */}
{openPayment && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 animate-scaleIn">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Add Payment</h2>
        <button
          onClick={() => setOpenPayment(false)}
          className="text-gray-400 hover:text-red-500"
        >
          ✕
        </button>
      </div>

      {/* Due Info */}
      <div className="bg-gray-100 rounded-lg p-3 text-sm">
        Current Due:{" "}
        <span className="font-bold text-red-500">
          ৳ {summary?.currentDue}
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handlePayDue} className="space-y-4">

        {/* Amount */}
        <div>
          <label className="text-sm">Amount</label>
          <input
            type="number"
            name="amount"
            required
            min="1"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        {/* Method */}
        <div>
          <label className="text-sm">Payment Method</label>
          <select
            name="method"
            value={formData.method}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
          >
            <option value="CASH">Cash</option>
            <option value="BKASH">bKash</option>
            <option value="BANK">Bank</option>
            <option value="CARD">Card</option>
          </select>
        </div>

        {/* 🔥 Transaction ID (Conditional) */}
        {formData.method !== "CASH" && (
          <div>
            <label className="text-sm">Transaction ID</label>
            <input
              type="text"
              name="transactionId"
              value={formData.transactionId}
              onChange={handleChange}
              placeholder="Enter transaction ID"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>
        )}

        {/* 🔥 Payment Date */}
        <div>
          <label className="text-sm">Payment Date</label>
          <input
            type="date"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
          />
        </div>

        {/* Note */}
        <div>
          <label className="text-sm">Note</label>
          <input
            type="text"
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Optional note"
            className="w-full border rounded-lg p-2 mt-1"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setOpenPayment(false)}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Save Payment
          </button>
        </div>

      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default CustomerDetails;