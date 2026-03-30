import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import StatsBar from '../components/StatsBar';
import ServicesSection from '../components/ServicesSection';
import LocationsSection from '../components/LocationsSection';
import PromotionsSection from '../components/PromotionsSection';
import AdvantagesSection from '../components/AdvantagesSection';
import GallerySection from '../components/GallerySection';
import TestimonialsSection from '../components/TestimonialsSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import PWAInstallPrompt from '../components/PWAInstallPrompt';

function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <StatsBar />
        <ServicesSection />
        <LocationsSection />
        <PromotionsSection />
        <AdvantagesSection />
        <GallerySection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <PWAInstallPrompt />
    </div>
  );
}

export default LandingPage;
