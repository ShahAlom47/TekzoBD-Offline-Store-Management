"use client";

import React, { useState } from "react";
import Logo from "./Logo";
import Logout from "../CommonComponents/Logout";
import UserInfo from "../CommonComponents/UserInfo";
import StoreNavbar from "../CommonComponents/Navbar";
// import { Menu, X } from "lucide-react";

const SideBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <button onClick={() => setOpen(true)}>
          {/* <Menu size={24} /> */}
          =
        
        </button>
        <Logo />
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 z-50 h-screen w-64 bg-gray-50 border-r border-gray-200 shadow-sm transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        <div className="flex flex-col justify-between h-full">

          {/* Close button (Mobile only) */}
          <div className="md:hidden flex justify-end p-4">
            <button onClick={() => setOpen(false)}>
              {/* <X size={22} /> */}
              x
            </button>
          </div>

          {/* Top */}
          <div className="flex flex-col items-center gap-4 pt-2 pb-4 border-b border-gray-200">
            <Logo />
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <StoreNavbar />
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <Logout />
          </div>

        </div>
      </div>
    </>
  );
};

export default SideBar;