import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Package, CheckCircle } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeliver = async (id) => {
    try {
      const res = await fetch(`/api/orders/${id}/deliver`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (res.ok) {
        fetchOrders();
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-32 px-6 bg-luxury-black text-white text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-32 px-6 lg:px-12 bg-luxury-black text-white pb-20">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="text-3xl font-serif tracking-wider mb-2">Orders</h1>
          <p className="text-white/50 text-sm tracking-wider">Manage customer orders</p>
        </div>

        <div className="overflow-x-auto border border-white/10">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 border-b border-white/10 uppercase tracking-widest text-[10px] text-white/50">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Paid</th>
                <th className="p-4">Delivered</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-white/50">{order._id.substring(0, 8)}...</td>
                  <td className="p-4">{order.user ? order.user.username : 'Deleted User'}</td>
                  <td className="p-4 text-white/70">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-serif">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                  <td className="p-4">
                    {order.isPaid ? (
                      <span className="text-green-500">Yes</span>
                    ) : (
                      <span className="text-red-500">No</span>
                    )}
                  </td>
                  <td className="p-4">
                    {order.isDelivered ? (
                      <span className="px-2 py-1 text-[10px] uppercase tracking-wider bg-green-500/10 text-green-500">
                        Delivered
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-[10px] uppercase tracking-wider bg-yellow-500/10 text-yellow-500">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="p-4 flex justify-end gap-3">
                    {!order.isDelivered && (
                      <button 
                        onClick={() => handleDeliver(order._id)}
                        className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-luxury-gold hover:text-white transition-colors"
                      >
                        <CheckCircle size={14} />
                        Mark Delivered
                      </button>
                    )}
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
