import { ObjectId } from "mongodb";

export interface SaleProduct {
    productId: string;
    quantity: number;
    sellingPrice: number; // per unit
    totalPrice: number; // quantity * sellingPrice
}

export interface Sale {
  _id?: ObjectId;
  customerId?: string; // optional, যদি regular customer থাকে
  products: SaleProduct[];
  discount?: number; // optional
  totalAmount: number; // sum of all products - discount
  paidAmount: number;
  dueAmount: number; // totalAmount - paidAmount
  createdBy?: string; // কে sale করেছে
  createdAt: Date;
  saleNumber?: string; 
}