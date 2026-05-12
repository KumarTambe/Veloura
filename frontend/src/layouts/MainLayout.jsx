import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';
import SmartSearch from '../components/SmartSearch';
import CartDrawer from '../components/CartDrawer';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {
  const { user } = useAuth();
  const isAdmin = user && user.role === 'admin';

  return (
    <>
      <Navigation />
      {!isAdmin && <SmartSearch />}
      {!isAdmin && <CartDrawer />}
      
      <main className="min-h-screen">
        <Outlet />
      </main>

      {!isAdmin && <Footer />}
    </>
  );
}
