# HH Asia Tyre - Database Architecture

## 📊 Database Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    HH ASIA TYRE DATABASE                     │
│                   (Supabase PostgreSQL)                      │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              CORE TABLES (8 Total)                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  1. branches              - Branch locations (6 branches)   │
│  2. customers             - Customer profiles               │
│  3. vehicles              - Customer vehicles               │
│  4. bookings              - Booking requests                │
│  5. branch_admins         - Branch admin accounts           │
│  6. super_admins          - Super admin accounts            │
│  7. audit_logs            - Activity tracking               │
│  8. service_bays          - Bay management                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏢 Table 1: branches

**Purpose:** Store all branch locations

**Fields:**
```sql
id                  SERIAL PRIMARY KEY
branch_code         VARCHAR(10) UNIQUE     -- 'ALABANG', 'LAOAG', etc.
name                VARCHAR(255)           -- Full branch name
area                VARCHAR(255)           -- Area/district
city                VARCHAR(100)           -- City
address             TEXT                   -- Full address
phone               VARCHAR(50)            -- Landline
mobile              VARCHAR(50)            -- Mobile number
email               VARCHAR(255)           -- Branch email
status              VARCHAR(20)            -- 'open', 'coming-soon', 'closed'
operating_hours     VARCHAR(100)           -- 'Mon-Sat: 8AM-6PM'
rating              DECIMAL(2,1)           -- Google rating
review_count        INTEGER                -- Number of reviews
max_bookings_per_slot INTEGER              -- Max bookings per time slot
total_bays          INTEGER                -- Total service bays
is_active           BOOLEAN                -- Is branch operational?
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

**Sample Data:**
```
id | branch_code | name                        | area     | city
1  | ALABANG     | Goodyear High Performance   | Alabang  | Metro Manila
2  | BICUTAN     | HH Asia Tyre Bicutan        | Bicutan  | Taguig
3  | BACOOR      | HH Asia Tyre Bacoor         | Bacoor   | Cavite
4  | SUCAT       | HH Asia Tyre Sucat          | Sucat    | Parañaque
5  | SUCAT2      | HH Asia Tyre Sucat 2        | Sucat 2  | Parañaque
6  | LAOAG       | HH Asia Tyre Laoag          | Laoag    | Ilocos Norte
```

---

## 👥 Table 2: customers

**Purpose:** Store customer information and track their history

**Fields:**
```sql
id                  SERIAL PRIMARY KEY
customer_reference  VARCHAR(50) UNIQUE     -- 'CUST-20260414-001'
full_name           VARCHAR(255)           -- Customer name
email               VARCHAR(255)           -- Email address
phone               VARCHAR(50)            -- Phone number
alternate_phone     VARCHAR(50)            -- Alternate contact
address             TEXT                   -- Customer address
city                VARCHAR(100)           -- City
total_bookings      INTEGER                -- Total bookings made
completed_bookings  INTEGER                -- Completed services
is_vip              BOOLEAN                -- VIP customer flag
preferred_branch_id INTEGER                -- FK to branches
notes               TEXT                   -- Admin notes
status              VARCHAR(20)            -- 'ACTIVE', 'INACTIVE', 'BLACKLISTED'
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

**Sample Data:**
```
id | customer_reference | full_name      | email              | phone        | total_bookings
1  | CUST-20260414-001  | Juan Dela Cruz | juan@email.com     | 09171234567  | 5
2  | CUST-20260414-002  | Maria Santos   | maria@email.com    | 09187654321  | 2
```

---

## 🚗 Table 3: vehicles

**Purpose:** Store customer vehicle information

**Fields:**
```sql
id                  SERIAL PRIMARY KEY
customer_id         INTEGER                -- FK to customers
plate_number        VARCHAR(50) UNIQUE     -- License plate
make                VARCHAR(100)           -- 'Toyota', 'Honda', etc.
model               VARCHAR(100)           -- 'Vios', 'Civic', etc.
year                INTEGER                -- Manufacturing year
trim                VARCHAR(100)           -- 'G', 'XLS', etc.
color               VARCHAR(50)            -- Vehicle color
vehicle_type        VARCHAR(50)            -- 'Sedan', 'SUV', 'Truck'
current_mileage     INTEGER                -- Current odometer reading
last_service_date   DATE                   -- Last service date
is_active           BOOLEAN                -- Is vehicle still in use?
created_at          TIMESTAMP
```

**Sample Data:**
```
id | customer_id | plate_number | make   | model  | year | vehicle_type
1  | 1           | ABC-1234     | Toyota | Vios   | 2020 | Sedan
2  | 1           | XYZ-5678     | Ford   | Ranger | 2021 | Truck
3  | 2           | DEF-9012     | Honda  | Civic  | 2022 | Sedan
```

