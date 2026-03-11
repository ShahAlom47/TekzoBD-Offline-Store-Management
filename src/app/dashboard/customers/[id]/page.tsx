"use client"

import { useCustomers } from "@/hook/useCustomers";
import { useQueries } from "@tanstack/react-query";
import { useParams } from "next/navigation";


const CustomerDetails = () => {
    const {id}= useParams()
    const {}= useCustomers()


    return (
        <div>
            
        </div>
    );
};

export default CustomerDetails;