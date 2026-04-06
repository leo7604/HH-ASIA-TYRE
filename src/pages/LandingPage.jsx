import { useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import StatsBar from '../components/StatsBar';
import LocationsSection from '../components/LocationsSection';
import PromotionsSection from '../components/PromotionsSection';
import AdvantagesSection from '../components/AdvantagesSection';
import GallerySection from '../components/GallerySection';
import TestimonialsSection from '../components/TestimonialsSection';
import ContactSection from '../components/ContactSection';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import PWAInstallPrompt from '../components/PWAInstallPrompt';

function LandingPage() {
  useEffect(() => {
    // Add FAQ Schema for rich snippets
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What tire brands do you carry?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We carry premium tire brands including Cooper, Goodyear, Michelin, GT Radial, and other leading manufacturers. Each branch has different stock availability, so we recommend calling ahead or booking an appointment to ensure we have your desired tires in stock."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need an appointment for service?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "While we accept walk-ins, we highly recommend booking an appointment to minimize wait times. Our online booking system makes it easy to schedule your preferred date and time. Same-day appointments may be available depending on branch capacity."
          }
        },
        {
          "@type": "Question",
          "name": "How long does a typical oil change take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A standard oil change typically takes 30-45 minutes. However, this may vary depending on your vehicle type and current workload. We offer complimentary waiting areas with WiFi, or you can drop off your vehicle and return later."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer warranties on your services?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! All our services come with warranties. Tire installations include free rotation and balancing for life. Parts and labor warranties vary by service type - typically ranging from 12 months/12,000 miles to 24 months/24,000 miles. Ask your service advisor for specific warranty details."
          }
        },
        {
          "@type": "Question",
          "name": "What payment methods do you accept?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We accept cash, all major credit cards (Visa, Mastercard, American Express), debit cards, and digital payments (GCash, Maya). We also offer financing options through our partner banks for larger repairs and purchases."
          }
        }
      ]
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <StatsBar />
        <LocationsSection />
        <PromotionsSection />
        <AdvantagesSection />
        <GallerySection />
        <TestimonialsSection />
        <ContactSection />
        <FAQSection />
      </main>
      <Footer />
      <PWAInstallPrompt />
    </div>
  );
}

export default LandingPage;
