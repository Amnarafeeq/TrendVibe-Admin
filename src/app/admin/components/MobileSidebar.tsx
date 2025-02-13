"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from 'framer-motion';
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
  const pathname = usePathname();
  
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
        <SheetTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-[#23856D] text-white rounded-lg hover:bg-[#23856D]/90 transition-colors"
          >
            <Menu size={24} />
          </motion.button>
        </SheetTrigger>
        
        <SheetContent side="left" className="w-72 p-0 bg-[#252B42]">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-6 border-b border-[#FAFAFA]/10">
              <SheetTitle className="text-2xl font-bold text-[#23A6F0]">
                TrendVibe
              </SheetTitle>
            </SheetHeader>
            
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {navLinks.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.li
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={item.href}>
                        <motion.div
                          whileHover={{ x: 4 }}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-all
                            ${isActive 
                              ? 'bg-[#23856D] text-white' 
                              : 'text-gray-300 hover:bg-[#23856D]/10'}`}
                        >
                          <span>{item.icon}</span>
                          <span className="font-medium">{item.title}</span>
                        </motion.div>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
            
            <div className="p-4 border-t border-[#FAFAFA]/10">
              <p className="text-sm text-gray-400 text-center">
                © 2024 TrendVibe Admin
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileSidebar;
