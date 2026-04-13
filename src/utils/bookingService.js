/**
 * Booking Service Layer
 * Handles all booking-related operations with database integration support
 * Falls back to localStorage if API is unavailable
 */

import { post, get, ENDPOINTS } from './api';

// Maximum bookings allowed per time slot per branch
const MAX_BOOKINGS_PER_SLOT = 4;

/**
 * Create a new booking
 * @param {Object} bookingData - Booking information
 * @returns {Promise<Object>} - Booking result
 */
export const createBooking = async (bookingData) => {
  try {
    // Try API first
    const apiPayload = {
      customerName: bookingData.fullName,
      phone: bookingData.phone,
      email: bookingData.email,
      serviceType: bookingData.selectedServices.join(', '),
      vehicleMake: bookingData.vehicleMake,
      vehicleModel: bookingData.vehicleModel,
      vehicleYear: bookingData.vehicleYear,
      plateNumber: bookingData.plateNumber,
      preferredDate: bookingData.selectedDate,
      preferredTime: bookingData.selectedTime,
      branch: bookingData.branchCode,
      notes: bookingData.specialRequests || '',
    };

    const response = await post(ENDPOINTS.BOOKINGS, apiPayload);

    if (response.success) {
      return {
        success: true,
        data: response.data,
        source: 'database',
      };
    }

    throw new Error(response.error);
  } catch (error) {
    console.warn('API booking failed, falling back to localStorage:', error.message);
    
    // Fallback to localStorage
    return createBookingLocal(bookingData);
  }
};

/**
 * Create booking in localStorage (fallback)
 */
const createBookingLocal = async (bookingData) => {
  try {
    const appointment = {
      id: Date.now(),
      branchId: parseInt(bookingData.branchId),
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
    existingAppointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(existingAppointments));

    return {
      success: true,
      data: appointment,
      source: 'localStorage',
    };
  } catch (error) {
    console.error('LocalStorage booking failed:', error);
    return {
      success: false,
      error: error.message,
      source: 'localStorage',
    };
  }
};

/**
 * Check slot availability
 * @param {string|number} branchId - Branch ID
 * @param {string} date - Date (YYYY-MM-DD)
 * @returns {Promise<Object>} - Slot availability data
 */
export const checkSlotAvailability = async (branchId, date) => {
  try {
    // Try API first
    const branchCodeMap = {
      1: 'MNL',
      2: 'MNL',
      3: 'MNL',
      4: 'MNL',
      5: 'MNL',
      6: 'LAO',
    };

    const branchCode = branchCodeMap[branchId] || 'MNL';
    const response = await get(ENDPOINTS.BOOKINGS_BY_DATE(branchCode, date));

    if (response.success) {
      return processAvailabilityFromAPI(response.data);
    }

    throw new Error(response.error);
  } catch (error) {
    console.warn('API availability check failed, using localStorage:', error.message);
    
    // Fallback to localStorage
    return checkSlotAvailabilityLocal(branchId, date);
  }
};

/**
 * Process availability data from API response
 */
const processAvailabilityFromAPI = (bookings) => {
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const slotCounts = {};
  timeSlots.forEach(slot => {
    const count = bookings.filter(b => b.preferredTime === slot).length;
    slotCounts[slot] = {
      available: count < MAX_BOOKINGS_PER_SLOT,
      booked: count,
      remaining: Math.max(0, MAX_BOOKINGS_PER_SLOT - count),
      status: count === 0 ? 'available' : count < MAX_BOOKINGS_PER_SLOT ? 'limited' : 'full'
    };
  });

  return slotCounts;
};

/**
 * Check slot availability from localStorage (fallback)
 */
const checkSlotAvailabilityLocal = (branchId, date) => {
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

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

  return slotCounts;
};

/**
 * Get booking by ID
 * @param {string|number} bookingId - Booking ID
 * @returns {Promise<Object>} - Booking data
 */
