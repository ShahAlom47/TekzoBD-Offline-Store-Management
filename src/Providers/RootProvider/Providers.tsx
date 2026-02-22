"use client";


import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import QueryProvider from "../QueryProvider";

export default function RootProvider({ children }: { children: ReactNode }) {
  return (

        <QueryProvider>
          <Toaster position="top-right" />
          
          {children}
        </QueryProvider>
  
  );
}
