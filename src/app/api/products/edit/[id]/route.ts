/* eslint-disable @typescript-eslint/no-explicit-any */
import { getProductCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { ProductFormData } from "@/Interfaces/productInterface";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid product ID", success: false },
        { status: 400 }
      );
    }

    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { message: "Invalid request body", success: false },
        { status: 400 }
      );
    }

    // 🔁 Numeric field validation (same as add API)
    const numericFields: (keyof ProductFormData)[] = [
      "costPrice",
      "sellingPrice",
      "discountPrice",
      "vatPercentage",
      "openingStock",
      "currentStock",
      "reorderLevel",
    ];

    for (const field of numericFields) {
      const value = body[field];

      if (value !== undefined) {
        const parsedValue = Number(value);

        if (isNaN(parsedValue)) {
          return NextResponse.json(
            { message: `Invalid ${field} format`, success: false },
            { status: 400 }
          );
        }

        body[field] = parsedValue as any;
      }
    }

    const productCollection = await getProductCollection();

    const updateResult = await productCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Product updated successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in PUT /api/products/[id]:", error);

    // 🔁 Duplicate key handling (e.g., SKU unique)
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];
      const duplicateValue = error.keyValue?.[duplicateField];

      return NextResponse.json(
        {
          message: `A product with the same ${duplicateField} "${duplicateValue}" already exists.`,
          success: false,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        message: "An error occurred while updating the product",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}