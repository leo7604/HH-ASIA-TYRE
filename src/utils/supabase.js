/**
 * Supabase Client Configuration
 * 
 * Connects to your HH Asia Tyre Supabase database
 * URL: https://knghsmttizcoecgwyfdk.supabase.co
 */

// Import Supabase client
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate credentials
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabase credentials not found!');
  console.error('Please check your .env file has:');
  console.error('  VITE_SUPABASE_URL=https://knghsmttizcoecgwyfdk.supabase.co');
  console.error('  VITE_SUPABASE_ANON_KEY=your-anon-key');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// BRANCH OPERATIONS
// ============================================

/**
 * Get all active branches
 */
export async function getBranches() {
  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('Error fetching branches:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

/**
 * Get branch by ID
 */
export async function getBranchById(id) {
  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching branch:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

/**
 * Get branch by code (e.g., 'ALABANG', 'BICUTAN')
 */
export async function getBranchByCode(code) {
  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .eq('branch_code', code)
    .single();

  if (error) {
    console.error('Error fetching branch by code:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

// ============================================
// BOOKING OPERATIONS
// ============================================

/**
 * Create a new booking with customer and vehicle
 * This function handles:
 * 1. Finding or creating the customer
 * 2. Finding or creating the vehicle
 * 3. Generating a booking reference
 * 4. Creating the booking with proper references
 */
export async function createBooking(bookingData) {
  try {
    // 1. Find or create customer
    let customerId = bookingData.customer_id;
    
    if (!customerId && bookingData.email) {
      // Check if customer exists
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', bookingData.email)
        .single();
      
      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        // Create new customer
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            customer_reference: 'CUST-' + Date.now(),
            full_name: bookingData.full_name || 'Website Customer',
            email: bookingData.email,
            phone: bookingData.phone || '',
            total_bookings: 0,
            status: 'ACTIVE'
          })
          .select('id')
          .single();
        
        if (customerError) {
          console.error('Error creating customer:', customerError);
        } else {
          customerId = newCustomer.id;
        }
      }
    }
    
    // 2. Find or create vehicle
    let vehicleId = bookingData.vehicle_id;
    
    if (!vehicleId && bookingData.plate_number && customerId) {
      // Check if vehicle exists
      const { data: existingVehicle } = await supabase
        .from('vehicles')
        .select('id')
        .eq('plate_number', bookingData.plate_number)
        .single();
      
      if (existingVehicle) {
        vehicleId = existingVehicle.id;
      } else {
        // Create new vehicle
        const { data: newVehicle, error: vehicleError } = await supabase
          .from('vehicles')
          .insert({
            customer_id: customerId,
            plate_number: bookingData.plate_number,
            make: bookingData.vehicle_make || 'Unknown',
            model: bookingData.vehicle_model || 'Unknown',
            year: bookingData.vehicle_year || new Date().getFullYear(),
            trim: bookingData.vehicle_trim || null,
            is_active: true
          })
          .select('id')
          .single();
        
        if (vehicleError) {
          console.error('Error creating vehicle:', vehicleError);
        } else {
          vehicleId = newVehicle.id;
        }
      }
    }
    
    // 3. Generate booking reference
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const bookingReference = `BK-${dateStr}-${randomSuffix}`;
    
    // 4. Create the booking
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        booking_reference: bookingReference,
        branch_id: bookingData.branch_id,
        customer_id: customerId,
        vehicle_id: vehicleId,
        preferred_date: bookingData.preferred_date,
        preferred_time: bookingData.preferred_time,
        services: bookingData.services || [],
        other_services: bookingData.other_services || null,
        customer_concern: bookingData.customer_concern || null,
        status: 'pending',
        source: bookingData.source || 'website',
        bay_id: null,
        bay_name: null
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error creating booking:', err);
    return { success: false, error: err };
  }
}

/**
 * Get bookings for a branch
 */
export async function getBranchBookings(branchId, filters = {}) {
  let query = supabase
    .from('bookings')
    .select('*')
    .eq('branch_id', branchId)
    .order('preferred_date', { ascending: true })
    .order('preferred_time', { ascending: true });

  // Apply status filter
  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  // Apply date filter
  if (filters.date) {
    query = query.eq('preferred_date', filters.date);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching branch bookings:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

/**
 * Get all bookings (for super admin)
 */
export async function getAllBookings(filters = {}) {
  let query = supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  // Apply status filter
  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching all bookings:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

/**
 * Update booking status
 */
export async function updateBookingStatus(bookingId, updates) {
  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', bookingId)
    .select()
    .single();

  if (error) {
    console.error('Error updating booking:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

/**
 * Approve booking with bay assignment
 */
export async function approveBooking(bookingId, bayId, bayName, adminId) {
  const updates = {
    status: 'approved',
    bay_id: bayId,
    bay_name: bayName,
    assigned_admin_id: adminId,
    confirmed_at: new Date().toISOString()
  };

  return await updateBookingStatus(bookingId, updates);
}

/**
 * Reject booking
 */
export async function rejectBooking(bookingId, reason, adminId) {
  const updates = {
    status: 'rejected',
    admin_notes: reason,
    assigned_admin_id: adminId
  };

  return await updateBookingStatus(bookingId, updates);
}

/**
 * Mark booking as completed
 */
export async function completeBooking(bookingId, adminId, paymentData = {}) {
  const updates = {
    status: 'completed',
    completed_at: new Date().toISOString(),
    assigned_admin_id: adminId,
    ...paymentData
  };

  return await updateBookingStatus(bookingId, updates);
}

/**
 * Cancel booking
 */
export async function cancelBooking(bookingId, reason) {
  const updates = {
    status: 'cancelled',
    cancellation_reason: reason,
    cancelled_at: new Date().toISOString()
  };

  return await updateBookingStatus(bookingId, updates);
}

/**
 * Delete booking
 */
export async function deleteBooking(bookingId) {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) {
    console.error('Error deleting booking:', error);
    return { success: false, error };
  }

  return { success: true };
}

/**
 * Update booking
 */
export async function updateBooking(bookingId, updates) {
  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', bookingId)
    .select()
    .single();

  if (error) {
    console.error('Error updating booking:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

// ============================================
// SLOT AVAILABILITY
// ============================================

/**
 * Check slot availability for a branch on a date
 */
export async function checkSlotAvailability(branchId, date) {
  const { data, error } = await supabase
    .from('bookings')
    .select('preferred_time, status')
    .eq('branch_id', branchId)
    .eq('preferred_date', date)
    .in('status', ['pending', 'approved']);

  if (error) {
    console.error('Error checking availability:', error);
    return { success: false, error };
  }

  // Define time slots
  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM'
  ];

  // Get max bookings per slot from branch
  const branchResult = await getBranchById(branchId);
  const maxPerSlot = branchResult.success ? branchResult.data.max_bookings_per_slot : 4;

  // Calculate availability
  const availability = {};
  timeSlots.forEach(slot => {
    const bookedCount = data.filter(b => b.preferred_time === slot).length;
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
 */
export async function findOrCreateCustomer(customerData) {
  // Try to find existing customer by email or phone
  const { data: existing } = await supabase
    .from('customers')
    .select('*')
    .or(`email.eq.${customerData.email},phone.eq.${customerData.phone}`)
    .single();

  if (existing) {
    return { success: true, data: existing, isNew: false };
  }

  // Create new customer
  const { data, error } = await supabase
    .from('customers')
    .insert([customerData])
    .select()
    .single();

  if (error) {
    console.error('Error creating customer:', error);
    return { success: false, error };
  }

  return { success: true, data, isNew: true };
}

/**
 * Update customer booking count
 */
export async function updateCustomerBookingCount(customerId) {
  // Get total bookings count
  const { count } = await supabase
    .from('bookings')
    .select('*', { count: 'exact' })
    .eq('customer_id', customerId);

  // Get completed bookings count
  const { count: completedCount } = await supabase
    .from('bookings')
    .select('*', { count: 'exact' })
    .eq('customer_id', customerId)
    .eq('status', 'completed');

  // Update customer
  const { error } = await supabase
    .from('customers')
    .update({
      total_bookings: count || 0,
      completed_bookings: completedCount || 0
    })
    .eq('id', customerId);

  if (error) {
    console.error('Error updating customer count:', error);
    return { success: false, error };
  }

  return { success: true };
}

// ============================================
// VEHICLE OPERATIONS
// ============================================

/**
 * Find or create vehicle
 */
export async function findOrCreateVehicle(vehicleData) {
  // Try to find existing vehicle by plate number
  const { data: existing } = await supabase
    .from('vehicles')
    .select('*')
    .eq('plate_number', vehicleData.plate_number)
    .single();

  if (existing) {
    return { success: true, data: existing, isNew: false };
  }

  // Create new vehicle
  const { data, error } = await supabase
    .from('vehicles')
    .insert([vehicleData])
    .select()
    .single();

  if (error) {
    console.error('Error creating vehicle:', error);
    return { success: false, error };
  }

  return { success: true, data, isNew: true };
}

// ============================================
// BRANCH ADMIN OPERATIONS
// ============================================

/**
 * Get branch admin by email
 */
export async function getBranchAdminByEmail(email) {
  const { data, error } = await supabase
    .from('branch_admins')
    .select('*')
    .eq('email', email)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching branch admin:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

/**
 * Verify branch admin password
 */
export async function verifyBranchAdminPassword(email, password) {
  const adminResult = await getBranchAdminByEmail(email);
  
  if (!adminResult.success) {
    return { success: false, error: 'Admin not found' };
  }

  const admin = adminResult.data;
  
  // Simple password check (in production, use bcrypt)
  // For now, we'll use plain text comparison
  // TODO: Implement proper password hashing
  if (admin.password_hash === password) {
    return { success: true, data: admin };
  }

  return { success: false, error: 'Invalid password' };
}

/**
 * Update branch admin last login
 */
export async function updateAdminLastLogin(adminId) {
  const { error } = await supabase
    .from('branch_admins')
    .update({ last_login: new Date().toISOString() })
    .eq('id', adminId);

  if (error) {
    console.error('Error updating last login:', error);
  }
}

// ============================================
// SUPER ADMIN OPERATIONS
// ============================================

/**
 * Get super admin by email
 */
export async function getSuperAdminByEmail(email) {
  const { data, error } = await supabase
    .from('super_admins')
    .select('*')
    .eq('email', email)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching super admin:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

/**
 * Verify super admin password
 */
export async function verifySuperAdminPassword(email, password) {
  const adminResult = await getSuperAdminByEmail(email);
  
  if (!adminResult.success) {
    return { success: false, error: 'Admin not found' };
  }

  const admin = adminResult.data;
  
  // Simple password check
  if (admin.password_hash === password) {
    return { success: true, data: admin };
  }

  return { success: false, error: 'Invalid password' };
}

/**
 * Create a new super admin
 */
export async function createSuperAdmin(adminData) {
  const { data, error } = await supabase
    .from('super_admins')
    .insert([{
      admin_reference: 'SA-' + Date.now(),
      email: adminData.email,
      password_hash: adminData.password,
      full_name: adminData.fullName,
      phone: adminData.phone || null,
      role: 'super_admin',
      level: 1,
      is_active: true,
      is_verified: true
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating super admin:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

/**
 * Update super admin
 */
export async function updateSuperAdmin(id, adminData) {
  const updateData = {
    email: adminData.email,
    full_name: adminData.fullName,
    phone: adminData.phone || null,
    updated_at: new Date().toISOString()
  };

  // Only update password if provided
  if (adminData.password) {
    updateData.password_hash = adminData.password;
  }

  const { data, error } = await supabase
    .from('super_admins')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating super admin:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

/**
 * Delete super admin
 */
export async function deleteSuperAdmin(id) {
  const { error } = await supabase
    .from('super_admins')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting super admin:', error);
    return { success: false, error };
  }

  return { success: true };
}

/**
 * Get all super admins
 */
export async function getAllSuperAdmins() {
  const { data, error } = await supabase
    .from('super_admins')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching super admins:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

/**
 * Update super admin last login
 */
export async function updateSuperAdminLastLogin(id) {
  const { error } = await supabase
    .from('super_admins')
    .update({ last_login: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating last login:', error);
  }
}

// ============================================
// BRANCH ADMIN CRUD (SUPABASE)
// ============================================

/**
 * Get all branch admins from Supabase
 */
export async function getAllBranchAdminsSupabase() {
  const { data, error } = await supabase
    .from('branch_admins')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching branch admins:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

/**
 * Create branch admin in Supabase
 */
export async function createBranchAdminSupabase(adminData) {
  const { data, error } = await supabase
    .from('branch_admins')
    .insert([{
      admin_reference: 'BA-' + Date.now(),
      email: adminData.email,
      password_hash: adminData.password,
      full_name: adminData.fullName,
      branch_id: adminData.branchId,
      role: 'branch_admin',
      can_approve_bookings: true,
      can_reject_bookings: true,
      can_edit_bookings: true,
      can_view_analytics: true,
      can_manage_bays: true,
      can_export_data: true,
      is_active: true,
      is_verified: true
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating branch admin:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

/**
 * Update branch admin in Supabase
 */
export async function updateBranchAdminSupabase(id, adminData) {
  const updateData = {
    email: adminData.email,
    full_name: adminData.fullName,
    updated_at: new Date().toISOString()
  };

  if (adminData.password) {
    updateData.password_hash = adminData.password;
  }

  const { data, error } = await supabase
    .from('branch_admins')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating branch admin:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

/**
 * Delete branch admin from Supabase
 */
export async function deleteBranchAdminSupabase(id) {
  const { error } = await supabase
    .from('branch_admins')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting branch admin:', error);
    return { success: false, error };
  }

  return { success: true };
}

/**
 * Toggle branch admin status
 */
export async function toggleBranchAdminStatus(id, currentStatus) {
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
  
  const { data, error } = await supabase
    .from('branch_admins')
    .update({ is_active: newStatus === 'active', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error toggling branch admin status:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

// ============================================
// AUDIT LOG OPERATIONS
// ============================================

/**
 * Log an action
 */
export async function logAction(actionData) {
  const { error } = await supabase
    .from('audit_logs')
    .insert([actionData]);

  if (error) {
    console.error('Error logging action:', error);
    // Don't fail the main operation if logging fails
  }
}

/**
 * Get audit logs for a branch
 */
export async function getBranchAuditLogs(branchId, limit = 50) {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('branch_id', branchId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching audit logs:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

// ============================================
// SERVICE BAY OPERATIONS
// ============================================

/**
 * Get service bays for a branch
 */
export async function getBranchServiceBays(branchId) {
  const { data, error } = await supabase
    .from('service_bays')
    .select('*')
    .eq('branch_id', branchId)
    .eq('is_active', true)
    .order('bay_number');

  if (error) {
    console.error('Error fetching service bays:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

// ============================================
// DASHBOARD STATISTICS
// ============================================

/**
 * Get branch dashboard stats
 */
export async function getBranchDashboardStats(branchId) {
  // Get counts by status
  const { data: allBookings } = await supabase
    .from('bookings')
    .select('status')
    .eq('branch_id', branchId);

  if (!allBookings) {
    return {
      success: true,
      data: {
        total: 0,
        pending: 0,
        approved: 0,
        completed: 0,
        rejected: 0,
        cancelled: 0
      }
    };
  }

  const stats = {
    total: allBookings.length,
    pending: allBookings.filter(b => b.status === 'pending').length,
    approved: allBookings.filter(b => b.status === 'approved').length,
    completed: allBookings.filter(b => b.status === 'completed').length,
    rejected: allBookings.filter(b => b.status === 'rejected').length,
    cancelled: allBookings.filter(b => b.status === 'cancelled').length
  };

  return { success: true, data: stats };
}

/**
 * Get today's bookings for a branch
 */
export async function getTodaysBookings(branchId) {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('branch_id', branchId)
    .eq('preferred_date', today)
    .in('status', ['approved', 'in_progress'])
    .order('preferred_time');

  if (error) {
    console.error('Error fetching today bookings:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

// ============================================
// CONNECTION HEALTH CHECK
// ============================================

/**
 * Check if Supabase connection is working
 */
export async function checkConnection() {
  try {
    const { data, error } = await supabase
      .from('branches')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Connection check failed:', error);
      return { success: false, error };
    }

    return { success: true, connected: true };
  } catch (err) {
    console.error('Connection error:', err);
    return { success: false, error: err };
  }
}

// Export default supabase client
export default supabase;
