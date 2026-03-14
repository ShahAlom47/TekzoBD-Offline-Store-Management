'use client'
import { getSaleById } from '@/lib/allApiRequest/salesRequest/salesRequest';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React from 'react';

const SaleDetails = () => {
const {id}= useParams()
const {data}=useQuery({
   queryKey:[] ,
   queryFn: async()=>{
    const  res = await getSaleById(id?.toString())
    return res
    
   }
})
console.log(id)
    return (
        <div>
            SaleDetails
        </div>
    );
};

export default SaleDetails;