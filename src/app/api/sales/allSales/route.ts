/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getSalesCollection, getPaymentsCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const salesCollection = await getSalesCollection();
    const paymentsCollection = await getPaymentsCollection();

    // 🔹 Pagination
    const currentPage = parseInt(url.searchParams.get("currentPage") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const skip = (currentPage - 1) * pageSize;

    // 🔹 Params
    const searchTrim = url.searchParams.get("searchTrim")?.trim() || "";
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const status = url.searchParams.get("status"); // paid/due/unpaid

    // 🔹 Filter
    const filter: any = {};

    if (searchTrim) {
      const orConditions: any[] = [
        { saleNumber: { $regex: searchTrim, $options: "i" } },
        { customerId: { $regex: searchTrim, $options: "i" } },
      ];
      try {
        const id = new ObjectId(searchTrim);
        orConditions.push({ _id: id });
      } catch {}
      filter.$or = orConditions;
    }

    // Date filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    // 🔹 Fetch sales
    const sales = await salesCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();



    // 🔹 Fetch all related payments for these sales
    const saleIds = sales.map((s) => s._id.toString());
    const payments = await paymentsCollection
      .find({ saleId: { $in: saleIds } })
      .toArray();
      
// console.log(payments)

    // 🔹 Map payments to sales
    const salesWithPayment = sales.map((sale) => {
      const relatedPayments = payments.filter(
        (p) => p.saleId?.toString() === sale._id?.toString()
      );
      const totalPaid = relatedPayments.reduce((acc, p) => acc + p.amount, 0);
      const dueAmount = Math.max(sale.totalAmount - totalPaid, 0);

      // console.log(saleIds,'iddd')

      return {
        ...sale,
        paidAmount: totalPaid,
        dueAmount,
      };
    });

    // 🔹 Optional: status filter on calculated values
    const filteredSales = salesWithPayment.filter((s) => {
      if (!status || status === "all") return true;
      if (status === "paid") return s.dueAmount === 0;
      if (status === "due") return s.dueAmount > 0;
      if (status === "unpaid") return s.paidAmount === 0;
      return true;
    });

    const total = await salesCollection.countDocuments(filter);

    return NextResponse.json({
      success: true,
      message: "Sales retrieved successfully",
      data: filteredSales,
      currentPage,
      pageSize,
      totalData: total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error: any) {
    console.error("GET /api/sales error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve sales", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}