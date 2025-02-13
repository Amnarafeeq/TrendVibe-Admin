import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import { Product } from '../products/page';
import { client } from '@/sanity/lib/client';
import toast from 'react-hot-toast';
import slugify from 'slugify';

interface ProductModalProps {
  product?: Product;
  onClose: () => void;
  onSubmit: (data: Partial<Product>) => Promise<void>;
}

export default function ProductModal({ product, onClose, onSubmit }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    status: product?.status || 'new',
    description: product?.description || '',
    categories: product?.categories || [],
    images: product?.images || []
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      const imageAssets = [];
      for (const file of Array.from(files)) {
        const imageAsset = await client.assets.upload('image', file);
        imageAssets.push(imageAsset._id);
      }
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageAssets]
      }));
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading images');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate slug from name
    const slug = slugify(formData.name, { lower: true });
    
    try {
      const productData = {
        _type: 'product',
        name: formData.name,
        slug: {
          _type: 'slug',
          current: slug
        },
        price: Number(formData.price),
        stock: Number(formData.stock),
        status: formData.status,
        description: formData.description,
        images: formData.images.map(image => ({
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: typeof image === 'string' ? image : image._id
          }
        })),
        categories: formData.categories
      };

      await onSubmit(productData);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Error saving product');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={onClose} className="p-2">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#23856D]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#23856D]"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#23856D]"
                required
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#23856D]"
            >
              <option value="new">New</option>
              <option value="hot">Hot</option>
              <option value="sale">Sale</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Images</label>
            <div className="border-2 border-dashed rounded-lg p-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploading}
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">
                  {uploading ? 'Uploading...' : 'Click to upload images'}
                </span>
              </label>
            </div>
            {formData.images.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={typeof image === 'string' 
                        ? `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/production/${image}`
                        : image.url}
                      alt={`Product image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index)
                      }))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#23856D]"
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 bg-[#23856D] text-white rounded hover:bg-[#23856D]/90 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : product ? 'Update' : 'Add'} Product
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 