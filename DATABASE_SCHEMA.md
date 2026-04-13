# Database Schema for HH Asia Tyre Booking System

This document outlines the database schema required for the HH Asia Tyre booking system.

## Database Options

The system supports multiple database backends:
- **PostgreSQL** (Recommended for production)
- **MySQL** 
- **MongoDB** (Document-based alternative)

---

## PostgreSQL/MySQL Schema

### 1. Branches Table

```sql
CREATE TABLE branches (
    id SERIAL PRIMARY KEY,
    branch_code VARCHAR(10) UNIQUE NOT NULL, -- e.g., 'MNL', 'LAO'
    name VARCHAR(255) NOT NULL,
    area VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50),
    mobile VARCHAR(50),
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'coming-soon', 'closed'
    operating_hours VARCHAR(100),
    rating DECIMAL(2, 1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    image_url VARCHAR(500),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    max_bookings_per_slot INTEGER DEFAULT 4,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_branches_code ON branches(branch_code);
CREATE INDEX idx_branches_city ON branches(city);
CREATE INDEX idx_branches_status ON branches(status);
```

### 2. Services Table

```sql
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    base_price DECIMAL(10, 2),
    duration_minutes INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_active ON services(is_active);
```

### 3. Customers Table

```sql
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    alternate_phone VARCHAR(50),
    total_bookings INTEGER DEFAULT 0,
    is_vip BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(email, phone) -- Prevent duplicate customers
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
```

### 4. Vehicles Table

```sql
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    plate_number VARCHAR(50) NOT NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    trim VARCHAR(100),
    color VARCHAR(50),
    current_mileage INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(plate_number)
);

CREATE INDEX idx_vehicles_customer ON vehicles(customer_id);
CREATE INDEX idx_vehicles_plate ON vehicles(plate_number);
```

### 5. Bookings Table (Main Table)

```sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    booking_reference VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'BK-20260407-001'
    
    -- Foreign Keys
    branch_id INTEGER REFERENCES branches(id) ON DELETE RESTRICT,
    customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
    
    -- Booking Details
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(20) NOT NULL, -- e.g., '10:00'
    status VARCHAR(30) DEFAULT 'pending',
    
    -- Status Flow: pending -> confirmed -> in_progress -> completed
    -- Cancellation: pending/cancelled, confirmed/cancelled
    
    -- Services (JSON array for flexibility)
    services JSONB NOT NULL, -- e.g., ['Tire Rotation', 'Oil Change']
    other_services TEXT,
    
    -- Notes
    customer_concern TEXT,
    admin_notes TEXT,
    
    -- Tracking
    source VARCHAR(50) DEFAULT 'website', -- 'website', 'phone', 'walk-in'
    how_did_you_hear VARCHAR(100),
    
    -- API Integration
    api_booking_id VARCHAR(100),
    api_success BOOLEAN DEFAULT false,
    
    -- Timestamps
    confirmed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Prevent double booking (composite unique constraint)
    CONSTRAINT unique_branch_date_time UNIQUE (branch_id, preferred_date, preferred_time)
);

-- Indexes for common queries
CREATE INDEX idx_bookings_branch ON bookings(branch_id);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_date ON bookings(preferred_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX idx_bookings_date_branch ON bookings(branch_id, preferred_date);
CREATE INDEX idx_bookings_created ON bookings(created_at DESC);
```

### 6. Booking Capacity Tracking Table

```sql
CREATE TABLE booking_slots (
    id SERIAL PRIMARY KEY,
    branch_id INTEGER REFERENCES branches(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL, -- e.g., '10:00'
    max_capacity INTEGER DEFAULT 4,
    current_bookings INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(branch_id, booking_date, time_slot)
);

CREATE INDEX idx_slots_branch_date ON booking_slots(branch_id, booking_date);
CREATE INDEX idx_slots_availability ON booking_slots(is_available);

-- Trigger to update is_available automatically
CREATE OR REPLACE FUNCTION update_slot_availability()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE booking_slots 
    SET is_available = (current_bookings < max_capacity)
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_slot_availability
AFTER INSERT OR UPDATE ON booking_slots
FOR EACH ROW
EXECUTE FUNCTION update_slot_availability();
```

### 7. Admin Users Table

```sql
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin', -- 'admin', 'super_admin'
    branch_id INTEGER REFERENCES branches(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_username ON admin_users(username);
CREATE INDEX idx_admin_email ON admin_users(email);
```

### 8. Audit Log Table

```sql
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(100) NOT NULL, -- 'booking_created', 'booking_cancelled', etc.
    entity_type VARCHAR(50), -- 'booking', 'customer', 'branch'
    entity_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
```

---

## MongoDB Schema (Alternative)

If using MongoDB, here's the document structure:

### Bookings Collection

