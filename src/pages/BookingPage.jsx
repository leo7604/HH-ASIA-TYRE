import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { locations, vehicleMakes, timeSlots, services } from '../data/mockData';
import Breadcrumbs from '../components/Breadcrumbs';
import { MAX_BOOKINGS_PER_SLOT } from '../utils/bookingService';

function BookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Pre-select branch from URL if provided
  const preselectedBranch = searchParams.get('branch');
  const preselectedStep = searchParams.get('step');
  
  const [bookingData, setBookingData] = useState({
    // Step 1: Region & Branch
    selectedRegion: '',
    selectedLocation: preselectedBranch || '',

    // Step 2: Vehicle
    vehicleYear: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleTrim: '',
    plateNumber: '',

    // Step 3: Services
    selectedServices: [],
    otherServices: '',

    // Step 4: Date & Time
    selectedDate: '',
    selectedTime: '',

    // Step 5: Customer Details
    fullName: '',
    email: '',
    phone: '',
    mileage: '',
    specialRequests: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [slotAvailability, setSlotAvailability] = useState({});
  const [checkingSlots, setCheckingSlots] = useState(false);

  // Filter branches by region
  const manilaBranches = locations.filter(l => l.city === 'Metro Manila' || l.city === 'Cavite');
  const laoagBranches = locations.filter(l => l.city === 'Ilocos Norte');
  
  const displayedBranches = bookingData.selectedRegion === 'manila' 
    ? manilaBranches 
    : bookingData.selectedRegion === 'laoag' 
      ? laoagBranches 
      : [];

  // Get selected branch details
  const selectedBranchDetails = locations.find(l => l.id === bookingData.selectedLocation);

  // If branch is preselected from URL, start at step 2 (vehicle details)
  useEffect(() => {
    if (preselectedBranch) {
      // Convert string ID to number for comparison
      const branchId = parseInt(preselectedBranch, 10);
      const branch = locations.find(l => l.id === branchId);
      
      if (branch) {
        const region = branch.city === 'Ilocos Norte' ? 'laoag' : 'manila';
        
        setBookingData(prev => ({ 
          ...prev, 
          selectedRegion: region,
          selectedLocation: preselectedBranch 
        }));
        
        // Skip branch selection, go straight to vehicle details
        setCurrentStep(2);
      }
    }
  }, [preselectedBranch]);

  const updateBooking = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateCurrentStep = () => {
    const errors = {};
    let isValid = true;

    switch (currentStep) {
      case 1:
        if (!bookingData.selectedRegion) {
          errors.selectedRegion = 'Please select a region';
          isValid = false;
        }
        if (!bookingData.selectedLocation) {
          errors.selectedLocation = 'Please select a branch';
          isValid = false;
        }
        break;
      case 2:
        if (!bookingData.vehicleYear) {
          errors.vehicleYear = 'Required';
          isValid = false;
        }
        if (!bookingData.vehicleMake) {
          errors.vehicleMake = 'Required';
          isValid = false;
        }
        if (!bookingData.vehicleModel) {
          errors.vehicleModel = 'Required';
          isValid = false;
        }
        if (!bookingData.plateNumber) {
          errors.plateNumber = 'Required';
          isValid = false;
        }
        break;
      case 3:
        if (bookingData.selectedServices.length === 0) {
          errors.selectedServices = 'Please select at least one service';
          isValid = false;
        }
        break;
      case 4:
        if (!bookingData.selectedDate) {
          errors.selectedDate = 'Required';
          isValid = false;
        } else {
          const selectedDate = new Date(bookingData.selectedDate);
          const phToday = getPhilippineToday();
          
          if (selectedDate < phToday) {
            errors.selectedDate = 'Cannot book past dates. Please select today or a future date.';
            isValid = false;
          }
          
          if (selectedDate.getFullYear() < phToday.getFullYear() || selectedDate.getFullYear() > phToday.getFullYear() + 1) {
            errors.selectedDate = `Please select a date in ${phToday.getFullYear()} or ${phToday.getFullYear() + 1}.`;
            isValid = false;
          }
        }
        if (!bookingData.selectedTime) {
          errors.selectedTime = 'Required';
          isValid = false;
        } else {
          const slotInfo = slotAvailability[bookingData.selectedTime];
          if (slotInfo && !slotInfo.available) {
            errors.selectedTime = 'This time slot is fully booked. Please select another time.';
            isValid = false;
          } else if (bookingData.selectedDate && isTimeSlotInPast(bookingData.selectedDate, bookingData.selectedTime)) {
            errors.selectedTime = 'Cannot book a time that has already passed. Please select a future time.';
            isValid = false;
          }
        }
        break;
      case 5:
        if (!bookingData.fullName.trim()) {
          errors.fullName = 'Required';
          isValid = false;
        }
        if (!bookingData.phone.trim()) {
          errors.phone = 'Required';
          isValid = false;
        } else if (!/^(\+63|0)?9\d{9}$/.test(bookingData.phone.replace(/\s/g, ''))) {
          errors.phone = 'Invalid Philippine mobile number';
          isValid = false;
        }
        if (!bookingData.email.trim()) {
          errors.email = 'Required';
          isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.email)) {
          errors.email = 'Invalid email format';
          isValid = false;
        }
        break;
    }

    setFormErrors(errors);
    return isValid;
  };

  const branchCodeMap = {
    1: 'MNL',
    2: 'MNL',
    3: 'MNL',
    4: 'MNL',
    5: 'MNL',
    6: 'LAO',
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const slotInfo = slotAvailability[bookingData.selectedTime];
      if (slotInfo && !slotInfo.available) {
        throw new Error('Sorry, this time slot was just booked. Please select another time.');
      }
      
      // Check if selected time has already passed
      if (isTimeSlotInPast(bookingData.selectedDate, bookingData.selectedTime)) {
        throw new Error('Cannot book a time that has already passed. Please select a future date and time.');
      }
      
      const selectedDate = new Date(bookingData.selectedDate);
      const phToday = getPhilippineToday();
      
      if (selectedDate < phToday) {
        throw new Error('Cannot book appointments in the past. Please select a future date.');
      }
      
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(phToday.getFullYear() - 2);
      if (selectedDate < twoYearsAgo) {
        throw new Error('Invalid date. Please select a valid future appointment date.');
      }
      
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(phToday.getMonth() + 6);
      if (selectedDate > sixMonthsFromNow) {
        throw new Error('You can only book appointments up to 6 months in advance.');
      }
      
      if (selectedDate.getFullYear() < phToday.getFullYear() || selectedDate.getFullYear() > phToday.getFullYear() + 1) {
        throw new Error(`Please select a date in ${phToday.getFullYear()} or ${phToday.getFullYear() + 1}.`);
      }
      
      const branchCode = branchCodeMap[bookingData.selectedLocation] || 'MNL';
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      const apiPayload = {
        customerName: bookingData.fullName,
        phone: bookingData.phone,
        email: bookingData.email,
        serviceType: bookingData.selectedServices.join(', '),
        vehicleMake: bookingData.vehicleMake,
        vehicleModel: bookingData.vehicleModel,
        vehicleYear: bookingData.vehicleYear,
        plateNumber: bookingData.plateNumber,
        preferredDate: formattedDate,
        preferredTime: bookingData.selectedTime,
        branch: branchCode,
        notes: bookingData.specialRequests || '',
      };
      
      let apiResponse = null;
      let apiSuccess = false;
      
      try {
        const response = await fetch('https://hh-asia-tyre-crm-inv-sys.vercel.app/api/public/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiPayload),
        });
        
        const result = await response.json();
        
        if (response.ok) {
          apiSuccess = true;
          apiResponse = result;
          console.log('Booking created successfully via API:', result);
        } else {
          console.warn('API booking failed, saving locally:', result.error);
        }
      } catch (apiError) {
        console.warn('API unavailable, saving booking locally:', apiError.message);
      }
      
      const appointment = {
        id: apiResponse?.data?.id || Date.now(),
        branchId: parseInt(bookingData.selectedLocation),
        customerName: bookingData.fullName,
        email: bookingData.email,
        phone: bookingData.phone,
        vehicleYear: bookingData.vehicleYear,
        vehicleMake: bookingData.vehicleMake,
        vehicleModel: bookingData.vehicleModel,
        vehicleTrim: bookingData.vehicleTrim,
        plateNumber: bookingData.plateNumber,
        services: bookingData.selectedServices,
        otherServices: bookingData.otherServices || null,
        date: bookingData.selectedDate,
        time: bookingData.selectedTime,
        mileage: bookingData.mileage ? parseInt(bookingData.mileage) : null,
        notes: bookingData.specialRequests,
        status: 'pending',
        createdAt: new Date().toISOString(),
        apiBookingId: apiResponse?.data?.id || null,
        apiSuccess: apiSuccess,
      };
      
      const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      const currentSlotBookings = existingAppointments.filter(
        apt => apt.branchId === appointment.branchId && 
               apt.date === appointment.date && 
               apt.time === appointment.time
      ).length;
      
      if (currentSlotBookings >= MAX_BOOKINGS_PER_SLOT) {
        throw new Error('This time slot just became fully booked. Please choose a different time.');
      }
      
      existingAppointments.push(appointment);
      localStorage.setItem('appointments', JSON.stringify(existingAppointments));
      
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/confirmation', { 
          state: { 
            bookingData, 
            apiResponse: apiResponse,
            apiSuccess: apiSuccess 
          } 
        });
      }, 2000);
      
    } catch (error) {
      console.error('Booking submission failed:', error);
      
      const appointment = {
        id: Date.now(),
        branchId: parseInt(bookingData.selectedLocation),
        customerName: bookingData.fullName,
        email: bookingData.email,
        phone: bookingData.phone,
        vehicleYear: bookingData.vehicleYear,
        vehicleMake: bookingData.vehicleMake,
        vehicleModel: bookingData.vehicleModel,
        vehicleTrim: bookingData.vehicleTrim,
        plateNumber: bookingData.plateNumber,
        services: bookingData.selectedServices,
        otherServices: bookingData.otherServices || null,
        date: bookingData.selectedDate,
        time: bookingData.selectedTime,
        mileage: bookingData.mileage ? parseInt(bookingData.mileage) : null,
        notes: bookingData.specialRequests,
        status: 'pending',
        createdAt: new Date().toISOString(),
        apiBookingId: null,
        apiSuccess: false,
      };
      
      const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      const currentSlotBookings = existingAppointments.filter(
        apt => apt.branchId === appointment.branchId && 
               apt.date === appointment.date && 
               apt.time === appointment.time
      ).length;
      
      if (currentSlotBookings >= MAX_BOOKINGS_PER_SLOT) {
        alert('Sorry, this time slot just became fully booked. Please choose a different time.');
        setIsSubmitting(false);
        return;
      }
      
      existingAppointments.push(appointment);
      localStorage.setItem('appointments', JSON.stringify(existingAppointments));
      
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/confirmation', { 
          state: { 
            bookingData, 
            apiResponse: null,
            apiSuccess: false 
          } 
        });
      }, 2000);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return bookingData.selectedRegion && bookingData.selectedLocation;
      case 2:
        return bookingData.vehicleYear && bookingData.vehicleMake && bookingData.vehicleModel && bookingData.plateNumber;
      case 3:
        return bookingData.selectedServices.length > 0;
      case 4:
        return bookingData.selectedDate && bookingData.selectedTime;
      case 5:
        return bookingData.fullName && bookingData.email && bookingData.phone;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const getStepSummary = () => {
    const summaries = [];
    
    if (bookingData.selectedLocation) {
      const branch = locations.find(l => l.id === bookingData.selectedLocation);
      summaries.push(branch ? branch.name : 'Branch selected');
    }
    
    if (bookingData.vehicleYear && bookingData.vehicleMake && bookingData.vehicleModel) {
      summaries.push(`${bookingData.vehicleYear} ${bookingData.vehicleMake} ${bookingData.vehicleModel}`);
    }
    
    if (bookingData.selectedServices.length > 0) {
      summaries.push(`${bookingData.selectedServices.length} service(s)`);
    }
    
    if (bookingData.selectedDate && bookingData.selectedTime) {
      const dateObj = new Date(bookingData.selectedDate);
      const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      summaries.push(`${dateStr} at ${bookingData.selectedTime}`);
    }
    
    if (bookingData.fullName) {
      summaries.push(bookingData.fullName);
    }
    
    return summaries;
  };

  const stepSummary = getStepSummary();

  const selectedBranch = bookingData.selectedLocation 
    ? locations.find(l => l.id === parseInt(bookingData.selectedLocation))
    : null;

  // Helper: Get current date/time in Philippine timezone (Asia/Manila, UTC+8)
  const getPhilippineTime = () => {
    // Get current time in Philippine timezone
    const now = new Date();
    const philippineTimeStr = now.toLocaleString('en-US', { timeZone: 'Asia/Manila' });
    return new Date(philippineTimeStr);
  };

  // Helper: Get today's date in Philippine timezone (start of day)
  const getPhilippineToday = () => {
    const phTime = getPhilippineTime();
    const today = new Date(phTime);
    today.setHours(0, 0, 0, 0);
    return today;
  };

  // Helper: Check if a time slot is in the past for today (Philippine time)
  const isTimeSlotInPast = (date, time) => {
    const selectedDate = new Date(date);
    const phNow = getPhilippineTime();
    const phToday = getPhilippineToday();
    
    // Only check if the selected date is today (Philippine time)
    const isToday = selectedDate.toDateString() === phToday.toDateString();
    if (!isToday) return false;
    
    // Extract hours and minutes from time slot (e.g., "09:00 AM")
    const match = time.match(/(\d{2}):(\d{2})\s(AM|PM)/i);
    if (!match) return false;
    
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toUpperCase();
    
    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    // Create a date object for the time slot
    const slotTime = new Date(selectedDate);
    slotTime.setHours(hours, minutes, 0, 0);
    
    // If slot time is before current Philippine time, it's in the past
    return slotTime < phNow;
  };

  // Check slot availability for selected branch and date
  const fetchSlotAvailability = async (branchId, date) => {
    if (!branchId || !date) return;
    
    setCheckingSlots(true);
    
    try {
      const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      const bookingsForSlot = existingAppointments.filter(
        apt => apt.branchId === parseInt(branchId) && apt.date === date
      );
      
      const slotCounts = {};
      timeSlots.forEach(slot => {
        const count = bookingsForSlot.filter(apt => apt.time === slot).length;
        slotCounts[slot] = {
          available: count < MAX_BOOKINGS_PER_SLOT,
          booked: count,
          remaining: Math.max(0, MAX_BOOKINGS_PER_SLOT - count),
          status: count === 0 ? 'available' : count < MAX_BOOKINGS_PER_SLOT ? 'limited' : 'full'
        };
      });
      
      setSlotAvailability(slotCounts);
    } catch (error) {
      console.error('Error checking slot availability:', error);
    } finally {
      setCheckingSlots(false);
    }
  };

  useEffect(() => {
    if (bookingData.selectedLocation && bookingData.selectedDate) {
      fetchSlotAvailability(bookingData.selectedLocation, bookingData.selectedDate);
    }
  }, [bookingData.selectedLocation, bookingData.selectedDate]);

  // Filter branches by region

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-black to-brand-card">
      {/* Branch Info Banner - Shows selected branch */}
      {selectedBranch && (
        <div className="bg-brand-yellow text-black py-3 px-6 border-b-2 border-yellow-400">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-75">Selected Branch</p>
                <p className="font-display font-bold text-sm">{selectedBranch.name}</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs opacity-75">{selectedBranch.address}</p>
              <p className="text-xs font-semibold">📞 {selectedBranch.phone}</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <nav className="bg-brand-black border-b border-brand-border sticky top-0 z-50" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Back Button - Left */}
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 bg-brand-raised border border-brand-yellow/40 hover:border-brand-yellow px-4 py-2 rounded-lg transition-all group hover:bg-brand-yellow/10 hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]"
            >
              <svg className="w-5 h-5 text-brand-yellow transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-display font-bold uppercase tracking-wider text-white text-sm">BACK</span>
            </button>

            {/* Page Title - Center */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <h1 className="font-display font-bold uppercase text-white text-lg hidden md:block">
                Book Your Service
              </h1>
            </div>

            {/* Right Side - Empty for balance or future actions */}
            <div className="w-24"></div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb Navigation */}
      <Breadcrumbs />

      {/* Enhanced Progress Bar with Summary */}
      <div className="bg-brand-black py-4 border-b border-brand-border sticky top-16 z-40" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-[1200px] mx-auto px-4">
          {/* Step Indicators */}
          <div className="flex items-center gap-1 overflow-x-auto mb-3">
            {[
              { num: 1, label: 'Branch', icon: '📍' },
              { num: 2, label: 'Vehicle', icon: '🚗' },
              { num: 3, label: 'Services', icon: '🔧' },
              { num: 4, label: 'Date/Time', icon: '📅' },
              { num: 5, label: 'Your Info', icon: '👤' },
              { num: 6, label: 'Confirm', icon: '✓' }
            ].map((step, index) => (
              <div key={step.label} className="flex items-center flex-shrink-0">
                <div className="flex items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      index + 1 <= currentStep
                        ? 'bg-brand-yellow text-black shadow-[0_0_20px_rgba(255,215,0,0.4)] scale-110'
                        : 'bg-gray-700 text-gray-500'
                    }`}
                  >
                    {index + 1 < currentStep ? '✓' : step.icon}
                  </div>
                  <span
                    className={`ml-2 text-xs hidden md:block font-medium ${
                      index + 1 <= currentStep ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < 5 && (
                  <div
                    className={`w-6 md:w-10 h-0.5 mx-1 ${
                      index + 1 < currentStep ? 'bg-brand-yellow' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Step Summary Pills */}
          {stepSummary.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-brand-border/30">
              {stepSummary.map((summary, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 bg-brand-raised border border-brand-border/50 rounded-full px-3 py-1 text-xs text-brand-textMuted"
                >
                  <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full"></div>
                  {summary}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Content */}
      <div className="max-w-[900px] mx-auto px-4 py-8">
        <div className="bg-brand-card border border-brand-border rounded-xl p-6 md:p-8">
          
          {/* STEP 1: Region & Branch Selection */}
          {currentStep === 1 && (
            <div className="animate-fade-up">
              <h2 className="text-2xl font-display font-bold uppercase text-white mb-2">Select Branch</h2>
              <p className="text-brand-textMuted text-sm mb-6">Choose your region, then select a service location.</p>
              
              {/* Error Display */}
              {(formErrors.selectedRegion || formErrors.selectedLocation) && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-400 text-sm">Please complete all required fields</span>
                </div>
              )}
              
              {/* Region Selection */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => {
                    updateBooking('selectedRegion', 'manila');
                    updateBooking('selectedLocation', '');
                  }}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    bookingData.selectedRegion === 'manila'
                      ? 'border-brand-yellow bg-brand-yellow/10 shadow-[0_0_24px_rgba(255,215,0,0.2)]'
                      : formErrors.selectedRegion
                        ? 'border-red-500/50 bg-red-500/5'
                        : 'border-brand-border bg-brand-raised hover:border-brand-yellow/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-bold uppercase text-white text-lg">
                      Metro Manila
                    </h3>
                    <span className="text-brand-yellow text-xs font-bold uppercase">3 Branches</span>
                  </div>
                  <p className="text-brand-textMuted text-sm">Cavite & Metro Manila area</p>
                </button>
                <button
                  onClick={() => {
                    updateBooking('selectedRegion', 'laoag');
                    updateBooking('selectedLocation', '');
                  }}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    bookingData.selectedRegion === 'laoag'
                      ? 'border-brand-yellow bg-brand-yellow/10 shadow-[0_0_24px_rgba(255,215,0,0.2)]'
                      : formErrors.selectedRegion
                        ? 'border-red-500/50 bg-red-500/5'
                        : 'border-brand-border bg-brand-raised hover:border-brand-yellow/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-bold uppercase text-white text-lg">
                      Ilocos Norte
                    </h3>
                    <span className="text-brand-yellow text-xs font-bold uppercase">2 Branches</span>
                  </div>
                  <p className="text-brand-textMuted text-sm">Laoag area</p>
                </button>
              </div>

              {/* Branch Selection (shown after region is selected) */}
              {bookingData.selectedRegion && (
                <div className="animate-fade-up">
                  <div className="text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-4">
                    Select Branch in {bookingData.selectedRegion === 'manila' ? 'Metro Manila & Cavite' : 'Ilocos Norte'}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {displayedBranches.map((location) => (
                      <div
                        key={location.id}
                        onClick={() => location.status === 'open' && updateBooking('selectedLocation', location.id)}
                        className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                          bookingData.selectedLocation === location.id
                            ? 'border-brand-yellow bg-brand-yellow/10 shadow-[0_0_24px_rgba(255,215,0,0.2)]'
                            : formErrors.selectedLocation
                              ? 'border-red-500/50 bg-red-500/5'
                              : 'border-brand-border bg-brand-raised hover:border-brand-yellow/40'
                        } ${location.status !== 'open' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-display font-bold uppercase text-white">
                            {location.name}
                          </h3>
                          <span className="text-green-400 text-xs font-bold uppercase">Open</span>
                        </div>
                        <p className="text-brand-textMuted text-xs mb-2">{location.area}, {location.city}</p>
                        <p className="text-brand-textDim text-xs">{location.hours}</p>
                        
                        {/* Services Tags */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {location.services.slice(0, 3).map((service, idx) => (
                            <span
                              key={idx}
                              className="text-[0.6rem] px-2 py-0.5 rounded bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow"
                            >
                              {service}
                            </span>
                          ))}
                          {location.services.length > 3 && (
                            <span className="text-[0.6rem] px-2 py-0.5 text-brand-textMuted">
                              +{location.services.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {formErrors.selectedLocation && (
                    <p className="mt-2 text-red-400 text-sm flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {formErrors.selectedLocation}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className={`px-8 py-3 rounded-md font-display font-bold uppercase tracking-wider transition-all ${
                    isStepValid()
                      ? 'bg-brand-yellow text-black hover:bg-yellow-400 shadow-[0_0_24px_rgba(255,215,0,0.3)] hover:-translate-y-0.5'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next: Vehicle Details →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Vehicle Details */}
          {currentStep === 2 && (
            <div className="animate-fade-up">
              <h2 className="text-2xl font-display font-bold uppercase text-white mb-2">Vehicle Details</h2>
              <p className="text-brand-textMuted text-sm mb-6">Tell us about your vehicle so we can prepare the right equipment.</p>
              
              {/* Error Summary */}
              {(formErrors.vehicleYear || formErrors.vehicleMake || formErrors.vehicleModel) && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-400 text-sm">Please complete all required fields</span>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                    Year <span className="text-brand-yellow">*</span>
                  </label>
                  <select
                    value={bookingData.vehicleYear}
                    onChange={(e) => updateBooking('vehicleYear', e.target.value)}
                    className={`w-full px-4 py-3 rounded-md bg-brand-raised border text-white focus:outline-none focus:border-brand-yellow transition-colors ${
                      formErrors.vehicleYear ? 'border-red-500' : 'border-brand-border'
                    }`}
                  >
                    <option value="">Select Year</option>
                    {Array.from({ length: 15 }, (_, i) => 2026 - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {formErrors.vehicleYear && (
                    <p className="mt-1 text-red-400 text-xs">{formErrors.vehicleYear}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                    Make <span className="text-brand-yellow">*</span>
                  </label>
                  <select
                    value={bookingData.vehicleMake}
                    onChange={(e) => updateBooking('vehicleMake', e.target.value)}
                    className={`w-full px-4 py-3 rounded-md bg-brand-raised border text-white focus:outline-none focus:border-brand-yellow transition-colors ${
                      formErrors.vehicleMake ? 'border-red-500' : 'border-brand-border'
                    }`}
                  >
                    <option value="">Select Make</option>
                    {vehicleMakes.map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </select>
                  {formErrors.vehicleMake && (
                    <p className="mt-1 text-red-400 text-xs">{formErrors.vehicleMake}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                  Model <span className="text-brand-yellow">*</span>
                </label>
                <input
                  type="text"
                  value={bookingData.vehicleModel}
                  onChange={(e) => updateBooking('vehicleModel', e.target.value)}
                  placeholder="e.g., Vios, Civic, Montero"
                  className={`w-full px-4 py-3 rounded-md bg-brand-raised border text-white focus:outline-none focus:border-brand-yellow transition-colors ${
                    formErrors.vehicleModel ? 'border-red-500' : 'border-brand-border'
                  }`}
                />
                {formErrors.vehicleModel && (
                  <p className="mt-1 text-red-400 text-xs">{formErrors.vehicleModel}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                  Plate Number <span className="text-brand-yellow">*</span>
                </label>
                <input
                  type="text"
                  value={bookingData.plateNumber}
                  onChange={(e) => updateBooking('plateNumber', e.target.value.toUpperCase())}
                  placeholder="e.g., ABC-1234"
                  className={`w-full px-4 py-3 rounded-md bg-brand-raised border text-white focus:outline-none focus:border-brand-yellow transition-colors ${
                    formErrors.plateNumber ? 'border-red-500' : 'border-brand-border'
                  }`}
                />
                {formErrors.plateNumber && (
                  <p className="mt-1 text-red-400 text-xs">{formErrors.plateNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                  Trim (Optional)
                </label>
                <input
                  type="text"
                  value={bookingData.vehicleTrim}
                  onChange={(e) => updateBooking('vehicleTrim', e.target.value)}
                  placeholder="e.g., G, S, EX, LX"
                  className="w-full px-4 py-3 rounded-md bg-brand-raised border border-brand-border text-white focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-md font-display font-bold uppercase tracking-wider text-brand-textMuted border border-brand-border hover:border-brand-yellow hover:text-white transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className={`px-8 py-3 rounded-md font-display font-bold uppercase tracking-wider transition-all ${
                    isStepValid()
                      ? 'bg-brand-yellow text-black hover:bg-yellow-400 shadow-[0_0_24px_rgba(255,215,0,0.3)] hover:-translate-y-0.5'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next: Select Services →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Services */}
          {currentStep === 3 && (
            <div className="animate-fade-up">
              <h2 className="text-2xl font-display font-bold uppercase text-white mb-2">Select Services</h2>
              <p className="text-brand-textMuted text-sm mb-6">Choose one or more services for your appointment.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => {
                      const isSelected = bookingData.selectedServices.includes(service.name);
                      updateBooking(
                        'selectedServices',
                        isSelected
                          ? bookingData.selectedServices.filter(s => s !== service.name)
                          : [...bookingData.selectedServices, service.name]
                      );
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      bookingData.selectedServices.includes(service.name)
                        ? 'border-brand-yellow bg-brand-yellow/10'
                        : 'border-brand-border bg-brand-raised hover:border-brand-yellow/40'
                    }`}
                  >
                    <div className="text-brand-yellow text-2xl mb-2">{service.icon === 'tyre' ? '🔄' : service.icon === 'oil' ? '🛢️' : service.icon === 'battery' ? '🔋' : '🔧'}</div>
                    <div className="font-display font-bold text-white text-sm uppercase">{service.name}</div>
                  </div>
                ))}
              </div>

              {/* Other Services Input */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                  Other Services (Optional)
                </label>
                <textarea
                  value={bookingData.otherServices || ''}
                  onChange={(e) => updateBooking('otherServices', e.target.value)}
                  placeholder="Describe any other services you need (e.g., engine diagnostics, transmission repair, AC service, etc.)"
                  rows={3}
                  className="w-full px-4 py-3 rounded-md bg-brand-raised border border-brand-border text-white placeholder-brand-textDim focus:outline-none focus:border-brand-yellow transition-colors resize-none"
                />
                <p className="mt-1 text-xs text-brand-textDim">
                  Not seeing what you need? Describe it here and we'll prepare for your visit.
                </p>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-md font-display font-bold uppercase tracking-wider text-brand-textMuted border border-brand-border hover:border-brand-yellow hover:text-white transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className={`px-8 py-3 rounded-md font-display font-bold uppercase tracking-wider transition-all ${
                    isStepValid()
                      ? 'bg-brand-yellow text-black hover:bg-yellow-400'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next: Date & Time →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Date & Time */}
          {currentStep === 4 && (
            <div className="animate-fade-up">
              <h2 className="text-2xl font-display font-bold uppercase text-white mb-2">Date & Time</h2>
              <p className="text-brand-textMuted text-sm mb-6">Select your preferred appointment date and time slot.</p>
              
              {/* Availability Legend */}
              {bookingData.selectedDate && bookingData.selectedLocation && (
                <div className="mb-4 p-3 bg-brand-raised border border-brand-border rounded-lg">
                  <p className="text-xs font-bold uppercase text-brand-textMuted mb-2">Slot Availability:</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-brand-textMuted">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs text-brand-textMuted">Limited</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full opacity-50"></div>
                      <span className="text-xs text-brand-textMuted">Fully Booked</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                  Select Date <span className="text-brand-yellow">*</span>
                </label>
                <input
                  type="date"
                  value={bookingData.selectedDate}
                  onChange={(e) => updateBooking('selectedDate', e.target.value)}
                  min={(() => {
                    const phToday = getPhilippineToday();
                    return phToday.toISOString().split('T')[0];
                  })()}
                  max={(() => {
                    const phMaxDate = getPhilippineTime();
                    phMaxDate.setMonth(phMaxDate.getMonth() + 6);
                    return phMaxDate.toISOString().split('T')[0];
                  })()}
                  className="w-full px-4 py-3 rounded-md bg-brand-raised border border-brand-border text-white focus:outline-none focus:border-brand-yellow"
                />
                <p className="mt-1 text-xs text-brand-textDim">
                  Bookings available from today up to 6 months in advance
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-3">
                  Available Time Slots {checkingSlots && <span className="text-brand-yellow text-xs">(Checking availability...)</span>}
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {timeSlots.map((time) => {
                    const slotInfo = slotAvailability[time];
                    const isFullyBooked = slotInfo && !slotInfo.available;
                    const isLimited = slotInfo && slotInfo.status === 'limited';
                    const isPastTime = bookingData.selectedDate && isTimeSlotInPast(bookingData.selectedDate, time);
                    const isDisabled = isFullyBooked || isPastTime;
                    
                    return (
                      <button
                        key={time}
                        onClick={() => !isDisabled && updateBooking('selectedTime', time)}
                        disabled={isDisabled}
                        className={`py-2 px-3 rounded-md text-sm font-medium transition-all relative ${
                          isDisabled
                            ? 'bg-red-500/10 text-red-400/50 cursor-not-allowed border border-red-500/30 line-through'
                            : bookingData.selectedTime === time
                              ? 'bg-brand-yellow text-black shadow-[0_0_12px_rgba(255,215,0,0.3)]'
                              : isLimited
                                ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/50 hover:border-yellow-400'
                                : 'bg-brand-raised text-brand-textMuted border border-brand-border hover:border-brand-yellow'
                        }`}
                        title={isPastTime ? 'This time has already passed' : isFullyBooked ? 'Fully booked' : ''}
                      >
                        <div>{time}</div>
                        {slotInfo && !isPastTime && (
                          <div className="text-[0.65rem] mt-0.5 opacity-75">
                            {isFullyBooked ? 'Full' : isLimited ? `${slotInfo.remaining} left` : 'Open'}
                          </div>
                        )}
                        {isPastTime && (
                          <div className="text-[0.65rem] mt-0.5 text-red-400">
                            Past
                          </div>
                        )}
                        {isLimited && !isFullyBooked && !isPastTime && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {/* Selected slot info */}
                {bookingData.selectedTime && slotAvailability[bookingData.selectedTime] && (
                  <div className="mt-3 p-3 bg-brand-yellow/5 border border-brand-yellow/30 rounded-lg">
                    <p className="text-xs text-brand-yellow">
                      ✓ Selected: {bookingData.selectedTime} - {slotAvailability[bookingData.selectedTime].remaining} spots remaining
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-md font-display font-bold uppercase tracking-wider text-brand-textMuted border border-brand-border hover:border-brand-yellow hover:text-white transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className={`px-8 py-3 rounded-md font-display font-bold uppercase tracking-wider transition-all ${
                    isStepValid()
                      ? 'bg-brand-yellow text-black hover:bg-yellow-400'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next: Your Info →
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Customer Details */}
          {currentStep === 5 && (
            <div className="animate-fade-up">
              <h2 className="text-2xl font-display font-bold uppercase text-white mb-2">Your Information</h2>
              <p className="text-brand-textMuted text-sm mb-6">We'll use these details to confirm and contact you about your appointment.</p>
              
              {/* Error Summary */}
              {(formErrors.fullName || formErrors.phone || formErrors.email) && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-400 text-sm">Please correct the errors below</span>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                    Full Name <span className="text-brand-yellow">*</span>
                  </label>
                  <input
                    type="text"
                    value={bookingData.fullName}
                    onChange={(e) => updateBooking('fullName', e.target.value)}
                    placeholder="Juan Dela Cruz"
                    className={`w-full px-4 py-3 rounded-md bg-brand-raised border text-white focus:outline-none focus:border-brand-yellow transition-colors ${
                      formErrors.fullName ? 'border-red-500' : 'border-brand-border'
                    }`}
                  />
                  {formErrors.fullName && (
                    <p className="mt-1 text-red-400 text-xs">{formErrors.fullName}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                      Phone <span className="text-brand-yellow">*</span>
                    </label>
                    <input
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) => updateBooking('phone', e.target.value)}
                      placeholder="0917 123 4567"
                      className={`w-full px-4 py-3 rounded-md bg-brand-raised border text-white focus:outline-none focus:border-brand-yellow transition-colors ${
                        formErrors.phone ? 'border-red-500' : 'border-brand-border'
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-red-400 text-xs">{formErrors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                      Email <span className="text-brand-yellow">*</span>
                    </label>
                    <input
                      type="email"
                      value={bookingData.email}
                      onChange={(e) => updateBooking('email', e.target.value)}
                      placeholder="juan@example.com"
                      className={`w-full px-4 py-3 rounded-md bg-brand-raised border text-white focus:outline-none focus:border-brand-yellow transition-colors ${
                        formErrors.email ? 'border-red-500' : 'border-brand-border'
                      }`}
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-red-400 text-xs">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                    Vehicle Mileage (Optional)
                  </label>
                  <input
                    type="number"
                    value={bookingData.mileage}
                    onChange={(e) => updateBooking('mileage', e.target.value)}
                    placeholder="e.g., 50000"
                    className="w-full px-4 py-3 rounded-md bg-brand-raised border border-brand-border text-white focus:outline-none focus:border-brand-yellow transition-colors"
                  />
                  <p className="mt-1 text-brand-textDim text-xs">Current odometer reading in kilometers</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                    Customer Concern (Optional)
                  </label>
                  <textarea
                    value={bookingData.specialRequests}
                    onChange={(e) => updateBooking('specialRequests', e.target.value)}
                    placeholder="Describe your vehicle issues or concerns..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-md bg-brand-raised border border-brand-border text-white focus:outline-none focus:border-brand-yellow transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-md font-display font-bold uppercase tracking-wider text-brand-textMuted border border-brand-border hover:border-brand-yellow hover:text-white transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className={`px-8 py-3 rounded-md font-display font-bold uppercase tracking-wider transition-all ${
                    isStepValid()
                      ? 'bg-brand-yellow text-black hover:bg-yellow-400 shadow-[0_0_24px_rgba(255,215,0,0.3)] hover:-translate-y-0.5'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next: Review →
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Review & Confirm */}
          {currentStep === 6 && (
            <div className="animate-fade-up">
              <h2 className="text-2xl font-display font-bold uppercase text-white mb-2">Review & Confirm</h2>
              <p className="text-brand-textMuted text-sm mb-6">Please review your booking details before confirming.</p>
              
              {/* Success Message Animation */}
              {showSuccess && (
                <div className="mb-6 p-6 bg-green-500/10 border border-green-500/50 rounded-lg text-center animate-fade-up">
                  <div className="w-16 h-16 mx-auto mb-3 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-display font-bold text-white text-lg mb-1">Booking Submitted!</h3>
                  <p className="text-green-400 text-sm">Redirecting to confirmation...</p>
                </div>
              )}
              
              <div className="space-y-4 mb-6">
                {/* Branch Details */}
                <div className="bg-brand-raised border border-brand-border rounded-lg p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 border border-brand-yellow/25 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📍</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-white mb-1">Branch</h3>
                      <p className="text-white text-sm">{selectedBranchDetails?.name || 'Not selected'}</p>
                      <p className="text-brand-textMuted text-xs mt-1">
                        📍 {selectedBranchDetails?.area}, {selectedBranchDetails?.city}
                      </p>
                      {selectedBranchDetails && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= Math.round(selectedBranchDetails.rating)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-600'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-brand-textDim text-xs">
                            {selectedBranchDetails.rating} ({selectedBranchDetails.reviewCount} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="bg-brand-raised border border-brand-border rounded-lg p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 border border-brand-yellow/25 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🚗</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-white mb-1">Vehicle</h3>
                      <p className="text-white text-sm">
                        {bookingData.vehicleYear} {bookingData.vehicleMake} {bookingData.vehicleModel}
                        {bookingData.vehicleTrim && ` ${bookingData.vehicleTrim}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="bg-brand-raised border border-brand-border rounded-lg p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 border border-brand-yellow/25 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🔧</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-white mb-3">Services ({bookingData.selectedServices.length})</h3>
                      <div className="flex flex-wrap gap-2">
                        {bookingData.selectedServices.map(service => (
                          <span key={service} className="text-xs px-3 py-1.5 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow font-medium">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="bg-brand-raised border border-brand-border rounded-lg p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 border border-brand-yellow/25 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📅</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-white mb-1">Appointment</h3>
                      <p className="text-white text-sm">
                        {new Date(bookingData.selectedDate).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                      <p className="text-brand-yellow text-sm font-bold mt-1">
                        ⏰ {bookingData.selectedTime}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="bg-brand-raised border border-brand-border rounded-lg p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 border border-brand-yellow/25 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">👤</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-white mb-2">Contact Information</h3>
                      <div className="space-y-1.5">
                        <p className="text-white text-sm">👨 {bookingData.fullName}</p>
                        <p className="text-brand-textMuted text-sm">📱 {bookingData.phone}</p>
                        <p className="text-brand-textMuted text-sm">✉️ {bookingData.email}</p>
                        {bookingData.mileage && (
                          <p className="text-brand-textMuted text-sm">🚗 Mileage: {parseInt(bookingData.mileage).toLocaleString()} km</p>
                        )}
                      </div>
                      {bookingData.specialRequests && (
                        <div className="mt-3 pt-3 border-t border-brand-border">
                          <p className="text-brand-textDim text-xs font-bold uppercase mb-1">Customer Concern:</p>
                          <p className="text-brand-textMuted text-sm">{bookingData.specialRequests}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms Notice */}
              <div className="mb-6 p-4 bg-brand-yellow/5 border border-brand-yellow/20 rounded-lg">
                <p className="text-brand-textDim text-xs leading-relaxed">
                  By confirming this booking, you agree to our terms of service. We'll send a confirmation to your email and phone number shortly after submission.
                </p>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-md font-display font-bold uppercase tracking-wider text-brand-textMuted border border-brand-border hover:border-brand-yellow hover:text-white transition-all disabled:opacity-50"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-md font-display font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                    isSubmitting
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-brand-yellow text-black hover:bg-yellow-400 shadow-[0_0_24px_rgba(255,215,0,0.3)] hover:-translate-y-0.5'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      ✓ Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default BookingPage;
