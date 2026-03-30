import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { locations, vehicleMakes, timeSlots, services } from '../data/mockData';

function BookingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    // Step 1: Vehicle
    vehicleYear: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleTrim: '',
    
    // Step 2: Services
    selectedServices: [],
    
    // Step 3: Location & Time
    selectedLocation: '',
    selectedDate: '',
    selectedTime: '',
    
    // Step 4: Customer Details
    fullName: '',
    email: '',
    phone: '',
    mileage: '',
    specialRequests: '',
  });

  const updateBooking = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = () => {
    // In a real app, this would submit to an API
    console.log('Booking submitted:', bookingData);
    navigate('/confirmation', { state: { bookingData } });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return bookingData.vehicleYear && bookingData.vehicleMake && bookingData.vehicleModel;
      case 2:
        return bookingData.selectedServices.length > 0;
      case 3:
        return bookingData.selectedLocation && bookingData.selectedDate && bookingData.selectedTime;
      case 4:
        return bookingData.fullName && bookingData.email && bookingData.phone;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-brand-black py-4" style={{ backgroundColor: '#000000' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {['Vehicle', 'Services', 'Location & Time', 'Your Details', 'Confirm'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      index + 1 <= currentStep
                        ? 'bg-brand-yellow text-brand-black'
                        : 'bg-gray-600 text-gray-400'
                    }`}
                  >
                    {index + 1 < currentStep ? '✓' : index + 1}
                  </div>
                  <span
                    className={`ml-2 text-sm hidden sm:block ${
                      index + 1 <= currentStep ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {index < 4 && (
                  <div
                    className={`w-12 sm:w-20 h-0.5 mx-2 ${
                      index + 1 < currentStep ? 'bg-brand-yellow' : 'bg-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Step 1: Vehicle Selection */}
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-brand-black mb-6">Select Your Vehicle</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                  <select
                    value={bookingData.vehicleYear}
                    onChange={(e) => updateBooking('vehicleYear', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  >
                    <option value="">Select Year</option>
                    {Array.from({ length: 15 }, (_, i) => 2026 - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Make *</label>
                  <select
                    value={bookingData.vehicleMake}
                    onChange={(e) => updateBooking('vehicleMake', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  >
                    <option value="">Select Make</option>
                    {vehicleMakes.map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                  <input
                    type="text"
                    value={bookingData.vehicleModel}
                    onChange={(e) => updateBooking('vehicleModel', e.target.value)}
                    placeholder="e.g., Camry, Civic, Montero"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trim</label>
                  <input
                    type="text"
                    value={bookingData.vehicleTrim}
                    onChange={(e) => updateBooking('vehicleTrim', e.target.value)}
                    placeholder="e.g., XE, LX, Sport"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">
                  💡 <strong>Tip:</strong> Don't know your exact model? You can manually enter details in the next step.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Service Selection */}
          {currentStep === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-brand-black mb-6">Select Services</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      const isSelected = bookingData.selectedServices.includes(service.name);
                      if (isSelected) {
                        updateBooking('selectedServices', bookingData.selectedServices.filter(s => s !== service.name));
                      } else {
                        updateBooking('selectedServices', [...bookingData.selectedServices, service.name]);
                      }
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      bookingData.selectedServices.includes(service.name)
                        ? 'border-brand-yellow bg-yellow-50'
                        : 'border-gray-200 hover:border-brand-yellow'
                    }`}
                  >
                    <div className={`text-2xl mb-2 ${
                      bookingData.selectedServices.includes(service.name) ? 'text-brand-yellow' : 'text-gray-400'
                    }`}>
                      {service.icon === 'tyre' && '🛞'}
                      {service.icon === 'oil' && '🛢️'}
                      {service.icon === 'battery' && '🔋'}
                      {service.icon === 'brakes' && '🔧'}
                      {service.icon === 'clutch' && '⚙️'}
                      {service.icon === 'maintenance' && '🔨'}
                      {service.icon === 'aircon' && '❄️'}
                      {service.icon === 'suspension' && '📍'}
                      {service.icon === 'transmission' && '🔩'}
                    </div>
                    <div className="font-medium text-sm">{service.name}</div>
                  </button>
                ))}
              </div>

              {bookingData.selectedServices.length === 0 && (
                <p className="text-red-500 text-sm">Please select at least one service</p>
              )}
            </div>
          )}

          {/* Step 3: Location & Time */}
          {currentStep === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-brand-black mb-6">Choose Location & Time</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Location *</label>
                <select
                  value={bookingData.selectedLocation}
                  onChange={(e) => updateBooking('selectedLocation', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                >
                  <option value="">Choose a location</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} - {loc.area} {loc.status === 'coming-soon' ? '(Coming Soon)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date *</label>
                  <input
                    type="date"
                    value={bookingData.selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => updateBooking('selectedDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Time *</label>
                  <select
                    value={bookingData.selectedTime}
                    onChange={(e) => updateBooking('selectedTime', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  >
                    <option value="">Choose a time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  🕐 <strong>Business Hours:</strong> 8:00 AM - 6:00 PM, Monday to Saturday
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Customer Details */}
          {currentStep === 4 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-brand-black mb-6">Your Details</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={bookingData.fullName}
                    onChange={(e) => updateBooking('fullName', e.target.value)}
                    placeholder="Juan Dela Cruz"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={bookingData.phone}
                    onChange={(e) => updateBooking('phone', e.target.value)}
                    placeholder="0917 123 4567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => updateBooking('email', e.target.value)}
                  placeholder="juan@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Mileage (km)</label>
                <input
                  type="number"
                  value={bookingData.mileage}
                  onChange={(e) => updateBooking('mileage', e.target.value)}
                  placeholder="e.g., 50000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                <textarea
                  value={bookingData.specialRequests}
                  onChange={(e) => updateBooking('specialRequests', e.target.value)}
                  placeholder="Any specific concerns or requests..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                />
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 5 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-brand-black mb-6">Confirm Booking</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">🚗 Vehicle</h3>
                  <p className="text-gray-600">
                    {bookingData.vehicleYear} {bookingData.vehicleMake} {bookingData.vehicleModel}
                    {bookingData.vehicleTrim && ` ${bookingData.vehicleTrim}`}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">🔧 Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {bookingData.selectedServices.map(service => (
                      <span key={service} className="bg-brand-yellow/20 text-brand-black px-3 py-1 rounded-full text-sm">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">📍 Location & Time</h3>
                  <p className="text-gray-600">
                    {locations.find(l => l.id === bookingData.selectedLocation)?.name}
                  </p>
                  <p className="text-gray-600">
                    {bookingData.selectedDate} at {bookingData.selectedTime}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">👤 Contact</h3>
                  <p className="text-gray-600">{bookingData.fullName}</p>
                  <p className="text-gray-600">{bookingData.phone}</p>
                  <p className="text-gray-600">{bookingData.email}</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  📧 You will receive a confirmation email and SMS shortly after booking.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {currentStep > 1 ? (
              <button
                onClick={prevStep}
                className="px-6 py-3 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ← Back
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 5 ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`px-8 py-3 rounded-md font-semibold transition-all ${
                  isStepValid()
                    ? 'bg-brand-yellow text-brand-black hover:bg-yellow-400'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className={`px-8 py-3 rounded-md font-semibold transition-all ${
                  isStepValid()
                    ? 'bg-brand-yellow text-brand-black hover:bg-yellow-400'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Confirm Booking ✓
              </button>
            )}
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a href="/" className="text-gray-600 hover:text-brand-yellow transition-colors">
            ← Go back to Home Page
          </a>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
