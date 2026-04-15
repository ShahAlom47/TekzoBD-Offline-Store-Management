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

    // ❌ Nothing to update
    if (!fullName && !role && typeof isActive !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Nothing to update" },
        { status: 400 }
      );
    }

    const userCollection = await getUserCollection();

    // 🎯 Target user (DB user)
    const targetUser = await userCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 🎯 Logged-in user (IMPORTANT)
    // 👉 এখানে তুমি JWT / middleware থেকে user আনবা
    const currentUserHeader = req.headers.get("user"); // example only
    const currentUser = currentUserHeader
      ? JSON.parse(currentUserHeader)
      : null;

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ❗ Normal user শুধু নিজের data update করতে পারবে
    if (
      currentUser._id !== id &&
      !["OWNER", "MANAGER"].includes(currentUser.role)
    ) {
      return NextResponse.json(
        { success: false, message: "You can only update your own profile" },
        { status: 403 }
      );
    }

    const updateData: any = {};

    // ✅ 1. Name → সবাই change করতে পারবে (OWNER সহ)
    if (fullName) {
      updateData.fullName = fullName;
    }

    // ✅ 2. Role update
    if (role) {
      // ❌ OWNER-এর role change করা যাবে না
      if (targetUser.role === "OWNER") {
        return NextResponse.json(
          { success: false, message: "Cannot change OWNER role" },
          { status: 403 }
        );
      }

      // ❌ শুধু OWNER / MANAGER role change করতে পারবে
      if (!["OWNER", "MANAGER"].includes(currentUser.role)) {
        return NextResponse.json(
          { success: false, message: "Not authorized to change role" },
          { status: 403 }
        );
      }

      updateData.role = role;
    }

    // ✅ 3. isActive update
    if (typeof isActive === "boolean") {
      // ❌ শুধু OWNER / MANAGER change করতে পারবে
      if (!["OWNER", "MANAGER"].includes(currentUser.role)) {
        return NextResponse.json(
          { success: false, message: "Not authorized" },
          { status: 403 }
        );
      }

      updateData.isActive = isActive;
    }

    // ❌ যদি শুধু name ছাড়া কিছু না থাকে, তাও ok (name already added)

    updateData.updatedAt = new Date().toISOString();

    const result = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "No changes applied" },
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