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

    // 🔹 Payments
    const payments = await paymentsCollection
      .find({ customerId }) // ✅ FIXED
      .toArray();

    // 🔥 Normalize Date (important for old data)
    const normalizeDate = (date: any) =>
      date ? new Date(date).toISOString() : null;

    // 🔹 Sale-wise mapping
    const salesWithCalc = sales.map((sale) => {
      const saleIdStr = sale._id?.toString();

      const relatedPayments = payments.filter(
        (p) => p.saleId && p.saleId.toString() === saleIdStr
      );

      const paidAmount = relatedPayments.reduce(
        (sum, p) => sum + (p.amount || 0),
        0
      );

      const dueAmount = Math.max(
        (sale.totalAmount || 0) - paidAmount,
        0
      );

      return {
        ...sale,
        createdAt: normalizeDate(sale.createdAt), // ✅ date fix
        paidAmount,
        dueAmount,
        payments: relatedPayments.map((p) => ({
          ...p,
          createdAt: normalizeDate(p.createdAt),
          paymentDate: normalizeDate(p.paymentDate),
        })),
      };
    });

    // 🔹 General due payments
    const duePayments = payments
      .filter((p) => p.type === "DUE_PAYMENT")
      .map((p) => ({
        ...p,
        createdAt: normalizeDate(p.createdAt),
        paymentDate: normalizeDate(p.paymentDate),
      }));

    // 🔹 Summary (FIXED LOGIC)
    const totalPurchase = salesWithCalc.reduce(
      (sum, s) => sum + (s.totalAmount || 0),
      0
    );

    const totalPaid = payments.reduce(
      (sum, p) => sum + (p.amount || 0),
      0
    );

    const totalDue = Math.max(totalPurchase - totalPaid, 0);

    const openingBalance = customer.openingBalance || 0;

    const currentDue = openingBalance + totalDue;

    return NextResponse.json({
      success: true,
      data: {
        customer: {
          ...customer,
          createdAt: normalizeDate(customer.createdAt),
          updatedAt: normalizeDate(customer.updatedAt),
          currentDue,
        },
        sales: salesWithCalc,
        payments: payments.map((p) => ({
          ...p,
          createdAt: normalizeDate(p.createdAt),
          paymentDate: normalizeDate(p.paymentDate),
        })),
        duePayments,
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