---

## 📅 Table 4: bookings (Booking Requests)

**Purpose:** Store all booking requests - THE MAIN TABLE

**Fields:**
```sql
id                      SERIAL PRIMARY KEY
booking_reference       VARCHAR(50) UNIQUE    -- 'BK-20260414-001'
confirmation_number     VARCHAR(50)           -- Customer confirmation code

-- Foreign Keys
branch_id               INTEGER               -- FK to branches
customer_id             INTEGER               -- FK to customers
vehicle_id              INTEGER               -- FK to vehicles

-- Booking Details
preferred_date          DATE                  -- Requested date
preferred_time          VARCHAR(20)           -- Requested time
status                  VARCHAR(30)           -- 'pending', 'approved', 'in_progress', 
                                              -- 'completed', 'rejected', 'cancelled'

-- Services
services                JSONB                 -- ['Tire Rotation', 'Oil Change']
other_services          TEXT                  -- Custom services

-- Bay Assignment
bay_id                  INTEGER               -- Assigned bay number
bay_name                VARCHAR(50)           -- 'Bay 1', 'Bay 2', etc.
assigned_admin_id       INTEGER               -- Which admin approved (FK to branch_admins)

-- Notes
customer_concern        TEXT                  -- Customer's concern
admin_notes             TEXT                  -- Admin notes
cancellation_reason     TEXT                  -- Why cancelled

-- Tracking
source                  VARCHAR(50)           -- 'website', 'phone', 'walk-in', 'facebook'
how_did_you_hear        VARCHAR(100)          -- How customer found us

-- Financial
estimated_cost          DECIMAL(10,2)         -- Estimated cost
final_cost              DECIMAL(10,2)         -- Actual cost
amount_paid             DECIMAL(10,2)         -- Amount paid
payment_status          VARCHAR(30)           -- 'unpaid', 'partial', 'paid'
payment_method          VARCHAR(50)           -- 'cash', 'card', 'gcash', 'paymaya'

-- API Integration
api_booking_id          VARCHAR(100)          -- External API ID
api_success             BOOLEAN               -- API sync status

-- Timestamps
confirmed_at            TIMESTAMP             -- When approved
cancelled_at            TIMESTAMP             -- When cancelled
completed_at            TIMESTAMP             -- When completed
created_at              TIMESTAMP
updated_at              TIMESTAMP
```

**Sample Data:**
```
id | booking_reference  | branch_id | customer_id | status    | preferred_date | preferred_time | bay_id
1  | BK-20260414-001    | 1         | 1           | pending   | 2026-05-01     | 10:00 AM       | NULL
2  | BK-20260414-002    | 1         | 2           | approved  | 2026-05-02     | 2:00 PM        | 1
3  | BK-20260414-003    | 6         | 1           | completed | 2026-04-10     | 11:00 AM       | 2
```

**Status Flow:**
```
pending → approved → in_progress → completed
  ↓          ↓
rejected  cancelled
```

---

## 👨‍💼 Table 5: branch_admins

**Purpose:** Branch admin login accounts with permissions

**Fields:**
```sql
id                      SERIAL PRIMARY KEY
admin_reference         VARCHAR(50) UNIQUE    -- 'BA-001'

-- Login Credentials
email                   VARCHAR(255) UNIQUE   -- Login email
password_hash           VARCHAR(255)          -- Bcrypt hashed password

-- Profile
full_name               VARCHAR(255)          -- Admin name
phone                   VARCHAR(50)           -- Contact number
avatar_url              TEXT                  -- Profile photo URL

-- Assignment
branch_id               INTEGER               -- FK to branches (which branch)
role                    VARCHAR(50)           -- 'branch_admin', 'senior_admin'

-- Permissions (Granular control)
can_approve_bookings    BOOLEAN               -- Can approve requests?
can_reject_bookings     BOOLEAN               -- Can reject requests?
can_delete_bookings     BOOLEAN               -- Can delete bookings?
can_edit_bookings       BOOLEAN               -- Can edit bookings?
can_view_analytics      BOOLEAN               -- Can view stats?
can_manage_bays         BOOLEAN               -- Can manage bays?
can_export_data         BOOLEAN               -- Can export CSV?

-- Status
is_active               BOOLEAN               -- Can login?
is_verified             BOOLEAN               -- Email verified?
last_login              TIMESTAMP             -- Last login time
login_attempts          INTEGER               -- Failed attempts
locked_until            TIMESTAMP             -- Lockout expiry

-- Metadata
created_by              INTEGER               -- Super admin who created
notes                   TEXT                  -- Admin notes
created_at              TIMESTAMP
updated_at              TIMESTAMP
```

