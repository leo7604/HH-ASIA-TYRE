# Supabase Database Setup Guide
# For HH Asia Tyre Booking System
# Isolated from Team A's system

## 🎯 Overview

This guide sets up a **completely isolated** Supabase database for HH Asia Tyre
that will NOT overlap with Team A's system.

## ✅ Prerequisites

- GitHub account
- Access to Supabase (https://supabase.com)
- Your HH Asia Tyre frontend project

---

## 📦 Step 1: Create Supabase Project

### 1.1 Sign Up / Login

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub
4. Accept authorization

### 1.2 Create New Project

1. Click "New Project"
2. Fill in:
   - **Name**: `hh-asia-tyre`
   - **Database Password**: Create a strong password (SAVE IT!)
   - **Region**: Singapore (closest to Philippines)
   - **Pricing Plan**: Free

3. Click "Create new project"
4. Wait 2-3 minutes for setup

### 1.3 Get Your Credentials

After project is created, go to:
**Settings → API**

You'll see:
```
Project URL: https://xxxxxxxxxxxxx.supabase.co
API Keys:
  - anon/public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  - service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (KEEP SECRET!)
```

**⚠️ IMPORTANT:**
- Use `anon/public` key in your frontend
- NEVER expose `service_role` key in frontend code
- Save these credentials securely

---

## 🗄️ Step 2: Set Up Database Schema

### 2.1 Open SQL Editor

1. In Supabase dashboard, click "SQL Editor" in left sidebar
2. Click "New query"

### 2.2 Run Schema SQL

Copy and paste this complete schema:

```sql
-- ============================================
-- HH ASIA TYRE BOOKING SYSTEM DATABASE SCHEMA
-- Isolated from Team A's system
-- ============================================

-- 1. Branches Table
CREATE TABLE IF NOT EXISTS branches (
    id SERIAL PRIMARY KEY,
    branch_code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    area VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50),
    mobile VARCHAR(50),
    status VARCHAR(20) DEFAULT 'open',
    operating_hours VARCHAR(100),
    rating DECIMAL(2, 1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    max_bookings_per_slot INTEGER DEFAULT 4,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    alternate_phone VARCHAR(50),
    total_bookings INTEGER DEFAULT 0,
    is_vip BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(email, phone)
);

-- 3. Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    plate_number VARCHAR(50) NOT NULL UNIQUE,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    trim VARCHAR(100),
    color VARCHAR(50),
    current_mileage INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bookings Table (Main Table)
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    
    -- Foreign Keys
    branch_id INTEGER REFERENCES branches(id) ON DELETE RESTRICT,
    customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
    
    -- Booking Details
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(20) NOT NULL,
    status VARCHAR(30) DEFAULT 'pending',
    
    -- Services (JSON array)
    services JSONB NOT NULL,
    other_services TEXT,
    
    -- Notes
    customer_concern TEXT,
    admin_notes TEXT,
    
    -- Bay Assignment
    bay_id INTEGER,
    bay_name VARCHAR(50),
    
    -- Tracking
    source VARCHAR(50) DEFAULT 'website',
    how_did_you_hear VARCHAR(100),
    
    -- API Integration
    api_booking_id VARCHAR(100),
    api_success BOOLEAN DEFAULT false,
    
    -- Timestamps
    confirmed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'branch_admin',
    branch_id INTEGER REFERENCES branches(id),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_bookings_branch ON bookings(branch_id);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_date ON bookings(preferred_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX idx_bookings_date_branch ON bookings(branch_id, preferred_date);
CREATE INDEX idx_bookings_created ON bookings(created_at DESC);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);

CREATE INDEX idx_vehicles_customer ON vehicles(customer_id);
CREATE INDEX idx_vehicles_plate ON vehicles(plate_number);

-- ============================================
-- SEED DATA: Branches
-- ============================================

INSERT INTO branches (branch_code, name, area, city, address, phone, mobile, status, max_bookings_per_slot) VALUES
('ALABANG', 'Goodyear High Performance Center', 'Alabang', 'Metro Manila', 'Alabang-Zapote Rd, Las Piñas City, Metro Manila', '8842-9148', '0917 623 5362', 'open', 4),
('BICUTAN', 'HH Asia Tyre Bicutan', 'Bicutan', 'Metro Manila', 'Bicutan, Taguig City, Metro Manila', '8842-9149', '0917 623 5363', 'open', 4),
('BACOOR', 'HH Asia Tyre Bacoor', 'Bacoor', 'Cavite', 'Aguinaldo Highway, Bacoor, Cavite', '8842-9150', '0917 623 5364', 'open', 4),
('SUCAT', 'HH Asia Tyre Sucat', 'Sucat', 'Metro Manila', 'Dr. Santos Ave, Sucat, Parañaque City', '8842-9151', '0917 623 5365', 'open', 4),
('SUCAT2', 'HH Asia Tyre Sucat 2', 'Sucat', 'Metro Manila', 'Sucat 2, Parañaque City, Metro Manila', '8842-9152', '0917 623 5366', 'open', 4),
('LAOAG', 'HH Asia Tyre Laoag', 'Laoag', 'Ilocos Norte', 'Laoag City, Ilocos Norte', '8842-9153', '0917 623 5367', 'open', 4)
ON CONFLICT (branch_code) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow public read access to branches (for booking form)
CREATE POLICY "Anyone can view branches" ON branches
    FOR SELECT
    USING (is_active = true);

-- Allow public to create bookings
CREATE POLICY "Anyone can create bookings" ON bookings
    FOR INSERT
    WITH CHECK (true);

-- Allow admins to manage bookings (will be refined with auth)
CREATE POLICY "Admins can manage bookings" ON bookings
    FOR ALL
    USING (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
    NEW.booking_reference := 'BK-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD((SELECT COUNT(*) FROM bookings WHERE preferred_date = NEW.preferred_date)::text, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_reference
    BEFORE INSERT ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION generate_booking_reference();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_customers
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check if branches were seeded
SELECT id, branch_code, name, area, status FROM branches;
```

### 2.3 Execute the SQL

1. Paste the SQL into the editor
2. Click "Run" or press `Ctrl+Enter`
3. Wait for execution (should take 2-3 seconds)
4. Check output for any errors

### 2.4 Verify Tables Created

1. Go to "Table Editor" in left sidebar
2. You should see:
   - ✅ `branches` (with 6 rows of data)
   - ✅ `customers`
   - ✅ `vehicles`
   - ✅ `bookings`
   - ✅ `admin_users`

---

## 🔑 Step 3: Configure Environment Variables

### 3.1 Create/Update `.env` File

In your project root (`hh-asia-tyre-prototype/.env`):

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# API Configuration (if still using Vercel API)
VITE_API_BASE_URL=https://hh-asia-tyre-crm-inv-sys.vercel.app/api

# App Configuration
VITE_APP_NAME=HH Asia Tyre
VITE_APP_URL=http://localhost:5173
```

**Replace:**
- `your-project-id` with your actual Supabase project ID
- `your-anon-key-here` with your anon/public key from Step 1.3

### 3.2 Create `.env.example` (for version control)

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# API Configuration
VITE_API_BASE_URL=https://hh-asia-tyre-crm-inv-sys.vercel.app/api
```

**⚠️ Add `.env` to `.gitignore`!**

---

## 💻 Step 4: Install Supabase Client

```bash
cd hh-asia-tyre-prototype
npm install @supabase/supabase-js
```

---

## 🔧 Step 5: Create Supabase Client

Create file: `src/utils/supabase.js`

```javascript
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found. Using localStorage fallback.');
}

// Create Supabase client
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================
// BOOKING OPERATIONS
// ============================================

/**
 * Create a new booking in Supabase
 */
export async function createBooking(bookingData) {
  if (!supabase) {
    console.warn('Supabase not configured, using localStorage');
    return { success: false, source: 'localStorage' };
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
      source: 'database'
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    return {
      success: false,
      error: error.message,
      source: 'database'
    };
  }
}

/**
 * Get bookings for a specific branch
 */
export async function getBranchBookings(branchId, filters = {}) {
  if (!supabase) {
    return { success: false, source: 'localStorage' };
  }

  try {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        customers (full_name, email, phone),
        vehicles (make, model, year, plate_number)
      `)
      .eq('branch_id', branchId)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.date) {
      query = query.eq('preferred_date', filters.date);
    }

    const { data, error } = await query;

    if (error) throw error;

    return {
      success: true,
      data,
      source: 'database'
    };
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return {
      success: false,
      error: error.message,
      source: 'database'
    };
  }
}

