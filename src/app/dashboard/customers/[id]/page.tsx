"use client"

import { useCustomer } from "@/hook/useCustomer";
import { useParams } from "next/navigation";


const CustomerDetails = () => {
    const {id}= useParams()
    const {data}= useCustomer(id?.toString() || "")

console.log(data)
    return (
        <div>
            
        </div>
    );
};

export default CustomerDetails;