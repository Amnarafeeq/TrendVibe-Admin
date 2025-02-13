"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { Loader2, Plus, Search, Trash2, Edit2, Filter } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import toast from 'react-hot-toast';

// First, let's define the Product type
interface Product {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  description: string;
  price: number;
  stock: number;
  status: 'new' | 'hot' | 'sale';
  categories: Array<{ title: string }>;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

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
        description,
        price,
        stock,
        status,
        categories[]->{ title }
      }`;
      const data = await client.fetch(query);
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id || !confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await client.delete(id);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
      console.error(error);
    }
  };

  const filteredProducts = products.filter(product => {
    if (!product || !product.name) return false;
    
    const matchesSearch = searchTerm 
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
      
    const matchesFilter = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <span className='flex items-center justify-center h-screen gap-3 text-textColor2 '><Loader2 className='sm:w-8 sm:h-8 animate-spin'/> <span className='text-2xl sm:text-3xl font-semibold'>Products are loading...</span></span> 
  if (error) return <p className="text-center text-3xl h-screen flex items-center justify-center text-red-500">{error}</p>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <AdminHeader />
        
        <main className="p-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#23856D]"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#23856D]"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="hot">Hot</option>
              <option value="sale">Sale</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative h-48">
                  {product.images?.[0] && (
                    <img
                      src={urlFor(product.images[0]).url()}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  )}
                  <div className="absolute top-2 right-2 space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(product._id);
                      }}
                      className="p-2 bg-white rounded-full shadow-sm hover:shadow-md"
                    >
                      <Edit2 size={16} className="text-[#23856D]" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(product._id);
                      }}
                      className="p-2 bg-white rounded-full shadow-sm hover:shadow-md"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#23856D] font-bold">${product.price}</span>
                    <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.status === 'new' ? 'bg-blue-100 text-blue-600' :
                      product.status === 'hot' ? 'bg-red-100 text-red-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {product.status}
                    </span>
                    {product.categories?.map((cat: any) => (
                      <span key={cat.title} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                        {cat.title}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
