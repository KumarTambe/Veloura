import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function OrderConfirmation() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setOrder(data);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.token) {
      fetchOrder();
    }
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="text-white/50 text-[10px] uppercase tracking-[0.3em]">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center flex-col gap-6">
        <div className="text-white/50 text-[10px] uppercase tracking-[0.3em]">Order Not Found</div>
        <Link to="/" className="text-white text-[10px] uppercase tracking-[0.3em] border-b border-white/30 pb-1 hover:border-white transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-luxury-black">
      <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Success Header */}
          <div className="text-center mb-16">
            <div className="w-16 h-16 rounded-full border border-luxury-gold/50 flex items-center justify-center mx-auto mb-8">
              <span className="text-luxury-gold text-2xl">✓</span>
            </div>
            <h1 className="text-2xl font-serif tracking-[0.3em] text-white mb-4">ORDER CONFIRMED</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
              Thank you for your purchase
            </p>
          </div>

          {/* Order Details */}
          <div className="space-y-8 border-t border-white/10 pt-8">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Order ID</span>
              <span className="text-xs font-mono text-white/80">{order._id}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Status</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-luxury-gold">{order.status}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Date</span>
              <span className="text-xs text-white/80">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>

            {/* Items */}
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-6">Items</h3>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-serif text-white">{item.name}</p>
                      <p className="text-[8px] uppercase tracking-widest text-white/40">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-mono text-white/80">₹{item.price?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-4">Shipping To</h3>
              <p className="text-sm text-white/80">
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                {order.shippingAddress.country}
              </p>
            </div>

            {/* Total */}
            <div className="border-t border-white/10 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-white">Total</span>
                <span className="text-lg font-mono tracking-wider text-white">₹{order.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="mt-16 text-center">
            <Link 
              to="/" 
              className="inline-block px-12 py-4 bg-white text-black text-[10px] uppercase tracking-[0.3em] font-semibold hover:bg-luxury-gold hover:text-white transition-all duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
