import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ConfirmationPage() {
  const location = useLocation();
  const { bookingData, apiResponse, apiSuccess } = location.state || {};
  const [showPWAInstall, setShowPWAInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Setup PWA install after booking confirmation
  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if user dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show install button after 2 seconds (let user see confirmation first)
      setTimeout(() => {
        setShowPWAInstall(true);
      }, 2000);
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
      setShowPWAInstall(false);
      setDeferredPrompt(null);
    } else {
      localStorage.setItem('pwa-install-dismissed', Date.now().toString());
      setShowPWAInstall(false);
    }
  };

  const handleDismissInstall = () => {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    setShowPWAInstall(false);
  };

  // Use confirmation number from API response, or generate fallback
  const confirmationNumber = apiResponse?.data?.confirmationNumber || `HH${Date.now().toString().slice(-8)}`;
  const bookingDate = new Date().toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-8 px-6 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-green-100">Your appointment has been scheduled successfully</p>
          </div>

          {/* Confirmation Details */}
          <div className="p-6">
            {/* Confirmation Number */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-center">
              <p className="text-sm text-yellow-800 mb-1">Confirmation Number</p>
              <p className="text-2xl font-bold text-brand-black">{confirmationNumber}</p>
            </div>

            {/* API Status Warning */}
            {apiSuccess === false && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-1">Booking Saved Locally</p>
                    <p className="text-xs text-blue-700">
                      Your booking has been saved successfully. Our team will confirm your appointment shortly. 
                      You may also contact us directly to confirm.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Summary */}
            {bookingData && (
              <div className="space-y-4 mb-6">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Vehicle</span>
                  <span className="font-medium text-brand-black">
                    {bookingData.vehicleYear} {bookingData.vehicleMake} {bookingData.vehicleModel}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Services</span>
                  <span className="font-medium text-brand-black text-right">
                    {bookingData.selectedServices.join(', ')}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Date & Time</span>
                  <span className="font-medium text-brand-black">
                    {bookingData.selectedDate} at {bookingData.selectedTime}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium text-brand-black text-right">
                    {bookingData.selectedLocation}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium text-brand-black">{bookingData.fullName}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Contact</span>
                  <span className="font-medium text-brand-black">{bookingData.phone}</span>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-brand-black mb-3">What's Next?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {apiSuccess ? (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-yellow">✓</span>
                      <span>A confirmation email has been sent to {bookingData?.email}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-yellow">✓</span>
                      <span>You'll receive an SMS reminder 24 hours before your appointment</span>
                    </li>
                  </>
                ) : (
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">ℹ</span>
                    <span>Please contact us to confirm your booking details</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-brand-yellow">✓</span>
                  <span>Please arrive 10 minutes early for check-in</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-yellow">✓</span>
                  <span>Bring your confirmation number for faster processing</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/"
                className="flex-1 bg-brand-yellow text-brand-black text-center py-3 rounded-md font-semibold hover:bg-yellow-400 transition-colors"
              >
                Back to Home
              </Link>
              <button
                onClick={() => window.print()}
                className="flex-1 border border-gray-300 text-gray-700 text-center py-3 rounded-md font-semibold hover:bg-gray-50 transition-colors"
              >
                Print Confirmation
              </button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Need to reschedule or cancel?</p>
          <p className="font-semibold">Call us: 1-800-HH-ASIA (442-7421)</p>
        </div>

        {/* Booking Date */}
        <p className="mt-4 text-center text-xs text-gray-400">
          Booked on {bookingDate}
        </p>

        {/* PWA Install Banner - Shows after booking */}
        {showPWAInstall && deferredPrompt && (
          <div className="mt-8 bg-gradient-to-r from-brand-yellow to-yellow-400 rounded-xl shadow-lg p-6 animate-fade-up">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-brand-yellow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-4 4 4h-3v4h-2z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-brand-black mb-1">Install HH Asia Tyre App</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Get quick access to your bookings, exclusive deals, and appointment reminders!
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleInstallClick}
                    className="flex-1 bg-brand-black text-brand-yellow py-3 px-6 rounded-md font-bold uppercase tracking-wider hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
                  >
                    Install App
                  </button>
                  <button
                    onClick={handleDismissInstall}
                    className="px-6 py-3 text-gray-600 hover:text-brand-black font-semibold transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
              <button
                onClick={handleDismissInstall}
                className="text-gray-600 hover:text-brand-black p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConfirmationPage;
