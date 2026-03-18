/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getSalesCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const salesCollection = await getSalesCollection();

    // 🔹 Pagination
    const currentPage = parseInt(
      url.searchParams.get("currentPage") || "1",
      10
    );

    const pageSize = parseInt(
      url.searchParams.get("pageSize") || "10",
      10
    );

    if (isNaN(currentPage) || isNaN(pageSize)) {
      return NextResponse.json(
        { success: false, message: "Invalid pagination params" },
        { status: 400 }
      );
    }

    const skip = (currentPage - 1) * pageSize;

    // 🔹 Params
    const searchTrim = url.searchParams.get("searchTrim")?.trim() || "";
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const status = url.searchParams.get("status");

    // 🔹 Filter
    const filter: any = {};

    // ✅ Search filter
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

    // ✅ Status filter (🔥 dynamic)
    if (status) {
      if (status === "paid") {
        filter.dueAmount = 0;
      } else if (status === "due") {
        filter.dueAmount = { $gt: 0 };
      } else if (status === "unpaid") {
        filter.paidAmount = 0;
      }
    }

    // 🔹 Get data
    const sales = await salesCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const total = await salesCollection.countDocuments(filter);

    return NextResponse.json({
      success: true,
      message: "Sales retrieved successfully",
      data: sales,
      currentPage,
      pageSize,
      totalData: total,
      totalPages: Math.ceil(total / pageSize),
    });

  } catch (error: any) {
    console.error("GET /api/sales error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve sales",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}