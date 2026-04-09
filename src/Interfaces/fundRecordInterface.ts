export interface FundRecord {
  id: string;               // Unique ID for each record
  source: string;           // “Personal”, “Loan from Bank”, “Investor A”, “Shop Revenue”, ইত্যাদি
  type: "IN" | "OUT";       // IN = টাকা এসেছে, OUT = টাকা গেছে
  amount: number;           // Amount in ৳
  date: string;             // ISO format, e.g., "2026-04-09T12:00:00.000Z"
  category: "Investment" | "Loan" | "Expense" | "Profit" | "Others"; 
  note?: string;            // Optional description / remarks
  paymentMethod?: "Cash" | "Bank Transfer" | "Mobile Payment" | "Other"; // Optional, future proof
  relatedParty?: string;    // Optional, Investor name, Supplier, Customer etc.
  tags?: string[];          // Optional, for filtering or grouping
}