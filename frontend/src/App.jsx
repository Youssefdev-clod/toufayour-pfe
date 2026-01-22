import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import AdminGuard from "./pages/AdminGuard";
import Cart from "./pages/Cart";
export default function App() {
  const [lang, setLang] = useState("fr");

  return (
    <Routes>
      <Route path="/" element={<Home lang={lang} setLang={setLang} />} />
      <Route path="/produits" element={<Products lang={lang} setLang={setLang} />} />
      <Route path="/produits/:id" element={<ProductDetails lang={lang} setLang={setLang} />} />
      <Route path="/admin" element={<AdminGuard lang={lang} setLang={setLang} />} />
      <Route path="/panier" element={<Cart lang={lang} setLang={setLang} />} />

    </Routes>
  );
}
