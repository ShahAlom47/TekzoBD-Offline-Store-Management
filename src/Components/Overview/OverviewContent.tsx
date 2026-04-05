"use client";

import React from "react";
import { Overview } from "@/Interfaces/overviewInterface";

interface Props {
  data: Overview;
}

const OverviewContent: React.FC<Props> = ({ data }) => {
  if (!data) return <p>No data available</p>;

  const { overall, filtered, counts, today, thisWeek, thisMonth, stock, insights } = data;

  const cards = [
    { title: "Total Purchase", value: overall.totalPurchase, bg: "bg-blue-100", text: "text-blue-800" },
    { title: "Total Sales", value: overall.totalSales, bg: "bg-green-100", text: "text-green-800" },
    { title: "Total Expense", value: overall.totalExpense, bg: "bg-red-100", text: "text-red-800" },
    { title: "Total Payment", value: overall.totalPayment, bg: "bg-purple-100", text: "text-purple-800" },
    { title: "Profit", value: overall.profit, bg: "bg-yellow-100", text: "text-yellow-800" },
  ];

  const stockCards = [
    { title: "Total Products", value: stock.totalProducts },
    { title: "In Stock", value: stock.inStock },
    { title: "Out of Stock", value: stock.outOfStock },
    { title: "Low Stock", value: stock.lowStock },
    { title: "Stock Value", value: stock.totalStockValue },
  ];

  return (
    <div className="space-y-6">
      {/* 🔹 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div key={card.title} className={`p-4 rounded shadow ${card.bg}`}>
            <p className="text-sm font-medium">{card.title}</p>
            <p className={`text-xl font-bold ${card.text}`}>{card.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* 🔹 Counts */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Counts</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-2 bg-gray-100 rounded text-center">
            <p className="text-sm font-medium">Purchases</p>
            <p className="font-bold">{counts.totalPurchases}</p>
          </div>
          <div className="p-2 bg-gray-100 rounded text-center">
            <p className="text-sm font-medium">Sales</p>
            <p className="font-bold">{counts.totalSales}</p>
          </div>
          <div className="p-2 bg-gray-100 rounded text-center">
            <p className="text-sm font-medium">Expenses</p>
            <p className="font-bold">{counts.totalExpenses}</p>
          </div>
        </div>
      </div>

      {/* 🔹 Stock Cards */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Stock Overview</h3>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {stockCards.map((s) => (
            <div key={s.title} className="p-2 bg-gray-100 rounded text-center">
              <p className="text-sm font-medium">{s.title}</p>
              <p className="font-bold">{s.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Insights */}
      {insights && (
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-2">Business Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.topSellingProduct && (
              <div className="p-2 bg-gray-100 rounded text-center">
                <p className="text-sm font-medium">Top Product</p>
                <p className="font-bold">{insights.topSellingProduct}</p>
              </div>
            )}
            {insights.topExpenseCategory && (
              <div className="p-2 bg-gray-100 rounded text-center">
                <p className="text-sm font-medium">Top Expense Category</p>
                <p className="font-bold">{insights.topExpenseCategory}</p>
              </div>
            )}
            {insights.topPaymentMethod && (
              <div className="p-2 bg-gray-100 rounded text-center">
                <p className="text-sm font-medium">Top Payment Method</p>
                <p className="font-bold">{insights.topPaymentMethod}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewContent;