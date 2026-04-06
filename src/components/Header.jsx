import { useState } from 'react';
import { Link } from 'react-router-dom';
import { services, locations } from '../data/mockData';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  return (
    <header className="bg-brand-black/88 backdrop-blur-md sticky top-0 z-50 border-b border-brand-border">
      <nav className="max-w-[1280px] mx-auto px-6 h-[68px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsMenuOpen(false)}>
          {/* Simplified Professional Logo */}
          <div className="relative w-[42px] h-[42px] flex items-center justify-center">
            {/* Outer ring */}
            <div className="absolute inset-0 border-2 border-brand-yellow rounded-full group-hover:border-white transition-colors duration-300"></div>
            {/* Inner circle */}
            <div className="absolute inset-1 bg-brand-yellow rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-300">
              <span className="font-display font-black text-brand-black text-lg">HH</span>
            </div>
          </div>
          
          {/* Brand Text */}
          <div className="flex flex-col leading-tight">
            <span className="font-display font-bold text-xl tracking-wide text-white group-hover:text-brand-yellow transition-colors duration-300">
              HH ASIA
            </span>
            <span className="font-display font-semibold text-xs tracking-[0.2em] uppercase text-brand-textMuted group-hover:text-white transition-colors duration-300">
              Tyre Alliance
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          <div 
            href="#services" 
            className="px-4 py-2 text-brand-textMuted hover:text-white text-sm font-medium transition-colors rounded-md hover:bg-brand-raised relative group cursor-pointer"
            onMouseEnter={() => setActiveDropdown('services')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            Services
            <svg className="w-3 h-3 inline-block ml-1 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" />
            </svg>
            
            {/* Services Dropdown */}
            <div className="absolute top-full left-0 mt-2 w-64 bg-brand-card border border-brand-border rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 z-50">
              <div className="py-2">
                {services.slice(0, 6).map((service) => (
                  <a
                    key={service.id}
                    href="#services"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-brand-raised transition-colors border-b border-brand-border/50 last:border-0"
                  >
                    <div className="w-8 h-8 bg-brand-yellow/20 rounded-md flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-brand-yellow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white text-sm font-semibold">{service.name}</div>
                      <div className="text-brand-textDim text-[10px]">{service.category}</div>
                    </div>
                  </a>
                ))}
              </div>
              <a href="#services" className="block px-4 py-3 bg-brand-yellow/10 text-brand-yellow text-center text-sm font-bold uppercase hover:bg-brand-yellow/20 transition-colors rounded-b-lg">
                View All Services
              </a>
            </div>
          </div>

          <div 
            className="px-4 py-2 text-brand-textMuted hover:text-white text-sm font-medium transition-colors rounded-md hover:bg-brand-raised relative group cursor-pointer"
            onMouseEnter={() => setActiveDropdown('locations')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            Branches
            <svg className="w-3 h-3 inline-block ml-1 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" />
            </svg>
            
            {/* Branches Dropdown */}
            <div className="absolute top-full left-0 mt-2 w-72 bg-brand-card border border-brand-border rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 z-50">
              <div className="py-2">
                {locations.map((location) => (
                  <a
                    key={location.id}
                    href="#locations"
                    className="flex items-start gap-3 px-4 py-3 hover:bg-brand-raised transition-colors border-b border-brand-border/50 last:border-0"
                  >
                    <div className="w-8 h-8 bg-brand-yellow/20 rounded-md flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-brand-yellow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-semibold truncate">{location.name}</div>
                      <div className="text-brand-textDim text-[10px]">{location.area}, {location.city}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${location.status === 'open' ? 'bg-green-500' : 'bg-gray-500'}`} />
                        <span className={`text-[10px] ${location.status === 'open' ? 'text-green-400' : 'text-gray-400'}`}>
                          {location.status === 'open' ? 'Open' : 'Coming Soon'}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <a href="#locations" className="block px-4 py-3 bg-brand-yellow/10 text-brand-yellow text-center text-sm font-bold uppercase hover:bg-brand-yellow/20 transition-colors rounded-b-lg">
                View All Branches
              </a>
            </div>
          </div>

          <a href="#gallery" className="px-4 py-2 text-brand-textMuted hover:text-white text-sm font-medium transition-colors rounded-md hover:bg-brand-raised">
            Gallery
          </a>
          <a href="#about" className="px-4 py-2 text-brand-textMuted hover:text-white text-sm font-medium transition-colors rounded-md hover:bg-brand-raised">
            About
          </a>
          <a href="#contact" className="px-4 py-2 text-brand-textMuted hover:text-white text-sm font-medium transition-colors rounded-md hover:bg-brand-raised">
            Contact
          </a>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* CTA Button */}
          <Link
            to="/book"
            className="hidden md:block bg-brand-yellow text-black px-6 py-2.5 rounded-md font-display font-bold text-sm tracking-wider uppercase hover:bg-yellow-400 transition-all shadow-[0_0_18px_rgba(255,215,0,0.3)] hover:shadow-[0_0_28px_rgba(255,215,0,0.4)] hover:-translate-y-0.5"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-brand-black border-b border-brand-border py-4 px-6 animate-fade-up">
          {/* Services Accordion */}
          <div className="mb-4">
            <button 
              className="flex items-center justify-between w-full py-3 text-brand-textMuted hover:text-white font-medium"
              onClick={() => setActiveDropdown(activeDropdown === 'mobile-services' ? null : 'mobile-services')}
            >
              <span>Services</span>
              <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'mobile-services' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeDropdown === 'mobile-services' && (
              <div className="pl-4 space-y-2 mt-2">
                {services.slice(0, 6).map((service) => (
                  <a key={service.id} href="#services" className="block py-2 text-sm text-brand-textMuted hover:text-brand-yellow">
                    {service.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Branches Accordion */}
          <div className="mb-4">
            <button 
              className="flex items-center justify-between w-full py-3 text-brand-textMuted hover:text-white font-medium"
              onClick={() => setActiveDropdown(activeDropdown === 'mobile-locations' ? null : 'mobile-locations')}
            >
              <span>Branches</span>
              <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'mobile-locations' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeDropdown === 'mobile-locations' && (
              <div className="pl-4 space-y-2 mt-2">
                {locations.map((location) => (
                  <a key={location.id} href="#locations" className="block py-2 text-sm text-brand-textMuted hover:text-brand-yellow">
                    {location.name} ({location.area})
                  </a>
                ))}
              </div>
            )}
          </div>

          <a href="#gallery" className="block py-3 text-brand-textMuted hover:text-white font-medium">Gallery</a>
          <a href="#about" className="block py-3 text-brand-textMuted hover:text-white font-medium">About</a>
          <a href="#contact" className="block py-3 text-brand-textMuted hover:text-white font-medium">Contact</a>
          <Link
            to="/book"
            className="block mt-4 bg-brand-yellow text-black text-center px-6 py-3 rounded-md font-display font-bold uppercase tracking-wider"
          >
            Book Appointment
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
