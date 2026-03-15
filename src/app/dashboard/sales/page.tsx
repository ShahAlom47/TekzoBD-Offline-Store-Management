'use client';
import { DashPaginationButton } from '@/Components/CommonComponents/DashPaginationButton';
import SalesDataTable from '@/Components/Sales/SalesDataTable';
import { Sale } from '@/Interfaces/saleInterfaces';
import { getAllSales } from '@/lib/allApiRequest/salesRequest/salesRequest';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';


const Sales = () => {
      const [page, setPage] = useState(1);
  const limit = 10;


  const { data, isLoading } = useQuery({
  queryKey: ["sales", page],
    queryFn: async () => {
      return await getAllSales({
        currentPage: page,
        limit: limit,
        searchTrim: undefined,
      });
    },
    placeholderData: (prev) => prev, // keep old data while fetching new
  });

  if (isLoading) return <p>Loading...</p>;
  const totalPages = data?.totalPages || 0;
  const salesData = (data?.data as Sale[]) || [];


    return (
        <div>
            <SalesDataTable sales={salesData}></SalesDataTable>
            <DashPaginationButton totalPages={totalPages} currentPage={page} onPageChange={setPage} />
        </div>
    );
};

export default Sales;