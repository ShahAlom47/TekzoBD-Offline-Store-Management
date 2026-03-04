"use client";

import ProductSelect from "@/Components/Sales/ProductSelect";
import { ProductUnit } from "@/Interfaces/productInterface";
import React, { useState } from "react";

export interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  unit: ProductUnit;
  price: number;
  total: number;
}


const AddSalePage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paidAmount, setPaidAmount] = useState(0);
  const [discount, setDiscount] = useState(0);

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const finalAmount = totalAmount - discount;
  const dueAmount = finalAmount - paidAmount;



  const handleSubmit = () => {
    const saleData = {
      products: cart,
      discount,
      totalAmount: finalAmount,
      paidAmount,
      dueAmount,
    };

    console.log(saleData);
    alert("Sale Submitted (Check console)");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">🧾 Add New Sale</h1>

      <ProductSelect cart={cart} setCart={setCart} />

      {/* Cart Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-center">Price</th>
              <th className="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-3">{item.name}</td>
                <td className="p-3 text-center">{item.quantity}</td>
                <td className="p-3 text-center">৳ {item.price}</td>
                <td className="p-3 text-right">
                  ৳ {item.quantity * item.price}
                </td>
              </tr>
            ))}

            {cart.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-400">
                  No products added
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Payment Section */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h2 className="font-semibold text-lg">Payment</h2>

          <div>
            <label className="block text-sm mb-1">Discount</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Paid Amount</label>
            <input
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
              className="w-full border p-2 rounded-lg"
            />
          </div>
        </div>

        {/* Total Section */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-3">
          <h2 className="font-semibold text-lg">Summary</h2>

          <div className="flex justify-between">
            <span>Total</span>
            <span>৳ {totalAmount}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount</span>
            <span>৳ {discount}</span>
          </div>

          <div className="flex justify-between font-semibold text-lg">
            <span>Final Total</span>
            <span>৳ {finalAmount}</span>
          </div>

          <div className="flex justify-between text-red-600">
            <span>Due</span>
            <span>৳ {dueAmount > 0 ? dueAmount : 0}</span>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 mt-4"
          >
            Confirm Sale
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSalePage;