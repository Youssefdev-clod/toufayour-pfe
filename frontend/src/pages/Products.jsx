import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import "./Products.css";
import { getProducts } from "../services/api";

export default function Products({ lang, setLang }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setErr("");
        const data = await getProducts();
        if (mounted) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) setErr(e.message || "Error");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
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
              ? "هنا سيتم عرض المنتجات التي يضيفها المشرف (Admin)."
              : "Ici seront affichés les produits ajoutés par l’admin."}
          </p>
        </div>

        {loading && (
          <p style={{ opacity: 0.85 }}>
            {lang === "ar" ? "جاري تحميل المنتجات..." : "Chargement des produits..."}
          </p>
        )}

        {!loading && err && (
          <div style={{ padding: 14, border: "1px solid #e2caa5", borderRadius: 12 }}>
            <b>{lang === "ar" ? "خطأ:" : "Erreur:"}</b> {err}
            <div style={{ marginTop: 8, opacity: 0.8 }}>
              {lang === "ar"
                ? "تأكد أن الـBackend خدام على http://localhost:5000"
                : "Vérifiez que le backend tourne sur http://localhost:5000"}
            </div>
          </div>
        )}

        {!loading && !err && (
          <div className="p-grid">
            {items.length === 0 ? (
              <p style={{ opacity: 0.85 }}>
                {lang === "ar" ? "لا توجد منتجات بعد." : "Aucun produit pour le moment."}
              </p>
            ) : (
              items.map((p) => <ProductCard key={p.id} lang={lang} product={p} />)
            )}
          </div>
        )}
      </div>
    </div>
  );
}
