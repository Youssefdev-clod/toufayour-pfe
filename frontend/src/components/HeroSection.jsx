import { Link } from "react-router-dom";

export default function HeroSection({ lang }) {
  return (
    <section className="relative bg-gradient-to-br from-chocolate-50 to-white py-20 px-4 overflow-hidden">
      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Texte */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            TOUFAYOUR <span className="text-chocolate-500">CHOCOLATE</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            {lang === "ar" ? "جودة • أناقة • نكهة" : "Qualité • Élégance • Saveur"}
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link
              to="/products"
              className="bg-chocolate-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-chocolate-600 transition shadow-lg hover:shadow-xl"
            >
              {lang === "ar" ? "عرض المنتجات" : "Voir les produits"}
            </Link>
            <a
              href="#contact"
              className="border-2 border-chocolate-500 text-chocolate-500 px-8 py-3 rounded-full font-semibold hover:bg-chocolate-500 hover:text-white transition"
            >
              {lang === "ar" ? "تابعنا" : "Suivez-nous"}
            </a>
          </div>

          {/* Coordonnées */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-600">
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <span className="text-xl">📱</span>
              <span>+212 600 000 000</span>
            </div>
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <span className="text-xl">📷</span>
              <span>@toufayour</span>
            </div>
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <span className="text-xl">✉️</span>
              <span>toufayour@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="lg:w-1/2">
          <div className="relative">
            <img
              src="/hero-chocolate.jpg"
              alt="Assortiment de chocolats"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-chocolate-900/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>

      {/* Élément décoratif */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-chocolate-200 via-chocolate-400 to-chocolate-200"></div>
    </section>
  );
}