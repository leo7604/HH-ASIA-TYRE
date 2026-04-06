import { useState } from 'react';
import { Link } from 'react-router-dom';
import { locations, services } from '../data/mockData';

function LocationsSection() {
  const [selectedBranch, setSelectedBranch] = useState(null);

  // Get services for selected branch
  const branchServices = selectedBranch 
    ? services.filter(s => 
        selectedBranch.services.some(bs => 
          bs.toLowerCase().includes(s.name.toLowerCase()) || 
          s.name.toLowerCase().includes(bs.toLowerCase())
        )
      )
    : [];

  return (
    <section id="locations" className="py-24 px-6 bg-gradient-to-b from-brand-black to-brand-card">
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-[0.72rem] font-bold tracking-[0.14em] uppercase text-brand-yellow mb-3">
            Our Locations
          </div>
          <h2 className="font-display font-bold uppercase text-white mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Find a <span className="text-brand-yellow">Branch</span>
          </h2>
          <p className="text-brand-textMuted max-w-[520px] mx-auto leading-relaxed">
            Select a branch to view available services.
          </p>
        </div>

        {/* Branch Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {locations.map((location) => (
            <div
              key={location.id}
              onClick={() => setSelectedBranch(selectedBranch?.id === location.id ? null : location)}
              className={`bg-brand-card border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                selectedBranch?.id === location.id
                  ? 'border-brand-yellow shadow-[0_0_40px_rgba(255,215,0,0.2)] -translate-y-1'
                  : 'border-brand-border hover:border-brand-yellow/40 hover:-translate-y-0.5'
              }`}
            >
              {/* Branch Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={location.image}
                  alt={`${location.name} - HH Asia Tyre auto service center ${location.area} Philippines`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  {location.status === 'open' ? (
                    <span className="bg-green-500 text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
                      Open
                    </span>
                  ) : (
                    <span className="bg-gray-500 text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>

              {/* Branch Info */}
              <div className="p-5">
                <h3 className="font-display font-bold uppercase text-white text-lg mb-2">
                  {location.name}
                </h3>
                <p className="text-brand-textMuted text-sm mb-3">
                  📍 {location.area}, {location.city}
                </p>
                
                {/* Google Reviews Stars */}
                {location.rating && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(location.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-600'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-white text-sm font-bold">
                      {location.rating.toFixed(1)}
                    </span>
                    <span className="text-brand-textDim text-xs">
                      ({location.reviewCount} Google reviews)
                    </span>
                  </div>
                )}
                
                <p className="text-brand-textDim text-xs mb-4">
                  ⏰ {location.hours}
                </p>

                {/* Service Count Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-brand-yellow text-xs font-bold uppercase">
                    {location.services.length} Services Available
                  </span>
                  <svg 
                    className={`w-5 h-5 text-brand-yellow transition-transform ${
                      selectedBranch?.id === location.id ? 'rotate-180' : ''
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expanded Services List */}
              {selectedBranch?.id === location.id && (
                <div className="border-t border-brand-border p-5 bg-brand-raised animate-fade-up">
                  <h4 className="font-display font-bold uppercase text-white text-sm mb-3">
                    Available Services
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {branchServices.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center gap-2 bg-brand-card border border-brand-border rounded-lg px-3 py-2"
                      >
                        <div className="w-2 h-2 bg-brand-yellow rounded-full flex-shrink-0" />
                        <span className="text-brand-textMuted text-xs">{service.name}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Review Source Badge */}
                  <div className="mt-4 pt-4 border-t border-brand-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <span className="text-brand-textDim text-xs">Reviews from Google</span>
                    </div>
                    <a
                      href={location.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-yellow text-xs font-bold uppercase hover:underline flex items-center gap-1"
                    >
                      Read More
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                  
                  {/* CTA Button */}
                  <Link
                    to={`/book?branch=${location.id}`}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-brand-yellow text-black px-6 py-3 rounded-md font-display font-bold uppercase tracking-wider text-sm hover:bg-yellow-400 transition-all"
                  >
                    Book This Branch
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* View All Branches Link */}
        <div className="text-center">
          <Link
            to="/branches"
            className="inline-flex items-center gap-2 text-brand-yellow font-display font-bold uppercase tracking-wider text-sm hover:underline"
          >
            View Complete Branch Details
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default LocationsSection;
