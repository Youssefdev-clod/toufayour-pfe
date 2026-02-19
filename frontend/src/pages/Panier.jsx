import { useState } from "react";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";
import "./Cart.css"; // إذا عندك نفس CSS ديال السلة

export default function Panier({ lang, setLang }) {
  const { cartItems, removeFromCart, clearCart, updateQty, getTotal } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const total = getTotal();

  async function submitOrder() {
    setErr("");
    setMsg("");

    if (!customerName.trim() || !phone.trim()) {
      setErr(lang === "ar" ? "الاسم ورقم الهاتف ضروريان." : "Nom et téléphone sont obligatoires.");
      return;
    }

    if (!cartItems.length) {
      setErr(lang === "ar" ? "السلة فارغة." : "Le panier est vide.");
      return;
    }

    const payload = {
      customer_name: customerName.trim(),
      phone: phone.trim(),
      address: address.trim() || null,
      items: cartItems.map((it) => ({
        product_id: it.id,
        quantity: it.qty,
      })),
    };

    try {
      setLoading(true);
      const data = await createOrder(payload);

      setMsg(
        lang === "ar"
          ? `✅ تم إرسال الطلب بنجاح! رقم الطلب: ${data.order_id} (المجموع: ${data.total} MAD)`
          : `✅ Commande envoyée! ID: ${data.order_id} (Total: ${data.total} MAD)`
      );

      clearCart();
      setCustomerName("");
      setPhone("");
      setAddress("");
    } catch (e) {
      setErr(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar lang={lang} setLang={setLang} />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
        <h1 style={{ marginBottom: 8 }}>
          {lang === "ar" ? "السلة" : "Panier"}
        </h1>

        {err && <p style={{ color: "crimson" }}>{err}</p>}
        {msg && <p style={{ color: "green" }}>{msg}</p>}

        {/* CART LIST */}
        {!cartItems.length ? (
          <p>{lang === "ar" ? "السلة فارغة." : "Votre panier est vide."}</p>
        ) : (
          <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
            {cartItems.map((it) => (
              <div
                key={it.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  padding: 12,
                  borderRadius: 12,
                  background: "#fff",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {lang === "ar" ? it.title_ar : it.title_fr}
                  </div>
                  <div style={{ opacity: 0.8 }}>
                    {Number(it.price).toFixed(2)} MAD
                  </div>

                  <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
                    <button onClick={() => updateQty(it.id, it.qty - 1)} disabled={it.qty <= 1}>
                      -
                    </button>
                    <span>{it.qty}</span>
                    <button onClick={() => updateQty(it.id, it.qty + 1)}>+</button>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                  <div style={{ fontWeight: 700 }}>
                    {(Number(it.price) * it.qty).toFixed(2)} MAD
                  </div>
                  <button onClick={() => removeFromCart(it.id)}>
                    {lang === "ar" ? "حذف" : "Supprimer"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TOTAL */}
        <div style={{ marginTop: 16, fontSize: 18, fontWeight: 700 }}>
          {lang === "ar" ? "المجموع:" : "Total:"} {total.toFixed(2)} MAD
        </div>

        {/* ORDER FORM */}
        <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: "#fff" }}>
          <h3 style={{ marginTop: 0 }}>
            {lang === "ar" ? "معلومات الزبون" : "Informations client"}
          </h3>

          <div style={{ display: "grid", gap: 10 }}>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={lang === "ar" ? "الاسم الكامل" : "Nom complet"}
            />

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={lang === "ar" ? "رقم الهاتف" : "Téléphone"}
            />

            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={lang === "ar" ? "العنوان (اختياري)" : "Adresse (optionnel)"}
            />

            <button onClick={submitOrder} disabled={loading || !cartItems.length}>
              {loading
                ? (lang === "ar" ? "جار الإرسال..." : "Envoi...")
                : (lang === "ar" ? "تأكيد الطلب" : "Confirmer la commande")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
