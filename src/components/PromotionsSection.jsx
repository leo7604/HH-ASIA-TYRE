import { Link } from 'react-router-dom';

function PromotionsSection() {
  const promotions = [
    {
      id: 1,
      brand: 'Cooper',
      title: 'FREE 4TH TIRE',
      subtitle: '+ FREE INSTALLATION',
      savings: 'SAVE UP TO ₱2,100',
      description: 'when you buy & install 4 Cooper Adventurer All-Season tires',
      validity: 'Valid 3/1/26 - 4/30/26',
      image: 'https://images.unsplash.com/photo-1578844251758-2f71da645217?w=800&h=500&fit=crop&q=80',
      cta: 'Claim Offer',
      featured: true
    },
    {
      id: 2,
      brand: 'Goodyear',
      title: 'FREE INSTALLATION',
      subtitle: 'SAVE ₱1,200',
      savings: '',
      description: 'when you buy & install 4 tires from Goodyear',
      validity: 'Valid 3/2/26 - 4/6/26',
      image: 'https://images.unsplash.com/photo-1597762696664-2c8e71c46f5d?w=800&h=500&fit=crop&q=80',
      cta: 'Shop Goodyear',
      featured: false
    },
    {
      id: 3,
      brand: 'Michelin',
      title: 'INSTANT + REBATE',
      subtitle: '₱2,800 TOTAL SAVINGS',
      savings: '',
      description: 'Get instant savings and mail-in rebate on Michelin sets',
      validity: 'Valid through 4/15/26',
      image: 'https://images.unsplash.com/photo-1543467978-02835c649dd1?w=800&h=500&fit=crop&q=80',
      cta: 'Get Rebate',
      featured: false
    }
  ];

  const featuredPromo = promotions.find(p => p.featured);
  const sidePromos = promotions.filter(p => !p.featured);

  return (
    <section id="promotions" className="py-12 px-4 md:py-16 md:px-6 bg-gradient-to-b from-brand-black to-brand-card">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="text-[0.72rem] font-bold tracking-[0.14em] uppercase text-brand-yellow mb-2">
            Special Offers & Coupons
          </div>
          <h2 className="font-display font-bold uppercase text-white text-xl md:text-2xl mb-4">
            Current <span className="text-brand-yellow">Promotions</span>
          </h2>
        </div>

        {/* Promo Grid - Featured Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Featured Promo - Left Large Card */}
          {featuredPromo && (
            <div 
              className="lg:col-span-2 relative border-2 border-brand-border rounded-xl overflow-hidden hover:border-brand-yellow/50 transition-colors group h-[400px] md:h-[450px]"
              style={{ 
                backgroundImage: `url(${featuredPromo.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
              
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
                <div className="text-brand-textDim text-[10px] font-bold uppercase mb-2">
                  {featuredPromo.brand}
                </div>
                <h3 className="font-display font-black uppercase text-white text-2xl md:text-4xl mb-2 leading-tight">
                  {featuredPromo.title}
                </h3>
                {featuredPromo.subtitle && (
                  <p className="font-bold text-brand-yellow text-base md:text-xl mb-3 uppercase">
                    {featuredPromo.subtitle}
                  </p>
                )}
                <p className="text-brand-textMuted text-sm md:text-base mb-4 max-w-lg">
                  {featuredPromo.description}
                </p>
                <div className="inline-block bg-brand-yellow/20 border border-brand-yellow/40 rounded-lg px-4 py-3 mb-6 w-fit backdrop-blur-sm">
                  <div className="font-bold text-brand-yellow text-lg md:text-xl">
                    {featuredPromo.savings}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    to="/book"
                    className="inline-block bg-brand-yellow text-brand-black px-8 py-3 rounded font-display font-bold uppercase text-sm text-center hover:bg-yellow-400 transition-colors"
                  >
                    {featuredPromo.cta}
                  </Link>
                  <p className="text-brand-textDim text-[10px]">
                    {featuredPromo.validity}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Side Promos - Right Stacked Cards */}
          <div className="flex flex-col gap-4">
            {sidePromos.map((promo) => (
              <div
                key={promo.id}
                className="flex-1 relative border border-brand-border rounded-lg overflow-hidden hover:border-brand-yellow/50 transition-colors group h-[200px]"
                style={{ 
                  backgroundImage: `url(${promo.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-transparent" />
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-end p-4">
                  <div className="text-brand-textDim text-[10px] font-bold uppercase mb-1">
                    {promo.brand}
                  </div>
                  <h3 className="font-display font-black uppercase text-white text-lg md:text-xl mb-1 leading-tight">
                    {promo.title}
                  </h3>
                  {promo.subtitle && (
                    <p className="font-bold text-brand-yellow text-sm uppercase mb-2">
                      {promo.subtitle}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-auto">
                    <Link
                      to="/book"
                      className="inline-block bg-brand-yellow text-brand-black px-5 py-2 rounded font-display font-bold uppercase text-xs hover:bg-yellow-400 transition-colors"
                    >
                      {promo.cta}
                    </Link>
                    <p className="text-brand-textDim text-[10px]">
                      {promo.validity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Credit Card Offer */}
        <div className="bg-brand-raised border border-brand-yellow/40 rounded-lg p-6 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-brand-yellow/20 border border-brand-yellow/40 rounded-full px-4 py-2 mb-4">
              <svg className="w-4 h-4 text-brand-yellow" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-brand-yellow text-xs font-bold uppercase">Exclusive Credit Card Offer</span>
            </div>
            
            <h3 className="font-display font-black uppercase text-white mb-2" style={{ fontSize: 'clamp(1.25rem, 4vw, 2rem)' }}>
              GET <span className="text-brand-yellow">10% BACK</span> (UP TO ₱5,000)
            </h3>
            <p className="text-brand-textMuted text-sm md:text-base mb-4">
              Via Visa® Prepaid Card by mail or email* when you spend ₱2,500 or more with your HH Asia credit card.
            </p>
            
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                to="/book"
                className="bg-brand-yellow text-brand-black px-6 py-2.5 rounded font-display font-bold uppercase text-xs hover:bg-yellow-400 transition-colors"
              >
                Apply Now
              </Link>
              <Link
                to="/contact"
                className="border-2 border-brand-yellow text-brand-yellow px-6 py-2.5 rounded font-display font-bold uppercase text-xs hover:bg-brand-yellow/10 transition-colors"
              >
                Learn More
              </Link>
            </div>
            <p className="text-brand-textDim text-[10px] mt-3">
              *Ends 3/31/26. Terms apply. See details.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PromotionsSection;
