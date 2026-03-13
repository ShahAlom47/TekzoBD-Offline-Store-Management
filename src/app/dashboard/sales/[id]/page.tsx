'use client'
import { useParams } from 'next/navigation';
import React from 'react';

const SaleDetails = () => {
const {id}= useParams()
console.log(id)
    return (
        <div>
            SaleDetails
        </div>
    );
};

export default SaleDetails;