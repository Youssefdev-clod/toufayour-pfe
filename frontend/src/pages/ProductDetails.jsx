import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getProductById } from "../services/api";

export default function ProductDetails({ lang, setLang }) {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setErr("");
        const data = await getProductById(id);
        if (mounted) setProduct(data);
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
  }, [id]);

  const title = useMemo(() => {
    if (!product) return "";
    return lang === "ar" ? product.title_ar : product.title_fr;
  }, [lang, product]);

  const desc = useMemo(() => {
    if (!product) return "";
    return lang === "ar" ? product.description_ar : product.description_fr;
  }, [lang, product]);

  const img = useMemo(() => {
    if (!product) return "https://via.placeholder.com/900x600?text=TOUFAYOUR";
    return product.image_url && product.image_url.trim() !== ""
      ? product.image_url
      : "https://via.placeholder.com/900x600?text=TOUFAYOUR";
  }, [product]);

  const waLink = useMemo(() => {
    if (!product) return "#";
    const p = Number(product.price).toFixed(2);
    const waText =
      lang === "ar"
        ? `سلام، بغيت نطلب: ${title} (الثمن: ${p} MAD)`
        : `Bonjour, je veux commander: ${title} (prix: ${p} MAD)`;
    return `https://wa.me/212600000000?text=${encodeURIComponent(waText)}`;
  }, [lang, product, title]);

  // حالات العرض
  if (loading) {
    return (
      <div>
        <Navbar lang={lang} setLang={setLang} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: 40, opacity: 0.85 }}>
          {lang === "ar" ? "جاري تحميل المنتج..." : "Chargement du produit..."}
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div>
        <Navbar lang={lang} setLang={setLang} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: 40 }}>
          <p>
            <b>{lang === "ar" ? "خطأ:" : "Erreur:"}</b> {err}
          </p>
          <Link to="/produits">{lang === "ar" ? "رجوع" : "Retour"}</Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: 40 }}>
        <p>{lang === "ar" ? "المنتج غير موجود" : "Produit introuvable"}</p>
        <Link to="/produits">{lang === "ar" ? "رجوع" : "Retour"}</Link>
      </div>
    );
  }

  return (
    <div>
      <Navbar lang={lang} setLang={setLang} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 40 }}>
        <Link to="/produits" style={{ opacity: 0.8 }}>
          ← {lang === "ar" ? "رجوع للمنتجات" : "Retour aux produits"}
        </Link>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 24,
            marginTop: 18,
          }}
        >
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <img
              src={img}
              alt={title}
              style={{ width: "100%", height: 420, objectFit: "cover" }}
            />
          </div>

          <div>
            <h1 style={{ fontFamily: "var(--font-title)", color: "var(--color-primary)" }}>
              {title}
            </h1>

            <p style={{ fontWeight: 800, marginTop: 10 }}>
              {Number(product.price).toFixed(2)} MAD
            </p>

            <p style={{ marginTop: 14, opacity: 0.88, lineHeight: 1.7 }}>
              {desc || (lang === "ar" ? "بدون وصف." : "Sans description.")}
            </p>

            <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
              <button
                type="button"
                style={{
                  flex: 1,
                  background: "var(--color-secondary)",
                  color: "var(--color-primary)",
                  border: "none",
                  padding: "12px 14px",
                  borderRadius: 12,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {lang === "ar" ? "أضف للسلة" : "Ajouter au panier"}
              </button>

              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  flex: 1,
                  textAlign: "center",
                  background: "var(--color-primary)",
                  color: "white",
                  padding: "12px 14px",
                  borderRadius: 12,
                  fontWeight: 800,
                }}
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
