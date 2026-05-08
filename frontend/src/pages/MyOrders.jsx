import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-luxury-black flex flex-col items-center justify-center gap-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">Please log in to view your orders</p>
        <Link to="/login" className="text-white text-[10px] uppercase tracking-[0.3em] border-b border-white/30 pb-1 hover:border-white transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="text-white/50 text-[10px] uppercase tracking-[0.3em]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-luxury-black">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mb-16">
            <h1 className="text-2xl font-serif tracking-[0.3em] text-white mb-4">MY ORDERS</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Your purchase history</p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20 border border-white/5">
              <p className="text-sm text-white/50 mb-6 font-serif italic">No orders yet.</p>
              <Link to="/" className="text-[10px] uppercase tracking-[0.3em] text-white border-b border-white/30 pb-1 hover:border-white transition-colors">
                Browse Collection
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/order/${order._id}`} className="block">
                    <div className="border border-white/10 p-6 hover:border-white/20 transition-colors group">
                      {/* Order Header */}
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">Order ID</p>
                          <p className="text-xs font-mono text-white/70">{order._id}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block text-[9px] uppercase tracking-[0.2em] px-3 py-1 border ${
                            order.status === 'Delivered' ? 'border-green-500/30 text-green-400' :
                            order.status === 'Processing' ? 'border-luxury-gold/30 text-luxury-gold' :
                            order.status === 'Shipped' ? 'border-blue-400/30 text-blue-400' :
                            'border-white/20 text-white/50'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">Items</p>
                          <div className="space-y-1">
                            {order.orderItems.map((item, i) => (
                              <p key={i} className="text-sm font-serif text-white/80">
                                {item.name} <span className="text-white/30 text-[10px]">× {item.quantity}</span>
                              </p>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">Total</p>
                          <p className="text-lg font-mono text-white">₹{order.totalPrice?.toLocaleString()}</p>
                          <p className="text-[9px] text-white/30 mt-2">
                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      {/* Hover hint */}
                      <div className="mt-4 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 text-right">View Details →</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
