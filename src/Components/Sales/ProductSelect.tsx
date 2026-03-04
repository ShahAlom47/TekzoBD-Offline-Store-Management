"use client";

import { CartItem } from "@/app/dashboard/sales/addSale/page";
import { ProductUnit } from "@/Interfaces/productInterface";
import { getAllProduct } from "@/lib/allApiRequest/productRequest/productRequest";
import { useQuery } from "@tanstack/react-query";
import React, { useState, } from "react";

interface Product {
  _id: string;
  name: string;
  sellingPrice: number;
  currentStock: number;
}


interface Props {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const units = ["PCS" , "KG" , "LITER" , "BOX" , "Feet"] as ProductUnit[];

const ProductSelect = ({ cart, setCart }: Props) => {
  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("PCS" as ProductUnit);
  const [price, setPrice] = useState(0);

  // Fetch all products
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await getAllProduct({ currentPage: 1, limit: 10000 });
      return res.data; // assuming API returns { data: Product[] }
    },
  });



 const allProducts = data as Product[] || [];
  const selectedProduct = allProducts.find((p) => p._id === selectedId);

  // Update price when product is selected via the select's onChange handler (avoid setting state in effect)

  const handleAddProduct = () => {
    if (!selectedProduct || quantity <= 0 || price < 0) return;

    const total = quantity * price;

    const existing = cart.find((c) => c.productId === selectedProduct._id);

    if (existing) {
      // Update existing cart item
      setCart(
        cart.map((c) =>
          c.productId === selectedProduct._id
            ? {
                ...c,
                quantity: c.quantity + quantity,
                unit,
                price,
                total: (c.quantity + quantity) * price,
              }
            : c
        )
      );
    } else {
      // Add new cart item
      setCart([
        ...cart,
        {
          productId: selectedProduct._id,
          name: selectedProduct.name,
          quantity,
          unit,
          price,
          total,
        },
      ]);
    }

    // Reset inputs
    setSelectedId("");
    setQuantity(1);
    setUnit("PCS");
    setPrice(0);
  };
    // Loading / Error
  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Error loading products.</p>;

  return (
    <div className="bg-white p-4 rounded-2xl shadow space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">Products</h2>
        <button
          onClick={handleAddProduct}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Product Dropdown */}
        <select
          value={selectedId}
          onChange={(e) => {
            const id = e.target.value;
            setSelectedId(id);
            const prod = allProducts.find((p) => p._id === id);
            if (prod) {
              setPrice(prod.sellingPrice);
            } else {
              setPrice(0);
            }
          }}
          className="border p-2 rounded-lg"
        >
          <option value="">Select Product</option>
          {allProducts.map((p) => (
            <option
              key={p._id}
              value={p._id}
              disabled={p.currentStock === 0}
            >
              {p.name} - Stock: {p.currentStock} - ৳{p.sellingPrice}
            </option>
          ))}
        </select>

        {/* Quantity Input */}
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border p-2 rounded-lg"
          placeholder="Quantity"
        />

        {/* Unit Select */}
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value as ProductUnit)}
          className="border p-2 rounded-lg"
        >
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>

        {/* Price Input */}
        <input
          type="number"
          min={0}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="border p-2 rounded-lg"
          placeholder="Unit Price"
        />
      </div>

      {/* Auto Total */}
      {selectedProduct && (
        <p className="text-right text-sm font-medium">
          Total: ৳ {quantity * price}
        </p>
      )}
    </div>
  );
};

export default ProductSelect;