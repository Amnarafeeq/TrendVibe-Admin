"use client";
import ProtectedRoute from '@/app/components/protected/ProtectedRoute';
import { client } from '@/sanity/lib/client';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  totalPrice: number;
  orderDate: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
}

interface Customer {
  email: string;
  customerName: string;
  orders: Order[];
  totalSpent: number;
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // First fetch all orders
        const orders = await client.fetch<Order[]>(`
          *[_type == "order"] {
            _id,
            orderNumber,
            customerName,
            email,
            totalPrice,
            orderDate,
            status
          }
        `);

        // Then group them by email to create customer profiles
        const customerMap = orders.reduce((acc, order) => {
          if (!order.email) return acc;

          if (!acc[order.email]) {
            acc[order.email] = {
              email: order.email,
              customerName: order.customerName,
              orders: [],
              totalSpent: 0
            };
          }

          acc[order.email].orders.push(order);
          acc[order.email].totalSpent += order.totalPrice || 0;

          return acc;
        }, {} as Record<string, Customer>);

        setCustomers(Object.values(customerMap));
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const toggleCustomerDetails = (email: string) => {
    setSelectedCustomerId(prev => prev === email ? null : email);
  };

  const filteredCustomers = customers.filter(customer => 
    customer.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#23856D]" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col bg-[#FAFAFA]">
          <AdminHeader />

          <div className="flex-1 overflow-y-auto p-6">
            {/* Header Stats */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-md mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    label: "Total Customers",
                    value: customers.length
                  },
                  {
                    label: "Total Revenue",
                    value: `$${customers.reduce((sum, customer) => sum + customer.totalSpent, 0).toLocaleString()}`
                  },
                  {
                    label: "Average Order Value",
                    value: `$${(customers.reduce((sum, customer) => sum + customer.totalSpent, 0) / 
                      customers.reduce((sum, customer) => sum + customer.orders.length, 0)).toFixed(2)}`
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <h3 className="text-gray-500 text-sm">{stat.label}</h3>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#23856D]"
              />
            </motion.div>

            {/* Customers Table */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <table className="w-full">
                <thead>
                  <tr className="bg-[#23856D] text-white">
                    <th className="p-4 text-left">Customer</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-right">Orders</th>
                    <th className="p-4 text-right">Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredCustomers.map((customer, index) => (
                      <React.Fragment key={customer.email}>
                        <motion.tr
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleCustomerDetails(customer.email)}
                        >
                          <td className="p-4">{customer.customerName}</td>
                          <td className="p-4">{customer.email}</td>
                          <td className="p-4 text-right">{customer.orders.length}</td>
                          <td className="p-4 text-right">${customer.totalSpent.toLocaleString()}</td>
                        </motion.tr>

                        <AnimatePresence>
                          {selectedCustomerId === customer.email && (
                            <motion.tr
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <td colSpan={4} className="bg-gray-50 p-4">
                                <motion.div
                                  initial={{ y: -20 }}
                                  animate={{ y: 0 }}
                                  className="space-y-4"
                                >
                                  <h3 className="font-semibold">Order History</h3>
                                  <div className="grid grid-cols-1 gap-3">
                                    {customer.orders.map((order) => (
                                      <motion.div
                                        key={order._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-white p-3 rounded-lg shadow-sm"
                                      >
                                        <div className="flex justify-between items-center">
                                          <div>
                                            <p className="font-medium">Order #{order.orderNumber}</p>
                                            <p className="text-sm text-gray-500">
                                              {new Date(order.orderDate).toLocaleDateString()}
                                            </p>
                                          </div>
                                          <div className="text-right">
                                            <p className="font-bold">${order.totalPrice?.toLocaleString()}</p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                              order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                              'bg-blue-100 text-blue-600'
                                            }`}>
                                              {order.status}
                                            </span>
                                          </div>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                </motion.div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </motion.div>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center p-8"
              >
                <Loader2 className="w-8 h-8 animate-spin text-[#23856D]" />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminCustomers;
