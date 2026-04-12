/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getUserCollection } from "@/lib/database/db_collections";
import { UserRole } from "@/Interfaces/userInterfaces";

export async function POST(req: NextRequest) {
  try {
    const { fullName, phone, email, password } = await req.json();

    // 🔥 validation
    if (!fullName || !phone || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const userCollection = await getUserCollection();

    // 🔥 normalize
    const cleanPhone:string = phone.trim().toString();

    // 🔥 duplicate check
    const existingUser = await userCollection.findOne({
      $or: [{ phone: cleanPhone }],
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409 }
      );
    }

    // 🔥 hash password (bcrypt)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 create user
    const newUser = {
      fullName,
      phone: cleanPhone,
      passwordHash: hashedPassword, // ✅ IMPORTANT (login same field)
      role: "SALESMAN" as UserRole,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    };

    const result = await userCollection.insertOne(newUser);

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: result.insertedId.toString(),
        fullName,
        phone: cleanPhone,
        role: "SALESMAN",
      },
    });
  } catch (error: any) {
    console.error("Register Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}