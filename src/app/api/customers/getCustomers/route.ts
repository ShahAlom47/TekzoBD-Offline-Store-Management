import { getCustomerCollection, getSalesCollection,  } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {

    const customerCollection = await getCustomerCollection();
    const saleCollection = await getSalesCollection();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search")?.trim() || "";

    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { address: { $regex: search, $options: "i" } },
          ],
        }
      : {};

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

        const currentDue =
          (customer.openingBalance || 0) + salesDue;

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
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch customers",
        success: false,
      },
      { status: 500 }
    );
  }
}