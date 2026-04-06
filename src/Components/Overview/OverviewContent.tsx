"use client";

import React from "react";
import { Overview } from "@/Interfaces/overviewInterface";
import {
  ShoppingCart,
  DollarSign,
  CreditCard,
  TrendingUp,
  Box,
  Wallet,
  AlertCircle,
} from "lucide-react";

interface Props {
  data: Overview;
}

const OverviewContent: React.FC<Props> = ({ data }) => {
  if (!data)
    return <p className="text-center text-gray-500 mt-4">No data available</p>;

  const { overall, counts, stock, insights } = data;

  // 🔥 MAIN FINANCIAL CARDS
  const summaryCards = [
    {
      title: "Sales",
      value: overall.totalSales,
      icon: <DollarSign className="w-6 h-6" />,
      color: "bg-green-50 text-green-700",
    },
    {
      title: "Payment",
      value: overall.totalPayment,
      icon: <Wallet className="w-6 h-6" />,
      color: "bg-purple-50 text-purple-700",
    },
    {
      title: "Due",
      value: overall.totalDue,
      icon: <AlertCircle className="w-6 h-6" />,
      color: "bg-red-50 text-red-700",
    },
    {
      title: "Cost",
      value: overall.totalCost,
      icon: <CreditCard className="w-6 h-6" />,
      color: "bg-orange-50 text-orange-700",
    },
    {
      title: "Profit",
      value: overall.profit,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      title: "Balance",
      value: overall.netBalance,
      icon: <Wallet className="w-6 h-6" />,
      color: "bg-blue-50 text-blue-700",
    },
  ];

  // 🔹 Stock Cards
  const stockCards = [
    { title: "Total Products", value: stock.totalProducts },
    { title: "In Stock", value: stock.inStock },
    { title: "Out of Stock", value: stock.outOfStock },
    { title: "Low Stock", value: stock.lowStock },
    { title: "Stock Value", value: stock.totalStockValue },
  ];

  return (
    <div className="space-y-8">

      {/* 🔥 FINANCIAL OVERVIEW */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {summaryCards.map((card) => (
            <div
              key={card.title}
              className={`p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex items-center gap-4 ${card.color}`}
            >
              <div className="p-3 bg-white rounded-full shadow">
                {card.icon}
              </div>

              <div>
                <p className="text-sm font-medium">{card.title}</p>
                <p className="text-2xl font-bold mt-1">
                  {card.value.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 COUNTS */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Transaction Counts</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl text-center">
            <p className="text-sm">Purchases</p>
            <p className="text-xl font-bold">{counts.totalPurchases}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl text-center">
            <p className="text-sm">Sales</p>
            <p className="text-xl font-bold">{counts.totalSales}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl text-center">
            <p className="text-sm">Expenses</p>
            <p className="text-xl font-bold">{counts.totalExpenses}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl text-center">
            <p className="text-sm">Payments</p>
            <p className="text-xl font-bold">{counts.totalPayments}</p>
          </div>
        </div>
      </div>

      {/* 🔹 STOCK */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Stock Overview</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stockCards.map((s) => (
            <div
              key={s.title}
              className="p-4 rounded-xl bg-gray-50 text-center shadow-sm hover:shadow-md transition"
            >
              <Box className="w-6 h-6 mx-auto mb-2 text-gray-500" />
              <p className="text-sm">{s.title}</p>
              <p className="text-xl font-bold">
                {s.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 INSIGHTS */}
      {insights && (
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Business Insights</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.topSellingProduct && (
              <div className="p-4 bg-indigo-50 rounded-xl text-center">
                <p className="text-sm">Top Product</p>
                <p className="text-xl font-bold">
                  {insights.topSellingProduct}
                </p>
              </div>
            )}

            {insights.topExpenseCategory && (
              <div className="p-4 bg-pink-50 rounded-xl text-center">
                <p className="text-sm">Top Expense</p>
                <p className="text-xl font-bold">
                  {insights.topExpenseCategory}
                </p>
              </div>
            )}

            {insights.topPaymentMethod && (
              <div className="p-4 bg-teal-50 rounded-xl text-center">
                <p className="text-sm">Top Payment</p>
                <p className="text-xl font-bold">
                  {insights.topPaymentMethod}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewContent;