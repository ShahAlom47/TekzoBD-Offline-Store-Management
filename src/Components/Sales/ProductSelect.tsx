"use client";

import { getAllProduct } from "@/lib/allApiRequest/productRequest/productRequest";
import { useQuery } from "@tanstack/react-query";
import { all } from "axios";
import React, { useState, useEffect } from "react";

interface Product {
  _id: string;
  name: string;
  sellingPrice: number;
  currentStock: number;
}

interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Props {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const ProductSelect = ({ cart, setCart }: Props) => {
  const [selectedId, setSelectedId] = useState("");

  // Fetch all products
  const { data, isLoading ,isError} = useQuery({
  queryKey: ["products", 1],
    queryFn: async () => {
      return await getAllProduct({
        currentPage: 1,
        limit: 10000,
      });
    },
  });

  if (isLoading) return <p>Loading...</p>;

  const allProducts = data?.data as Product[] || [];
  const totalPages = data?.totalPages || 1;
  console.log(data?.totalPages)

  const handleAddProduct = () => {
    if (!selectedId) return;

    const product = allProducts.find((p) => p._id === selectedId);
    if (!product) return;

    const existing = cart.find((c) => c.productId === product._id);

    if (existing) {
      // Increase quantity if already in cart
      setCart(
        cart.map((c) =>
          c.productId === product._id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        )
      );
    } else {
      // Add new product to cart
      setCart([
        ...cart,
        {
          productId: product._id,
          name: product.name,
          quantity: 1,
          price: product.sellingPrice,
        },
      ]);
    }

    setSelectedId(""); // Reset dropdown
  };

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

      {/* Product Dropdown */}
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="w-full border p-2 rounded-lg"
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
      <input type="number" className="w-full border p-2 rounded-lg" placeholder="Quantity" />
      <input type="number" className="w-full border p-2 rounded-lg" placeholder="price" />
    </div>
  );
};

export default ProductSelect;