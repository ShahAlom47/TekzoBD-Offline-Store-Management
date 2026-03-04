// Interfaces/paymentInterface.ts

export interface Payment {
  _id: string;                // Unique Payment ID

  // Customer & Sale reference
  customerId: string;         // এই payment কোন customer এর
  saleId?: string;            // Optional: যদি specific sale এর জন্য হয়

  // Payment details
  amount: number;             // Paid amount
  method: "CASH" | "BKASH" | "BANK" | "CARD"; // Payment method
  note?: string;              // Optional note, e.g. "Partial Payment", "Advance"

  // Metadata
  createdAt: Date;            // Payment created date
  updatedAt?: Date;           // Optional: if edited later
}