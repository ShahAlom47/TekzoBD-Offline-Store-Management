import { ObjectId } from "mongodb";

export interface SaleProduct {
    productId: string;
    productName?: string; // optional, for display purposes
    quantity: number;

    sellingPrice: number;  // per unit
    costPrice: number;     // per unit cost (from Product DB)
    
    totalPrice: number;    // quantity * sellingPrice
    totalCost: number;     // quantity * costPrice
    profit: number;        // totalPrice - totalCost
}

export interface Sale {
  _id?: ObjectId;
  customerId?: string |undefined;       // optional, walk-in
  products: SaleProduct[];
  discount?: number;         // optional
  totalAmount: number;       // sum(products totalPrice) - discount
  totalCost: number;         // sum(products totalCost)
  totalProfit: number;       // totalAmount - totalCost
  paidAmount: number;
  dueAmount: number;         // totalAmount - paidAmount
  createdBy?: string;        // কোন user sale করেছে
  createdAt: Date;
  saleNumber?: string; 
}