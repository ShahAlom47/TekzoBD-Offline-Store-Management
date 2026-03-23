/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getPaymentsCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const paymentCollection = await getPaymentsCollection();

    // 🔹 Pagination
    const currentPage = parseInt(url.searchParams.get("currentPage") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const skip = (currentPage - 1) * pageSize;

    // 🔹 Params
    const searchTrim = url.searchParams.get("searchTrim")?.trim() || "";
    const startDate = url.searchParams.get("startDate"); // YYYY-MM-DD
    const endDate = url.searchParams.get("endDate"); // YYYY-MM-DD
    const method = url.searchParams.get("method"); // CASH / BKASH etc

    // 🔹 Filter
    const filter: any = {};

    // ✅ Search (customerId / _id / saleId)
    if (searchTrim) {
      const orConditions: any[] = [];
      try {
        const id = new ObjectId(searchTrim);
        orConditions.push({ _id: id });
        orConditions.push({ customerId: id });
        orConditions.push({ saleId: id });
      } catch {}
      filter.$or = orConditions;
    }

    // ✅ Date filter (paymentDate)
    if (startDate || endDate) {
      filter.paymentDate = {};
      if (startDate) {
        filter.paymentDate.$gte = new Date(`${startDate}T00:00:00Z`);
      }
      if (endDate) {
        const end = new Date(`${endDate}T23:59:59Z`);
        filter.paymentDate.$lte = end;
      }
    }

    // ✅ Method filter
    if (method && method !== "all") {
      filter.method = method;
    }

    // 🔹 Get data
    const payments = await paymentCollection
      .find(filter)
      .sort({ paymentDate: -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const total = await paymentCollection.countDocuments(filter);

    return NextResponse.json({
      success: true,
      message: "Payments retrieved successfully",
      data: payments,
      currentPage,
      pageSize,
      totalData: total,
      totalPages: Math.ceil(total / pageSize),
    });

  } catch (error: any) {
    console.error("GET /api/payments error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve payments",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}