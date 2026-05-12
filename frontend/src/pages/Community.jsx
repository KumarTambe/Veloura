import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReviewCard from '../components/ReviewCard';
import AnnouncementCard from '../components/AnnouncementCard';
import { MessageCircle, TrendingUp, Star, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Community() {
  const [reviews, setReviews] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('latest');
  const { user } = useAuth();

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  // Announcement state
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch products for dropdown when modal opens
  useEffect(() => {
    if (showModal && products.length === 0) {
      fetch('/api/products')
        .then((res) => res.json())
        .then((data) => setProducts(data.products || data))
        .catch((err) => console.error('Failed to fetch products:', err));
    }
  }, [showModal, products.length]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?sort=${sortBy}`);
      const data = await res.json();
      setReviews(data);

      const annRes = await fetch('/api/announcements');
      if (annRes.ok) {
        const annData = await annRes.json();
        setAnnouncements(annData);
      }
    } catch (error) {
      console.error('Failed to fetch community discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [sortBy]);

  const handleUpdateReview = (id, updatedReview) => {
    setReviews(reviews.map((r) => (r._id === id ? updatedReview : r)));
  };

  const handleDeleteReview = async (id) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (res.ok) {
        setReviews(reviews.filter((r) => r._id !== id));
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleUpdateAnnouncement = (id, updatedAnnouncement) => {
    setAnnouncements(announcements.map((a) => (a._id === id ? updatedAnnouncement : a)));
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      const res = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (res.ok) {
        setAnnouncements(announcements.filter((a) => a._id !== id));
      }
    } catch (error) {
      console.error('Delete announcement error:', error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to create a post');
    if (!selectedProduct) return alert('Please select a product/brand');

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          product: selectedProduct,
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Post created successfully');
        setShowModal(false);
        setComment('');
        setRating(5);
        setSelectedProduct('');
        fetchReviews(); // Refresh the lounge
      } else {
        alert(data.message || 'Failed to create post');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!user || user.role !== 'admin') return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          title: announcementTitle,
          content: announcementContent,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Announcement created successfully');
        setShowModal(false);
        setAnnouncementTitle('');
        setAnnouncementContent('');
        fetchReviews(); // Refresh everything
      } else {
        alert(data.message || 'Failed to create announcement');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-luxury-black">
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-4xl font-serif text-white tracking-[0.3em] mb-6">
              THE LOUNGE
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 max-w-xl mx-auto leading-relaxed mb-8">
              Join the conversation. Discover authentic experiences from Veloura collectors and horology enthusiasts worldwide.
            </p>
            {user ? (
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-8 py-3 bg-luxury-gold text-black text-[10px] uppercase tracking-[0.3em] font-semibold hover:bg-white transition-colors"
              >
                <Plus size={14} /> {user.role === 'admin' ? 'Create Announcement' : 'Create Post'}
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-block px-8 py-3 border border-white/20 text-white text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-colors"
              >
                Log In to Post
              </Link>
            )}
          </motion.div>
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-b border-white/10 pb-6 mb-12">
          <div className="flex gap-6 mb-6 sm:mb-0">
            <button
              onClick={() => setSortBy('latest')}
              className={`flex items-center gap-2 text-[10px] uppercase tracking-widest pb-2 border-b-2 transition-colors ${
                sortBy === 'latest' ? 'text-luxury-gold border-luxury-gold' : 'text-white/40 border-transparent hover:text-white'
              }`}
            >
              <MessageCircle size={14} /> Latest
            </button>
            <button
              onClick={() => setSortBy('helpful')}
              className={`flex items-center gap-2 text-[10px] uppercase tracking-widest pb-2 border-b-2 transition-colors ${
                sortBy === 'helpful' ? 'text-luxury-gold border-luxury-gold' : 'text-white/40 border-transparent hover:text-white'
              }`}
            >
              <TrendingUp size={14} /> Most Helpful
            </button>
            <button
              onClick={() => setSortBy('highest')}
              className={`flex items-center gap-2 text-[10px] uppercase tracking-widest pb-2 border-b-2 transition-colors ${
                sortBy === 'highest' ? 'text-luxury-gold border-luxury-gold' : 'text-white/40 border-transparent hover:text-white'
              }`}
            >
              <Star size={14} /> Top Rated
            </button>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-white/30">
            {reviews.length} Discussions
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-t-2 border-luxury-gold border-solid rounded-full animate-spin"></div>
          </div>
        ) : reviews.length === 0 && announcements.length === 0 ? (
          <div className="text-center py-20 text-white/30 font-serif italic">
            No discussions found. Be the first to share your experience.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Announcements */}
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="md:col-span-2"
              >
                <AnnouncementCard 
                  announcement={announcement}
                  onUpdate={handleUpdateAnnouncement}
                  onDelete={handleDeleteAnnouncement}
                />
              </motion.div>
            ))}

            {/* Standard Reviews */}
            {reviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ReviewCard 
                  review={review} 
                  onUpdate={handleUpdateReview} 
                  onDelete={handleDeleteReview} 
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-luxury-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-luxury-obsidian border border-white/10 rounded-2xl p-8 w-full max-w-lg relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-serif text-white tracking-widest mb-8">
                {user?.role === 'admin' ? 'CREATE ANNOUNCEMENT' : 'CREATE A POST'}
              </h2>

              {user?.role === 'admin' ? (
                <form onSubmit={handleCreateAnnouncement} className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-3">
                      Title
                    </label>
                    <input
                      required
                      type="text"
                      value={announcementTitle}
                      onChange={(e) => setAnnouncementTitle(e.target.value)}
                      placeholder="Announcement title..."
                      className="w-full bg-luxury-charcoal border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-3">
                      Message
                    </label>
                    <textarea
                      required
                      rows="6"
                      value={announcementContent}
                      onChange={(e) => setAnnouncementContent(e.target.value)}
                      placeholder="Write your announcement..."
                      className="w-full bg-luxury-charcoal border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-luxury-gold resize-none"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-luxury-gold text-black text-[10px] uppercase tracking-[0.3em] font-semibold hover:bg-white transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Posting...' : 'Post Announcement'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCreatePost} className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-3">
                      Select Timepiece / Brand
                    </label>
                    <select
                      required
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full bg-luxury-charcoal border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-luxury-gold"
                    >
                      <option value="" disabled>Choose a product...</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.brand} - {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

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
                    <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-3">
                      Your Experience
                    </label>
                    <textarea
                      required
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="w-full bg-luxury-charcoal border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-luxury-gold resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-luxury-gold text-black text-[10px] uppercase tracking-[0.3em] font-semibold hover:bg-white transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Posting...' : 'Post to Lounge'}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
