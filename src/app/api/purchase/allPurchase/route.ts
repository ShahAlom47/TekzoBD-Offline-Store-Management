/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getPurchaseCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";
import { Purchase } from "@/Interfaces/purchaseInterface";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const purchaseCollection = await getPurchaseCollection();

    // 🔹 Pagination
    const currentPage = parseInt(url.searchParams.get("currentPage") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const skip = (currentPage - 1) * pageSize;

    if (isNaN(currentPage) || isNaN(pageSize)) {
      return NextResponse.json(
        { success: false, message: "Invalid pagination params" },
        { status: 400 }
      );
    }

    // 🔹 Query params
    const searchTrim = url.searchParams.get("searchTrim")?.trim() || "";
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    // 🔹 Build filter
    const filter: any = {};

    // --- Search (shopName or memoNumber)
    if (searchTrim) {
      const regex = { $regex: searchTrim, $options: "i" };
      filter.$or = [
        { "memos.shopName": regex },
        { "memos.memoNumber": regex },
      ];

      // Try ObjectId search
      try {
        const id = new ObjectId(searchTrim);
        filter._id = id;
      } catch {}
    }

    // --- Date filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // 🔹 Sorting (newest first)
    const sortQuery: any = { date: -1 };

    // 🔹 Fetch purchases + total count in parallel
    const [purchases, total] = await Promise.all([
      purchaseCollection.find(filter).sort(sortQuery).skip(skip).limit(pageSize).toArray() as Promise<Purchase[]>,
      purchaseCollection.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      message: "Purchases retrieved successfully",
      data: purchases,
      currentPage,
      pageSize,
      totalData: total,
      totalPages: Math.ceil(total / pageSize),
    });

  } catch (error: any) {
    console.error("GET /api/purchase/allPurchase error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve purchases",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}