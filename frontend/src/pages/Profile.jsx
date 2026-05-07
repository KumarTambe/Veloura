import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !user.token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/users/profile', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setForm((prev) => ({
            ...prev,
            username: data.username || '',
            email: data.email || '',
            street: data.address?.street || '',
            city: data.address?.city || '',
            state: data.address?.state || '',
            zipCode: data.address?.zipCode || '',
            country: data.address?.country || '',
          }));
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (form.password && form.password !== form.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        username: form.username,
        email: form.email,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country,
        },
      };

      if (form.password) {
        updateData.password = form.password;
      }

      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (res.ok) {
        // Update localStorage with new user info
        localStorage.setItem('userInfo', JSON.stringify(data));
        setMessage('Profile updated successfully');
        setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      } else {
        setMessage(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      setMessage('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-luxury-black flex flex-col items-center justify-center gap-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">Please log in to view your profile</p>
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

  const inputClass = "w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white outline-none focus:border-white transition-colors";

  return (
    <div className="min-h-screen pt-32 pb-20 bg-luxury-black">
      <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mb-16">
            <h1 className="text-2xl font-serif tracking-[0.3em] text-white mb-4">MY PROFILE</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Manage your account</p>
          </div>

          {message && (
            <div className={`mb-8 p-4 border text-[10px] uppercase tracking-[0.2em] ${
              message.includes('success') ? 'border-green-500/30 text-green-400' : 'border-red-500/30 text-red-400'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Account Info */}
            <div>
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-8 pb-4 border-b border-white/10">Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.3em] text-white/40 mb-3">Full Name</label>
                  <input type="text" name="username" value={form.username} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.3em] text-white/40 mb-3">Email Address</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-8 pb-4 border-b border-white/10">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-[9px] uppercase tracking-[0.3em] text-white/40 mb-3">Street Address</label>
                  <input type="text" name="street" value={form.street} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.3em] text-white/40 mb-3">City</label>
                  <input type="text" name="city" value={form.city} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.3em] text-white/40 mb-3">State</label>
                  <input type="text" name="state" value={form.state} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.3em] text-white/40 mb-3">Zip Code</label>
                  <input type="text" name="zipCode" value={form.zipCode} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.3em] text-white/40 mb-3">Country</label>
                  <input type="text" name="country" value={form.country} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-8 pb-4 border-b border-white/10">Change Password <span className="text-white/20">(optional)</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.3em] text-white/40 mb-3">New Password</label>
                  <input type="password" name="password" value={form.password} onChange={handleChange} className={inputClass} placeholder="Leave blank to keep current" />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.3em] text-white/40 mb-3">Confirm Password</label>
                  <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className={`px-12 py-4 text-[10px] uppercase tracking-[0.3em] font-semibold transition-all duration-300 ${
                  saving
                    ? 'bg-white/30 text-white/50 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-luxury-gold hover:text-white'
                }`}
              >
                {saving ? 'Saving...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
