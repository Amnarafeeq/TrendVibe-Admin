import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings } from "lucide-react"; // Icons

export default function Sidebar() {
  const navLinks = [
    { title: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { title: "Products", href: "/admin/products", icon: <Package size={20} /> },
    { title: "Orders", href: "/admin/orders", icon: <ShoppingCart size={20} /> },
    { title: "Customers", href: "/admin/customers", icon: <Users size={20} /> },
    { title: "Settings", href: "/admin/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="hidden md:block w-64 h-full bg-[#252B42] text-[#FAFAFA] p-4 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-[#23A6F0]">TrendVibe</h2>
      <ul>
        {navLinks.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-3 p-4 rounded-lg transition duration-300 cursor-pointer
                       hover:bg-[#23856D] hover:text-[#FAFAFA]"
          >
            <span className="text-[#FAFAFA]">{item.icon}</span>
            <Link href={item.href} className="block text-white ">
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
