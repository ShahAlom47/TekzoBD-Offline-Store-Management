'use client'
import { getAllProduct } from '@/lib/allApiRequest/productRequest/productRequest';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const Products = () => {
    const {data}=useQuery({
        queryKey:["products"],
        queryFn: async()=>{
            const res=await getAllProduct({
                currentPage:1,
                limit:10,
                isDashboardRequest:true
            }   );
            return res;
        }
    })

    console.log(data,"products data from dashboard/products page");
    return (
        <div>
            All product s

        </div>
    );
};

export default Products;