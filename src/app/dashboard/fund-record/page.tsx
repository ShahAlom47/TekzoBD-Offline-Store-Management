"use client"
import CustomModal from '@/Components/CommonComponents/CustomModal';
import React, { useState } from 'react';

const FundRecord = () => {
    const [openModal,setModal]= useState(false)
   
    return (
        <div>
            FundRecord
            <CustomModal open={openModal} onOpenChange={setModal}>
                Modal Form
            </CustomModal>
        </div>
    );
};

export default FundRecord;