**Sample Data:**
```
id | admin_reference | email                    | full_name      | branch_id | can_approve | is_active
1  | BA-001          | alabang.admin@hhasia.com | Alabang Admin  | 1         | true        | true
2  | BA-002          | bicutan.admin@hhasia.com | Bicutan Admin  | 2         | true        | true
3  | BA-003          | bacoor.admin@hhasia.com  | Bacoor Admin   | 3         | true        | true
4  | BA-004          | sucat.admin@hhasia.com   | Sucat Admin    | 4         | true        | true
5  | BA-005          | sucat2.admin@hhasia.com  | Sucat 2 Admin  | 5         | true        | true
6  | BA-006          | laoag.admin@hhasia.com   | Laoag Admin    | 6         | true        | true
```

**Permissions Example:**
```javascript
// Branch admin can ONLY:
✅ View bookings for their branch (branch_id = 1)
✅ Approve/reject bookings for their branch
✅ Assign bays in their branch
✅ Edit bookings in their branch
✅ Export their branch data

// Branch admin CANNOT:
❌ View other branches' bookings
❌ Manage other branch admins
❌ Access system settings
❌ Delete bookings (if can_delete_bookings = false)
```

---

## 👑 Table 6: super_admins

**Purpose:** System-wide administrator accounts

**Fields:**
```sql
id                          SERIAL PRIMARY KEY
admin_reference             VARCHAR(50) UNIQUE    -- 'SA-001'

-- Login Credentials
email                       VARCHAR(255) UNIQUE   -- Login email
password_hash               VARCHAR(255)          -- Bcrypt hashed password

-- Profile
full_name                   VARCHAR(255)          -- Admin name
phone                       VARCHAR(50)           -- Contact number
avatar_url                  TEXT                  -- Profile photo URL

-- Role
role                        VARCHAR(50)           -- 'super_admin', 'owner'
level                       INTEGER               -- Permission level (1=highest)

-- Permissions (ALL enabled by default)
can_manage_branches         BOOLEAN               -- Can manage branches?
can_manage_admins           BOOLEAN               -- Can manage admins?
can_view_all_bookings       BOOLEAN               -- Can view all bookings?
can_delete_any_booking      BOOLEAN               -- Can delete any booking?
can_view_analytics          BOOLEAN               -- Can view analytics?
can_export_all_data         BOOLEAN               -- Can export everything?
can_manage_services         BOOLEAN               -- Can manage services?
can_manage_pricing          BOOLEAN               -- Can manage pricing?
can_access_system_settings  BOOLEAN               -- Can access settings?

-- Status
is_active                   BOOLEAN               -- Can login?
is_verified                 BOOLEAN               -- Email verified?
last_login                  TIMESTAMP             -- Last login
login_attempts              INTEGER               -- Failed attempts
locked_until                TIMESTAMP             -- Lockout expiry

created_at                  TIMESTAMP
updated_at                  TIMESTAMP
```

**Sample Data:**
```
id | admin_reference | email                | full_name         | role        | level
1  | SA-001          | superadmin@hhasia.com| System Admin      | super_admin | 1
2  | SA-002          | owner@hhasia.com     | Business Owner    | owner       | 0
```

**Super Admin Can:**
```javascript
✅ View ALL bookings across ALL branches
✅ Manage ALL branch admins
✅ Create/edit/delete branches
✅ Access system-wide analytics
✅ Manage services and pricing
✅ Export all data
✅ Delete any booking
✅ Access system settings
✅ View audit logs
```

---

## 📝 Table 7: audit_logs

**Purpose:** Track all important actions for security and accountability

**Fields:**
```sql
id              SERIAL PRIMARY KEY

-- Action Details
action          VARCHAR(100)      -- 'BOOKING_CREATED', 'BOOKING_APPROVED', etc.
entity_type     VARCHAR(50)       -- 'booking', 'customer', 'admin'
entity_id       INTEGER           -- ID of the affected entity

-- Who did it
user_type       VARCHAR(50)       -- 'customer', 'branch_admin', 'super_admin'
user_id         INTEGER           -- User who performed action
user_email      VARCHAR(255)      -- User's email
user_name       VARCHAR(255)      -- User's name

-- What changed
old_values      JSONB             -- Previous values
new_values      JSONB             -- New values
description     TEXT              -- Human-readable description

-- Metadata
ip_address      VARCHAR(50)       -- User's IP
user_agent      TEXT              -- Browser info
branch_id       INTEGER           -- Which branch (if applicable)

created_at      TIMESTAMP
```

