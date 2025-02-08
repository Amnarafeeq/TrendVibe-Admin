"use client";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import SalesGraph from "../components/graph";

export default function AdminDashboard() {
  return (
    <div className="flex h-screen">
      {/* Sidebar - Fixed Width & Full Height */}
      <div className="w-[250px] bg-gray-800 h-screen">
        <Sidebar />
      </div>

      {/* Main Section (Header + Content) */}
      <div className="flex-1 flex flex-col bg-[#FAFAFA]">
        {/* Admin Header - Fixed Height */}
        <div className="h-[70px]">
          <AdminHeader />
        </div>

        {/* Dashboard Content */}
        {/* <div className="p-6 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded shadow-md text-center">
              <h3 className="text-lg font-semibold">Total Sales</h3>
              <p className="text-2xl font-bold">$5,320</p>
            </div>
            <div className="bg-white p-6 rounded shadow-md text-center">
              <h3 className="text-lg font-semibold">Total Orders</h3>
              <p className="text-2xl font-bold">324</p>
            </div>
          </div>

          <div className="mt-8">
  <h2 className="text-xl font-semibold">Sales Overview</h2>
  <div className="w-full h-screen bg-gray-400 p-6 rounded shadow-md mt-4">
    <div className="w-full h-full bg-[#f4f4f4] flex items-center justify-center text-[#737373]">
      <SalesGraph />
    </div>
  </div>
</div>
        </div> */}

<div className="p-6 flex-1">
  {/* Overview Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div className="bg-white p-6 rounded shadow-md text-center">
      <h3 className="text-lg font-semibold text-[#252B42]">Total Sales</h3>
      <p className="text-2xl font-bold text-[#737373]">$5,320</p>
    </div>
    <div className="bg-white p-6 rounded shadow-md text-center">
      <h3 className="text-lg font-semibold text-[#252B42]">Total Orders</h3>
      <p className="text-2xl font-bold text-[#737373]">324</p>
    </div>
  </div>

  {/* Sales Graph Section */}
  <div className="mt-8">
    <h2 className="text-xl font-semibold text-[#252B42]">Sales Overview</h2>
    <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] bg-white p-6 rounded shadow-md mt-4">
      <div className="w-full h-full flex items-center justify-center text-[#737373]">
        <SalesGraph />
      </div>
    </div>
  </div>
</div>






      </div>
    </div>
  );
}









// ye sai ha
// "use client";
// import ProtectedRoute from '@/app/components/protected/page';
// import { client } from '@/sanity/lib/client';
// import { urlFor } from '@/sanity/lib/image';
// import React, { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';

// export type Order = {
//       _id: string;
//       _type: "order";
//       _createdAt: string;
//       _updatedAt: string;
//       _rev: string;
//       orderNumber?: string;
//       invoice?: {
//         id?: string;
//         number?: string;
//         hosted_invoice_url?: string;
//       };
//       stripeCheckoutSessionId?: string;
//       stripeCustomerId?: string;
//       clerkUserId?: string;
//       customerName?: string;
//       email?: string;
//       stripePaymentIntentId?: string;
//       products?: Array<{
//         product?: {
//           name:string
//           _ref: string;
//           _type: "reference";
//           _weak?: boolean;
//           images:string
//         };
//         quantity?: number;
//         _key: string;
//       }>;
//       totalPrice?: number;
//       currency?: string;
//       amountDiscount?: number;
//       status?: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
//       orderDate?: string;
//     };

// const AdminDashboard = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
//   const [filter, setFilter] = useState("all");

//   useEffect(() => {
//     client
//       .fetch(`*[_type == "order"]{
//         _id,
//           orderNumber,
//           invoice {
//             id,
//             number,
//             hosted_invoice_url
//           },
//           stripeCheckoutSessionId,
//           stripeCustomerId,
//           clerkUserId,
//           customerName,
//           email,
//           stripePaymentIntentId,
//           products[]{
//             product->{
//               name,
//               price,
//               currency,
//               images
//             },
//             quantity
//           },
//           totalPrice,
//           currency,
//           amountDiscount,
//           status,
//           orderDate
//         }
//         `)
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

