export default function Footer({ lang }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#faf7f2] bg-opacity-85 border-t border-black/10 py-5 px-4 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="font-black text-lg text-gray-800">TOUFAYOUR</div>
        <div className="text-gray-600 text-sm opacity-75">
          {lang === 'ar' ? 'جميع الحقوق محفوظة' : 'Tous droits réservés'} © {currentYear}
        </div>
      </div>
    </footer>
  );
}