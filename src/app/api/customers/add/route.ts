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

    const newCustomer = {
      name,
      phone,
      email: email || "",
      address: address || "",
      customerType: customerType || "REGULAR",
      openingBalance: openingBalance || 0,
      creditLimit: creditLimit || 0,
      isActive: isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newCustomer);

    // 🔥 Final Customer Object
    const createdCustomer: Customer = {
      _id: result.insertedId,
      ...newCustomer,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Customer added successfully",
        data: createdCustomer,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}