//   return (
//     <ProtectedRoute>
//       <div className="flex flex-col h-auto bg-gray-100">
//         <nav className="bg-red-500 text-white p-4 flex justify-between items-center">
//           <h2 className="text-xl font-bold">Admin Dashboard</h2>
//           <div className="space-x-4">
//             {["all", "pending", "success", "dispatched"].map((status) => (
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
//       <h2>total orders{calculateTotalOrders()}</h2>

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
//                  <tr 
//                     className="cursor-pointer hover:bg-gray-100 transition-all" 
//                 onClick={() => toggleOrderDetails(order._id)}
//                        >
//                       <td className="p-2 border">{order._id}</td>
//                      <td className="p-2 border">{order.customerName}</td>
//                       <td className="p-2 border">{order.email}</td>
//                   <td className="p-2 border">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}</td>
//                         <td className="p-2 border">${order.totalPrice}</td>
//                     <td className="p-2 border">
//                           <select 
//                          value={order.status || ""} 
//                        className="border p-1"
//                               onClick={(e) => e.stopPropagation()}
//                             >
//                   <option value="pending">Pending</option>
//                     <option value="delivered">Delivered</option>
//                       <option value="dispatched">Dispatched</option>
//                              </select>
//                                   </td>
//                              <td className="p-2 border">
//                                  <button
//                                onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleDelete(order._id);
                               
//                               }}
//                                className="bg-red-500 text-white px-3 py-2 rounded-lg"
//                                    >
//                                    Delete
//                                 </button>
//                                         </td>
//                       </tr>

// {selectedOrderId === order._id && (
//   <tr>
//     <td colSpan={7} className="bg-gray-50 p-4 transition-all h-auto ">
//       <h3 className="font-bold">Order Details</h3>
//       <p>Customer: {order.customerName}</p>
//       <p>Email: {order.email}</p>
//       <div>
//                            {order.products?.map((item, index) => {
//                             return(
//                               <>
//                                 <div key={index} className="flex items-center gap-4 p-4 border-b">
//                                   {/* Product Image and Name Container */}
//                                   <div className="flex items-center gap-4 w-full">
//                                     {/* Display product image */}
//                                     {item.product?.images && item.product.images[0] && (
//                                       <img 
//                                         src={urlFor(item.product.images[0]).url()} 
//                                         alt="Product Image" 
//                                         className="w-16 h-16 object-cover rounded-md"
//                                       />
//                                     )}
                            
//                                     {/* Display product name */}
//                                     <p className="text-lg font-semibold text-gray-800">{item.product?.name}</p>
//                                   </div>
                            
//                                   {/* Product Quantity */}
//                                   <div className="flex items-center justify-between w-24">
//                                     <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
//                                   </div>
//                                 </div>
                            
//                             </>
                            
//                             )
//                            } )}
//                           </div>
//     </td>
//   </tr>
// )}


//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default AdminDashboard;





// "use client";
// import ProtectedRoute from '@/app/components/protected/page';
// import { client } from '@/sanity/lib/client';
// import { urlFor } from '@/sanity/lib/image';
// import React, { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';

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
//       images: string[];
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

// const AdminDashboard = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
//   const [filter, setFilter] = useState("all");

//   useEffect(() => {
//     client
//       .fetch(`*[_type == "order"]{
//           orderNumber,
//           invoice {
//             id,
//             number,
//             hosted_invoice_url
//           },
//           stripeCheckoutSessionId,
//           stripeCustomerId,
//           clerkUserId,
//           customerName,
//           email,
//           stripePaymentIntentId,
//           products[] {
//             product->{
//               name,
//               price,
//               currency,
//               images
//             },
//             quantity
//           },
//           totalPrice,
//           currency,
//           amountDiscount,
//           status,
//           orderDate
//         }`)
//       .then((data) => setOrders(data))
//       .catch((error) => {
//         console.error("Error fetching orders:", error);
//         toast.error("Error fetching orders");
//       });
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

