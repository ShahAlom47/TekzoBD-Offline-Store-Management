import { NextRequest, NextResponse } from "next/server";
import { getUserCollection } from "@/lib/database/db_collections";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json(
        { success: false, message: "Phone and password required" },
        { status: 400 }
      );
    }

    const usersCollection = await getUserCollection();
    const user = await usersCollection.findOne({ phone });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );
console.log(isPasswordValid,'hhhh')


    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ Create JWT Token
    const token = sign(
      {
        userId: user?._id,
        role: user?.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id.toString(),
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,  
      }
    });

    // ✅ Set HTTP-only Cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}