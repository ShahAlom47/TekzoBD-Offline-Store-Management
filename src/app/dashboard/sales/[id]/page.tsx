'use client'
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React from 'react';

const SaleDetails = () => {
const {id}= useParams()
const {}=useQuery({
   queryKey:[] ,
   queryFn:()=>{
    
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