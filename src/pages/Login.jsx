import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
    navigate('/');
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-luxury-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md p-8"
      >
        <div className="text-center mb-12">
          <h1 className="text-2xl font-serif text-white tracking-[0.3em] mb-4">SIGN IN</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Access your curated collection</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[9px] uppercase tracking-[0.3em] text-white/50 mb-3">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 pb-2 text-white text-sm outline-none focus:border-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-[0.3em] text-white/50 mb-3">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 pb-2 text-white text-sm outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full py-4 bg-white text-black text-[10px] uppercase tracking-[0.3em] font-semibold hover:bg-luxury-gold hover:text-white transition-all duration-300"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="mt-12 text-center border-t border-white/10 pt-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">Don't have an account?</p>
          <Link to="/register" className="text-xs text-white border-b border-white/30 pb-1 hover:border-white transition-colors">
            Create Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
