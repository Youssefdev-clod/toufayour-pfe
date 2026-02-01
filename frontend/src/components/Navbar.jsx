import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";
import { useCart } from "../context/CartContext";

export default function Navbar({ lang, setLang }) {
  const { count } = useCart();

  return (
    <header className="nav">
      <div className="nav__inner">
        <Link className="nav__brand" to="/">
          <div className="nav__logo">T</div>
          <div className="nav__name">TOUFAYOUR</div>
        </Link>

        <nav className="nav__links">
          <NavLink to="/" end>{lang === "ar" ? "الرئيسية" : "Accueil"}</NavLink>
          <NavLink to="/produits">{lang === "ar" ? "المنتجات" : "Produits"}</NavLink>
          <NavLink to="/panier" className="nav__cartLink">
            {lang === "ar" ? "السلة" : "Panier"}
            {count > 0 && <span className="nav__badge">{count}</span>}
          </NavLink>
        </nav>

        <div className="nav__actions">
          <button className="nav__pill" onClick={() => setLang(lang === "ar" ? "fr" : "ar")}>
            {lang === "ar" ? "FR" : "AR"}
          </button>
        </div>
      </div>
    </header>
  );
}
