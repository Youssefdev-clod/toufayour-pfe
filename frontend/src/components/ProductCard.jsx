import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.image_url || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{product.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-chocolate-600 font-bold">{product.price} DH</span>
            <span className="text-gray-500 text-sm">Détails</span>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button
          onClick={() => addToCart(product)}
          className="w-full bg-chocolate-500 text-white py-2 rounded hover:bg-chocolate-600 transition"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}