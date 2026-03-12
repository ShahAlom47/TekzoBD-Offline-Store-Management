/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import {
  getProductCollection,
  getSalesCollection,
} from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";
import { Product } from "@/Interfaces/productInterface";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const productCollection = await getSalesCollection();

    // 🔹 Pagination
    const currentPage = parseInt(
      url.searchParams.get("currentPage") || "1",
      10,
    );
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const skip = (currentPage - 1) * pageSize;

    if (isNaN(currentPage) || isNaN(pageSize)) {
      return NextResponse.json(
        { success: false, message: "Invalid pagination params" },
        { status: 400 },
      );
    }

    // 🔹 Query params
    const searchTrim = url.searchParams.get("searchTrim")?.trim() || "";

    // 🔹 Build filter
    const filter: any = { isDeleted: { $ne: true } }; // ignore deleted

    // --- Search
    if (searchTrim) {
      const regex = { $regex: searchTrim, $options: "i" };
      const orConditions: any[] = [
        { name: regex },
        { slug: regex },
        { brand: regex },
        { productCode: regex },
      ];
      try {
        const id = new ObjectId(searchTrim);
        orConditions.push({ _id: id });
      } catch {}
      filter.$or = orConditions;
    }

    return NextResponse.json({
      success: true,
      message: "Products retrieved successfully",
      data: products,

      currentPage,
      pageSize,
      totalData: total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve products",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