//   const handleStatusChange = async (orderId: string, newStatus: string) => {
//     try {
//       await client.patch(orderId).set({ status: newStatus }).commit();
//       setOrders((prevOrders) =>  prevOrders.map((order) =>order._id === orderId ? { ...order, newStatus } : order))
//       toast.success("Order status updated");
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       toast.error("Error updating order status");
//     }
//   };

//   return (
//     <ProtectedRoute>
//       <div className="flex flex-col h-auto bg-gray-100">
//         <nav className="bg-red-500 text-white p-4 flex justify-between items-center">
//           <h2 className="text-xl font-bold">Admin Dashboard</h2>
//           <div className="space-x-4">
//             {["all", "pending", "success", "dispatched"].map((status) => (
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
//                     <tr className="cursor-pointer hover:bg-gray-100 transition-all" onClick={() => toggleOrderDetails(order._id)}>
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
//                         >
//                           <option value="pending">Pending</option>
//                           <option value="success">Success</option>
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
//                         <td colSpan={7} className="bg-gray-50 p-4 transition-all">
//                           <h3 className="font-bold">Order Details</h3>
//                           <p>Customer: {order.customerName}</p>
//                           <p>Email: {order.email}</p>
//                           <ul>
//                             {order.products?.map((item, index) => (
//                               <li key={index} className="flex items-center gap-2">
//                                 {item.product?.images && item.product.images[0] && (
//                                   <img 
//                                     src={urlFor(item.product.images[0]).url()} 
//                                     alt="Product Image" 
//                                     width={50} 
//                                     height={50} 
//                                   />
//                                 )}
//                                 {item.product?.name}
//                               </li>
//                             ))}
//                           </ul>
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
//     </ProtectedRoute>
//   );
// };

// export default AdminDashboard;








// my code

// "use client"
// import ProtectedRoute from '@/app/components/protected/page';
// import { client } from '@/sanity/lib/client';
// import { urlFor } from '@/sanity/lib/image';
// import React, { useEffect, useState } from 'react'
// import toast from 'react-hot-toast';

// export type Order = {
//     _id: string;
//     _type: "order";
//     _createdAt: string;
//     _updatedAt: string;
//     _rev: string;
//     orderNumber?: string;
//     invoice?: {
//       id?: string;
//       number?: string;
//       hosted_invoice_url?: string;
//     };
//     stripeCheckoutSessionId?: string;
//     stripeCustomerId?: string;
//     clerkUserId?: string;
//     customerName?: string;
//     email?: string;
//     stripePaymentIntentId?: string;
//     products?: Array<{
//       product?: {
//         name:string
//         _ref: string;
//         _type: "reference";
//         _weak?: boolean;
//         images:string
//         // [internalGroqTypeReferenceTo]?: "product";
//       };
//       quantity?: number;
//       _key: string;
//     }>;
//     totalPrice?: number;
//     currency?: string;
//     amountDiscount?: number;
//     status?: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
//     orderDate?: string;
//   };

// const AdminDashboard = () => {
//   const [orders,setOrders] = useState<Order[]>([])
//   const [selectedOrderId,setSelectedOrderId] = useState<string|null>()
//   const [filter,setFilter] = useState("all")

//   useEffect(()=>{
//     client.fetch(`*[_type == "order"]{
//   orderNumber,
//   invoice {
//     id,
//     number,
//     hosted_invoice_url
//   },
//   stripeCheckoutSessionId,
//   stripeCustomerId,
//   clerkUserId,
//   customerName,
//   email,
//   stripePaymentIntentId,
//   products[]{
//     product->{
//       name,
//       price,
//       currency,
//       images
//     },
//     quantity
//   },
//   totalPrice,
//   currency,
//   amountDiscount,
//   status,
//   orderDate
// }
// `)
// .then((data) => setOrders(data))
// .catch((error)=>console.log("error fetching products",error))
//   },[ ])
//   const filteredOrders = filter === "all"? orders : orders.filter((order)=>order.status===filter)
//   const  toggleOrderDetails = (orderId:string) =>{
//     setSelectedOrderId((prev)=>(prev=== orderId?null:orderId))
//     const handleDelete = async(orderId:string) =>{
//               try{
//                 await client.delete(orderId)
//                 setOrders((prevOrder) =>prevOrder.filter((order)=>order._id !== orderId))
//                 toast.success(`... deleted from cart`)  

