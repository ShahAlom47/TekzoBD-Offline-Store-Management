import { PaymentMethod } from './../../../../Interfaces/saleInterfaces';
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
      return NextResponse.json({ message: "Invalid customer ID", success: false }, { status: 400 });
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
      return NextResponse.json({ message: "Customer not found", success: false }, { status: 404 });
    }

    // 🔹 Sales
    const sales = await saleCollection.find({ customerId }).sort({ createdAt: -1 }).toArray();

    // 🔹 All payments
    const payments = await paymentsCollection.find({ customerId:new ObjectId(customerId) }).toArray();
    console.log(payments,'PaymentMethod')

    // 🔹 Sale-wise mapping + payment history
    const salesWithCalc = sales.map((sale) => {
      const saleIdStr = sale._id?.toString();
      const relatedPayments = payments.filter(p => p.saleId && p.saleId.toString() === saleIdStr);

      const paidAmount = relatedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const dueAmount = Math.max((sale.totalAmount || 0) - paidAmount, 0);

      return { ...sale, paidAmount, dueAmount, payments: relatedPayments };
    });

    // 🔹 General due payments (not linked to any sale)
    const duePayments = payments.filter(p => p.type==="DUE_PAYMENT");

    // 🔹 Summary
    const totalPurchase = salesWithCalc.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
    const totalPaidSales = salesWithCalc.reduce((sum, s) => sum + (s.paidAmount || 0), 0);
    const totalDueSales = salesWithCalc.reduce((sum, s) => sum + (s.dueAmount || 0), 0);
    const totalGeneralPaid = duePayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    const totalPaid = totalPaidSales + totalGeneralPaid;
    const totalDue = totalDueSales + duePayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const openingBalance = customer.openingBalance || 0;
    const currentDue = openingBalance + totalDue - totalPaid;

    return NextResponse.json({
      success: true,
      data: {
        customer: { ...customer, currentDue },
        sales: salesWithCalc,
        payments,
        duePayments,
        summary: { totalSales: salesWithCalc.length, totalPurchase, totalPaid, totalDue, openingBalance, currentDue },
      },
    });

  } catch (error: any) {
    console.error("Error fetching customer:", error);
    return NextResponse.json(
      { message: "Failed to fetch customer", success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}