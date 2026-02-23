// import { cookies } from "next/headers";
"use client";
import { useUser } from "@/context/AuthContext";
import { redirect } from "next/navigation";

export default function Home() {
  // const cookieStore = await cookies();
  // const session = cookieStore.get("session");
  const {user,loading}= useUser()

  console.log(user,'uder')

  if(loading){  
    return <div>Loading...</div>  

  }

  if (!user) {
    redirect("/login");
  }

  redirect("/dashboard");
}