import React from "react";
import Logo from "./Logo";
import Logout from "../CommonComponents/Logout";

const SideBar = () => {
  return (
    <div className="w-64 h-screen bg-white text-black border-r-2 border-gray-500 ">
      <div className=" flex flex-col justify-between h-full max-h-screen">
        <Logo></Logo>
        <div className=" border-t-2 border-gray-500 flex-grow overflow-y-scroll"></div>
        <div>
          <Logout></Logout>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