**Sample Data:**
```
id | action              | user_type    | user_name     | entity_type | entity_id | description
1  | BOOKING_CREATED     | customer     | Juan Dela Cruz| booking     | 1         | Customer created booking
2  | BOOKING_APPROVED    | branch_admin | Alabang Admin | booking     | 1         | Approved and assigned Bay 1
3  | BOOKING_COMPLETED   | branch_admin | Alabang Admin | booking     | 1         | Service completed
4  | ADMIN_LOGIN         | branch_admin | Alabang Admin | admin       | 1         | Admin logged in
5  | BOOKING_DELETED     | super_admin  | System Admin  | booking     | 5         | Deleted test booking
```

**Tracked Actions:**
- BOOKING_CREATED
- BOOKING_APPROVED
- BOOKING_REJECTED
- BOOKING_CANCELLED
- BOOKING_COMPLETED
- BOOKING_DELETED
- BOOKING_EDITED
- ADMIN_LOGIN
- ADMIN_LOGOUT
- ADMIN_CREATED
- ADMIN_UPDATED
- CUSTOMER_CREATED
- CUSTOMER_UPDATED

---

## 🔧 Table 8: service_bays

**Purpose:** Manage service bays for each branch

**Fields:**
```sql
id              SERIAL PRIMARY KEY
branch_id       INTEGER           -- FK to branches
bay_number      INTEGER           -- Bay number (1, 2, 3, 4)
bay_name        VARCHAR(50)       -- 'Bay 1', 'Bay 2', etc.
bay_type        VARCHAR(50)       -- 'general', 'alignment', 'balancing'
is_active       BOOLEAN           -- Is bay operational?
created_at      TIMESTAMP
```

**Sample Data:**
```
id | branch_id | bay_number | bay_name | bay_type | is_active
1  | 1         | 1          | Bay 1    | general  | true
2  | 1         | 2          | Bay 2    | general  | true
3  | 1         | 3          | Bay 3    | alignment| true
4  | 1         | 4          | Bay 4    | balancing| true
5  | 6         | 1          | Bay 1    | general  | true
...
```

---

## 🔐 Security & Access Control

### Row Level Security (RLS) Policies:

```sql
-- Branch admins can ONLY see their branch's bookings
CREATE POLICY "Branch admins see own branch bookings" ON bookings
    FOR SELECT
    USING (
        branch_id = (
            SELECT branch_id FROM branch_admins 
            WHERE id = current_setting('app.current_admin_id')::integer
        )
    );

-- Super admins can see ALL bookings
CREATE POLICY "Super admins see all bookings" ON bookings
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM super_admins 
            WHERE id = current_setting('app.current_admin_id')::integer
        )
    );

-- Customers can only see their own bookings
CREATE POLICY "Customers see own bookings" ON bookings
    FOR SELECT
    USING (
        customer_id = (
            SELECT id FROM customers 
            WHERE id = current_setting('app.current_customer_id')::integer
        )
    );
```

---

## 📊 Dashboard Queries

### Branch Admin Dashboard:
```sql
-- Get bookings for this branch
SELECT * FROM bookings 
WHERE branch_id = 1 
ORDER BY created_at DESC;

-- Get statistics
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'pending') as pending,
  COUNT(*) FILTER (WHERE status = 'approved') as approved,
  COUNT(*) FILTER (WHERE status = 'completed') as completed
FROM bookings 
WHERE branch_id = 1;

-- Get today's bookings
SELECT * FROM bookings 
WHERE branch_id = 1 
AND preferred_date = CURRENT_DATE
ORDER BY preferred_time;
```

### Super Admin Dashboard:
```sql
-- Get ALL statistics
SELECT 
  COUNT(*) as total_bookings,
  COUNT(*) FILTER (WHERE status = 'pending') as pending,
  COUNT(*) FILTER (WHERE status = 'approved') as approved,
  COUNT(*) FILTER (WHERE status = 'completed') as completed,
  COUNT(DISTINCT customer_id) as unique_customers,
  COUNT(DISTINCT branch_id) as active_branches
FROM bookings;

-- Get bookings by branch
SELECT 
  b.name as branch_name,
  COUNT(book.id) as total_bookings,
  COUNT(*) FILTER (WHERE book.status = 'pending') as pending,
  COUNT(*) FILTER (WHERE book.status = 'approved') as approved
FROM branches b
LEFT JOIN bookings book ON b.id = book.branch_id
GROUP BY b.id, b.name;

-- Get all active branch admins
SELECT ba.*, br.branch_code, br.name as branch_name
FROM branch_admins ba
JOIN branches br ON ba.branch_id = br.id
WHERE ba.is_active = true;
```

---

## 🚀 Ready to Implement?

**Next steps:**
1. ✅ Create Supabase project
2. ✅ Run the SQL schema
3. ✅ Install Supabase client in your app
4. ✅ Update components to use database
5. ✅ Implement authentication for admins
6. ✅ Add real-time subscriptions

**Want me to help you set this up?** Just say the word! 🎯
