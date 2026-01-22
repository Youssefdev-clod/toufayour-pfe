import { Link } from "react-router-dom";
import "./ProductCard.css";
import { useCart } from "../context/CartContext";

export default function ProductCard({ lang, product }) {
  const { addToCart } = useCart();

  const title = lang === "ar" ? product.titleAR : product.titleFR;

  return (
    <div className="p-card">
      <div className="p-img">
        <img src={product.image} alt={title} />
      </div>

      <div className="p-body">
        <h3 className="p-title">{title}</h3>
        <p className="p-price">{product.price} MAD</p>

        <div className="p-actions">
          <Link className="p-btn outline" to={`/produits/${product.id}`}>
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
