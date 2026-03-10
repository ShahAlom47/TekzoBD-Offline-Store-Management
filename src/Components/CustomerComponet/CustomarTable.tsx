'use client'

import { Customer } from "@/Interfaces/customerInterface";
import { CustomTable } from "../CommonComponents/CustomTable";
import { useConfirm } from "@/hook/useConfirm";

interface TableProps {
    customer:Customer[];
    refetch?:()=>void;
}

const CustomerTable = ({ customer, refetch }:TableProps) => {
  const { confirm } = useConfirm();


  const handleDelete = (id: string) => {

    console.log("Delete customer with ID:", id);
  };

 const columns = [
    { header: "Name", accessor: "name" },
    { header: "Phone", accessor: "phone" },
    { header: "Address", accessor: "address" },
    { header: "Current Due", accessor: "currentStock" },
    { header: "Status", accessor: "status" },
    { header: "Action", accessor: "action" },
  ];

  const data = customer.map((customer) => ({
    name: (<h1 className="font-medium">{customer.name}</h1>),
    phone: customer.phone,
    address: customer.address,
    currentStock: customer.currentDue,
    status: (<span className={`px-2 py-1 rounded-full text-sm ${customer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {customer.isActive ? 'Active' : 'Inactive'}
    </span>),
    action: (
      <div className="flex gap-2">  
        <button className="bg-blue-600 text-white px-3 py-1 rounded-lg">View</button>
        <button className="bg-yellow-600 text-white px-3 py-1 rounded-lg">Edit</button>
        <button onClick={() => handleDelete(customer?._id.toString())} className="bg-red-600 text-white px-3 py-1 rounded-lg">Delete</button>
      </div>
    ),      
  }));

    return (
        <div>
            <CustomTable columns={columns} data={data} />
        </div>
    );
};

export default CustomerTable;