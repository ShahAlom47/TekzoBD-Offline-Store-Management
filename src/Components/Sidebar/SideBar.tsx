import React from "react";
import Logo from "./Logo";
import Logout from "../CommonComponents/Logout";
import UserInfo from "../CommonComponents/UserInfo";
import StoreNavbar from "../CommonComponents/Navbar";

const SideBar = () => {
  return (
    <div className="w-64 h-screen bg-white text-black border-r-2 border-gray-500 ">
      <div className=" flex flex-col justify-between h-full max-h-screen">
       <div className=" flex flex-col gap-2 justify-center items-center ">
         <Logo></Logo>
         <UserInfo></UserInfo>
       </div>
        <div className=" border-t-2 border-gray-500 flex-grow overflow-y-scroll">
            <StoreNavbar></StoreNavbar>
        </div>
        <div>
          <Logout></Logout>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
