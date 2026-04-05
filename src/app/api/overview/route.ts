import { NextRequest, NextResponse } from "next/server";
import { getPurchaseCollection, getSalesCollection, getExpensesCollection, getProductCollection } from "@/lib/database/db_collections";
import { Overview } from "@/Interfaces/overviewInterface";


export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    const purchaseCollection = await getPurchaseCollection();
    const saleCollection = await getSalesCollection();
    const expenseCollection = await getExpensesCollection();
    const productCollection = await getProductCollection();

    // 🔹 Build date filter
    const dateFilter: any = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    // ------------------------
    // 1️⃣ Summary Calculations
    // ------------------------

    // Purchases
    const purchaseMatch: any = {};
    if (startDate || endDate) purchaseMatch.date = dateFilter;

    const totalPurchaseResult = await purchaseCollection.aggregate([
      { $match: purchaseMatch },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } }
    ]).toArray();
    const totalPurchase = totalPurchaseResult[0]?.totalAmount || 0;

    // Expenses
    const expenseMatch: any = {};
    if (startDate || endDate) expenseMatch.date = dateFilter;

    const totalExpenseResult = await expenseCollection.aggregate([
      { $match: expenseMatch },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]).toArray();
    const totalExpense = totalExpenseResult[0]?.totalAmount || 0;

    // Sales
    const saleMatch: any = {};
    if (startDate || endDate) saleMatch.date = dateFilter;

    const totalSalesResult = await saleCollection.aggregate([
      { $match: saleMatch },
      { $group: { _id: null, totalAmount: { $sum: "$total" } } }
    ]).toArray();
    const totalSales = totalSalesResult[0]?.totalAmount || 0;

    const profit = totalSales - totalPurchase - totalExpense;

    // ------------------------
    // 2️⃣ Counts
    // ------------------------
    const [totalPurchases, totalExpenses, totalSalesCount] = await Promise.all([
      purchaseCollection.countDocuments(purchaseMatch),
      expenseCollection.countDocuments(expenseMatch),
      saleCollection.countDocuments(saleMatch),
    ]);

    // ------------------------
    // 3️⃣ Stock
    // ------------------------
    const products = await productCollection.find().toArray();
    const totalProducts = products.length;
    const inStock = products.filter(p => p.stock > 0).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock < 5).length;
    const totalStockValue = products.reduce((acc, p) => acc + (p.stock * p.price), 0);

    // ------------------------
    // 4️⃣ Insights
    // ------------------------
    // Top Selling Product
    const topProductResult = await saleCollection.aggregate([
      { $unwind: "$products" },
      { $group: { _id: "$products.productId", totalQty: { $sum: "$products.qty" } } },
      { $sort: { totalQty: -1 } },
      { $limit: 1 }
    ]).toArray();
    const topSellingProduct = topProductResult[0]?._id || null;

    // Top Expense Category
    const topExpenseCategoryResult = await expenseCollection.aggregate([
      { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } },
      { $sort: { totalAmount: -1 } },
      { $limit: 1 }
    ]).toArray();
    const topExpenseCategory = topExpenseCategoryResult[0]?._id || null;

    // ------------------------
    // 5️⃣ Build Overview object
    // ------------------------
    const overview: Overview = {
      summary: { totalPurchase, totalExpense, totalSales, profit },
      counts: { totalPurchases, totalExpenses, totalSales: totalSalesCount },
      today: { purchase: totalPurchase, expense: totalExpense, sales: totalSales }, // simple, can split by date later
      thisMonth: { purchase: totalPurchase, expense: totalExpense, sales: totalSales }, // same
      stock: { totalProducts, inStock, outOfStock, lowStock, totalStockValue },
      insights: { topSellingProduct, topExpenseCategory },
    };

    return NextResponse.json({ success: true, data: overview });

  } catch (error: any) {
    console.error("GET /api/overview error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch overview",
      error: error.message || String(error)
    }, { status: 500 });
  }
}