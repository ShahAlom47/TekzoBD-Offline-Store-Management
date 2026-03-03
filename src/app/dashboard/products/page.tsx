"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllProduct } from "@/lib/allApiRequest/productRequest/productRequest";
import ProductCardView from "@/Components/ProductComponet/ProductCardView";
import ProductFilter from "@/Components/ProductComponet/ProductFilter";
import { DashPaginationButton } from "@/Components/CommonComponents/DashPaginationButton";
import { Product, GetAllProductParams } from "@/Interfaces/productInterface";
import ProductTableView from "@/Components/ProductComponet/ProductTableView ";

const Products = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [filters, setFilters] = useState<Partial<GetAllProductParams>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["products", page, filters], // 🔥 important
    queryFn: async () => {
      return await getAllProduct({
        currentPage: page,
        limit: limit,
        isDashboardRequest: true,
        ...filters,
      });
    },
    keepPreviousData: true, // 🔥 smooth pagination
  });

  const products = data?.data as Product[] || [];
  const totalPages = data?.totalPages || 1;
  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold my-3">Stock Products</h1>

      {/* 🔥 Filter Section */}
      <ProductFilter
        onFilterChange={(newFilters) => {
          setPage(1); // filter change করলে page reset
          setFilters(newFilters);
        }}
      />

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Desktop View */}
          <div className="hidden md:block">
            <ProductTableView products={products} />
          </div>

          {/* Mobile View */}
          <div className="block md:hidden">
            <ProductCardView products={products} />
          </div>

          {/* Pagination */}
          <DashPaginationButton
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            className="mt-4"
          />
        </>
      )}
    </div>
  );
};

export default Products;