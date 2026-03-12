import { DashPaginationButton } from '@/Components/CommonComponents/DashPaginationButton';
import { getAllSales } from '@/lib/allApiRequest/salesRequest/salesRequest';
import { useQueries, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

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
  const salesData = data?.data || [];

  console.log(salesData,data)
    return (
        <div>
            Sales
            <DashPaginationButton totalPages={totalPages} currentPage={page} onPageChange={setPage} />
        </div>
    );
};

export default Sales;