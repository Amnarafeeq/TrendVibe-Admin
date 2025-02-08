"use client";
import ProtectedRoute from '@/app/components/protected/ProtectedRoute';
import { client } from '@/sanity/lib/client';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';

export type Customer = {
  _id: string;
  customerName?: string;
  email?: string;
  orderNumber?: string;
  totalPrice?: number;
  orderDate?: string;
  status?: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
};

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    client
      .fetch(`*[_type == "order"]{
        _id,
        orderNumber,
        customerName,
        email,
        totalPrice,
        orderDate,
        status
      }`)
      .then((data) => setCustomers(data))
      .catch((error) => console.error("Error fetching customers:", error));
  }, []);

  const filteredCustomers = filter === "all" ? customers : customers.filter((customer) => customer.status === filter);

  const toggleCustomerDetails = (customerId: string) => {
    setSelectedCustomerId((prev) => (prev === customerId ? null : customerId));
  };

  const handleDelete = async (customerId: string) => {
    try {
      await client.delete(customerId);
      setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer._id !== customerId));
      toast.success("Customer deleted successfully");
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Error deleting customer");
    }
  };

  const calculateTotalCustomers = () => customers.length;

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-[250px] bg-gray-800 h-full md:p-4">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-[#FAFAFA]">
          {/* Header */}
          <div className="h-[70px] bg-white shadow-md">
            <AdminHeader />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Navigation and Filters */}
            <nav className="bg-textColor2 text-white p-4 mb-6 flex justify-between items-center rounded-lg shadow-md">
              <h2 className='font-bold text-2xl'>Total Customers: {calculateTotalCustomers()}</h2>

              <div className="space-x-4">
                {["all", "pending", "delivered", "dispatched"].map((status) => (
                  <button
                    key={status}
                    className={`px-4 py-2 rounded-lg ${filter === status ? "bg-white text-red-500 font-bold" : "text-white"}`}
                    onClick={() => setFilter(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </nav>

            {/* Customers Table */}
            <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Customers</h2>

              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-darkBackground text-buttonColor">
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">Customer Name</th>
                    <th className="p-2 border">Email</th>
                    <th className="p-2 border">Order Number</th>
                    <th className="p-2 border">Total</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <React.Fragment key={customer._id}>
                      <tr
                        className="cursor-pointer hover:bg-gray-100 transition-all"
                        onClick={() => toggleCustomerDetails(customer._id)}
                      >
                        <td className="p-2 border">{customer._id}</td>
                        <td className="p-2 border">{customer.customerName}</td>
                        <td className="p-2 border">{customer.email}</td>
                        <td className="p-2 border">{customer.orderNumber}</td>
                        <td className="p-2 border">${customer.totalPrice}</td>
                        <td className="p-2 border">{customer.status}</td>
                        <td className="p-2 border">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(customer._id);
                            }}
                            className="bg-textColor2 text-white px-3 py-2 rounded-lg"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>

                      {/* Customer Details */}
                      {selectedCustomerId === customer._id && (
                        <tr>
                          <td colSpan={7} className="bg-gray-50 p-4 transition-all">
                            <h3 className="font-bold">Customer Details</h3>
                            <p>Name: {customer.customerName}</p>
                            <p>Email: {customer.email}</p>
                            <p>Order Number: {customer.orderNumber}</p>
                            <p>Total: ${customer.totalPrice}</p>
                            <p>Status: {customer.status}</p>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminCustomers;
