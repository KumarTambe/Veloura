import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async () => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        navigate(`/admin/product/${data._id}/edit`);
      } else {
        alert('Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (res.ok) {
          fetchProducts();
        } else {
          alert('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-32 px-6 bg-luxury-black text-white text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-32 px-6 lg:px-12 bg-luxury-black text-white">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-serif tracking-wider mb-2">Products</h1>
            <p className="text-white/50 text-sm tracking-wider">Manage your inventory</p>
          </div>
          <button 
            onClick={handleCreateProduct}
            className="flex items-center gap-2 px-6 py-2 bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-black font-semibold text-sm uppercase tracking-widest transition-colors"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>

        <div className="overflow-x-auto border border-white/10">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 border-b border-white/10 uppercase tracking-widest text-[10px] text-white/50">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Price</th>
                <th className="p-4">Category</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-white/50">{product._id.substring(0, 8)}...</td>
                  <td className="p-4 font-serif">{product.name}</td>
                  <td className="p-4">₹{product.price.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-white/70">{product.category}</td>
                  <td className="p-4 text-white/70">{product.brand}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[10px] uppercase tracking-wider ${product.stockQuantity > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {product.stockQuantity > 0 ? `${product.stockQuantity} In Stock` : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-3">
                    <Link to={`/admin/product/${product._id}/edit`} className="text-white/50 hover:text-luxury-gold transition-colors">
                      <Edit2 size={16} />
                    </Link>
                    <button onClick={() => handleDeleteProduct(product._id)} className="text-white/50 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
