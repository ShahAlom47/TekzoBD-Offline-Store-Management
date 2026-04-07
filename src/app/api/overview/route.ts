/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { Overview } from "@/Interfaces/overviewInterface";
import {
  getPurchaseCollection,
  getSalesCollection,
  getExpensesCollection,
  getProductCollection,
  getPaymentsCollection,
} from "@/lib/database/db_collections";
import { PaymentMethod } from "@/Interfaces/paymentInterface";

type DateRange = { startDate?: string; endDate?: string };

// Helper to build date filter for MongoDB
const buildDateFilter = (field: string, range: DateRange) => {
  if (!range.startDate && !range.endDate) return {};
  const filter: any = {};
  if (range.startDate) filter.$gte = new Date(range.startDate);
  if (range.endDate) filter.$lte = new Date(range.endDate);
  return { [field]: filter };
};

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const startDate = url.searchParams.get("startDate") || undefined;
    const endDate = url.searchParams.get("endDate") || undefined;
    const dateRange: DateRange = { startDate, endDate };

    console.log(startDate,endDate,'start date end date ')

    // ------------------------
    // 1️⃣ Collections
    // ------------------------
    const [
      purchaseCollection,
      saleCollection,
      expenseCollection,
      productCollection,
      paymentCollection,
    ] = await Promise.all([
      getPurchaseCollection(),
      getSalesCollection(),
      getExpensesCollection(),
      getProductCollection(),
      getPaymentsCollection(),
    ]);

    // ------------------------
    // 2️⃣ Aggregations
    // ------------------------

    // Purchases
    const purchaseFilter = buildDateFilter("date", dateRange);
    const totalPurchaseResult = await purchaseCollection
      .aggregate([
        { $match: purchaseFilter },
        { $group: { _id: null, totalAmount: { $sum: "$grandTotal" } } },
      ])
      .toArray();
    const totalPurchase = totalPurchaseResult[0]?.totalAmount || 0;
    const totalPurchasesCount =
      await purchaseCollection.countDocuments(purchaseFilter);

    // Expenses
    const expenseFilter = buildDateFilter("expenseDate", dateRange);
    const totalExpenseResult = await expenseCollection
      .aggregate([
        { $match: expenseFilter },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ])
      .toArray();
    const totalExpense = totalExpenseResult[0]?.totalAmount || 0;
    const totalExpensesCount =
      await expenseCollection.countDocuments(expenseFilter);

    // Sales
    const saleFilter = buildDateFilter("createdAt", dateRange);
    const totalSalesResult = await saleCollection
      .aggregate([
        { $match: saleFilter },
        { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
      ])
      .toArray();
    const totalSales = totalSalesResult[0]?.totalAmount || 0;
    const totalSalesCount =
      await saleCollection.countDocuments(saleFilter);

    // Payments
    const paymentFilter = buildDateFilter("paymentDate", dateRange);
    const totalPaymentResult = await paymentCollection
      .aggregate([
        { $match: paymentFilter },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ])
      .toArray();
    const totalPayment = totalPaymentResult[0]?.totalAmount || 0;
    const totalPaymentsCount =
      await paymentCollection.countDocuments(paymentFilter);

    // ------------------------
    // 3️⃣ Financial Calculations 🔥
    // ------------------------

    const totalCost = totalPurchase + totalExpense; // 💸
    const profit = totalSales - totalCost;          // 🟢
    const totalDue = totalSales - totalPayment;     // 🔴
    const netBalance = totalPayment - totalCost;    // 🏦

    // ------------------------
    // 4️⃣ Stock Info
    // ------------------------
    const products = await productCollection.find().toArray();
    const totalProducts = products.length;
    const inStock = products.filter((p) => p.currentStock > 0).length;
    const outOfStock = products.filter((p) => p.currentStock === 0).length;
    const lowStock = products.filter(
      (p) => p.currentStock > 0 && p.currentStock < 5
    ).length;
    const totalStockValue = products.reduce(
      (acc, p) => acc + p.currentStock * p.costPrice,
      0
    );

    // ------------------------
    // 5️⃣ Insights
    // ------------------------

    const topProductResult = await saleCollection
      .aggregate([
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.productId",
            totalQty: { $sum: "$products.quantity" },
          },
        },
        { $sort: { totalQty: -1 } },
        { $limit: 1 },
      ])
      .toArray();

    const topSellingProduct = topProductResult[0]?._id || null;

    const topExpenseCategoryResult = await expenseCollection
      .aggregate([
        {
          $group: {
            _id: "$category",
            totalAmount: { $sum: "$amount" },
          },
        },
        { $sort: { totalAmount: -1 } },
        { $limit: 1 },
      ])
      .toArray();

    const topExpenseCategory = topExpenseCategoryResult[0]?._id || null;

    const topPaymentMethodResult = await paymentCollection
      .aggregate([
        { $match: paymentFilter },
        {
          $group: {
            _id: "$method",
            totalAmount: { $sum: "$amount" },
          },
        },
        { $sort: { totalAmount: -1 } },
        { $limit: 1 },
      ])
      .toArray();

    const topPaymentMethod: PaymentMethod | undefined =
      topPaymentMethodResult[0]?._id || undefined;

    // ------------------------
    // 6️⃣ Final Overview
    // ------------------------

    const overview: Overview = {
      overall: {
        totalPurchase,
        totalExpense,
        totalSales,
        totalPayment,
        totalCost,
        totalDue,
        netBalance,
        profit,
      },

      filtered: {
        purchase: totalPurchase,
        expense: totalExpense,
        sales: totalSales,
        payment: totalPayment,
        cost: totalCost,
        due: totalDue,
        profit,
      },

      counts: {
        totalPurchases: totalPurchasesCount,
        totalExpenses: totalExpensesCount,
        totalSales: totalSalesCount,
        totalPayments: totalPaymentsCount,
      },

      today: {
        purchase: totalPurchase,
        expense: totalExpense,
        sales: totalSales,
        payment: totalPayment,
        due: totalDue,
      },

      thisWeek: {
        purchase: totalPurchase,
        expense: totalExpense,
        sales: totalSales,
        payment: totalPayment,
        due: totalDue,
      },

      thisMonth: {
        purchase: totalPurchase,
        expense: totalExpense,
        sales: totalSales,
        payment: totalPayment,
        due: totalDue,
      },

      stock: {
        totalProducts,
        inStock,
        outOfStock,
        lowStock,
        totalStockValue,
      },

      insights: {
        topSellingProduct,
        topExpenseCategory,
        topPaymentMethod,
      },
    };

    return NextResponse.json({ success: true, data: overview });
  } catch (error: any) {
    console.error("GET /api/overview error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch overview",
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}