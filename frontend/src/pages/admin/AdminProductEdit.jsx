import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [stockQuantity, setStockQuantity] = useState(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (res.ok) {
          setName(data.name);
          setPrice(data.price);
          setImages(data.images ? data.images.join(', ') : '');
          setBrand(data.brand);
          setCategory(data.category);
          setStockQuantity(data.stockQuantity);
          setDescription(data.description);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name,
          price,
          images: images.split(',').map((img) => img.trim()),
          brand,
          category,
          stockQuantity,
          description,
        }),
      });

      if (res.ok) {
        navigate('/admin/products');
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-32 px-6 bg-luxury-black text-white text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-32 px-6 lg:px-12 bg-luxury-black text-white pb-20">
      <div className="container mx-auto max-w-2xl">
        <Link to="/admin/products" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 text-sm uppercase tracking-widest">
          <ArrowLeft size={16} />
          Back to Products
        </Link>
        
        <h1 className="text-3xl font-serif tracking-wider mb-8">Edit Product</h1>

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/50">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/50">Price (₹)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/50">Stock Quantity</label>
              <input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/50">Images (Comma separated URLs)</label>
            <input
              type="text"
              value={images}
              onChange={(e) => setImages(e.target.value)}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/50">Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/50">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/50">Description</label>
            <textarea
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-luxury-gold text-luxury-black font-semibold py-4 uppercase tracking-widest hover:bg-luxury-gold/90 transition-colors"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}
