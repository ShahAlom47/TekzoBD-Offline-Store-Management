/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getCustomerCollection,
  getSalesCollection,
  getPaymentsCollection,
} from "@/lib/database/db_collections";
import { address } from "framer-motion/client";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const customerCollection = await getCustomerCollection();
    const saleCollection = await getSalesCollection();
    const paymentsCollection = await getPaymentsCollection();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search")?.trim() || "";

    // 🔹 Filter customers
    const filter: any = { isDeleted: { $ne: true } };
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

    if (!customers.length) {
      return NextResponse.json({
        success: true,
        total,
        totalPages: Math.ceil(total / limit),
        data: [],
      });
    }

    // 🔹 Convert customerIds to string
    const customerIds = customers.map((c) => c._id.toString());

    // 🔹 Fetch only sales where customerId exists and in our list

    const customerObjectIds = customerIds
  .filter(Boolean) // remove empty string
  .map((id) => new ObjectId(id)); // convert string to ObjectId

const sales = await saleCollection
  .find({
    customerId: { $in: customerObjectIds },
  })
  .toArray();


    // 🔹 Fetch payments for sales which exist
 // saleIds as ObjectId
const saleObjectIds = sales
  .map((s) => s._id)
  .filter(Boolean); // already ObjectId in DB

const payments = await paymentsCollection
  .find({
    saleId: { $in: saleObjectIds }, // match ObjectId type
  })
  .toArray();

    // 🔹 Map each customer with currentDue
    const customersWithDue = customers.map((customer) => {
      const customerSales = sales.filter(
        (s) =>
          s.customerId && // ensure customerId exists
          s.customerId.toString() === customer._id.toString()
      );

      let totalDue = 0;

      customerSales.forEach((sale) => {
        const relatedPayments = payments.filter(
          (p) =>
            p.saleId && // ensure saleId exists
            p.saleId.toString() === sale._id.toString()
        );

        const paid = relatedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const due = Math.max((sale.totalAmount || 0) - paid, 0);
        totalDue += due;
      });

      const currentDue = (customer.openingBalance || 0) + totalDue;

      return {
        _id: customer._id,
        name: customer.name,
        address:customer?.address,
        phone: customer.phone,
        currentDue,
      };
    });

    return NextResponse.json({
      success: true,
      total,
      totalPages: Math.ceil(total / limit),
      data: customersWithDue,
    });
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