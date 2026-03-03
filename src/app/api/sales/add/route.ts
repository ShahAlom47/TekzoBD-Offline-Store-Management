import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSalesCollection, getProductCollection } from "@/lib/database/db_collections";
import { SaleProduct } from "@/Interfaces/saleInterfaces";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      customerId,
      products,
      discount = 0,
      paidAmount,
      createdBy,
    } = body;

    if (!products || products.length === 0) {
      return NextResponse.json(
        { success: false, message: "No products provided" },
        { status: 400 }
      );
    }

    const productCollection = await getProductCollection();
    const salesCollection = await getSalesCollection();

    let totalAmount = 0;

    // 1️⃣ Validate stock & calculate total
    for (const item of products) {
      const product = await productCollection.findOne({
        _id: new ObjectId(item.productId),
      });

      if (!product) {
        return NextResponse.json(
          { success: false, message: "Product not found" },
          { status: 404 }
        );
      }

      if (product.currentStock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `${product.name} stock not enough`,
          },
          { status: 400 }
        );
      }

      const itemTotal = item.quantity * item.sellingPrice;
      totalAmount += itemTotal;
    }

    totalAmount = totalAmount - discount;
    const dueAmount = totalAmount - paidAmount;

    let paymentStatus: "PAID" | "PARTIAL" | "DUE" = "DUE";

    if (dueAmount <= 0) paymentStatus = "PAID";
    else if (paidAmount > 0) paymentStatus = "PARTIAL";

    // 2️⃣ Insert Sale
    const saleData = {
      customerId: customerId || null,
      products: products.map((p: SaleProduct) => ({
        productId: p.productId,
        quantity: p.quantity,
        sellingPrice: p.sellingPrice,
        totalPrice: p.quantity * p.sellingPrice,
      })),
      discount,
      totalAmount,
      paidAmount,
      dueAmount,
      paymentStatus,
      createdBy,
      createdAt: new Date(),
    };

    const saleResult = await salesCollection.insertOne(saleData);

    // 3️⃣ Update Product Stock & Sold
    for (const item of products) {
      await productCollection.updateOne(
        { _id: new ObjectId(item.productId) },
        {
          $inc: {
            currentStock: -item.quantity,
            sold: item.quantity,
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Sale created successfully",
      saleId: saleResult.insertedId,
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("SALE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}