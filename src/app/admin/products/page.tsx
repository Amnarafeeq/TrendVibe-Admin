"use client";
import { client } from '@/sanity/lib/client';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader'; // Assuming you have an AdminHeader component
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  slug: string;
  images: string[]; // Array of image URLs
  intro: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  status: string;
  variant?: string; // Optional field (if some products don't have variants)
  categories: string[]; // Array of category titles
}


const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center text-3xl text-textColor2 flex items-center justify-center h-screen">Loading products...</p>;
  if (error) return <p className="text-center text-3xl h-screen flex items-center justify-center text-red-500">{error}</p>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-[250px] bg-gray-800 h-screen">
        <Sidebar />
      </div>

      {/* Main Section (Header + Content) */}
      <div className="flex-1 flex flex-col bg-[#FAFAFA]">
        {/* Admin Header */}
        <div className="h-[70px]">
          <AdminHeader />
        </div>

        {/* <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">Products</h2>
          <div className="overflow-x-auto p-4 rounded-lg shadow-md">
            <table className="min-w-full bg-[#FAFAFA] rounded-lg">
              <thead>
                <tr className="bg-[#23856D] text-white">
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b">
                    <td className="p-3">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={urlFor(product.images[0]).url()}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-500">No Image</span>
                      )}
                    </td>
                    <td className="p-3 text-sm sm:text-base">{product.name}</td>
                    <td className="p-3 text-green-600">${product.price}</td>
                    <td className="p-3">{product.stock}</td>
                    <td className="p-3">{product.categories?.join(', ') || 'No Category'}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-md text-white ${
                          product.status === 'new'
                            ? 'bg-blue-500'
                            : product.status === 'hot'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}
        <div className="p-6">
  {/* <h2 className="text-2xl font-semibold mb-4 text-center">Products</h2> */}
  <div className="overflow-x-auto p-4 rounded-lg shadow-md">
    <table className="min-w-full bg-[#FAFAFA] rounded-lg">
      <thead>
        <tr className="bg-[#23856D] text-white">
          <th className="p-3 text-left">Image</th>
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-left">Price</th>
          <th className="p-3 text-left">Stock</th>
          <th className="p-3 text-left">Category</th>
          <th className="p-3 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product._id} className="border-b">
            <td className="p-3">
              {product.images && product.images.length > 0 ? (
                <Image
                  width={20}
                  height={20}
                  src={urlFor(product.images[0]).url()}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
            </td>
            <td className="p-3 text-sm sm:text-base overflow-hidden text-ellipsis whitespace-nowrap">
              {product.name}
            </td>
            <td className="p-3 text-green-600">${product.price}</td>
            <td className="p-3">{product.stock}</td>
            <td className="p-3">{product.categories?.join(', ') || 'No Category'}</td>
            <td className="p-3">
              <span
                className={`px-2 py-1 rounded-md text-white ${
                  product.status === 'new'
                    ? 'bg-blue-500'
                    : product.status === 'hot'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }`}
              >
                {product.status}
              </span>
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
