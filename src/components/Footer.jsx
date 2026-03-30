import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-card border-t border-brand-border py-12 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 cursor-pointer mb-4">
              <div className="w-[38px] h-[38px] bg-brand-yellow rounded-lg flex items-center justify-center font-display font-black text-lg text-white shadow-[0_0_16px_rgba(255,215,0,0.3)]">
                HH
              </div>
              <div className="font-display font-bold text-xl tracking-wide text-white">
                Asia <span className="text-brand-yellow">Tyre</span>
              </div>
            </Link>
            <p className="text-brand-textMuted text-sm leading-relaxed max-w-[300px]">
              Premium tyre and auto services trusted by thousands of drivers across the Philippines.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="text-brand-textMuted text-sm hover:text-brand-yellow transition-colors">Services</a></li>
              <li><a href="#locations" className="text-brand-textMuted text-sm hover:text-brand-yellow transition-colors">Branches</a></li>
              <li><a href="#promotions" className="text-brand-textMuted text-sm hover:text-brand-yellow transition-colors">Promotions</a></li>
              <li><a href="#contact" className="text-brand-textMuted text-sm hover:text-brand-yellow transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-brand-textMuted text-sm">
              <li>Manila: (02) 8123-4567</li>
              <li>Laoag: (077) 771-2345</li>
              <li>service@hhasiatyre.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-border pt-6 text-center text-brand-textDim text-sm">
          <p>© {currentYear} HH Asia Tyre Alliance Plus+. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
