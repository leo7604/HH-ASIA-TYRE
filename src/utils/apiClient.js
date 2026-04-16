/**
 * API Client for HH Asia Tyre Booking System
 * 
 * Connects to the Team A Next.js backend API
 * Base URL: https://hh-asia-tyre-crm-inv-sys.vercel.app
 * 
 * This file replaces the old Supabase integration to ensure:
 * - Same database (PostgreSQL via Prisma)
 * - Smart duplicate detection
 * - Unified customer/vehicle records
 * - Real-time sync with admin dashboard
 */

// ============================================
// CONFIGURATION
// ============================================

// API Base URL - Change this for local development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://hh-asia-tyre-crm-inv-sys.vercel.app';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      console.error(`API Error (${response.status}):`, data);
      return { success: false, error: data.error || 'Unknown error', status: response.status };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Network error:', error.message);
    return { success: false, error: error.message };
  }
}

// ============================================
// BRANCH OPERATIONS
// ============================================

/**
 * Get all active branches from API
 * Maps to: GET /api/branches
 */
export async function getBranches() {
  try {
    const result = await apiCall('/api/branches');
    
    if (result.success) {
      // Transform API response to match frontend expectations
      const branches = result.data.branches || result.data || [];
      return { success: true, data: branches };
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching branches:', error);
    return { success: false, error };
  }
}

/**
 * Get branch by ID
 * Maps to: GET /api/branches?id={id}
 */
export async function getBranchById(id) {
  try {
    const result = await apiCall(`/api/branches?id=${id}`);
    
    if (result.success) {
      const branches = result.data.branches || result.data || [];
      const branch = Array.isArray(branches) ? branches.find(b => b.id === id) : branches;
      return { success: true, data: branch };
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching branch:', error);
    return { success: false, error };
  }
}

/**
 * Get branch by code (e.g., 'ALABANG', 'BICUTAN')
 * Maps to: GET /api/branches?code={code}
 */
export async function getBranchByCode(code) {
  try {
    const result = await apiCall(`/api/branches?code=${code}`);
    
    if (result.success) {
      const branches = result.data.branches || result.data || [];
      const branch = Array.isArray(branches) ? branches.find(b => b.code === code) : branches;
      return { success: true, data: branch };
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching branch by code:', error);
    return { success: false, error };
  }
}

// ============================================
// BOOKING OPERATIONS
// ============================================

/**
 * Create a new booking with customer and vehicle
 * 
 * This function now calls the Team A API endpoint which handles:
 * 1. Smart duplicate detection (case-insensitive)
 * 2. Finding or creating the customer
 * 3. Finding or creating the vehicle
 * 4. Creating the booking
 * 
 * Maps to: POST /api/public/bookings
 */
export async function createBooking(bookingData) {
  try {
    // Map frontend field names to API expected format
    const apiPayload = {
      // Customer info
      customerName: bookingData.full_name,
      fullName: bookingData.full_name, // Alias for compatibility
      email: bookingData.email,
      phone: bookingData.phone,
      
      // Vehicle info
      vehicleMake: bookingData.vehicle_make,
      vehicleModel: bookingData.vehicle_model,
      vehicleYear: bookingData.vehicle_year,
      plateNumber: bookingData.plate_number,
      
      // Booking details
      serviceType: bookingData.services?.join(', ') || bookingData.other_services,
      selectedServices: bookingData.services, // Alias for compatibility
      preferredDate: bookingData.preferred_date,
      date: bookingData.preferred_date, // Alias for compatibility
      preferredTime: bookingData.preferred_time,
      time: bookingData.preferred_time, // Alias for compatibility
      branch: bookingData.branch_id.toString(),
      
      // Additional info
      notes: bookingData.customer_concern || bookingData.other_services,
      specialRequests: bookingData.customer_concern, // Alias for compatibility
      source: bookingData.source || 'website',
    };

    const result = await apiCall('/api/public/bookings', {
      method: 'POST',
      body: apiPayload,
    });

    if (result.success) {
      console.log('✅ Booking created successfully:', result.data);
      return { success: true, data: result.data };
    } else {
      console.error('❌ Booking creation failed:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('❌ Unexpected error creating booking:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get bookings for a branch
 * Maps to: GET /api/bookings?branchId={branchId}
 */
export async function getBranchBookings(branchId, filters = {}) {
  try {
    let url = `/api/bookings?branchId=${branchId}`;
    
    if (filters.status) {
      url += `&status=${filters.status}`;
    }
    
    if (filters.date) {
      url += `&date=${filters.date}`;
    }

    const result = await apiCall(url);
    
    if (result.success) {
      return { success: true, data: result.data.bookings || result.data || [] };
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching branch bookings:', error);
    return { success: false, error };
  }
}

/**
 * Get all bookings (for super admin)
 * Maps to: GET /api/bookings
 */
export async function getAllBookings(filters = {}) {
  try {
    let url = '/api/bookings';
    const params = [];
    
    if (filters.status) {
      params.push(`status=${filters.status}`);
    }
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    const result = await apiCall(url);
    
    if (result.success) {
      return { success: true, data: result.data.bookings || result.data || [] };
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    return { success: false, error };
  }
}

/**
 * Update booking status
 * Maps to: PATCH /api/bookings/{id}
 */
export async function updateBookingStatus(bookingId, updates) {
  try {
    const result = await apiCall(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      body: updates,
    });

    if (result.success) {
      return { success: true, data: result.data };
    }
    
    return result;
  } catch (error) {
    console.error('Error updating booking:', error);
    return { success: false, error };
  }
}

/**
 * Approve booking with bay assignment
 */
export async function approveBooking(bookingId, bayId, bayName, adminId) {
  return await updateBookingStatus(bookingId, {
    status: 'approved',
    bayId,
    bayName,
    assignedAdminId: adminId,
    confirmedAt: new Date().toISOString(),
  });
}

/**
 * Reject booking
 */
export async function rejectBooking(bookingId, reason, adminId) {
  return await updateBookingStatus(bookingId, {
    status: 'rejected',
    adminNotes: reason,
    assignedAdminId: adminId,
  });
}

/**
 * Mark booking as completed
 */
export async function completeBooking(bookingId, adminId, paymentData = {}) {
  return await updateBookingStatus(bookingId, {
    status: 'completed',
    completedAt: new Date().toISOString(),
    assignedAdminId: adminId,
    ...paymentData,
  });
}

/**
 * Cancel booking
 */
export async function cancelBooking(bookingId, reason) {
  return await updateBookingStatus(bookingId, {
    status: 'cancelled',
    cancellationReason: reason,
    cancelledAt: new Date().toISOString(),
  });
}

// ============================================
// SLOT AVAILABILITY
// ============================================

/**
 * Check slot availability for a branch on a date
 * Maps to: GET /api/bookings/availability?branchId={id}&date={date}
 */
export async function checkSlotAvailability(branchId, date) {
  try {
    const result = await apiCall(`/api/bookings/availability?branchId=${branchId}&date=${date}`);
    
    if (result.success) {
      return { success: true, data: result.data };
    }
    
    // Fallback: Calculate from bookings
    return await calculateAvailabilityFromBookings(branchId, date);
  } catch (error) {
    console.error('Error checking availability:', error);
    return await calculateAvailabilityFromBookings(branchId, date);
  }
}

/**
 * Fallback: Calculate availability from existing bookings
 */
async function calculateAvailabilityFromBookings(branchId, date) {
  const bookingsResult = await getBranchBookings(branchId, { date });
  
  if (!bookingsResult.success) {
    return { success: false, error: bookingsResult.error };
  }

  const bookings = bookingsResult.data || [];
  
  // Define time slots
  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM'
  ];

  // Get branch to find max bookings per slot
  const branchResult = await getBranchById(branchId);
  const maxPerSlot = branchResult.success ? (branchResult.data.maxBookingsPerSlot || 4) : 4;

  // Calculate availability
  const availability = {};
  timeSlots.forEach(slot => {
    const bookedCount = bookings.filter(b => b.preferredTime === slot || b.slotStart?.includes(slot)).length;
    const remaining = maxPerSlot - bookedCount;
    
    availability[slot] = {
      booked: bookedCount,
      remaining,
      available: remaining > 0,
      status: remaining === 0 ? 'full' : remaining <= 1 ? 'limited' : 'available'
    };
  });

  return { success: true, data: availability };
}

// ============================================
// CUSTOMER OPERATIONS
// ============================================

/**
 * Find or create customer
 * Now handled by the booking API with smart duplicate detection
 */
export async function findOrCreateCustomer(customerData) {
  console.log('⚠️ findOrCreateCustomer is deprecated - use createBooking instead');
  console.log('The booking API now handles customer creation with smart duplicate detection');
  
  return {
    success: false,
    error: 'Please use createBooking() which handles customer creation automatically'
  };
}

/**
 * Update customer booking count
 * This is now handled automatically by the API
 */
export async function updateCustomerBookingCount(customerId) {
  console.log('ℹ️ Customer booking counts are updated automatically by the API');
  return { success: true };
}

// ============================================
// VEHICLE OPERATIONS
// ============================================

/**
 * Find or create vehicle
 * Now handled by the booking API with smart duplicate detection
 */
export async function findOrCreateVehicle(vehicleData) {
  console.log('⚠️ findOrCreateVehicle is deprecated - use createBooking instead');
  console.log('The booking API now handles vehicle creation with smart duplicate detection');
  
  return {
    success: false,
    error: 'Please use createBooking() which handles vehicle creation automatically'
  };
}

// ============================================
// AUTHENTICATION (Update to use NextAuth)
// ============================================

/**
 * Verify branch admin credentials
 * Maps to: POST /api/auth/callback/credentials
 */
export async function verifyBranchAdminPassword(email, password) {
  try {
    const result = await apiCall('/api/auth/callback/credentials', {
      method: 'POST',
      body: { email, password, role: 'branch_admin' },
    });

    if (result.success) {
      return { success: true, data: result.data };
    }
    
    return { success: false, error: 'Invalid credentials' };
  } catch (error) {
    console.error('Error verifying admin:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Verify super admin credentials
 */
export async function verifySuperAdminPassword(email, password) {
  try {
    const result = await apiCall('/api/auth/callback/credentials', {
      method: 'POST',
      body: { email, password, role: 'super_admin' },
    });

    if (result.success) {
      return { success: true, data: result.data };
    }
    
    return { success: false, error: 'Invalid credentials' };
  } catch (error) {
    console.error('Error verifying super admin:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// DASHBOARD STATISTICS
// ============================================

/**
 * Get branch dashboard stats
 * Maps to: GET /api/dashboard/stats?branchId={id}
 */
export async function getBranchDashboardStats(branchId) {
  try {
    const result = await apiCall(`/api/dashboard/stats?branchId=${branchId}`);
    
    if (result.success) {
      return { success: true, data: result.data };
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { success: false, error };
  }
}

/**
 * Get today's bookings for a branch
 */
export async function getTodaysBookings(branchId) {
  const today = new Date().toISOString().split('T')[0];
  return await getBranchBookings(branchId, { date: today });
}

// ============================================
// CONNECTION HEALTH CHECK
// ============================================

/**
 * Check if API connection is working
 */
export async function checkConnection() {
  try {
    const result = await apiCall('/api/branches');
    
    if (result.success) {
      return { success: true, connected: true };
    }
    
    return { success: false, error: result.error };
  } catch (error) {
    console.error('Connection check failed:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// EXPORTS
// ============================================

export default {
  // Branches
  getBranches,
  getBranchById,
  getBranchByCode,
  
  // Bookings
  createBooking,
  getBranchBookings,
  getAllBookings,
  updateBookingStatus,
  approveBooking,
  rejectBooking,
  completeBooking,
  cancelBooking,
  
  // Availability
  checkSlotAvailability,
  
  // Customers (deprecated)
  findOrCreateCustomer,
  updateCustomerBookingCount,
  
  // Vehicles (deprecated)
  findOrCreateVehicle,
  
  // Auth
  verifyBranchAdminPassword,
  verifySuperAdminPassword,
  
  // Dashboard
  getBranchDashboardStats,
  getTodaysBookings,
  
  // Health
  checkConnection,
};
