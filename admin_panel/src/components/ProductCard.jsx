import { Link } from "react-router-dom";
import "./ProductCard.css";
import { useCart } from "../context/CartContext";

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:5000";

function normalizeImage(url) {
  if (!url) return "https://via.placeholder.com/600x400?text=TOUFAYOUR";
  if (url.startsWith("http")) return url;
  return `${API_ORIGIN}${url}`; // /uploads/xx => http://localhost:5000/uploads/xx
}

export default function ProductCard({ lang, product }) {
  const { addToCart } = useCart();

  const title = lang === "ar" ? product.title_ar : product.title_fr;
  const img = normalizeImage(product.image_url);

  return (
    <div className="p-card">
      <div className="p-img">
        <img src={img} alt={title} />
      </div>

      <div className="p-body">
        <h3 className="p-title">{title}</h3>
        <p className="p-price">{Number(product.price || 0).toFixed(2)} MAD</p>

        <div className="p-actions">
          <Link className="p-btn outline" to={`/products/${product.id}`}>
            {lang === "ar" ? "التفاصيل" : "Détails"}
          </Link>

          <button className="p-btn solid" onClick={() => addToCart(product, 1)}>
            {lang === "ar" ? "أضف للسلة" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}
