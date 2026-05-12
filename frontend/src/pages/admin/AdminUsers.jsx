import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user.token]);

  if (loading) {
    return <div className="min-h-screen pt-32 px-6 bg-luxury-black text-white text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-32 px-6 lg:px-12 bg-luxury-black text-white pb-20">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12">
          <h1 className="text-3xl font-serif tracking-wider mb-2">Users</h1>
          <p className="text-white/50 text-sm tracking-wider">Manage platform users</p>
        </div>

        <div className="overflow-x-auto border border-white/10">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 border-b border-white/10 uppercase tracking-widest text-[10px] text-white/50">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-white/50">{u._id.substring(0, 8)}...</td>
                  <td className="p-4 font-serif">{u.username}</td>
                  <td className="p-4 text-white/70">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[10px] uppercase tracking-wider ${u.role === 'admin' ? 'bg-luxury-gold/10 text-luxury-gold' : 'bg-white/5 text-white/50'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-white/50">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
