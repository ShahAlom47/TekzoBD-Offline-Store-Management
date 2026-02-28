'use client';
import Loading from '@/app/loading';
import ProductForm from '@/Components/Products/ProductForm';
import { Product, ProductFormData } from '@/Interfaces/productInterface';
import { getSingleProduct, updateProduct } from '@/lib/allApiRequest/productRequest/productRequest';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';

const EditProduct = () => {
      const { id } = useParams();


      const {data,isLoading}=useQuery({
        queryKey:["product",id],
        queryFn:async()=>{
           const res = await getSingleProduct(id as string);
           return res.data;
        }
      })

      const  product = data.data as Product;

      if(isLoading){
        return (
            <Loading></Loading>
        )
    }

    // const handleSubmit = (data: ProductFormData) => {

    //     const res = updateProduct(id as string, data);
    //     if(!res.success){
    //         toast.error("Failed to update product");
            
    //     }
    //     console.log("Form Data:", data);
    //     // You can perform further actions here, such as sending the data to an API
    //   }

    return (
        
             <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
                  <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                    Add New Product
                  </h1>
            
                  {/* Product Form */}
                  {/* <ProductForm product={data} onSubmit={handleSubmit} /> */}
                </div>
            
       
    );
};

export default EditProduct;