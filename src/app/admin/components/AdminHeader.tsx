"use client";
import Image from "next/image";
import MobileSidebar from "./MobileSidebar";
import { Bell, Search } from "lucide-react";
import { motion } from "framer-motion";

const AdminHeader = () => {
  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full bg-white flex justify-between items-center px-4 py-3 shadow-sm border-b"
    >
      <div className="flex items-center gap-4">
        <MobileSidebar />
        <div className="hidden sm:flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none ml-2 w-48"
          />
        </div>
      </div>

      <h1 className="text-xl font-semibold text-[#252B42] hidden sm:block">
        Admin Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 hover:bg-gray-100 rounded-full"
        >
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </motion.button>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-[#252B42]">Admin User</p>
            <p className="text-xs text-gray-500">admin@trendvibe.com</p>
          </div>
          <Image
            width={40}
            height={40}
            className="rounded-full border-2 border-[#23856D]"
            src="/image/icon.jpeg"
            alt="Profile"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default AdminHeader;
