import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

export default function Panier({ lang, setLang }) {
  const { items, total, setQty, removeFromCart, clearCart } = useCart();

  const label = {
    title: lang === "ar" ? "سلة المشتريات" : "Commandes",
    empty: lang === "ar" ? "السلة فارغة." : "Votre panier est vide.",
    name: lang === "ar" ? "الاسم" : "Nom",
    phone: lang === "ar" ? "الهاتف" : "Téléphone",
    city: lang === "ar" ? "المدينة" : "Ville",
    note: lang === "ar" ? "ملاحظة" : "Note",
    qty: lang === "ar" ? "الكمية" : "Qté",
    remove: lang === "ar" ? "حذف" : "Supprimer",
    total: lang === "ar" ? "المجموع" : "Total",
    send: lang === "ar" ? "إرسال الطلب عبر واتساب" : "Envoyer la commande sur WhatsApp",
    clear: lang === "ar" ? "افراغ السلة" : "Vider le panier",
  };

  // Simple customer info (optional)
  const customer = JSON.parse(localStorage.getItem("toufayour_customer_v1") || "{}");
  const setCustomer = (patch) => {
    const next = { ...customer, ...patch };
    localStorage.setItem("toufayour_customer_v1", JSON.stringify(next));
    window.dispatchEvent(new Event("storage"));
  };

  const buildWhatsAppMessage = () => {
    const lines = [];

    if (lang === "ar") {
      lines.push("سلام، بغيت نطلب هاد المنتجات:");
      lines.push("");
      items.forEach((p, idx) => {
        const title = p.titleAR || p.title_ar || p.titleFR || p.title_fr || "Produit";
        lines.push(`${idx + 1}) ${title}`);
        lines.push(`   • الكمية: ${p.qty}`);
        lines.push(`   • الثمن: ${Number(p.price).toFixed(2)} MAD`);
      });
      lines.push("");
      lines.push(`المجموع: ${total.toFixed(2)} MAD`);
      lines.push("");
      lines.push("معلومات الزبون:");
      lines.push(`- الاسم: ${customer.name || "-"}`);
      lines.push(`- الهاتف: ${customer.phone || "-"}`);
      lines.push(`- المدينة: ${customer.city || "-"}`);
      if (customer.note) lines.push(`- ملاحظة: ${customer.note}`);
      lines.push("");
      lines.push("شكراً 🙏");
    } else {
      lines.push("Bonjour, je souhaite commander :");
      lines.push("");
      items.forEach((p, idx) => {
        const title = p.titleFR || p.title_fr || p.titleAR || p.title_ar || "Produit";
        lines.push(`${idx + 1}) ${title}`);
        lines.push(`   • Quantité: ${p.qty}`);
        lines.push(`   • Prix: ${Number(p.price).toFixed(2)} MAD`);
      });
      lines.push("");
      lines.push(`Total: ${total.toFixed(2)} MAD`);
      lines.push("");
      lines.push("Infos client :");
      lines.push(`- Nom: ${customer.name || "-"}`);
      lines.push(`- Téléphone: ${customer.phone || "-"}`);
      lines.push(`- Ville: ${customer.city || "-"}`);
      if (customer.note) lines.push(`- Note: ${customer.note}`);
      lines.push("");
      lines.push("Merci 🙏");
    }

    return lines.join("\n");
  };

  const waNumber = "212600000000"; // بدّل الرقم ديالك هنا
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(buildWhatsAppMessage())}`;

  return (
    <div>
      <Navbar lang={lang} setLang={setLang} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "26px 16px" }}>
        <h1 style={{ fontFamily: "var(--font-title)", marginBottom: 12 }}>{label.title}</h1>

        {items.length === 0 ? (
          <p style={{ opacity: 0.85 }}>{label.empty}</p>
        ) : (
          <>
            {/* Cart items */}
            <div
              style={{
                background: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              {items.map((p) => {
                const title = lang === "ar"
                  ? (p.titleAR || p.title_ar || p.titleFR || p.title_fr)
                  : (p.titleFR || p.title_fr || p.titleAR || p.title_ar);

                const img = p.image || p.image_url || "https://via.placeholder.com/800x500";

                return (
                  <div
                    key={p.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "84px 1fr 110px 120px",
                      gap: 12,
                      alignItems: "center",
                      padding: 12,
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <img
                      src={img}
                      alt={title}
                      style={{
                        width: 84,
                        height: 64,
                        objectFit: "cover",
                        borderRadius: 12,
                        border: "1px solid rgba(0,0,0,0.08)",
                      }}
                    />

                    <div>
                      <div style={{ fontWeight: 800 }}>{title}</div>
                      <div style={{ opacity: 0.85, marginTop: 4 }}>
                        {Number(p.price).toFixed(2)} MAD
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ fontSize: 12, opacity: 0.7 }}>{label.qty}</div>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={p.qty}
                        onChange={(e) => setQty(p.id, e.target.value)}
                        style={{
                          padding: "10px 10px",
                          borderRadius: 12,
                          border: "1px solid rgba(0,0,0,0.18)",
                          outline: "none",
                        }}
                      />
                    </div>

                    <button
                      onClick={() => removeFromCart(p.id)}
                      style={{
                        border: "1px solid rgba(0,0,0,0.18)",
                        background: "white",
                        padding: "10px 12px",
                        borderRadius: 12,
                        cursor: "pointer",
                        fontWeight: 800,
                      }}
                    >
                      {label.remove}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Total + actions */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginTop: 16,
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 16,
                  padding: 16,
                }}
              >
                <div style={{ fontWeight: 900, fontSize: 18 }}>
                  {label.total}: {total.toFixed(2)} MAD
                </div>

                <button
                  onClick={clearCart}
                  style={{
                    marginTop: 12,
                    border: "1px solid rgba(0,0,0,0.18)",
                    background: "white",
                    padding: "12px 14px",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontWeight: 900,
                    width: "100%",
                  }}
                >
                  {label.clear}
                </button>
              </div>

              {/* Customer info + WhatsApp */}
              <div
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 16,
                  padding: 16,
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <input
                    placeholder={label.name}
                    defaultValue={customer.name || ""}
                    onChange={(e) => setCustomer({ name: e.target.value })}
                    style={fieldStyle}
                  />
                  <input
                    placeholder={label.phone}
                    defaultValue={customer.phone || ""}
                    onChange={(e) => setCustomer({ phone: e.target.value })}
                    style={fieldStyle}
                  />
                  <input
                    placeholder={label.city}
                    defaultValue={customer.city || ""}
                    onChange={(e) => setCustomer({ city: e.target.value })}
                    style={fieldStyle}
                  />
                  <input
                    placeholder={label.note}
                    defaultValue={customer.note || ""}
                    onChange={(e) => setCustomer({ note: e.target.value })}
                    style={fieldStyle}
                  />
                </div>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "block",
                    marginTop: 12,
                    textAlign: "center",
                    background: "var(--color-primary)",
                    color: "white",
                    padding: "12px 14px",
                    borderRadius: 12,
                    fontWeight: 900,
                    textDecoration: "none",
                  }}
                >
                  {label.send}
                </a>

                <p style={{ marginTop: 10, opacity: 0.7, fontSize: 12, lineHeight: 1.4 }}>
                  {lang === "ar"
                    ? "نصيحة: خليه يكتب رقم الهاتف والمدينة باش الطلب يكون واضح."
                    : "Conseil: demandez au client d’ajouter téléphone + ville pour une commande claire."}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer lang={lang} />
    </div>
  );
}

const fieldStyle = {
  padding: "12px 12px",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.18)",
  outline: "none",
};
