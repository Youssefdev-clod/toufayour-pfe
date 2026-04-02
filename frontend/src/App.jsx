import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AdminGuard from './pages/AdminGuard';

export default function App() {
  const [lang, setLang] = useState('fr');

  return (
    <Routes>
      <Route element={<Layout lang={lang} setLang={setLang} />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products lang={lang} />} />
        <Route path="/products/:id" element={<ProductDetails lang={lang} />} />
        <Route path="/cart" element={<Cart lang={lang} />} />
        <Route path="/admin" element={<AdminGuard lang={lang} />} />
      </Route>
      <Route path="*" element={<h1 className="text-center mt-20">Page non trouvée</h1>} />
    </Routes>
  );
}