/**
 * Update booking status (approve, reject, complete)
 */
export async function updateBookingStatus(bookingId, updates) {
  if (!supabase) {
    return { success: false, source: 'localStorage' };
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
      source: 'database'
    };
  } catch (error) {
    console.error('Error updating booking:', error);
    return {
      success: false,
      error: error.message,
      source: 'database'
    };
  }
}

/**
 * Check slot availability for a branch on a specific date
 */
export async function checkSlotAvailability(branchId, date) {
  if (!supabase) {
    return { success: false, source: 'localStorage' };
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('preferred_time, status')
      .eq('branch_id', branchId)
      .eq('preferred_date', date)
      .in('status', ['pending', 'approved']);

    if (error) throw error;

    // Calculate availability
    const timeSlots = [
      '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
      '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
      '04:00 PM', '05:00 PM'
    ];

    const maxPerSlot = 4; // From branches.max_bookings_per_slot
    const availability = {};

    timeSlots.forEach(slot => {
      const booked = data.filter(b => b.preferred_time === slot).length;
      const remaining = maxPerSlot - booked;
      
      availability[slot] = {
        available: remaining > 0,
        booked,
        remaining,
        status: remaining === 0 ? 'full' : remaining <= 1 ? 'limited' : 'available'
      };
    });

    return {
      success: true,
      data: availability,
      source: 'database'
    };
  } catch (error) {
    console.error('Error checking availability:', error);
    return {
      success: false,
      error: error.message,
      source: 'database'
    };
  }
}

