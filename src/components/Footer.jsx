import { Link } from 'react-router-dom';
import PWAInstallPrompt from './PWAInstallPrompt';
import { useToast } from './ToastProvider';

function Footer() {
  const currentYear = new Date().getFullYear();
  const toast = useToast();

  const showToastDemo = () => {
    const types = ['success', 'error', 'warning', 'info'];
    const messages = [
      'Booking confirmed successfully!',
      'Failed to save changes. Please try again.',
      'Your session will expire in 5 minutes.',
      'New appointment request received.'
    ];
    const randomIndex = Math.floor(Math.random() * types.length);
    toast[types[randomIndex]](messages[randomIndex]);
  };

  return (
    <footer className="bg-brand-card border-t border-brand-border py-12 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 cursor-pointer group mb-4">
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
          
          {/* Toast Demo Button - Remove in production */}
          <button
            onClick={showToastDemo}
            className="mt-4 px-4 py-2 bg-brand-yellow/10 hover:bg-brand-yellow/20 text-brand-yellow rounded-md text-xs font-semibold transition-colors border border-brand-yellow/30"
          >
            🎉 Test Toast Notification
          </button>
        </div>
      </div>

      {/* PWA Install Prompt (Automatic - shows after 5 seconds) */}
      <PWAInstallPrompt />
    </footer>
  );
}

export default Footer;
