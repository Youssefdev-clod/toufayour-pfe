import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';
// import './Products.css'; // si vous utilisez un fichier CSS séparé

export default function Products({ lang }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getProducts();
        if (!mounted) return;
        setProducts(data.products || []);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="text-center mt-10">Chargement...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">Erreur : {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        {lang === 'ar' ? 'منتجاتنا' : 'Nos Produits'}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}