import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCustomerCollection, getSalesCollection } from "@/lib/database/db_collections";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid customer ID", success: false },
        { status: 400 }
      );
    }

    const customerCollection = await getCustomerCollection();
    const saleCollection = await getSalesCollection();

    // customer
    const customer = await customerCollection.findOne({
      _id: new ObjectId(id),
      isDeleted: { $ne: true },
    });

    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found", success: false },
        { status: 404 }
      );
    }

    // sales history
    const sales = await saleCollection
      .find({ customerId: id })
      .sort({ createdAt: -1 })
      .toArray();

    // calculations
    const totalPurchase = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalPaid = sales.reduce((sum, sale) => sum + sale.paidAmount, 0);
    const totalDue = sales.reduce((sum, sale) => sum + sale.dueAmount, 0);

    const openingBalance = customer.openingBalance || 0;

    const currentDue = totalDue + openingBalance;

    return NextResponse.json({
      success: true,
      data: {
        customer,
        sales,
        summary: {
          totalSales: sales.length,
          totalPurchase,
          totalPaid,
          totalDue,
          openingBalance,
          currentDue,
        },
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching customer:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch customer",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}