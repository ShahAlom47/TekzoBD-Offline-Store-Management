import { NextRequest, NextResponse } from "next/server";
import { getExpensesCollection } from "@/lib/database/db_collections";

export async function GET(req: NextRequest) {
  try {
    const expenseCollection = await getExpensesCollection();

    const expenses = await expenseCollection
      .find({})
      .sort({ expenseDate: -1 }) // latest first
      .toArray();

    return NextResponse.json({
      success: true,
      message: "Expenses fetched successfully",
      data: expenses,
    });
  } catch (error) {
    console.error("Get Expenses Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}