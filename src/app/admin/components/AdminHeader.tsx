"use client";
import Image from "next/image";
import MobileSidebar from "../components/MobileSidebar";

const AdminHeader = () => {
  return (
    // <div className="w-full bg-slate-600 flex justify-between items-center p-4 bg- shadow-md">
    //   {/* Sidebar Toggle Button for Mobile */}
    //   <MobileSidebar />

    //   <div className="text-xl font-semibold">Admin Dashboard</div>

    //   {/* Profile Section */}
    //   <div className="flex items-center space-x-4">
       
    //     <div className="flex items-center cursor-pointer">
    //       <span className="text-[#737373]">Admin</span>
    //       <img
    //         className="ml-2 w-8 h-8 rounded-full"
    //         src="path_to_profile_image"
    //         alt="Profile"
    //       />
    //     </div>
    //   </div>
    // </div>
    <div className="w-full bg-[#FAFAFA] flex justify-between items-center p-4 shadow-md">
    {/* Sidebar Toggle Button for Mobile */}
    <MobileSidebar />
    
    <div className="text-xl font-semibold text-[#252B42]">Admin Dashboard</div>
    
    {/* Profile Section */}
    <div className="flex items-center space-x-4">
      <div className="flex items-center cursor-pointer">
        <span className="text-[#737373]">Admin</span>
        <Image
           width={20}
           height={20}
          className="ml-2 w-8 h-8 rounded-full"
          src="/image/icon.jpeg"
          alt="Profile"
        />
      </div>
    </div>
  </div>
  

  );
};

export default AdminHeader;