//               }catch(error){
//                toast.success("something went wrong");
                
//               }
//     }
//     const handleStatusChange =async(orderId:string,newStatus:string)=>{
//           try{
//             await client.patch(orderId)
//             .set({status:newStatus})
//             .commit()
//             setOrders((prevOrders)=> prevOrders.map((order)=> order._id == orderId? {...order, newStatus }:order))
//             if(newStatus === "dispatch"){
//               toast.success(`Order Dispatched, Your order has been dispatched`)
//             }else if(newStatus === "success"){
//               toast.success(`Your order has been completed.`)
//             }
//           }catch(error){
//          toast.success(`Failed to change status`)
//           }
//     }
//   }
//   function handleStatus(_id:string,value:string):void{
//           throw new Error("Function not implemented")
//   }
//   function handleDelete(_id: string) {
//     throw new Error('Function not implemented.');
//   }

//   return (
//     <div>
//           <ProtectedRoute>
//             <div className='flex flex-col h-screen'>
//                           <nav className='bg-red-500 flex  justify-evenly items-center'>
//               <h2>Admin Dashboard</h2>

                          
//                 <div className='flex  space-x-4'>

//                   {["All","pending","success","dispatched"].map((status)=>(
//                     <button key={status} className={`px-4 py-2 transition-all ${filter === status ? "bg-white text-red-500 font-bold":"text-black"}`} onClick={()=>setFilter(status)} >
//                            {status}
//                     </button>
//                   ))}
//                 </div>
//                 </nav>

//                 <div className='flex-1 p-6 overflow-y-auto'>
//                   <h2>orders</h2>
//                   <div className='overflow-y-auto bg-red-400 rounded-lg shadow-lg'>
//                     <table>
//                       <thead>
//                         <tr>
//                           <th>ID</th>
//                           <th>Customer</th>
//                           <th>Address</th>
//                           <th>Date</th>
//                           <th>Total</th>
//                           <th>Status</th>
//                           <th>Actions</th>

//                         </tr>
//                       </thead>
//                       <tbody className='divide-y divide-gray-400'>
//                                    {filteredOrders.map((order,index)=>(
//                                     <React.Fragment key={index}>
//                                       <tr className='cursor-pointer hover:bg-slate-200 transition-all' onClick={()=>toggleOrderDetails(order._id)}>
//                                         <td>{order._id}</td>
//                                         <td>{order.customerName}</td>
//                                         <td>{order.email}</td>
//                                         <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</td>
//                                         <td>{order.totalPrice}</td>
//                                         </tr>
//                                         <td>
//                                         <select value={order.status|| ""} onChange={(e)=>handleStatus(order._id,e.target.value)} >
//                                           <option value="pending">Pending</option>
//                                           <option value="success">Success</option>
//                                           <option value="dispatch">Dispatch</option>
//                                         </select>
//                                         </td>
//                                         <td className='px-6 py-4'>
//                                                <button onClick={(e)=>{e.stopPropagation(),handleDelete(order._id)}} className='bg-red-500 text-white px-3 py-5'>Delete</button> 
//                                         </td>
//                                         {selectedOrderId === order._id &&(
//                                           <tr>
//                                             <td colSpan={7} className='bg-gray-50 p-4 transition-all '>
//                                               <h3 className='font-bold'>order details</h3>
//                                               <p>Customer:{order.customerName}</p>
//                                               <p>Email:{order.email}</p>
//                                               <ul>
//                                                 {order.products?.map((item,index)=>(
//                                                   <li key={index} className='line-clamp-1 flex items-center gap-2'>
//                                                     {item.product?.name}
//                                                     {item.product?.images &&(
//                                                       <img src={urlFor(item.product.images[0]).url()} alt='' width={100} height={100}/>
//                                                     )}
//                                                   </li>
//                                                 ))}
//                                               </ul>
//                                             </td>
//                                           </tr>
//                                         )}
                                       
//                                     </React.Fragment>
//                                    ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//             </div>
//           </ProtectedRoute>

//     </div>
//   )
// }

// export default AdminDashboard