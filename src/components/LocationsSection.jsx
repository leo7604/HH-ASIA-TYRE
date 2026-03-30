import { Link } from 'react-router-dom';
import { locations } from '../data/mockData';

const manilaLocations = locations.filter(l => l.city === 'Metro Manila' || l.city === 'Cavite');
const laoagLocations = locations.filter(l => l.city === 'Ilocos Norte');

function LocationsSection() {
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
            Conveniently located branches across Metro Manila, Cavite, and Ilocos Norte.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
          <div className="text-center bg-brand-card border border-brand-border rounded-xl p-4">
            <div className="font-display font-black text-3xl text-brand-yellow">5</div>
            <div className="text-xs text-brand-textMuted uppercase tracking-wider mt-1">Total Branches</div>
          </div>
          <div className="text-center bg-brand-card border border-brand-border rounded-xl p-4">
            <div className="font-display font-black text-3xl text-brand-yellow">3</div>
            <div className="text-xs text-brand-textMuted uppercase tracking-wider mt-1">Manila Area</div>
          </div>
          <div className="text-center bg-brand-card border border-brand-border rounded-xl p-4">
            <div className="font-display font-black text-3xl text-brand-yellow">2</div>
            <div className="text-xs text-brand-textMuted uppercase tracking-wider mt-1">Laoag Area</div>
          </div>
        </div>

        {/* Manila Branches */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-1 bg-brand-yellow" />
            <div>
              <h3 className="font-display font-bold uppercase text-white text-2xl">
                Metro Manila <span className="text-brand-yellow">& Cavite</span>
              </h3>
              <p className="text-brand-textMuted text-sm">3 branches serving the capital region</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {manilaLocations.map((location) => (
              <div
                key={location.id}
                className="group bg-brand-card border border-brand-border rounded-xl overflow-hidden transition-all duration-300 hover:border-brand-yellow/40 hover:shadow-[0_0_40px_rgba(255,215,0,0.15)] hover:-translate-y-1"
              >
                {/* Map Image */}
                <div className="relative h-40 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${location.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-brand-card/50 to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    {location.status === 'open' ? (
                      <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 rounded-full px-3 py-1.5">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Open</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-gray-500/20 border border-gray-500/40 rounded-full px-3 py-1.5">
                        <div className="w-2 h-2 bg-gray-500 rounded-full" />
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Coming Soon</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="font-display font-bold uppercase text-white text-lg mb-2">
                    {location.name}
                  </h3>
                  
                  {/* Area Badge */}
                  <div className="inline-flex items-center gap-2 bg-brand-raised border border-brand-border rounded-full px-3 py-1 mb-3">
                    <svg className="w-3.5 h-3.5 text-brand-yellow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-brand-textMuted text-xs">{location.area}, {location.city}</span>
                  </div>

                  {/* Address */}
                  <p className="text-brand-textMuted text-sm mb-4 line-clamp-2">
                    {location.address}
                  </p>

                  {/* Hours */}
                  <div className="flex items-center gap-2 text-brand-textDim text-xs mb-4 pb-4 border-b border-brand-border">
                    <svg className="w-4 h-4 text-brand-yellow flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 3" />
                    </svg>
                    <span>{location.hours}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to="/book"
                      className={`flex-1 text-center py-2.5 rounded-md font-display font-bold uppercase tracking-wider text-sm transition-all ${
                        location.status === 'open'
                          ? 'bg-brand-yellow text-black hover:bg-yellow-400'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {location.status === 'open' ? 'Book Now' : 'Coming Soon'}
                    </Link>
                    <a
                      href={location.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-brand-raised text-white text-center py-2.5 rounded-md font-display font-bold uppercase tracking-wider text-sm border border-brand-border hover:border-brand-yellow transition-all"
                    >
                      Map
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Laoag Branches */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-1 bg-brand-yellow" />
            <div>
              <h3 className="font-display font-bold uppercase text-white text-2xl">
                Ilocos <span className="text-brand-yellow">Norte</span>
              </h3>
              <p className="text-brand-textMuted text-sm">2 branches serving Northern Luzon</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {laoagLocations.map((location) => (
              <div
                key={location.id}
                className="group bg-brand-card border border-brand-border rounded-xl overflow-hidden transition-all duration-300 hover:border-brand-yellow/40 hover:shadow-[0_0_40px_rgba(255,215,0,0.15)] hover:-translate-y-1"
              >
                {/* Map Image */}
                <div className="relative h-48 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${location.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-brand-card/50 to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    {location.status === 'open' ? (
                      <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 rounded-full px-3 py-1.5">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Open</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-gray-500/20 border border-gray-500/40 rounded-full px-3 py-1.5">
                        <div className="w-2 h-2 bg-gray-500 rounded-full" />
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Coming Soon</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="font-display font-bold uppercase text-white text-lg mb-2">
                    {location.name}
                  </h3>
                  
                  {/* Area Badge */}
                  <div className="inline-flex items-center gap-2 bg-brand-raised border border-brand-border rounded-full px-3 py-1 mb-3">
                    <svg className="w-3.5 h-3.5 text-brand-yellow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-brand-textMuted text-xs">{location.area}, {location.city}</span>
                  </div>

                  {/* Address */}
                  <p className="text-brand-textMuted text-sm mb-4 line-clamp-2">
                    {location.address}
                  </p>

                  {/* Hours */}
                  <div className="flex items-center gap-2 text-brand-textDim text-xs mb-4 pb-4 border-b border-brand-border">
                    <svg className="w-4 h-4 text-brand-yellow flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 3" />
                    </svg>
                    <span>{location.hours}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to="/book"
                      className={`flex-1 text-center py-2.5 rounded-md font-display font-bold uppercase tracking-wider text-sm transition-all ${
                        location.status === 'open'
                          ? 'bg-brand-yellow text-black hover:bg-yellow-400'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {location.status === 'open' ? 'Book Now' : 'Coming Soon'}
                    </Link>
                    <a
                      href={location.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-brand-raised text-white text-center py-2.5 rounded-md font-display font-bold uppercase tracking-wider text-sm border border-brand-border hover:border-brand-yellow transition-all"
                    >
                      Map
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="relative bg-gradient-to-br from-brand-yellow/15 via-brand-yellow/8 to-brand-yellow/5 border border-brand-yellow/30 rounded-2xl p-10 md:p-12 text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-brand-yellow to-transparent" />
          
          <div className="relative z-10">
            <h3 className="font-display font-black uppercase text-white mb-3" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
              Can't Visit a <span className="text-brand-yellow">Branch</span>?
            </h3>
            <p className="text-brand-textMuted text-base mb-6 max-w-xl mx-auto">
              We offer 24/7 roadside assistance for emergencies.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="tel:18004427421"
                className="inline-flex items-center gap-2 bg-brand-yellow text-black px-8 py-3.5 rounded-md font-display font-bold uppercase tracking-wider text-sm hover:bg-yellow-400 transition-all shadow-[0_0_24px_rgba(255,215,0,0.3)] hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                Call Roadside Assistance
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-brand-yellow text-brand-yellow px-8 py-3 rounded-md font-display font-bold uppercase tracking-wider text-sm hover:bg-brand-yellow/10 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LocationsSection;
