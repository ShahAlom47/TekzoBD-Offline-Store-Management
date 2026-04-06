export interface FundRecord {
  source: string; // “Personal”, “Loan from Bank”, “Investor A”, “Shop Revenue”, ইত্যাদি
  type: "IN" | "OUT"; // টাকা এসেছে কিনা বা গেছে
  amount: number;
  date: string; // ISO format
  category: string; // Investment, Loan, Expense, Profit, Others
  note?: string; // Optional description
}