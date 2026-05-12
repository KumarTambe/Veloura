import Hero from '../components/Hero';
import ProductShowcase from '../components/ProductShowcase';
import Collection from '../components/Collection';

export default function Home() {
  return (
    <div className="relative">
      <Hero />
      <ProductShowcase />
      <Collection />
    </div>
  );
}
