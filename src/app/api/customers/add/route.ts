import { getCustomerCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";
import { Customer } from "@/Interfaces/customerInterface";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      phone,
      email,
      address,
      customerType,
      openingBalance,
      creditLimit,
      isActive,
    } = body;

    // Validation
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: "Name and phone are required" },
        { status: 400 }
      );
    }

    const collection = await getCustomerCollection();

    const newCustomer: Customer = {
  
      name,
      phone,
      email,
      address,
      customerType,
      openingBalance,
      creditLimit,
      isActive: isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newCustomer);

    return NextResponse.json(
      {
        success: true,
        message: "Customer added successfully",
        data: { ...newCustomer, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}