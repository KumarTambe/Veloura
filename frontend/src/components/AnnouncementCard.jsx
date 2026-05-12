import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnnouncementCard({ announcement, onUpdate, onDelete }) {
  const { user } = useAuth();
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please log in to reply.');
    if (!replyText.trim()) return;

    setIsReplying(true);
    try {
      const res = await fetch(`/api/announcements/${announcement._id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ comment: replyText }),
      });
      if (res.ok) {
        const newReplies = await res.json();
        onUpdate(announcement._id, { ...announcement, replies: newReplies });
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

  return (
    <div className="bg-luxury-obsidian border-2 border-luxury-gold/30 rounded-xl p-6 relative md:col-span-2 shadow-[0_0_15px_rgba(197,160,89,0.1)]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-black bg-luxury-gold px-2 py-0.5 rounded-full font-bold">
              Admin Announcement
            </span>
          </div>
          <h3 className="font-serif text-white text-xl">{announcement.title}</h3>
          <span className="text-[10px] text-white/40">
            {new Date(announcement.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
        {user && user.role === 'admin' && (
          <button
            onClick={() => onDelete(announcement._id)}
            className="text-red-400/50 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
          >
            <X size={14} /> Delete
          </button>
        )}
      </div>
      
      <p className="text-sm text-white/80 leading-relaxed font-sans mb-6">
        {announcement.content}
      </p>

      {/* Interaction Footer */}
      <div className="flex items-center gap-6 border-t border-white/5 pt-4">
        <button 
          onClick={() => setShowReplies(!showReplies)}
          className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors"
        >
          <MessageSquare size={14} />
          <span>Replies ({announcement.replies?.length || 0})</span>
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
              {announcement.replies?.map((reply, idx) => (
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
                <p className="text-[10px] text-white/40 italic text-center mt-4">Log in to reply to this announcement.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
