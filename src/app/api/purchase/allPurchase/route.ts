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

    // =========================
    // 🔍 SEARCH (FIXED)
    // =========================
    if (searchTrim) {
      const regex = { $regex: searchTrim, $options: "i" };

      const orConditions: any[] = [
        { "memos.shopName": regex },
        { "memos.memoNumber": regex },
      ];

      // ObjectId search (safe way)
      if (ObjectId.isValid(searchTrim)) {
        orConditions.push({ _id: new ObjectId(searchTrim) });
      }

      filter.$or = orConditions;
    }

    // =========================
    // 📅 DATE FILTER (IMPORTANT FIX)
    // =========================
    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        filter.date.$gte = startDate; // ISO string compare
      }

      if (endDate) {
        filter.date.$lt = endDate; // ⚠️ use $lt (NOT $lte)
      }
    }

    // =========================
    // 🔽 SORT
    // =========================
    const sortQuery: any = { date: -1 };

    // =========================
    // 🚀 QUERY EXECUTION
    // =========================
    const [purchases, total] = await Promise.all([
      purchaseCollection
        .find(filter)
        .sort(sortQuery)
        .skip(skip)
        .limit(pageSize)
        .toArray() as Promise<Purchase[]>,

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