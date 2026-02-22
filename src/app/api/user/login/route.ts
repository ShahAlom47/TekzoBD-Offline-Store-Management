import { NextRequest, NextResponse } from "next/server";
import { getUserCollection } from "@/lib/database/db_collections";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const usersCollection = await getUserCollection();

    // Find user by phone
    const user = await usersCollection.findOne({ phone });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Optional: check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: "User is inactive" },
        { status: 403 }
      );
    }

    // ✅ Login successful → return minimal info
    return NextResponse.json({
      message: "Login successful",
      user: {
        _id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}