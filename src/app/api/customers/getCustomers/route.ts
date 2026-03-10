/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCustomerCollection, getSalesCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const customerCollection = await getCustomerCollection();
    const saleCollection = await getSalesCollection();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search")?.trim() || "";

    // ✅ Filter: search + exclude soft deleted
    const filter: any = { isDeleted: { $ne: true } }; // isDeleted true হলে exclude

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    const total = await customerCollection.countDocuments(filter);

    const customers = await customerCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // 👉 each customer এর due calculate
    const customersWithDue = await Promise.all(
      customers.map(async (customer) => {
        const sales = await saleCollection
          .find({ customerId: customer._id.toString() })
          .toArray();

        const salesDue = sales.reduce(
          (sum, sale) => sum + (sale.dueAmount || 0),
          0
        );

        const currentDue = (customer.openingBalance || 0) + salesDue;

        return {
          ...customer,
          currentDue,
        };
      })
    );

    return NextResponse.json({
      success: true,
      total,
      totalPages: Math.ceil(total / limit),
      data: customersWithDue,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch customers",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}