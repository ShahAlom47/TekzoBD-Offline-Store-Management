/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getPaymentsCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const paymentCollection = await getPaymentsCollection();

    // 🔹 Pagination
    const currentPage = parseInt(
      url.searchParams.get("currentPage") || "1",
      10
    );

    const pageSize = parseInt(
      url.searchParams.get("pageSize") || "10",
      10
    );

    const skip = (currentPage - 1) * pageSize;

    // 🔹 Params
    const searchTrim = url.searchParams.get("searchTrim")?.trim() || "";
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
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

    // ✅ Date filter
    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    // ✅ Method filter
    if (method && method !== "all") {
      filter.method = method;
    }

    // 🔹 Get data
    const payments = await paymentCollection
      .find(filter)
      .sort({ createdAt: -1 })
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
      },
      { status: 500 }
    );
  }
}