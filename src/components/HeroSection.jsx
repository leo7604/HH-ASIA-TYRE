import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { locations } from '../data/mockData';

// Hero slides showcasing different branches
const heroSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1625043484550-df60256f6ea5?w=1600&q=80',
    eyebrow: 'Metro Manila',
    title: 'ALABANG BRANCH',
    subtitle: 'Your trusted tire and auto care experts in the south',
    address: 'Alabang-Zapote Rd, Las Piñas City, Metro Manila',
    phone: '8842-9148',
    validity: 'Open Mon-Sat: 8AM-6PM',
    primaryCTA: { text: 'Book Now', href: '/book', icon: 'calendar' },
    secondaryCTA: { text: 'Get Directions', href: '#locations', icon: 'map' },
    badges: ['Tire Services', 'Oil Change', 'Brake Repair', 'Battery Replacement']
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1600&q=80',
    eyebrow: 'Metro Manila',
    title: 'BICUTAN BRANCH',
    subtitle: 'Full-service auto care in Parañaque City',
    address: '118 Doña Soledad Avenue, Don Bosco, Parañaque City',
    phone: '8334-2858',
    validity: 'Open Mon-Sat: 8AM-6PM',
    primaryCTA: { text: 'Book Now', href: '/book', icon: 'calendar' },
    secondaryCTA: { text: 'Get Directions', href: '#locations', icon: 'map' },
    badges: ['Tire Services', 'Oil Change', 'Batteries']
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=1600&q=80',
    eyebrow: 'Cavite',
    title: 'BACOOR BRANCH',
    subtitle: 'Quality auto services in Cavite',
    address: 'Aguinaldo Highway Nlog II, Bacoor, Cavite',
    phone: '(046) 417-8415',
    validity: 'Open Mon-Sat: 8AM-6PM',
    primaryCTA: { text: 'Book Now', href: '/book', icon: 'calendar' },
    secondaryCTA: { text: 'Get Directions', href: '#locations', icon: 'map' },
    badges: ['Tire Services', 'Oil Change', 'Brake Services']
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1552857859-8462d3d17dec?w=1600&q=80',
    eyebrow: 'Ilocos Norte',
    title: 'LAOAG BRANCH',
    subtitle: 'Northern Luzon\'s premier tire and auto service center',
    address: 'John Henry Car Care Center, Bacarra Road, Laoag City',
    phone: '(077) 772-3456',
    validity: 'Open Mon-Sat: 8AM-5PM',
    primaryCTA: { text: 'Book Now', href: '/book', icon: 'calendar' },
    secondaryCTA: { text: 'Get Directions', href: '#locations', icon: 'map' },
    badges: ['Tire Services', 'Oil Change', 'Suspension', 'Full Auto Care']
  }
];

const CTAIcons = {
  calendar: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  map: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  tag: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  card: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  ),
  target: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  )
};

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentSlideData = heroSlides[currentSlide];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <section className="relative h-[92vh] min-h-[600px] overflow-hidden pt-[68px]">
      {/* Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 flex items-center transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/40" />

          {/* Content */}
          <div className="relative z-10 max-w-[1280px] mx-auto px-6 w-full">
            <div className="max-w-[700px]">
              {/* Eyebrow - Location */}
              <div className={`inline-flex items-center gap-2 bg-brand-yellow/15 border border-brand-yellow/40 rounded-md px-4 py-2 mb-5 font-semibold text-[0.72rem] tracking-widest uppercase text-brand-yellow animate-fade-up animate-fade-up-1`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {slide.eyebrow}
              </div>

              {/* Title - Branch Name */}
              <h1 className="font-display font-black uppercase text-white mb-3 animate-fade-up animate-fade-up-2" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: '0.95' }}>
                {slide.title}
              </h1>

              {/* Subtitle - Branch Description */}
              <p className="text-[1.1rem] text-brand-textMuted max-w-[550px] leading-relaxed mb-4 animate-fade-up animate-fade-up-3">
                {slide.subtitle}
              </p>

              {/* Address Badge */}
              <div className="inline-flex items-start gap-2 bg-gradient-to-r from-brand-yellow/20 to-brand-yellow/10 border border-brand-yellow/30 rounded-lg px-5 py-3 mb-6 animate-fade-up animate-fade-up-3">
                <svg className="w-5 h-5 text-brand-yellow flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <div className="font-display font-bold text-white text-sm">{slide.address}</div>
                  <div className="text-brand-yellow text-xs mt-1">📞 {slide.phone}</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4 flex-wrap mb-8 animate-fade-up animate-fade-up-4">
                <Link
                  to={slide.primaryCTA.href}
                  className="inline-flex items-center gap-2.5 bg-brand-yellow text-black px-8 py-4 rounded-md font-display font-bold uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-[0_0_24px_rgba(255,215,0,0.3)] hover:shadow-[0_0_36px_rgba(255,215,0,0.45)] hover:-translate-y-1"
                >
                  {CTAIcons[slide.primaryCTA.icon]}
                  {slide.primaryCTA.text}
                </Link>
                <Link
                  to={slide.secondaryCTA.href}
                  className="inline-flex items-center gap-2 bg-transparent border-2 border-white/60 text-white px-8 py-4 rounded-md font-display font-bold uppercase tracking-wider hover:bg-white/10 hover:border-white transition-all"
                >
                  {slide.secondaryCTA.text}
                  {CTAIcons[slide.secondaryCTA.icon] || (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </Link>
              </div>

              {/* Services Badges */}
              <div className="flex flex-wrap gap-3 animate-fade-up animate-fade-up-4">
                {slide.badges.map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-brand-textMuted bg-brand-raised/80 border border-brand-border rounded-full px-4 py-2">
                    <svg className="w-4 h-4 text-brand-yellow flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {badge}
                  </div>
                ))}
              </div>

              {/* Hours */}
              <div className="flex items-center gap-2 text-brand-textDim text-sm mt-6 animate-fade-up animate-fade-up-4">
                <svg className="w-4 h-4 text-brand-yellow flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
                <span>{slide.validity}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-10 bg-brand-yellow shadow-[0_0_12px_rgba(255,215,0,0.5)]'
                : 'w-2 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-7 right-10 flex gap-2.5 z-20">
        <button
          onClick={prevSlide}
          className="w-11 h-11 rounded-full border border-brand-border bg-black/70 flex items-center justify-center text-brand-textMuted hover:border-brand-yellow hover:text-brand-yellow transition-all hover:bg-black/90"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="w-11 h-11 rounded-full border border-brand-border bg-black/70 flex items-center justify-center text-brand-textMuted hover:border-brand-yellow hover:text-brand-yellow transition-all hover:bg-black/90"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-border z-20">
        <div
          className="h-full bg-brand-yellow transition-all duration-300 ease-linear"
          style={{ width: `${((currentSlide % heroSlides.length) + 1) * (100 / heroSlides.length)}%` }}
        />
      </div>
    </section>
  );
}

export default HeroSection;