export const getBookingById = async (bookingId) => {
  try {
    const response = await get(ENDPOINTS.BOOKING_BY_ID(bookingId));
    
    if (response.success) {
      return { success: true, data: response.data, source: 'database' };
    }

    throw new Error(response.error);
  } catch (error) {
    console.warn('API fetch failed, checking localStorage:', error.message);
    
    // Fallback to localStorage
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const booking = appointments.find(a => a.id === bookingId);
    
    if (booking) {
      return { success: true, data: booking, source: 'localStorage' };
    }

    return { success: false, error: 'Booking not found' };
  }
};

/**
 * Get all bookings for a branch
 * @param {string|number} branchId - Branch ID
 * @returns {Promise<Array>} - Bookings array
 */
export const getBranchBookings = async (branchId) => {
  try {
    const branchCodeMap = {
      1: 'MNL', 2: 'MNL', 3: 'MNL', 4: 'MNL', 5: 'MNL', 6: 'LAO',
    };
    const branchCode = branchCodeMap[branchId] || 'MNL';
    
    const response = await get(ENDPOINTS.BOOKINGS_BY_BRANCH(branchCode), { auth: true });
    
    if (response.success) {
      return { success: true, data: response.data, source: 'database' };
    }

    throw new Error(response.error);
  } catch (error) {
    console.warn('API fetch failed, using localStorage:', error.message);
    
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const branchBookings = appointments.filter(a => a.branchId === parseInt(branchId));
    
    return { success: true, data: branchBookings, source: 'localStorage' };
  }
};

/**
 * Update booking status
 * @param {string|number} bookingId - Booking ID
 * @param {string} status - New status
 * @returns {Promise<Object>} - Update result
 */
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await put(ENDPOINTS.BOOKING_BY_ID(bookingId), { status }, { auth: true });
    
    if (response.success) {
      return { success: true, data: response.data, source: 'database' };
    }

    throw new Error(response.error);
  } catch (error) {
    console.warn('API update failed, updating localStorage:', error.message);
    
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const index = appointments.findIndex(a => a.id === bookingId);
    
    if (index !== -1) {
      appointments[index].status = status;
      localStorage.setItem('appointments', JSON.stringify(appointments));
      return { success: true, data: appointments[index], source: 'localStorage' };
    }

    return { success: false, error: 'Booking not found' };
  }
};

/**
 * Cancel booking
 * @param {string|number} bookingId - Booking ID
 * @returns {Promise<Object>} - Cancellation result
 */
export const cancelBooking = async (bookingId) => {
  return updateBookingStatus(bookingId, 'cancelled');
};

/**
 * Validate booking data before submission
 * @param {Object} bookingData - Booking data to validate
 * @returns {Object} - Validation result
 */
export const validateBooking = (bookingData) => {
  const errors = {};
  
  // Required fields validation
  if (!bookingData.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  }
  
  if (!bookingData.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^(\+63|0)?9\d{9}$/.test(bookingData.phone.replace(/\s/g, ''))) {
    errors.phone = 'Invalid Philippine mobile number';
  }
  
  if (!bookingData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (!bookingData.selectedDate) {
    errors.selectedDate = 'Date is required';
  }
  
  if (!bookingData.selectedTime) {
    errors.selectedTime = 'Time slot is required';
  }
  
  if (!bookingData.branchId) {
    errors.branchId = 'Branch is required';
  }
  
  if (!bookingData.selectedServices || bookingData.selectedServices.length === 0) {
    errors.selectedServices = 'At least one service is required';
  }
  
  // Date validation
  if (bookingData.selectedDate) {
    const selectedDate = new Date(bookingData.selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      errors.selectedDate = 'Cannot book appointments in the past';
    }
    
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);
    if (selectedDate > sixMonthsFromNow) {
      errors.selectedDate = 'Can only book up to 6 months in advance';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export { MAX_BOOKINGS_PER_SLOT };
