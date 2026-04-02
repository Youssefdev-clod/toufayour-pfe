import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Layout({ lang, setLang }) {
  return (
    <>
      <Navbar lang={lang} setLang={setLang} />
      <main className="min-h-screen pt-20">
        <Outlet />
      </main>
      <Footer lang={lang} />
    </>
  );
}