```javascript
{
  _id: ObjectId,
  bookingReference: "BK-20260407-001",
  
  branch: {
    id: ObjectId,
    code: "MNL",
    name: "Goodyear Alabang"
  },
  
  customer: {
    id: ObjectId,
    fullName: "Juan Dela Cruz",
    email: "juan@example.com",
    phone: "09171234567"
  },
  
  vehicle: {
    id: ObjectId,
    plateNumber: "ABC1234",
    make: "Toyota",
    model: "Vios",
    year: 2020,
    trim: "G"
  },
  
  preferredDate: "2026-04-15",
  preferredTime: "10:00",
  status: "pending",
  
  services: ["Tire Rotation", "Oil Change"],
  otherServices: "Check brake pads",
  customerConcern: "Please check tire pressure",
  
  source: "website",
  howDidYouHear: "Facebook",
  
  apiBookingId: null,
  apiSuccess: false,
  
  confirmedAt: null,
  cancelledAt: null,
  completedAt: null,
  
  createdAt: ISODate("2026-04-07T10:30:00Z"),
  updatedAt: ISODate("2026-04-07T10:30:00Z")
}
```

### Booking Slots Collection (For Overbooking Prevention)

```javascript
{
  _id: ObjectId,
  branchId: ObjectId,
  bookingDate: "2026-04-15",
  timeSlot: "10:00",
  maxCapacity: 4,
  currentBookings: 2,
  isAvailable: true,
  
  bookings: [
    ObjectId, // booking_id
    ObjectId  // booking_id
  ],
  
  createdAt: ISODate,
  updatedAt: ISODate
}

// Compound Index for fast lookups
db.booking_slots.createIndex({ branchId: 1, bookingDate: 1, timeSlot: 1 }, { unique: true })
```

---

## Sample Queries

### Check Slot Availability

```sql
-- PostgreSQL/MySQL
SELECT 
    time_slot,
    max_capacity,
    current_bookings,
    (max_capacity - current_bookings) as remaining,
    (current_bookings < max_capacity) as is_available
FROM booking_slots
WHERE branch_id = 1 
  AND booking_date = '2026-04-15'
ORDER BY time_slot;
```

### Create Booking (with overbooking prevention)

```sql
-- PostgreSQL/MySQL
BEGIN;

-- Check availability first
SELECT current_bookings, max_capacity 
FROM booking_slots 
WHERE branch_id = 1 
  AND booking_date = '2026-04-15' 
  AND time_slot = '10:00'
FOR UPDATE; -- Lock the row

-- If available, insert booking
INSERT INTO bookings (
    booking_reference, branch_id, customer_id, vehicle_id,
    preferred_date, preferred_time, status, services
) VALUES (
    'BK-20260407-001', 1, 123, 456,
    '2026-04-15', '10:00', 'pending', 
    '["Tire Rotation", "Oil Change"]'::jsonb
);

-- Update slot count
UPDATE booking_slots 
SET current_bookings = current_bookings + 1
WHERE branch_id = 1 
  AND booking_date = '2026-04-15' 
  AND time_slot = '10:00';

COMMIT;
```

### Get Daily Bookings for Branch

```sql
-- PostgreSQL/MySQL
SELECT 
    b.*,
    c.full_name,
    c.phone,
    c.email,
    v.plate_number,
    v.make,
    v.model
FROM bookings b
JOIN customers c ON b.customer_id = c.id
JOIN vehicles v ON b.vehicle_id = v.id
WHERE b.branch_id = 1
  AND b.preferred_date = '2026-04-15'
  AND b.status != 'cancelled'
ORDER BY b.preferred_time;
```

---

## Migration from localStorage to Database

### Steps:

1. **Export localStorage data**
```javascript
// Run in browser console
const bookings = localStorage.getItem('appointments');
console.log(bookings);
// Copy this JSON to save
```

2. **Transform data to match database schema**
```javascript
const transformBooking = (localBooking) => ({
  booking_reference: `BK-${Date.now()}`,
  branch_id: localBooking.branchId,
  preferred_date: localBooking.date,
  preferred_time: localBooking.time,
  status: localBooking.status,
  services: JSON.stringify(localBooking.services),
  // ... map other fields
});
```

3. **Import to database**
```javascript
// Use the API or direct database insert
const importBookings = async (localBookings) => {
  for (const booking of localBookings) {
    await fetch('/api/public/bookings', {
      method: 'POST',
      body: JSON.stringify(transformBooking(booking))
    });
  }
};
```

---

## Environment Variables for Database

```env
# Database Connection
VITE_DB_TYPE=postgresql
VITE_DB_HOST=localhost
VITE_DB_PORT=5432
VITE_DB_NAME=hh_asia_tyre
VITE_DB_USER=your_username
VITE_DB_PASSWORD=your_password

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Feature Flags
VITE_USE_DATABASE=true
VITE_ENABLE_FALLBACK=true
```

---

## Next Steps

1. Choose your database (PostgreSQL recommended)
2. Run the schema SQL to create tables
3. Set up a backend API (Node.js/Express, Python/FastAPI, etc.)
4. Update `.env` with database credentials
5. Test API endpoints
6. The frontend is already configured to use the API service layer!

The frontend code will automatically:
- Try API first
- Fall back to localStorage if API fails
- Seamlessly switch when database is ready