/**
 * Delete a booking
 */
export async function deleteBooking(bookingId) {
  if (!supabase) {
    return { success: false, source: 'localStorage' };
  }

  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId);

    if (error) throw error;

    return {
      success: true,
      source: 'database'
    };
  } catch (error) {
    console.error('Error deleting booking:', error);
    return {
      success: false,
      error: error.message,
      source: 'database'
    };
  }
}

/**
 * Get dashboard statistics
 */
export async function getBookingStats(branchId) {
  if (!supabase) {
    return { success: false, source: 'localStorage' };
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('status')
      .eq('branch_id', branchId);

    if (error) throw error;

    const stats = {
      total: data.length,
      pending: data.filter(b => b.status === 'pending').length,
      approved: data.filter(b => b.status === 'approved').length,
      completed: data.filter(b => b.status === 'completed').length,
      rejected: data.filter(b => b.status === 'rejected').length
    };

    return {
      success: true,
      data: stats,
      source: 'database'
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      success: false,
      error: error.message,
      source: 'database'
    };
  }
}

// ============================================
// CUSTOMER OPERATIONS
// ============================================

/**
 * Find or create customer
 */
export async function findOrCreateCustomer(customerData) {
  if (!supabase) {
    return { success: false, source: 'localStorage' };
  }

  try {
    // Try to find existing customer
    const { data: existing } = await supabase
      .from('customers')
      .select('*')
      .or(`email.eq.${customerData.email},phone.eq.${customerData.phone}`)
      .single();

    if (existing) {
      return {
        success: true,
        data: existing,
        source: 'database',
        isNew: false
      };
    }

    // Create new customer
    const { data, error } = await supabase
      .from('customers')
      .insert([customerData])
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
      source: 'database',
      isNew: true
    };
  } catch (error) {
    console.error('Error with customer:', error);
    return {
      success: false,
      error: error.message,
      source: 'database'
    };
  }
}

// ============================================
// VEHICLE OPERATIONS
// ============================================

/**
 * Find or create vehicle
 */
export async function findOrCreateVehicle(vehicleData) {
  if (!supabase) {
    return { success: false, source: 'localStorage' };
  }

  try {
    // Try to find existing vehicle
    const { data: existing } = await supabase
      .from('vehicles')
      .select('*')
      .eq('plate_number', vehicleData.plate_number)
      .single();

    if (existing) {
      return {
        success: true,
        data: existing,
        source: 'database',
        isNew: false
      };
    }

    // Create new vehicle
    const { data, error } = await supabase
      .from('vehicles')
      .insert([vehicleData])
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
      source: 'database',
      isNew: true
    };
  } catch (error) {
    console.error('Error with vehicle:', error);
    return {
      success: false,
      error: error.message,
      source: 'database'
    };
  }
}

// ============================================
// HEALTH CHECK
// ============================================

/**
 * Check if Supabase is connected
 */
export async function checkSupabaseHealth() {
  if (!supabase) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('branches')
      .select('count')
      .limit(1);

    return !error;
  } catch {
    return false;
  }
}
```

---

## 🔄 Step 6: Update AdminDashboard to Use Supabase

### 6.1 Update Approve Function

In `src/pages/AdminDashboard.jsx`:

```javascript
import { supabase, updateBookingStatus } from '../utils/supabase';

