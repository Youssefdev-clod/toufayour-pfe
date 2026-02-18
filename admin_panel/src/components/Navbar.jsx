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
          <div className="nav__name">TOUFAYOUR ADMIN</div>
        </Link>

        <nav className="nav__links">
          <NavLink to="/orders" end>{lang === "ar" ? "--" : "Commandes"}</NavLink>
          <NavLink to="/products">{lang === "ar" ? "--" : "Produits"}</NavLink>
          <NavLink to="/agents" className="nav__cartLink">
            {lang === "ar" ? "السلة" : "Agents"}
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
