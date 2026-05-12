import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ThumbsUp, MessageSquare, Star, BadgeCheck, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReviewCard({ review, onUpdate, onDelete }) {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Check if current user liked it
  const isLiked = user && review.likes.includes(user._id);

  const handleLike = async () => {
    if (!user) return alert('Please log in to helpful vote.');
    setIsLiking(true);
    try {
      const res = await fetch(`/api/reviews/${review._id}/like`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (res.ok) {
        const newLikes = await res.json();
        onUpdate(review._id, { ...review, likes: newLikes });
      }
    } catch (error) {
      console.error('Like error:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please log in to reply.');
    if (!replyText.trim()) return;

    setIsReplying(true);
    try {
      const res = await fetch(`/api/reviews/${review._id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ comment: replyText }),
      });
      if (res.ok) {
        const newReplies = await res.json();
        onUpdate(review._id, { ...review, replies: newReplies });
        setReplyText('');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to add reply');
      }
    } catch (error) {
      console.error('Reply error:', error);
    } finally {
      setIsReplying(false);
    }
  };

  const isOwnerOrAdmin = user && (review.user._id === user._id || user.role === 'admin');

  return (
    <div className="bg-luxury-obsidian border border-white/10 rounded-xl p-6 relative">
      {/* Header: User & Rating */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-serif text-white">{review.user.username}</h4>
            {review.isVerifiedPurchase && (
              <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-luxury-gold bg-luxury-gold/10 px-2 py-0.5 rounded-full">
                <BadgeCheck size={12} /> Verified
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={12}
                className={star <= review.rating ? 'fill-luxury-gold text-luxury-gold' : 'text-white/20'}
              />
            ))}
            <span className="text-[10px] text-white/40 ml-2">
              {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Product Context (if shown in Lounge, product is populated) */}
        {review.product && typeof review.product === 'object' && (
          <div className="text-right flex items-center gap-3">
            <div className="hidden sm:block">
              <p className="text-[10px] uppercase tracking-widest text-white/50">{review.product.brand}</p>
              <p className="text-xs text-white/80 font-serif">{review.product.name}</p>
            </div>
            {review.product.images && (
              <div className="w-10 h-10 rounded bg-luxury-charcoal overflow-hidden">
                <img src={review.product.images[0]} alt={review.product.name} className="w-full h-full object-cover opacity-80" />
              </div>
            )}
          </div>
        )}

        {/* Actions Menu */}
        {isOwnerOrAdmin && (
          <div className="absolute top-4 right-4">
            <button 
              onClick={() => setShowActions(!showActions)}
              className="p-1 text-white/40 hover:text-white rounded-full hover:bg-white/10 transition"
            >
              <MoreVertical size={16} />
            </button>
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-6 mt-2 w-32 bg-luxury-charcoal border border-white/10 rounded-md shadow-xl z-10"
                >
                  <button 
                    onClick={() => { setShowActions(false); onDelete(review._id); }}
                    className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-white/5 flex items-center gap-2"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Review Content */}
      <p className="text-sm text-white/80 leading-relaxed mb-6 font-sans">
        {review.comment}
      </p>

      {/* Interaction Footer */}
      <div className="flex items-center gap-6 border-t border-white/5 pt-4">
        <button 
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 text-xs transition-colors ${isLiked ? 'text-luxury-gold' : 'text-white/50 hover:text-white'}`}
        >
          <ThumbsUp size={14} className={isLiked ? 'fill-luxury-gold' : ''} />
          <span>Helpful ({review.likes?.length || 0})</span>
        </button>
        <button 
          onClick={() => setShowReplies(!showReplies)}
          className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors"
        >
          <MessageSquare size={14} />
          <span>Replies ({review.replies?.length || 0})</span>
        </button>
      </div>

      {/* Replies Section */}
      <AnimatePresence>
        {showReplies && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
              {review.replies?.map((reply, idx) => (
                <div key={idx} className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-serif text-white">{reply.user?.username || 'User'}</span>
                    <span className="text-[9px] text-white/30">
                      {new Date(reply.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-white/70">{reply.comment}</p>
                </div>
              ))}

              {/* Reply Form */}
              {user ? (
                <form onSubmit={handleReplySubmit} className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Add a reply..."
                    className="flex-1 bg-luxury-charcoal border border-white/10 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                  />
                  <button 
                    type="submit"
                    disabled={isReplying || !replyText.trim()}
                    className="px-4 py-2 bg-luxury-gold text-black text-[10px] uppercase tracking-widest rounded-md font-semibold hover:bg-white transition-colors disabled:opacity-50"
                  >
                    Reply
                  </button>
                </form>
              ) : (
                <p className="text-[10px] text-white/40 italic text-center mt-4">Log in to reply to this review.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
