import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import "./Products.css";
import { getProducts } from "../services/api";

export default function Products({ lang, setLang }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await getProducts();
        if (!mounted) return;
        setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!mounted) return;
        setErr(e.message || "Error");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="zellige-bg" id="produits">
      <Navbar lang={lang} setLang={setLang} />

      <div className="p-container">
        <div className="p-head">
          <h1>{lang === "ar" ? "المنتجات" : "Produits"}</h1>
          <p>
            {lang === "ar"
              ? "هنا المنتجات اللي كيضيفها الأدمن."
              : "Ici, les produits ajoutés par l’admin."}
          </p>
        </div>

        {loading && (
          <p style={{ opacity: 0.8 }}>{lang === "ar" ? "تحميل..." : "Chargement..."}</p>
        )}
        {err && <p style={{ color: "crimson" }}>{err}</p>}

        <div className="p-grid">
          {products.map((p) => (
            <ProductCard key={p.id} lang={lang} product={p} />
          ))}
        </div>
      </div>

      <Footer lang={lang} />
    </div>  
  );
}
