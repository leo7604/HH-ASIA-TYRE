import { useState, useEffect } from 'react';

function PWAInstallPrompt({ forceShow = false }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Force show for testing
    if (forceShow) {
      setShowPrompt(true);
      return;
    }

    // Check if user has already dismissed the prompt
    const hasDismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (hasDismissed) return;

    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome from showing the default prompt
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e);
      // Show prompt after 5 seconds of engagement
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for 30 days
    localStorage.setItem('pwa-prompt-dismissed', 'true');
    setTimeout(() => {
      localStorage.removeItem('pwa-prompt-dismissed');
    }, 30 * 24 * 60 * 60 * 1000);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-brand-black text-white rounded-xl shadow-2xl p-4 z-50 animate-slide-up" style={{ backgroundColor: '#000000' }}>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-brand-yellow rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-7 h-7 text-brand-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-4 4 4h-3v4h-2z"/>
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-lg mb-1">Install HH Asia App</h4>
          <p className="text-sm text-gray-300 mb-3">
            Get quick access to booking and exclusive mobile-only deals!
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 bg-brand-yellow text-brand-black py-2 px-4 rounded-md font-semibold hover:bg-yellow-400 transition-colors text-sm"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              Later
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-white p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default PWAInstallPrompt;
