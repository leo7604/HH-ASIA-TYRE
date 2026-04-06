import { useLocation, Link } from 'react-router-dom';

function ConfirmationPage() {
  const location = useLocation();
  const { bookingData, apiResponse } = location.state || {};

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
                <li className="flex items-start gap-2">
                  <span className="text-brand-yellow">✓</span>
                  <span>A confirmation email has been sent to {bookingData?.email}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-yellow">✓</span>
                  <span>You'll receive an SMS reminder 24 hours before your appointment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-yellow">✓</span>
                  <span>Please arrive 10 minutes early for check-in</span>
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
      </div>
    </div>
  );
}

export default ConfirmationPage;
