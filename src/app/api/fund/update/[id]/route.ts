import { getFundCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      source,
      type,
      amount,
      date,
      category,
      note,
      paymentMethod,
      relatedParty,
      tags,
    } = body;

    // ✅ validation
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    const fundCollection = await getFundCollection();

    // ✅ ISO safe update object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (source !== undefined) updatedData.source = source;
    if (type !== undefined) updatedData.type = type;
    if (amount !== undefined) updatedData.amount = Number(amount);
    if (date !== undefined) updatedData.date = new Date(date).toISOString();
    if (category !== undefined) updatedData.category = category;
    if (note !== undefined) updatedData.note = note;
    if (paymentMethod !== undefined) updatedData.paymentMethod = paymentMethod;
    if (relatedParty !== undefined) updatedData.relatedParty = relatedParty;
    if (tags !== undefined) updatedData.tags = tags;

    const result = await fundCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Fund record updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Update Fund Error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}