const approveAppointment = async (id, bayId = null, bayName = null) => {
  // Update localStorage (keep as fallback)
  const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
  const updatedWithBay = allAppointments.map(apt => {
    if (apt.id === id) {
      return { 
        ...apt, 
        bayId: bayId || apt.bayId,
        bayName: bayName || apt.bayName,
        status: 'approved'
      };
    }
    return apt;
  });
  
  localStorage.setItem('appointments', JSON.stringify(updatedWithBay));
  setAppointments(updatedWithBay);
  
  // 🆕 ALSO UPDATE SUPABASE DATABASE
  if (supabase) {
    const result = await updateBookingStatus(id, {
      status: 'approved',
      bay_id: bayId,
      bay_name: bayName,
      api_success: true
    });

    if (result.success) {
      toast.success('Appointment approved and saved to database!');
    } else {
      console.warn('Database update failed:', result.error);
      toast.success('Appointment approved (saved locally)');
    }
  }
  
  setFilter('all');
};
```

---

## 📊 Step 7: Verify Database Connection

### 7.1 Test in Browser Console

Open your app, press F12, and run:

```javascript
import { checkSupabaseHealth } from './utils/supabase';

checkSupabaseHealth().then(connected => {
  console.log(connected ? '✅ Connected to Supabase' : '❌ Not connected');
});
```

### 7.2 Test Creating a Booking

```javascript
import { createBooking } from './utils/supabase';

createBooking({
  branch_id: 1,
  preferred_date: '2026-05-01',
  preferred_time: '10:00 AM',
  services: ['Tire Rotation'],
  customer_concern: 'Test booking'
}).then(result => {
  console.log('Booking created:', result);
});
```

### 7.3 View in Supabase Dashboard

1. Go to "Table Editor"
2. Click "bookings" table
3. You should see your test booking!

---

## 🎯 Step 8: Migration (Optional)

If you have existing bookings in localStorage, migrate them:

```javascript
// Run in browser console
import { createBooking } from './utils/supabase';

const localBookings = JSON.parse(localStorage.getItem('appointments') || '[]');

async function migrateBookings() {
  console.log(`Migrating ${localBookings.length} bookings...`);
  
  for (const booking of localBookings) {
    const result = await createBooking({
      branch_id: booking.branchId,
      preferred_date: booking.date,
      preferred_time: booking.time,
      services: booking.services,
      customer_concern: booking.notes,
      bay_id: booking.bayId,
      bay_name: booking.bayName,
      status: booking.status,
      api_success: booking.apiSuccess || false
    });
    
    if (result.success) {
      console.log(`✅ Migrated: ${booking.customerName}`);
    } else {
      console.error(`❌ Failed: ${booking.customerName}`, result.error);
    }
  }
  
  console.log('Migration complete!');
}

migrateBookings();
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Supabase project created
- [ ] Database schema executed successfully
- [ ] 5 tables visible in Table Editor
- [ ] Branches table has 6 rows
- [ ] `.env` file created with credentials
- [ ] `@supabase/supabase-js` installed
- [ ] `src/utils/supabase.js` created
- [ ] Browser console shows connection success
- [ ] Can create booking in database
- [ ] Can view bookings in Supabase dashboard
- [ ] Admin approval updates database

---

## 🔐 Security Notes

### What's Safe:
- ✅ `anon/public` key in frontend code
- ✅ Row Level Security (RLS) policies
- ✅ HTTPS-only connections

### What to Keep Secret:
- ❌ `service_role` key (NEVER in frontend)
- ❌ Database password
- ❌ `.env` file (add to `.gitignore`)

### Best Practices:
1. Enable RLS policies for all tables
2. Use environment variables for credentials
3. Never commit `.env` to Git
4. Regular backups (Supabase does this automatically)
5. Monitor usage in dashboard

---

## 🚀 Next Steps

After database is set up:

1. **Update BookingPage** to use Supabase
2. **Update AdminDashboard** to fetch from database
3. **Add real-time updates** (Supabase feature)
4. **Set up authentication** for admins
5. **Add analytics dashboard**
6. **Deploy to production**

---

## 📞 Support

If you encounter issues:

1. Check Supabase logs (Dashboard → Logs)
2. Check browser console for errors
3. Verify credentials in `.env`
4. Test connection with health check
5. Review RLS policies if access denied

---

**Ready to start? Let me know and I'll guide you through each step!** 🎉
