/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import {
  getCustomerCollection,
  getSalesCollection,
  getPaymentsCollection,
} from "@/lib/database/db_collections";

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
    const paymentsCollection = await getPaymentsCollection();

    const customerId = new ObjectId(id);

    // 🔹 Customer
    const customer = await customerCollection.findOne({
      _id: customerId,
      isDeleted: { $ne: true },
    });

    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found", success: false },
        { status: 404 }
      );
    }

    // 🔹 Sales
    const sales = await saleCollection
      .find({ customerId })
      .sort({ createdAt: -1 })
      .toArray();

    const saleIds = sales.map((s) => s._id);

    // 🔹 Payments (including due payments with no saleId)
    const payments = await paymentsCollection
      .find({ customerId })
      .toArray();

    // 🔹 Add paid & due per sale
    const salesWithCalc = sales.map((sale) => {
      const saleIdStr = sale._id?.toString();

      const relatedPayments = payments.filter(
        (p) => p.saleId && p.saleId.toString() === saleIdStr
      );

      const paidAmount = relatedPayments.reduce(
        (sum, p) => sum + (p.amount || 0),
        0
      );

      const dueAmount = Math.max((sale.totalAmount || 0) - paidAmount, 0);

      return {
        ...sale,
        paidAmount,
        dueAmount,
      };
    });

    // 🔹 Include due payments not linked to any sale
    const duePayments = payments.filter((p) => !p.saleId);
    const totalDuePayments = duePayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // 🔹 Summary Calculation
    const totalPurchase = salesWithCalc.reduce(
      (sum, sale) => sum + (sale.totalAmount || 0),
      0
    );

    const totalPaidSales = salesWithCalc.reduce(
      (sum, sale) => sum + (sale.paidAmount || 0),
      0
    );

    const totalPaid = totalPaidSales + totalDuePayments;

    const totalDueSales = salesWithCalc.reduce(
      (sum, sale) => sum + (sale.dueAmount || 0),
      0
    );

    const totalDue = totalDueSales; // duePayments already counted in totalPaid

    const openingBalance = customer.openingBalance || 0;

    const currentDue = Math.max(openingBalance + totalDue - totalPaid, 0);

    return NextResponse.json({
      success: true,
      data: {
        customer: {
          ...customer,
          currentDue,
        },
        sales: salesWithCalc,
        duePayments, // 🔥 optional, frontend can show these
        summary: {
          totalSales: salesWithCalc.length,
          totalPurchase,
          totalPaid,
          totalDue,
          openingBalance,
          currentDue,
        },
      },
    });
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