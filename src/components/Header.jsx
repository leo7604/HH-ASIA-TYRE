import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { services, locations } from '../data/mockData';
import Icon from './Icon';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return; // Already installed, don't show button
    }

    // Check if user dismissed the install prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return; // Don't show for 7 days after dismissal
      }
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowInstallButton(false);
      setDeferredPrompt(null);
    } else {
      // User dismissed, don't show for 7 days
      localStorage.setItem('pwa-install-dismissed', Date.now().toString());
      setShowInstallButton(false);
    }
  };

  const handleDismissInstall = () => {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    setShowInstallButton(false);
  };

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
            <Icon name="chevronDown" size="xs" className="inline-block ml-1 transition-transform group-hover:rotate-180" />
            
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
                      <Icon name="settings" size="sm" className="text-brand-yellow" />
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
            <Icon name="chevronDown" size="xs" className="inline-block ml-1 transition-transform group-hover:rotate-180" />
            
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
                      <Icon name="mapPin" size="sm" className="text-brand-yellow" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-semibold truncate">{location.name}</div>
                      <div className="text-brand-textDim text-[10px]">{location.area}, {location.city}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-[10px] text-green-400">
                          Open
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
          {/* PWA Install Button */}
          {showInstallButton && deferredPrompt && (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 bg-white/10 text-white px-4 py-2.5 rounded-md font-display font-semibold text-sm tracking-wide hover:bg-white/20 transition-all border border-white/20 hover:border-brand-yellow"
                title="Install HH Asia Tyre App"
              >
                <Icon name="download" size="sm" />
                <span>Install App</span>
              </button>
              <button
                onClick={handleDismissInstall}
                className="text-brand-textMuted hover:text-white p-1 transition-colors"
                title="Dismiss"
              >
                <Icon name="x" size="sm" />
              </button>
            </div>
          )}

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
          {isMenuOpen ? <Icon name="x" size="lg" /> : <Icon name="menu" size="lg" />}
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
              <Icon name="chevronDown" size="sm" className={`transition-transform ${activeDropdown === 'mobile-services' ? 'rotate-180' : ''}`} />
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
              <Icon name="chevronDown" size="sm" className={`transition-transform ${activeDropdown === 'mobile-locations' ? 'rotate-180' : ''}`} />
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
          
          {/* Mobile PWA Install Button */}
          {showInstallButton && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="flex items-center justify-center gap-2 mt-4 bg-white/10 text-white px-6 py-3 rounded-md font-display font-semibold uppercase tracking-wider border border-white/20 hover:bg-white/20 transition-all"
            >
              <Icon name="download" size="md" />
              <span>Install App</span>
            </button>
          )}
          
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
