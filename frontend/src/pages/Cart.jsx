import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import "./Cart.css";

export default function Cart({ lang, setLang }) {
  const { items, removeFromCart, setQty, total, clearCart } = useCart();

  const phone = "212600000000"; // بدّل رقم واتساب ديالك (بدون +)
  const lines = items.map((i, idx) => {
    const title = lang === "ar" ? i.title_ar : i.title_fr;
    const itemTotal = (i.price * i.qty).toFixed(2);
    return `${idx + 1}) ${title} | Qty: ${i.qty} | ${i.price} MAD | Sub: ${itemTotal} MAD`;
  });

  const message =
    lang === "ar"
      ? `سلام، بغيت نطلب:\n\n${lines.join("\n")}\n\nالمجموع: ${total.toFixed(
          2
        )} MAD\n\nالاسم:\nالعنوان:\nالمدينة:\nملاحظة:`
      : `Bonjour, je veux commander:\n\n${lines.join(
          "\n"
        )}\n\nTotal: ${total.toFixed(2)} MAD\n\nNom:\nAdresse:\nVille:\nNote:`;

  const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="cart-page">
      <Navbar lang={lang} setLang={setLang} />

      <div className="cart-wrap">
        <h1>{lang === "ar" ? "السلة" : "Panier"}</h1>

        {items.length === 0 ? (
          <p style={{ opacity: 0.8 }}>
            {lang === "ar" ? "السلة فارغة." : "Votre panier est vide."}
          </p>
        ) : (
          <>
            <div className="cart-list">
              {items.map((i) => (
                <div className="cart-item" key={i.id}>
                  <img
                    src={i.image_url || "https://via.placeholder.com/140x100"}
                    alt=""
                  />

                  <div className="cart-info">
                    <div className="cart-title">
                      {lang === "ar" ? i.title_ar : i.title_fr}
                    </div>
                    <div className="cart-price">{i.price} MAD</div>
                  </div>

                  <div className="cart-qty">
                    <input
                      type="number"
                      min="1"
                      value={i.qty}
                      onChange={(e) => setQty(i.id, e.target.value)}
                    />
                  </div>

                  <div className="cart-sub">
                    {(i.price * i.qty).toFixed(2)} MAD
                  </div>

                  <button className="cart-remove" onClick={() => removeFromCart(i.id)}>
                    {lang === "ar" ? "حذف" : "Supprimer"}
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>{lang === "ar" ? "المجموع" : "Total"}</span>
                <b>{total.toFixed(2)} MAD</b>
              </div>

              <div className="cart-actions">
                <button className="btn-outline" onClick={clearCart}>
                  {lang === "ar" ? "افراغ السلة" : "Vider"}
                </button>

                <a className="btn-solid" href={waLink} target="_blank" rel="noreferrer">
                  {lang === "ar" ? "طلب عبر واتساب" : "Commander via WhatsApp"}
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
