/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getUserCollection } from "@/lib/database/db_collections";
import { UserRole } from "@/Interfaces/userInterfaces";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { fullName, role, isActive } = body as {
      fullName?: string;
      role?: UserRole;
      isActive?: boolean;
    };

    // ❌ Nothing to update validation
    if (!fullName && !role && typeof isActive !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Nothing to update" },
        { status: 400 }
      );
    }

    const userCollection = await getUserCollection();

    const user = await userCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 🔥 SECURITY
    if (user.role === "OWNER") {
      return NextResponse.json(
        { success: false, message: "Cannot modify OWNER" },
        { status: 403 }
      );
    }

    const updateData: any = {};

    // ✅ Name update
    if (fullName) {
      updateData.fullName = fullName;
    }

    // ✅ Role update
    if (role) {
      updateData.role = role;
    }

    // ✅ Active status update
    if (typeof isActive === "boolean") {
      updateData.isActive = isActive;
    }

    updateData.updatedAt = new Date().toISOString();

    const result = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Update failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}