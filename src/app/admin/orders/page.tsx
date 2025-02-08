"use client";
import ProtectedRoute from '@/app/components/protected/ProtectedRoute';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import Image from 'next/image';

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

  if (loading) return <p className="text-center text-3xl text-textColor2 flex items-center justify-center h-screen">Loading orders...</p>;
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
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-[250px] bg-gray-800 h-full p-4">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-[#FAFAFA]">
          {/* Header */}
          <div className="h-[70px] bg-white shadow-md">
            <AdminHeader />
          </div>

         

<div className="flex-1 overflow-y-auto p-6">
  {/* Navigation and Filters */}
  <nav className="bg-[#252B42] text-[#FAFAFA] p-4 mb-6 flex justify-between items-center rounded-lg shadow-md">
    <h2 className="font-bold text-2xl text-[#FAFAFA]">Total Orders: {calculateTotalOrders()}</h2>

    <div className="space-x-4">
      {["all", "pending", "delivered", "dispatched"].map((status) => (
        <button
          key={status}
          className={`px-4 py-2 rounded-lg ${
            filter === status
              ? "bg-[#FAFAFA] text-[#252B42] font-bold"
              : "text-[#FAFAFA]"
          } hover:bg-[#23856D] hover:text-[#FAFAFA]`}
          onClick={() => setFilter(status)}
        >
          {status}
        </button>
      ))}
    </div>
  </nav>

  {/* Orders Table */}
  <div className="overflow-x-auto bg-[#FAFAFA] p-4 rounded-lg shadow-lg">
    <h2 className="text-lg font-semibold mb-4 text-[#252B42]">Orders</h2>

    <table className="w-full border-collapse border border-[#737373]">
      <thead>
        <tr className="bg-[#23856D] text-[#FAFAFA]">
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
        {filteredOrders.map((order) => (
          <React.Fragment key={order._id}>
            <tr
              className="cursor-pointer hover:bg-[#737373]/10 transition-all"
              onClick={() => toggleOrderDetails(order._id)}
            >
              <td className="p-2 border">{order._id}</td>
              <td className="p-2 border">{order.customerName}</td>
              <td className="p-2 border">{order.email}</td>
              <td className="p-2 border">
                {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}
              </td>
              <td className="p-2 border text-[#737373] font-bold">${order.totalPrice}</td>
              <td className="p-2 border">
                <select
                  value={order.status || ""}
                  className="border p-1 bg-[#FAFAFA] text-[#252B42] rounded-md"
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  onClick={(e) => e.stopPropagation()} // Prevent order details toggle
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
                  className="bg-[#2DC071] text-[#FAFAFA] px-3 py-2 rounded-lg"
                >
                  Delete
                </button>
              </td>
            </tr>

            {/* Order Details */}
            {selectedOrderId === order._id && (
              <tr>
                <td colSpan={7} className="bg-[#FAFAFA] p-4 transition-all">
                  <h3 className="font-bold text-[#252B42]">Order Details</h3>
                  <p>Customer: {order.customerName}</p>
                  <p>Email: {order.email}</p>
                  <div>
                    {order.products?.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border-b">
                        <div className="flex items-center gap-4 w-full">
                          {item.product?.images && item.product.images[0] && (
                            <Image
                              width={20}
                              height={20} 
                              src={urlFor(item.product.images[0]).url()}
                              alt="Product Image"
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          )}
                          <p className="text-lg font-semibold text-[#252B42]">
                            {item.product?.name}
                          </p>
                        </div>
                        <div className="flex items-center justify-between w-24">
                          <p className="text-sm text-[#737373]">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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

export default AdminOrders;




// "use client";
// import ProtectedRoute from '@/app/components/protected/page';
// import { client } from '@/sanity/lib/client';
// import { urlFor } from '@/sanity/lib/image';
// import React, { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import Sidebar from '../components/Sidebar';
// import AdminHeader from '../components/AdminHeader';

// export type Order = {
//   _id: string;
//   _type: "order";
//   _createdAt: string;
//   _updatedAt: string;
//   _rev: string;
//   orderNumber?: string;
//   invoice?: {
//     id?: string;
//     number?: string;
//     hosted_invoice_url?: string;
//   };
//   stripeCheckoutSessionId?: string;
//   stripeCustomerId?: string;
//   clerkUserId?: string;
//   customerName?: string;
//   email?: string;
//   stripePaymentIntentId?: string;
//   products?: Array<{
//     product?: {
//       name: string;
//       _ref: string;
//       _type: "reference";
//       _weak?: boolean;
//       images: string;
//     };
//     quantity?: number;
//     _key: string;
//   }>;
//   totalPrice?: number;
//   currency?: string;
//   amountDiscount?: number;
//   status?: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
//   orderDate?: string;
// };

// const AdminOrders = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
//   const [filter, setFilter] = useState("all");

//   useEffect(() => {
//     client
//       .fetch(`*[_type == "order"]{
//         _id,
//         orderNumber,
//         invoice {
//           id,
//           number,
//           hosted_invoice_url
//         },
//         stripeCheckoutSessionId,
//         stripeCustomerId,
//         clerkUserId,
//         customerName,
//         email,
//         stripePaymentIntentId,
//         products[] {
//           product -> {
//             name,
//             price,
//             currency,
//             images
//           },
//           quantity
//         },
//         totalPrice,
//         currency,
//         amountDiscount,
//         status,
//         orderDate
//       }`)
//       .then((data) => setOrders(data))
//       .catch((error) => console.error("Error fetching orders:", error));
//   }, []);

//   const filteredOrders = filter === "all" ? orders : orders.filter((order) => order.status === filter);

//   const toggleOrderDetails = (orderId: string) => {
//     setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
//   };

//   const handleDelete = async (orderId: string) => {
//     try {
//       await client.delete(orderId);
//       setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
//       toast.success("Order deleted successfully");
//     } catch (error) {
//       console.error("Error deleting order:", error);
//       toast.error("Error deleting order");
//     }
//   };

//   // Calculate the total number of orders
//   const calculateTotalOrders = () => {
//     return orders.length; // Get the total number of orders
//   };

//   // Handle status change
//   const handleStatusChange = async (orderId: string, newStatus: string) => {
//     try {
//       console.log("Updating order:", orderId, "to status:", newStatus);
  
//       const updatedOrder = await client.patch(orderId).set({ status: newStatus }).commit();
//       console.log("Sanity Updated Order:", updatedOrder); // Check what comes back
  
//       setOrders((prevOrders) => {
//         console.log("Previous Orders:", prevOrders);
//         return prevOrders.map((order) =>
//           order._id === orderId ? { ...order, status: newStatus as Order["status"] } : order
//         );
//       });
  
//       toast.success(`Order status updated to ${newStatus}`);
//     } catch (error) {
//       console.error("Error updating status:", error);
//       toast.error("Something went wrong while updating status");
//     }
//   };
  
  

  

//   return (
//     <ProtectedRoute>
//       <div className='flex h-screen' >
//       <div className="w-[250px] bg-gray-800 h-screen">
//         <Sidebar />
//       </div>

//       {/* Main Section (Header + Content) */}
//       <div className="flex-1 flex flex-col bg-[#FAFAFA]">
//         {/* Admin Header - Fixed Height */}
//         <div className="h-[70px]">
//           <AdminHeader />
//         </div>
//         </div>
//       {/* <Sidebar /> */}

//       <div className="flex flex-col h-auto bg-gray-100">
//         <nav className="bg-red-500 text-white p-4 flex justify-between items-center">
//           <h2 className="text-xl font-bold">Admin Dashboard</h2>
//           <div className="space-x-4">
//             {["all", "pending", "delivered", "dispatched"].map((status) => (
//               <button
//                 key={status}
//                 className={`px-4 py-2 rounded-lg ${filter === status ? "bg-white text-red-500 font-bold" : "text-white"}`}
//                 onClick={() => setFilter(status)}
//               >
//                 {status}
//               </button>
//             ))}
//           </div>
//         </nav>

//         <div className="p-6 overflow-y-auto">
//           <h2 className="text-lg font-semibold mb-4">Orders</h2>
//           <h2>Total Orders: {calculateTotalOrders()}</h2>

//           <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-lg">
//             <table className="w-full border-collapse border border-gray-300">
//               <thead>
//                 <tr className="bg-gray-200">
//                   <th className="p-2 border">ID</th>
//                   <th className="p-2 border">Customer</th>
//                   <th className="p-2 border">Email</th>
//                   <th className="p-2 border">Date</th>
//                   <th className="p-2 border">Total</th>
//                   <th className="p-2 border">Status</th>
//                   <th className="p-2 border">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredOrders.map((order) => (
//                   <React.Fragment key={order._id}>
//                     <tr
//                       className="cursor-pointer hover:bg-gray-100 transition-all"
//                       onClick={() => toggleOrderDetails(order._id)}
//                     >
//                       <td className="p-2 border">{order._id}</td>
//                       <td className="p-2 border">{order.customerName}</td>
//                       <td className="p-2 border">{order.email}</td>
//                       <td className="p-2 border">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}</td>
//                       <td className="p-2 border">${order.totalPrice}</td>
//                       <td className="p-2 border">
//                         <select
//                           value={order.status || ""}
//                           className="border p-1"
//                           onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                           onClick={(e) => e.stopPropagation()} // Prevent the order details toggle from being triggered
//                         >
//                           <option value="pending">Pending</option>
//                           <option value="delivered">Delivered</option>
//                           <option value="dispatched">Dispatched</option>
//                         </select>
//                       </td>
//                       <td className="p-2 border">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleDelete(order._id);
//                           }}
//                           className="bg-red-500 text-white px-3 py-2 rounded-lg"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>

//                     {selectedOrderId === order._id && (
//                       <tr>
//                         <td colSpan={7} className="bg-gray-50 p-4 transition-all h-auto ">
//                           <h3 className="font-bold">Order Details</h3>
//                           <p>Customer: {order.customerName}</p>
//                           <p>Email: {order.email}</p>
//                           <div>
//                             {order.products?.map((item, index) => {
//                               return (
//                                 <div key={index} className="flex items-center gap-4 p-4 border-b">
//                                   <div className="flex items-center gap-4 w-full">
//                                     {item.product?.images && item.product.images[0] && (
//                                       <img
//                                         src={urlFor(item.product.images[0]).url()}
//                                         alt="Product Image"
//                                         className="w-16 h-16 object-cover rounded-md"
//                                       />
//                                     )}
//                                     <p className="text-lg font-semibold text-gray-800">{item.product?.name}</p>
//                                   </div>
//                                   <div className="flex items-center justify-between w-24">
//                                     <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
//                                   </div>
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//       </div>
      
     
//     </ProtectedRoute>
//   );
// };

// export default AdminOrders;