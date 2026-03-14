/* eslint-disable @typescript-eslint/no-explicit-any */
import {  getSalesCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid or missing ID", success: false },
        { status: 400 }
      );
    }

    const saleCollection = await getSalesCollection();

    const sale = await saleCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!sale) {
      return NextResponse.json(
        { message: "Sale not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Sale fetched successfully",
        success: true,
        data: sale,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in GET /api/sales/[id]:", error);

    return NextResponse.json(
      {
        message: "An error occurred while fetching the sale",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}