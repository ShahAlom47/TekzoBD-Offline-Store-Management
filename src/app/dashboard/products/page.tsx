'use client'

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllProduct } from "@/lib/allApiRequest/productRequest/productRequest";
import ProductTableView from "@/Components/ProductComponet/ProductTableView ";
import { Product } from "@/Interfaces/productInterface";
import ProductCardView from "@/Components/ProductComponet/ProductCardView";
import { DashPaginationButton } from "@/Components/CommonComponents/DashPaginationButton";


const Products = () => {
    const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      return await getAllProduct({
        currentPage: 1,
        limit: 10,
        isDashboardRequest: true,
      });
    },
  });

  if (isLoading) return <p>Loading...</p>;

  const products = data?.data as Product[] || [];
  const totalPages = data?.totalPages || 1;
  console.log(data?.totalPages)

  return (
    <div className="p-4">
        <div>
            <h1 className="text-2xl font-bold my-3 ">Stock Products</h1>
        </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <ProductTableView products={products} />
      </div>

      {/* Mobile View */}
      <div className="block md:hidden">
        <ProductCardView products={products} />
      </div>

       <DashPaginationButton
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            className="mt-4"
          />

    </div>
  );
};

export default Products;