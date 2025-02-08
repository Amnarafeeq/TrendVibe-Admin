import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Menu,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MobileSidebar = () => {
  const navLinks = [
    { title: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { title: "Products", href: "/admin/products", icon: <Package size={20} /> },
    { title: "Orders", href: "/admin/orders", icon: <ShoppingCart size={20} /> },
    { title: "Customers", href: "/admin/customers", icon: <Users size={20} /> },
    { title: "Settings", href: "/admin/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger className="p-2 text-white bg-[#23856D] rounded-md">
          <Menu size={24} />
        </SheetTrigger>
        <SheetContent side="left" className="bg-[#252B42] text-[#FAFAFA] w-64">
          <SheetHeader>
            <SheetTitle className="text-[#23A6F0] text-2xl font-bold">
              TrendVibe
            </SheetTitle>
          </SheetHeader>
          <ul className="mt-6 space-y-2">
            {navLinks.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg transition duration-300
                            hover:bg-[#23856D] text-white"
                >
                  <span>{item.icon}</span>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileSidebar;
