import { advantages } from '../data/mockData';

const advantageIcons = {
  inspection: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M9 12l2 2 4-4" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
  pricing: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v12M8 10h8M8 14h8" />
    </svg>
  ),
  mobile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" />
    </svg>
  ),
  certified: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <circle cx="12" cy="8" r="4" />
      <path d="M12 14v8M8 18h8" />
      <path d="M4 10l2-2M20 10l-2-2" />
    </svg>
  ),
};

function AdvantagesSection() {
  return (
    <section id="about" className="py-24 px-6 bg-gradient-to-b from-brand-black to-brand-card">
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-[0.72rem] font-bold tracking-[0.14em] uppercase text-brand-yellow mb-3">
            Why Choose Us
          </div>
          <h2 className="font-display font-bold uppercase text-white mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            The HH Asia <span className="text-brand-yellow">Advantage</span>
          </h2>
          <p className="text-brand-textMuted max-w-2xl mx-auto leading-relaxed">
            Here's what you can count on with every service.
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1100px] mx-auto mb-12">
          {advantages.map((advantage) => (
            <div
              key={advantage.id}
              className="text-center group bg-brand-card border border-brand-border rounded-xl p-8 transition-all duration-300 hover:border-brand-yellow/40 hover:shadow-[0_0_40px_rgba(255,215,0,0.1)] hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 bg-brand-yellow/10 border border-brand-yellow/25 rounded-xl flex items-center justify-center text-brand-yellow group-hover:bg-brand-yellow group-hover:text-black transition-all duration-300">
                {advantageIcons[advantage.icon]}
              </div>

              {/* Title */}
              <h3 className="font-display font-bold text-white text-lg mb-2">
                {advantage.title}
              </h3>

              {/* Description */}
              <p className="text-brand-textMuted text-sm leading-relaxed">
                {advantage.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="bg-gradient-to-br from-brand-yellow/12 to-brand-yellow/6 border border-brand-yellow/20 rounded-xl p-8 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-display font-black text-4xl md:text-5xl text-brand-yellow leading-none mb-2">15+</div>
              <div className="text-xs text-brand-textMuted uppercase tracking-wider">Years Experience</div>
            </div>
            <div>
              <div className="font-display font-black text-4xl md:text-5xl text-brand-yellow leading-none mb-2">50K+</div>
              <div className="text-xs text-brand-textMuted uppercase tracking-wider">Vehicles Serviced</div>
            </div>
            <div>
              <div className="font-display font-black text-4xl md:text-5xl text-brand-yellow leading-none mb-2">5</div>
              <div className="text-xs text-brand-textMuted uppercase tracking-wider">Locations</div>
            </div>
            <div>
              <div className="font-display font-black text-4xl md:text-5xl text-brand-yellow leading-none mb-2">98%</div>
              <div className="text-xs text-brand-textMuted uppercase tracking-wider">Customer Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Partner Brands */}
        <div className="mt-12 text-center">
          <p className="text-brand-textDim text-xs uppercase tracking-widest mb-6">Trusted Partner Of</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-50">
            {['Goodyear', 'Cooper', 'Kumho', 'GT Radial', 'Bridgestone'].map((brand) => (
              <div key={brand} className="font-display font-bold text-xl text-brand-textMuted">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdvantagesSection;
