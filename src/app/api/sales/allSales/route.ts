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

    // 🔹 Search param
    const searchTrim = url.searchParams.get("searchTrim")?.trim() || "";

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

    // 🔹 Get latest sales first
    const sales = await salesCollection
      .find(filter)
      .sort({ createdAt: -1 }) // latest first
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