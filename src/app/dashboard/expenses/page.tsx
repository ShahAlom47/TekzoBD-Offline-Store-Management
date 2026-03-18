import CustomModal from '@/Components/CommonComponents/CustomModal';
import { getExpenses } from '@/lib/allApiRequest/expensesRequest/expensesRequest';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

const Expenses = () => {
    const [openModal,setOpenModal]= useState<boolean>(false)
    const {data}= useQuery({
        queryKey:[],
        queryFn:async()=>{
            const res= await getExpenses()
            return res
        }
    })
    
    return (
        <div>
           Expenses 

           <CustomModal title='Add Expense' open={openModal} onOpenChange={setOpenModal}>
            <div>
                Form
            </div>
           </CustomModal>
        </div>
    );
};

export default Expenses;