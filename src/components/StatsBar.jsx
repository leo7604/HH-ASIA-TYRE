function StatsBar() {
  return (
    <div className="bg-brand-card border-y border-brand-border py-10">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="font-display font-black text-5xl text-brand-yellow leading-none">10K+</div>
            <div className="text-xs text-brand-textMuted uppercase tracking-wider mt-1.5">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="font-display font-black text-5xl text-brand-yellow leading-none">5</div>
            <div className="text-xs text-brand-textMuted uppercase tracking-wider mt-1.5">Branches</div>
          </div>
          <div className="text-center">
            <div className="font-display font-black text-5xl text-brand-yellow leading-none">15+</div>
            <div className="text-xs text-brand-textMuted uppercase tracking-wider mt-1.5">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="font-display font-black text-5xl text-brand-yellow leading-none">50+</div>
            <div className="text-xs text-brand-textMuted uppercase tracking-wider mt-1.5">Tyre Brands</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsBar;
