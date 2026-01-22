import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ lang, setLang }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (path) => {
    if (path === "/produits") return location.pathname.startsWith("/produits");
    return location.pathname === path;
  };

  const phoneDigits = "212600000000"; // بدّل رقمك
  const instaUrl = "https://instagram.com/"; // بدّل رابطك
  const mail = "toufayour@gmail.com"; // بدّل ايميلك

  const isAuthed = !!localStorage.getItem("token"); // JWT (إلا عندك)
  const showLogout = isAuthed;

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // RTL للّغة العربية
  useEffect(() => {
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang === "ar" ? "ar" : "fr");
  }, [lang]);

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          {/* Brand */}
          <Link to="/" className="nav-brand" aria-label="TOUFAYOUR">
            <span className="nav-mark">T</span>
            <span className="nav-name">TOUFAYOUR</span>
          </Link>

          {/* Desktop links */}
          <nav className="nav-links" aria-label="Navigation">
            <Link className={isActive("/") ? "active" : ""} to="/">
              {lang === "ar" ? "الرئيسية" : "Accueil"}
            </Link>

            <Link className={isActive("/produits") ? "active" : ""} to="/produits">
              {lang === "ar" ? "المنتجات" : "Produits"}
            </Link>

            {isAuthed && (
              <Link className={isActive("/admin") ? "active" : ""} to="/admin">
                Admin
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="nav-actions">
            <a
              className="btn btn-outline"
              href={`https://wa.me/${phoneDigits}`}
              target="_blank"
              rel="noreferrer"
              title="WhatsApp"
            >
              WhatsApp
            </a>

            <button
              className="btn btn-ghost"
              onClick={() => setLang(lang === "ar" ? "fr" : "ar")}
              title="Lang"
            >
              {lang === "ar" ? "FR" : "AR"}
            </button>

            {showLogout && (
              <button className="btn btn-dark" onClick={logout}>
                {lang === "ar" ? "خروج" : "Logout"}
              </button>
            )}

            {/* Burger */}
            <button
              className={`burger ${open ? "is-open" : ""}`}
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={open}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer + overlay */}
      <div className={`nav-overlay ${open ? "show" : ""}`} onClick={() => setOpen(false)} />

      <aside className={`nav-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="drawer-head">
          <div className="drawer-brand">
            <span className="nav-mark small">T</span>
            <div>
              <div className="drawer-title">TOUFAYOUR CHOCOLATE</div>
              <div className="drawer-sub">
                {lang === "ar"
                  ? "شوكولاتة مغربية حرفية بجودة عالية"
                  : "Chocolat artisanal marocain de qualité"}
              </div>
            </div>
          </div>

          <button className="drawer-close" onClick={() => setOpen(false)} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="drawer-links">
          <Link className={isActive("/") ? "active" : ""} to="/">
            {lang === "ar" ? "الرئيسية" : "Accueil"}
          </Link>

          <Link className={isActive("/produits") ? "active" : ""} to="/produits">
            {lang === "ar" ? "المنتجات" : "Produits"}
          </Link>

          {isAuthed && (
            <Link className={isActive("/admin") ? "active" : ""} to="/admin">
              Admin
            </Link>
          )}
        </div>

        <div className="drawer-cta">
          <a className="btn btn-gold full" href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer">
            {lang === "ar" ? "اطلب عبر واتساب" : "Commander via WhatsApp"}
          </a>
          <a className="btn btn-outline full" href={instaUrl} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a className="btn btn-outline full" href={`mailto:${mail}`}>
            {mail}
          </a>

          {showLogout && (
            <button className="btn btn-dark full" onClick={logout}>
              {lang === "ar" ? "خروج" : "Logout"}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
  