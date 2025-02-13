"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Users, TrendingUp, Loader2 } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import SalesGraph from '../components/graph';
import StatCard from '../components/StatCard';
import { Order } from '../orders/page';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total products
        const productsCount = await client.fetch(`count(*[_type == "product"])`);
        
        // Fetch orders and calculate revenue
        const orders = await client.fetch(`*[_type == "order"] | order(_createdAt desc)[0...5]{
          _id,
          orderNumber,
          customerName,
          totalPrice,
          status,
          _createdAt
        }`);
        
        const allOrders = await client.fetch(`*[_type == "order"]{
          totalPrice,
          customerName
        }`);
        
        const totalOrders = allOrders.length;
        const totalRevenue = allOrders.reduce((sum: number, order: any) => 
          sum + (order.totalPrice || 0), 0);
        
        // Count unique customers
        const uniqueCustomers = new Set(allOrders.map((order: any) => order.customerName)).size;

        setStats({
          totalProducts: productsCount,
          totalOrders,
          totalCustomers: uniqueCustomers,
          totalRevenue
        });

        setRecentOrders(orders);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statsConfig = [
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      icon: <Package className="text-white" size={24} />,
      color: "bg-blue-500"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: <ShoppingCart className="text-white" size={24} />,
      color: "bg-green-500"
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toLocaleString(),
      icon: <Users className="text-white" size={24} />,
      color: "bg-purple-500"
    },
    {
      title: "Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: <TrendingUp className="text-white" size={24} />,
      color: "bg-[#23856D]"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#23856D]" />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <AdminHeader />
        
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsConfig.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <SalesGraph />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{order.customerName || 'Anonymous'}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order._createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#23856D]">${order.totalPrice}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}