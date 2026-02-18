import Navbar from "../components/Navbar";
import "./Home.css";

export default function Home({ lang, setLang }) {
  const phone = "+212600000000";
  const insta = "https://instagram.com/toufayour.chocolate";
  const email = "toufayour@gmail.com";

  return (
    <div className="home-page">
      <Navbar lang={lang} setLang={setLang} />

      <div className="home-container">
        <div className="home-grid">
          {/* Left: Brand info */}
          <div className="home-info">
            <div className="brand-badge">
              <div className="brand-logo">T</div>
              <div>
                <h1 className="brand-name">TOUFAYOUR ADMIN</h1>
                <p className="brand-sub">
                  {lang === "ar"
                    ? "شوكولاتة مغربية حرفية بجودة عالية"
                    : "Chocolat artisanal marocain de qualité"}
                </p>
              </div>
            </div>

            <p className="brand-desc">
              {lang === "ar"
                ? "نقدّم شوكولاتة فاخرة بلمسة مغربية، مصنوعة بعناية وبمكونات مختارة لتجربة مذاق راقية."
                : "Nous proposons un chocolat premium avec une touche marocaine, fabriqué avec soin et des ingrédients sélectionnés."}
            </p>

            {/* Contact */}
            <div className="contact-box">
              <a className="contact-item" href={`https://wa.me/${phone.replace("+", "")}`} target="_blank" rel="noreferrer">
                📱 WhatsApp: {phone}
              </a>

              <a className="contact-item" href={insta} target="_blank" rel="noreferrer">
                📸 Instagram
              </a>

              <a className="contact-item" href={`mailto:${email}`}>
                ✉️ {email}
              </a>
            </div>

            {/* CTA */}
            <div className="home-actions">
              <a className="btn-primary" href="/products">
                {lang === "ar" ? "شاهد المنتجات" : "Voir les produits"}
              </a>

              <a className="btn-outline" href={insta} target="_blank" rel="noreferrer">
                {lang === "ar" ? "تابعنا على إنستغرام" : "Suivez-nous"}
              </a>
            </div>
          </div>

          {/* Right: Brand image */}
          <div className="home-visual">
            <div className="visual-card">
              <img
                src="/src/assets/brand.jpg"
                alt="Toufayour"
                className="visual-img"
              />
              <div className="visual-note">
                {lang === "ar" ? "جودة • أناقة • مذاق" : "Qualité • Élégance • Saveur"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
