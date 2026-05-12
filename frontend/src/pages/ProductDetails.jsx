import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import ReviewCard from '../components/ReviewCard';
import { Star } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { cartItems, addToCart } = useCart();
  const { user } = useAuth();

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);

        // Fetch reviews
        const reviewsRes = await fetch(`/api/reviews/product/${id}`);
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to submit a review');
    
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          product: id,
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Review submitted successfully');
        setComment('');
        setRating(5);
        // Refresh product and reviews
        const updatedProductRes = await fetch(`/api/products/${id}`);
        setProduct(await updatedProductRes.json());
        const updatedReviewsRes = await fetch(`/api/reviews/product/${id}`);
        setReviews(await updatedReviewsRes.json());
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleUpdateReview = (reviewId, updatedReview) => {
    setReviews(reviews.map((r) => (r._id === reviewId ? updatedReview : r)));
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (res.ok) {
        setReviews(reviews.filter((r) => r._id !== reviewId));
        // Refresh product to update average rating
        const updatedProductRes = await fetch(`/api/products/${id}`);
        setProduct(await updatedProductRes.json());
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="text-white/50 text-[10px] uppercase tracking-[0.3em]">Loading...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center flex-col gap-6">
        <div className="text-white/50 text-[10px] uppercase tracking-[0.3em]">Product Not Found</div>
        <Link to="/" className="text-white text-[10px] uppercase tracking-[0.3em] border-b border-white/30 pb-1 hover:border-white transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-luxury-black">
      <div className="container mx-auto px-6 lg:px-12">
        <Link to="/" className="inline-block text-[9px] uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors mb-12">
          ← Back to Collection
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 aspect-[4/5] bg-luxury-charcoal relative overflow-hidden"
          >
            <img 
              src={product.images && product.images.length > 0 ? product.images[0] : ''} 
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
          </motion.div>

          {/* Details Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-1/2 flex flex-col justify-center"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-4">{product.brand} | {product.category}</p>
            <h1 className="text-4xl md:text-5xl font-serif text-white tracking-wide mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={star <= product.rating ? 'fill-luxury-gold text-luxury-gold' : 'text-white/20'}
                  />
                ))}
              </div>
              <span className="text-[10px] text-white/40 tracking-widest">{product.rating} ({product.numReviews} Reviews)</span>
            </div>

            <p className="text-2xl font-sans text-white/80 tracking-wider mb-10">₹{product.price?.toLocaleString()}</p>
            
            <div className="border-t border-white/10 pt-8 mb-12">
              <p className="text-sm text-white/60 leading-relaxed font-serif italic">
                {product.description}
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-white/50 border-b border-white/10 pb-4">
                <span>Availability</span>
                <span className={product.stockQuantity > 0 ? 'text-luxury-gold' : 'text-red-500'}>
                  {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {(() => {
                const cartItem = cartItems.find(item => item._id === product._id);
                const maxReached = cartItem && cartItem.quantity >= product.stockQuantity;
                return (
                  <button 
                    onClick={() => addToCart(product)}
                    disabled={product.stockQuantity === 0 || maxReached}
                    className={`w-full py-5 text-[10px] uppercase tracking-[0.3em] font-semibold transition-all duration-300 ${
                      product.stockQuantity > 0 && !maxReached
                        ? 'bg-white text-black hover:bg-luxury-gold hover:text-white' 
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    {maxReached ? 'Max Stock in Cart' : 'Add to Cart'}
                  </button>
                );
              })()}
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="mt-32 border-t border-white/10 pt-16">
          <h2 className="text-2xl font-serif text-white tracking-[0.2em] mb-12">REVIEWS & DISCUSSIONS</h2>
          
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Review List */}
            <div className="w-full lg:w-2/3 space-y-6">
              {reviews.length === 0 ? (
                <p className="text-white/40 italic font-serif">No reviews yet. Be the first to share your experience.</p>
              ) : (
                reviews.map(review => (
                  <ReviewCard 
                    key={review._id} 
                    review={review} 
                    onUpdate={handleUpdateReview} 
                    onDelete={handleDeleteReview} 
                  />
                ))
              )}
            </div>

            {/* Review Form */}
            <div className="w-full lg:w-1/3">
              <div className="bg-luxury-obsidian border border-white/10 rounded-xl p-8 sticky top-32">
                <h3 className="text-sm uppercase tracking-widest text-white mb-6">Write a Review</h3>
                {user ? (
                  user.role === 'admin' ? (
                    <div className="text-center">
                      <p className="text-xs text-white/40 mb-6">Admins cannot review products.</p>
                    </div>
                  ) : (
                    <form onSubmit={submitReview} className="space-y-6">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-3">Rating</label>
                        <select 
                          value={rating} 
                          onChange={(e) => setRating(Number(e.target.value))}
                          className="w-full bg-luxury-charcoal border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-luxury-gold"
                        >
                          <option value="5">5 - Masterpiece</option>
                          <option value="4">4 - Excellent</option>
                          <option value="3">3 - Good</option>
                          <option value="2">2 - Fair</option>
                          <option value="1">1 - Poor</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-3">Your Experience</label>
                        <textarea 
                          required
                          rows="4"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your thoughts on this timepiece..."
                          className="w-full bg-luxury-charcoal border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-luxury-gold resize-none"
                        ></textarea>
                      </div>
                      <button 
                        type="submit"
                        disabled={submittingReview}
                        className="w-full py-4 bg-luxury-gold text-black text-[10px] uppercase tracking-[0.3em] font-semibold hover:bg-white transition-colors disabled:opacity-50"
                      >
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  )
                ) : (
                  <div className="text-center">
                    <p className="text-xs text-white/40 mb-6">Please log in to share your experience.</p>
                    <Link to="/login" className="inline-block py-3 px-6 bg-white text-black text-[10px] uppercase tracking-widest font-semibold hover:bg-luxury-gold hover:text-white transition-colors">
                      Log In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
