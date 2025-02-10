"use client";
import { client } from '@/sanity/lib/client';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import { Loader2, Trash2 } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  intro: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  status: string;
  variant?: string;
  categories: string[];
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const query = `*[_type == "product"]{
        _id,
        name,
        "slug": slug.current,
        images,
        intro,
        description,
        price,
        discount,
        stock,
        status,
        variant,
        "categories": categories[]->title
      }`;
      const data = await client.fetch(query);
      setProducts(data);
    } catch (err) {
      setError('Failed to load products.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await client.delete(id);
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete the product.");
    }
  };

  if (loading)
    return (
      <span className="flex items-center justify-center h-screen gap-3 text-textColor2">
        <Loader2 className="sm:w-8 sm:h-8 animate-spin" /> 
        <span className="text-2xl sm:text-3xl font-semibold">Product is loading...</span>
      </span>
    );

  if (error)
    return <p className="text-center text-3xl h-screen flex items-center justify-center text-red-500">{error}</p>;

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-[250px] bg-gray-800 h-screen hidden md:block">
        <Sidebar />
      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col bg-[#FAFAFA]">
        {/* Admin Header */}
        <div className="h-[70px] shadow-md flex items-center bg-white">
          <AdminHeader />
        </div>

        {/* Product Table */}
        <div className="p-4">
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-[#FAFAFA] rounded-lg">
              <thead>
                <tr className="bg-[#23856D] text-white text-sm md:text-base">
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b text-sm md:text-base">
                    <td className="p-3">
                      {product.images?.length > 0 ? (
                        <Image
                          width={64}
                          height={64}
                          src={urlFor(product.images[0]).url()}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-500">No Image</span>
                      )}
                    </td>
                    <td className="p-3 truncate max-w-[150px]">{product.name}</td>
                    <td className="p-3 text-green-600">${product.price}</td>
                    <td className="p-3">{product.stock}</td>
                    <td className="p-3 truncate max-w-[120px]">{product.categories?.join(", ") || "No Category"}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-md text-white ${
                          product.status === "new"
                            ? "bg-blue-500"
                            : product.status === "hot"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete Product"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;




// "use client";
// import { client } from '@/sanity/lib/client';
// import { useEffect, useState } from 'react';
// import Sidebar from '../components/Sidebar';
// import AdminHeader from '../components/AdminHeader'; // Assuming you have an AdminHeader component
// import { urlFor } from '@/sanity/lib/image';
// import Image from 'next/image';
// import { Loader2 } from 'lucide-react';

// interface Product {
//   _id: string;
//   name: string;
//   slug: string;
//   images: string[]; // Array of image URLs
//   intro: string;
//   description: string;
//   price: number;
//   discount: number;
//   stock: number;
//   status: string;
//   variant?: string; // Optional field (if some products don't have variants)
//   categories: string[]; // Array of category titles
// }


// const ProductsPage = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const query = `*[_type == "product"]{
//           _id,
//           name,
//           "slug": slug.current,
//           images,
//           intro,
//           description,
//           price,
//           discount,
//           stock,
//           status,
//           variant,
//           "categories": categories[]->title
//         }`;
//         const data = await client.fetch(query);
//         setProducts(data);
//       } catch (err) {
//         setError('Failed to load products.');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   if (loading) return <span className='flex items-center justify-center h-screen gap-3 text-textColor2 '><Loader2 className='sm:w-8 sm:h-8 animate-spin'/> <span className='text-2xl sm:text-3xl font-semibold'>Product is loading...</span></span> 

//   if (error) return <p className="text-center text-3xl h-screen flex items-center justify-center text-red-500">{error}</p>;

//   return (
//     <div className="flex h-screen flex-col md:flex-row">
//     <div className="w-[250px] bg-gray-800 h-screen hidden md:block">
//       <Sidebar />
//     </div>

//     <div className="flex-1 flex flex-col bg-[#FAFAFA]">
//       <div className="h-[70px] shadow-md  flex items-center bg-white">
//         <AdminHeader />
//       </div>

//       <div className="p-4">
//         <div className="overflow-x-auto rounded-lg shadow-md">
//           <table className="min-w-full bg-[#FAFAFA] rounded-lg">
//             <thead>
//               <tr className="bg-[#23856D] text-white text-sm md:text-base">
//                 <th className="p-3 text-left">Image</th>
//                 <th className="p-3 text-left">Name</th>
//                 <th className="p-3 text-left">Price</th>
//                 <th className="p-3 text-left">Stock</th>
//                 <th className="p-3 text-left">Category</th>
//                 <th className="p-3 text-left">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.map((product) => (
//                 <tr key={product._id} className="border-b text-sm md:text-base">
//                   <td className="p-3">
//                     {product.images?.length > 0 ? (
//                       <Image
//                         width={64}
//                         height={64}
//                         src={urlFor(product.images[0]).url()}
//                         alt={product.name}
//                         className="w-16 h-16 object-cover rounded"
//                       />
//                     ) : (
//                       <span className="text-gray-500">No Image</span>
//                     )}
//                   </td>
//                   <td className="p-3 truncate max-w-[150px]">{product.name}</td>
//                   <td className="p-3 text-green-600">${product.price}</td>
//                   <td className="p-3">{product.stock}</td>
//                   <td className="p-3 truncate max-w-[120px]">{product.categories?.join(", ") || "No Category"}</td>
//                   <td className="p-3">
//                     <span
//                       className={`px-2 py-1 rounded-md text-white ${
//                         product.status === "new"
//                           ? "bg-blue-500"
//                           : product.status === "hot"
//                           ? "bg-red-500"
//                           : "bg-yellow-500"
//                       }`}
//                     >
//                       {product.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   </div>
//   );
// };

// export default ProductsPage;

















// "use client"
// import { client } from '@/sanity/lib/client';
// import { useEffect, useState } from 'react';
// import Sidebar from '../components/Sidebar';

// const ProductsPage = () => {
//   const [products, setProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const query = `*[_type == "product"]{
//           _id,
//           name,
//           "slug": slug.current,
//           images,
//           intro,
//           description,
//           price,
//           discount,
//           stock,
//           status,
//           variant,
//           "categories": categories[]->title
//         }`;
//         const data = await client.fetch(query);
//         setProducts(data);
//       } catch (err) {
//         setError('Failed to load products.');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   if (loading) return <p className="text-center text-blue-500">Loading products...</p>;
//   if (error) return <p className="text-center text-red-500">{error}</p>;

//   return (

//     <div className='flex h-screen'>
//          {/* <Sidebar /> */}
//     <div className="p-">
//       <h2 className="text-2xl font-semibold mb-4 text-center">Products</h2>
//       <div className="overflow-x-auto  p-4 rounded-lg shadow-md">
//         <table className="min-w-full bg-[#FAFAFA] rounded-lg">
//           <thead>
//             <tr className="bg-[#23856D] text-white">
//               <th className="p-3 text-left">Image</th>
//               <th className="p-3 text-left">Name</th>
//               <th className="p-3 text-left">Price</th>
//               <th className="p-3 text-left">Stock</th>
//               <th className="p-3 text-left">Category</th>
//               <th className="p-3 text-left">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((product) => (
//               <tr key={product._id} className="border-b">
//                 <td className="p-3">
//                   {product.images && product.images.length > 0 ? (
//                     <img src={product.images[0].asset.url} alt={product.name} className="w-16 h-16 object-cover rounded" />
//                   ) : (
//                     <span className="text-gray-500">No Image</span>
//                   )}
//                 </td>
//                 <td className="p-3">{product.name}</td>
//                 <td className="p-3 text-green-600">${product.price}</td>
//                 <td className="p-3">{product.stock}</td>
//                 <td className="p-3">{product.categories?.join(', ') || 'No Category'}</td>
//                 <td className="p-3">
//                   <span className={`px-2 py-1 rounded-md text-white ${
//                     product.status === 'new' ? 'bg-blue-500' :
//                     product.status === 'hot' ? 'bg-red-500' :
//                     'bg-yellow-500'
//                   }`}>
//                     {product.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default ProductsPage;
