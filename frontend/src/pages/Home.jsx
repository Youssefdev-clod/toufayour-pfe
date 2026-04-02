import HeroSection from "../components/HeroSection";
import FeaturedProducts from "../components/FeaturedProducts"; // à créer si besoin

export default function Home({ lang }) {
  return (
    <div>
      <HeroSection lang={lang} />
      <FeaturedProducts lang={lang} /> {/* facultatif */}
    </div>
  );
}