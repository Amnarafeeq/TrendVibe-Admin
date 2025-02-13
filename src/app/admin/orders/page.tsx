"use client";
import ProtectedRoute from '@/app/components/protected/ProtectedRoute';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export type Order = {
  _id: string;
  _type: "order";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  orderNumber?: string;
  invoice?: {
    id?: string;
    number?: string;
    hosted_invoice_url?: string;
  };
  stripeCheckoutSessionId?: string;
  stripeCustomerId?: string;
  clerkUserId?: string;
  customerName?: string;
  email?: string;
  stripePaymentIntentId?: string;
  products?: Array<{
    product?: {
      name: string;
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      images: string;
    };
    quantity?: number;
    _key: string;
  }>;
  totalPrice?: number;
  currency?: string;
  amountDiscount?: number;
  status?: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  orderDate?: string;
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async ()=>{try{
      const query= `*[_type == "order"]{
        _id,
        orderNumber,
        invoice {
          id,
          number,
          hosted_invoice_url
        },
        stripeCheckoutSessionId,
        stripeCustomerId,
        clerkUserId,
        customerName,
        email,
        stripePaymentIntentId,
        products[] {
          product -> {
            name,
            price,
            currency,
            images
          },
          quantity
        },
        totalPrice,
        currency,
        amountDiscount,
        status,
        orderDate
      }`
     const data = await client.fetch(query)
     setOrders(data)
    }catch(error){
      setError('Failed to load Orders.');
      console.error(error)

    }finally{
      setLoading(false)
    } }
    fetchOrders()
  
  }, []);

  if (loading) return <span className='flex items-center justify-center h-screen gap-3 text-textColor2 '><Loader2 className='sm:w-8 sm:h-8 animate-spin'/> <span className='text-2xl sm:text-3xl font-semibold'>Orders are loading...</span></span> 
  if (error) return <p className="text-center text-3xl h-screen flex items-center justify-center text-red-500">{error}</p>;

  const filteredOrders = filter === "all" ? orders : orders.filter((order) => order.status === filter);

  const toggleOrderDetails = (orderId: string) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleDelete = async (orderId: string) => {
    try {
      await client.delete(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Error deleting order");
    }
  };

  const calculateTotalOrders = () => orders.length;

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const updatedOrder = await client
        .patch(orderId)
        .set({ status: newStatus })
        .commit();
      
      // Update the state with the updated order using the updatedOrder variable
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: updatedOrder.status } : order
        )
      );
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Something went wrong while updating status");
    }
  };
  

  return (
    <ProtectedRoute>
      <div className="flex h-screen flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 flex flex-col bg-[#FAFAFA] w-full">
          <AdminHeader />
          <div className="flex-1 overflow-y-auto p-2 md:p-6">
            {/* Stats Navigation - More compact on mobile */}
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-textColor2 text-white p-3 mb-4 md:mb-6 flex flex-col gap-3 rounded-lg shadow-md"
            >
              <h2 className='font-bold text-lg md:text-2xl text-center md:text-left'>Total Orders: {calculateTotalOrders()}</h2>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center md:justify-start">
                {["all", "pending", "delivered", "dispatched"].map((status, index) => (
                  <motion.button
                    key={status}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`px-2 py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-base ${
                      filter === status ? "bg-white text-red-500 font-bold" : "text-white"
                    }`}
                    onClick={() => setFilter(status)}
                  >
                    {status}
                  </motion.button>
                ))}
              </div>
            </motion.nav>

            {/* Orders Table - Responsive design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-2 md:p-4 rounded-lg shadow-lg"
            >
              <h2 className="text-base md:text-lg font-semibold mb-4">Orders</h2>

              <div className="overflow-x-auto -mx-2 md:mx-0">
                <table className="w-full whitespace-nowrap">
                  <thead>
                    <tr className="bg-darkBackground text-buttonColor text-xs md:text-base">
                      <th className="p-2 border">ID</th>
                      <th className="p-2 border">Customer</th>
                      <th className="p-2 border">Email</th>
                      <th className="p-2 border">Date</th>
                      <th className="p-2 border">Total</th>
                      <th className="p-2 border">Status</th>
                      <th className="p-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <React.Fragment key={order._id}>
                        <motion.tr
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="cursor-pointer hover:bg-gray-100 transition-all text-xs md:text-base"
                          onClick={() => toggleOrderDetails(order._id)}
                        >
                          <td className="p-2 border truncate max-w-[60px] md:max-w-[150px]">
                            {order._id}
                          </td>
                          <td className="p-2 border truncate max-w-[80px] md:max-w-[120px]">{order.customerName}</td>
                          <td className="p-2 border truncate max-w-[100px] md:max-w-[150px]">{order.email}</td>
                          <td className="p-2 border">
                            {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}
                          </td>
                          <td className="p-2 border text-[#737373] font-bold">${order.totalPrice}</td>
                          <td className="p-2 border">
                            <select
                              value={order.status || ""}
                              className="border p-1 bg-[#FAFAFA] text-[#252B42] rounded-md text-xs w-full"
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="pending">Pending</option>
                              <option value="delivered">Delivered</option>
                              <option value="dispatched">Dispatched</option>
                            </select>
                          </td>
                          <td className="p-2 border">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(order._id);
                              }}
                              className="bg-[#2DC071] text-[#FAFAFA] px-2 py-1 md:px-3 md:py-2 rounded-lg text-xs w-full"
                            >
                              Delete
                            </button>
                          </td>
                        </motion.tr>

                        {selectedOrderId === order._id && (
                          <motion.tr>
                            <td colSpan={7} className="bg-gray-50 p-2 md:p-4">
                              <motion.div className="space-y-2 text-xs md:text-base">
                                <h3 className="font-bold text-[#252B42]">Order Details</h3>
                                <p>Customer: {order.customerName}</p>
                                <p>Email: {order.email}</p>

                                <div className="mt-3 space-y-2">
                                  {order.products?.map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 p-2 border-b"
                                    >
                                      {item.product?.images && item.product.images[0] && (
                                        <Image
                                          width={48}
                                          height={48}
                                          src={urlFor(item.product.images[0]).url()}
                                          alt="Product Image"
                                          className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-md"
                                        />
                                      )}
                                      <div>
                                        <p className="font-semibold text-[#252B42]">
                                          {item.product?.name}
                                        </p>
                                        <p className="text-[#737373]">
                                          Quantity: {item.quantity}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            </td>
                          </motion.tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminOrders;