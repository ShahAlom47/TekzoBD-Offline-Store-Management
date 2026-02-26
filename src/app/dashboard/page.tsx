"use client"
import { useCategories } from '@/hook/useCategory';


const DashHome = () => {
  const { categories, isLoading, isError } = useCategories();

  console.log(categories, isLoading, isError);
  return (
    <div>

      Overview
      
    </div>
  );
};

export default DashHome