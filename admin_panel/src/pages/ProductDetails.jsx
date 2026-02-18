import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getProductById } from "../services/api";
import { useCart } from "../context/CartContext";

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:5000";

function normalizeImage(url) {
  if (!url) return "https://via.placeholder.com/900x600?text=TOUFAYOUR";
  if (url.startsWith("http")) return url;
  return `${API_ORIGIN}${url}`;
}

export default function ProductDetails({ lang, setLang }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [err, setErr] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    getProductById(id)
      .then(setProduct)
      .catch((e) => setErr(e.message));
  }, [id]);

  if (err) {
    return (
      <div style={{ padding: 40 }}>
        <p style={{ color: "crimson" }}>{err}</p>
        <Link to="/products">{lang === "ar" ? "رجوع" : "Retour"}</Link>
      </div>
    );
  }

  if (!product) {
    return <div style={{ padding: 40 }}>{lang === "ar" ? "تحميل..." : "Chargement..."}</div>;
  }

  const title = lang === "ar" ? product.title_ar : product.title_fr;
  const img = normalizeImage(product.image_url);

  return (
    <>
      <Navbar lang={lang} setLang={setLang} />

      <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
        <Link to="/products">{lang === "ar" ? "← رجوع" : "← Retour"}</Link>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 16 }}>
          <div>
            <img src={img} alt={title} style={{ width: "100%", borderRadius: 12 }} />
          </div>

          <div>
            <h1 style={{ marginTop: 0 }}>{title}</h1>
            <p style={{ fontSize: 18 }}>
              {Number(product.price || 0).toFixed(2)} MAD
            </p>

            <button
              type="button"
              onClick={() => addToCart(product, 1)}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
              }}
            >
              {lang === "ar" ? "أضف للسلة" : "Ajouter au panier"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
