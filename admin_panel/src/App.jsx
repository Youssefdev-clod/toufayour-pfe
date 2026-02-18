import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Agents from "./pages/Agents";

import Orders from "./pages/Orders";

export default function App() {
  const [lang, setLang] = useState("fr");

  return (
    <Routes>
      <Route path="*" element={<h1>Page Not Found</h1>} />
      <Route path="/" element={<Orders lang={lang} setLang={setLang} />} />
      <Route path="/products" element={<Products lang={lang} setLang={setLang} />} />
      <Route path="/products/:id" element={<ProductDetails lang={lang} setLang={setLang} />} />
      <Route path="/orders" element={<Orders lang={lang} setLang={setLang} />} />
      <Route path="/agents" element={<Agents lang={lang} setLang={setLang} />} />
    </Routes>
  );
}
