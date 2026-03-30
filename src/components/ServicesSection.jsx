import { useState } from 'react';
import { Link } from 'react-router-dom';
import { services, serviceCategories, specialServices } from '../data/mockData';

const serviceIcons = {
  tyre: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      <path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </svg>
  ),
  oil: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L7 9v6c0 2.8 2.2 5 5 5s5-2.2 5-5V9l-5-7z" />
      <path d="M12 2v7M9 12h6" />
    </svg>
  ),
  battery: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2" />
      <path d="M9 11l1.5 2L13 10" />
    </svg>
  ),
  brakes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
    </svg>
  ),
  clutch: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
    </svg>
  ),
  maintenance: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  aircon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 7V5M12 19v-2M7 12H5M19 12h-2" />
    </svg>
  ),
  suspension: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2v6M12 16v6M8 8a4 4 0 108 0M8 16a4 4 0 108 0" />
      <circle cx="12" cy="8" r="2" />
      <circle cx="12" cy="16" r="2" />
    </svg>
  ),
  transmission: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
};

function ServicesSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  return (
    <section id="services" className="py-24 px-6 bg-gradient-to-b from-brand-black to-brand-card">
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-[0.72rem] font-bold tracking-[0.14em] uppercase text-brand-yellow mb-3">
            What We Offer
          </div>
          <h2 className="font-display font-bold uppercase text-white mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Our <span className="text-brand-yellow">Services</span>
          </h2>
          <p className="text-brand-textMuted max-w-[520px] mx-auto leading-relaxed">
            Professional tyre and auto services by factory-certified technicians.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {serviceCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md font-medium transition-all text-sm ${
                selectedCategory === category.id
                  ? 'bg-brand-yellow text-black shadow-[0_0_24px_rgba(255,215,0,0.3)]'
                  : 'bg-brand-raised text-brand-textMuted hover:bg-brand-overlay border border-brand-border hover:border-brand-yellow/40'
              }`}
            >
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group bg-brand-card border border-brand-border rounded-xl overflow-hidden transition-all duration-300 hover:border-brand-yellow/40 hover:shadow-[0_0_40px_rgba(255,215,0,0.15)] hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="p-6 pb-4">
                <div className="w-14 h-14 rounded-xl bg-brand-yellow/10 border border-brand-yellow/25 flex items-center justify-center text-brand-yellow mb-4 group-hover:bg-brand-yellow group-hover:text-black transition-all">
                  {serviceIcons[service.icon]}
                </div>
                <h3 className="font-display font-bold uppercase text-white text-xl mb-2">
                  {service.name}
                </h3>
                <p className="text-brand-textMuted text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
              </div>

              {/* Learn More Link */}
              <div className="px-6 pb-6">
                <Link
                  to="/book"
                  className="inline-flex items-center gap-2 text-brand-yellow font-display font-bold uppercase tracking-wider text-sm hover:gap-3 transition-all"
                >
                  Book This Service
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Advanced Services */}
        <div className="bg-brand-raised border border-brand-border rounded-xl p-8 mb-12">
          <div className="text-center mb-8">
            <div className="text-[0.72rem] font-bold tracking-[0.14em] uppercase text-brand-yellow mb-3">
              Specialized Services
            </div>
            <h3 className="font-display font-bold uppercase text-white text-xl">
              Advanced <span className="text-brand-yellow">Diagnostics</span>
            </h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {specialServices.map((service, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-brand-card border border-brand-border rounded-lg px-4 py-3 hover:border-brand-yellow/40 transition-all"
              >
                <div className="w-2 h-2 bg-brand-yellow rounded-full flex-shrink-0" />
                <span className="text-brand-textMuted text-sm">{service}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="relative bg-gradient-to-br from-brand-yellow/15 via-brand-yellow/8 to-brand-yellow/5 border border-brand-yellow/30 rounded-2xl p-10 md:p-12 text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-brand-yellow to-transparent" />
          
          <div className="relative z-10">
            <h3 className="font-display font-black uppercase text-white mb-3" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
              Need a <span className="text-brand-yellow">Custom Quote</span>?
            </h3>
            <p className="text-brand-textMuted text-base mb-6 max-w-xl mx-auto">
              Fleet packages, corporate accounts, and bulk orders available.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-brand-yellow text-black px-8 py-3.5 rounded-md font-display font-bold uppercase tracking-wider text-sm hover:bg-yellow-400 transition-all shadow-[0_0_24px_rgba(255,215,0,0.3)] hover:-translate-y-0.5"
              >
                Contact Us
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/book"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-brand-yellow text-brand-yellow px-8 py-3 rounded-md font-display font-bold uppercase tracking-wider text-sm hover:bg-brand-yellow/10 transition-all"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
