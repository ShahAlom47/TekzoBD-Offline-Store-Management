import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSalesCollection, getProductCollection } from "@/lib/database/db_collections";
import { Sale, SaleProduct } from "@/Interfaces/saleInterfaces";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      customerId,
      products,
      discount = 0,
      paidAmount = 0,
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

    const saleProducts: SaleProduct[] = [];

    let totalAmount = 0;
    let totalCost = 0;

    // 1️⃣ Validate stock + calculate
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

      const sellingPrice = item.sellingPrice;
      const costPrice = product.costPrice;

      const totalPrice = item.quantity * sellingPrice;
      const itemTotalCost = item.quantity * costPrice;
      const profit = totalPrice - itemTotalCost;

      totalAmount += totalPrice;
      totalCost += itemTotalCost;

      saleProducts.push({
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        sellingPrice,
        costPrice,
        totalPrice,
        totalCost: itemTotalCost,
        profit,
      });
    }

    totalAmount = totalAmount - discount;

    const totalProfit = totalAmount - totalCost;
    const dueAmount = totalAmount - paidAmount;

    // 2️⃣ Create Sale
    const saleData: Sale = {
      customerId: customerId || undefined,
      products: saleProducts,
      discount,
      totalAmount,
      totalCost,
      totalProfit,
      paidAmount,
      dueAmount,
      createdBy,
      createdAt: new Date(),
      saleNumber: `SALE-${Date.now()}`,
    };

    const saleResult = await salesCollection.insertOne(saleData);

    // 3️⃣ Update stock
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

  } catch (error) {
    console.error("SALE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}