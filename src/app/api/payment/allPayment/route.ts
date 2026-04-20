/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getPaymentsCollection } from "@/lib/database/db_collections";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const paymentCollection = await getPaymentsCollection();

    // 🔹 Pagination
    const currentPage = parseInt(url.searchParams.get("currentPage") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const skip = (currentPage - 1) * pageSize;

    // 🔹 Params
 
    const month = url.searchParams.get("month"); // 🔥 NEW (YYYY-MM)
    console.log("Month:", month);
    // Month: 2026-04

    // 🔹 Filter
    const filter: any = {};
   

    // ✅ Month filter (priority)
    if (month) {
      const [year, monthNum] = month.split("-").map(Number);

      const start = new Date(Date.UTC(year, monthNum - 1, 1, 0, 0, 0));
      const end = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59));

      filter.paymentDate = {
        $gte: start,
        $lte: end,
      };
    }
  


    // 🔹 Get paginated data
    const payments = await paymentCollection
      .find(filter)
      .sort({ paymentDate: -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    // 🔹 Total documents
    const total = await paymentCollection.countDocuments(filter);

    // 🔹 🔥 Total Amount (Summary)
    const totalAmountAgg = await paymentCollection
      .aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
          },
        },
      ])
      .toArray();

    const totalAmount = totalAmountAgg[0]?.totalAmount || 0;

    return NextResponse.json({
      success: true,
      message: "Payments retrieved successfully",
      data: payments,
      currentPage,
      pageSize,
      totalData: total,
      totalPages: Math.ceil(total / pageSize),
      summary:{totalAmount:totalAmount}, // 🔥 important
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