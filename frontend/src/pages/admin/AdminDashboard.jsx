import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, Package, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    products: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = { Authorization: `Bearer ${user.token}` };
        
        // Fetch users
        const usersRes = await fetch('/api/users', { headers });
        const usersData = await usersRes.json();
        
        // Fetch orders
        const ordersRes = await fetch('/api/orders', { headers });
        const ordersData = await ordersRes.json();
        
        // Fetch products
        const productsRes = await fetch('/api/products');
        const productsData = await productsRes.json();
        
        // Calculate total revenue from paid orders
        const totalRevenue = ordersData.reduce((acc, order) => {
          return order.isPaid ? acc + order.totalPrice : acc;
        }, 0);

        // Process real chart data from orders
        const groupedData = {};
        ordersData.forEach(order => {
          if (order.isPaid) {
            const dateObj = new Date(order.createdAt);
            const dateKey = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
            if (!groupedData[dateKey]) {
              groupedData[dateKey] = 0;
            }
            groupedData[dateKey] += order.totalPrice;
          }
        });

        const computedChartData = Object.keys(groupedData)
          .sort()
          .map(dateKey => {
            const d = new Date(dateKey);
            return {
              name: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              revenue: groupedData[dateKey]
            };
          });

        setChartData(computedChartData.length > 0 ? computedChartData : [{ name: 'No Data', revenue: 0 }]);

        setStats({
          users: usersData.length || 0,
          orders: ordersData.length || 0,
          products: productsData.products ? productsData.products.length : 0,
          revenue: totalRevenue,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.token]);

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-luxury-gold' },
    { title: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'text-white' },
    { title: 'Total Products', value: stats.products, icon: Package, color: 'text-white' },
    { title: 'Total Users', value: stats.users, icon: Users, color: 'text-white' },
  ];

  if (loading) {
    return <div className="min-h-screen pt-32 px-6 lg:px-12 bg-luxury-black text-white flex justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen pt-32 px-6 lg:px-12 bg-luxury-black text-white">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-serif tracking-wider mb-2">Admin Dashboard</h1>
            <p className="text-white/50 text-sm tracking-wider">Overview of your platform's performance</p>
          </div>
          <div className="flex gap-4">
            <Link to="/admin/products" className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-sm uppercase tracking-widest transition-colors">
              Manage Products
            </Link>
            <Link to="/admin/orders" className="px-6 py-2 bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-black font-semibold text-sm uppercase tracking-widest transition-colors">
              Manage Orders
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-white/5 border border-white/10"
            >
              <div className="flex justify-between items-start mb-4">
                <p className="text-white/50 text-xs uppercase tracking-widest">{stat.title}</p>
                <stat.icon size={20} className={stat.color} strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-serif">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-white/5 border border-white/10 mb-12"
        >
          <h3 className="text-sm uppercase tracking-widest text-white/50 mb-8">Revenue Overview</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff50" 
                  tick={{ fill: '#ffffff50', fontSize: 12 }} 
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#ffffff50" 
                  tick={{ fill: '#ffffff50', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `₹${value}`}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #ffffff10' }}
                  itemStyle={{ color: '#C5A059' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#C5A059" 
                  strokeWidth={2}
                  dot={{ fill: '#0A0A0A', stroke: '#C5A059', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#C5A059' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
