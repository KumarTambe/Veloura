import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';
import SmartSearch from '../components/SmartSearch';
import CartDrawer from '../components/CartDrawer';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <>
      <Navigation />
      <SmartSearch />
      <CartDrawer />
      
      <main className="min-h-screen">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
