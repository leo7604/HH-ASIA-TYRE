# Team A vs HH Asia Tyre - Database Comparison

## ⚠️ IMPORTANT: TWO SEPARATE SYSTEMS

This document shows the **COMPLETE SEPARATION** between Team A's CRM/Inventory system and your HH Asia Tyre booking system.

---

## 📊 SYSTEM OVERVIEW

### Team A's System (CRM & Business Management)
```
Purpose: Full business management (CRM, Inventory, Accounting, HR)
Tables: 47+ tables
Database: Team A's Supabase project
Schema Style: PascalCase (Customer, Booking, Invoice)
Focus: Enterprise resource planning
```

### Your HH Asia Tyre System (Booking Management)
```
Purpose: Booking & appointment management only
Tables: 8 tables
Database: YOUR separate Supabase project
Schema Style: lowercase (customers, bookings, branch_admins)
Focus: Customer booking workflow with admin approval
```

---

## 🔍 DETAILED TABLE COMPARISON

### Team A's Tables (47 Total) - DO NOT TOUCH!

```sql
-- CUSTOMER MANAGEMENT
Customer               -- Customer profiles
Lead                   -- Sales leads
CrmCall               -- CRM call logs

-- BOOKING & APPOINTMENTS
Booking                -- Customer bookings
Appointment            -- Service appointments
JobCard                -- Work orders
WorkSchedule           -- Work scheduling
Inspection             -- Vehicle inspections
ServiceReminder        -- Service reminders

-- VEHICLES
Vehicle                -- Customer vehicles

-- BRANCHES
Branch                 -- Branch locations (basic)

-- INVENTORY & PRODUCTS
Product                -- Products/services
Part                   -- Auto parts
PartBrand              -- Part brands
PartCategory           -- Part categories
Inventory              -- Stock levels
InventoryAdjustment    -- Stock adjustments

-- VENDORS & PROCUREMENT
Vendor                 -- Vendors/suppliers
PurchaseRequest        -- Purchase requests
PurchaseOrder          -- Purchase orders
Quotation              -- Vendor quotations
GoodsReceipt           -- Received goods
VendorBill             -- Vendor bills
VendorCredit           -- Vendor credits

-- ACCOUNTING & FINANCE
Invoice                -- Customer invoices
Payment                -- Customer payments
PaymentMade            -- Payments to vendors
Expense                -- Business expenses
ExpenseCategory        -- Expense categories
ChartOfAccount         -- Chart of accounts
ManualJournal          -- Journal entries
CreditNote             -- Credit notes

-- HR & EMPLOYEES
Employee               -- Employee records
Payroll                -- Payroll processing
TimeClock              -- Time clock entries
TimeSheet              -- Timesheets

-- SERVICES
Service                -- Service catalog
ServiceGroup           -- Service groups

-- REVIEWS & RATINGS
RatingAndReview        -- Customer reviews
GoogleBusinessReview   -- Google Business reviews

-- USERS & PERMISSIONS
User                   -- System users (all roles)

-- CALENDAR & SCHEDULING
ShopCalendar           -- Shop calendar
ShopTiming             -- Shop hours
Holiday                -- Holidays

-- TASKS & WORKFLOWS
Task                   -- Task management
ApprovalLog            -- Approval workflows

-- RELATIONSHIPS
_AssignedTechnician    -- Technician assignments

-- MIGRATIONS
_prisma_migrations     -- Prisma migration tracking

-- ESTIMATES
Estimate               -- Cost estimates
```

---

### Your HH Asia Tyre Tables (8 Total) - SAFE TO USE!

```sql
-- YOUR TABLES (in your separate Supabase project)

branches               -- Branch locations (detailed)
  id, branch_code, name, area, city, address,
  phone, mobile, email, status, operating_hours,
  rating, review_count, max_bookings_per_slot,
  total_bays, is_active, created_at, updated_at

customers              -- Customer information
  id, customer_reference, full_name, email, phone,
  alternate_phone, address, city, total_bookings,
  completed_bookings, is_vip, preferred_branch_id,
  notes, status, created_at, updated_at

vehicles               -- Customer vehicles
  id, customer_id, plate_number, make, model, year,
  trim, color, vehicle_type, current_mileage,
  last_service_date, is_active, created_at

bookings               -- Booking requests (MAIN TABLE)
  id, booking_reference, confirmation_number,
  branch_id, customer_id, vehicle_id,
  preferred_date, preferred_time, status,
  services (JSONB), other_services,
  bay_id, bay_name, assigned_admin_id,
  customer_concern, admin_notes, cancellation_reason,
  source, how_did_you_hear,
  estimated_cost, final_cost, amount_paid,
  payment_status, payment_method,
  api_booking_id, api_success,
  confirmed_at, cancelled_at, completed_at,
  created_at, updated_at

branch_admins          -- Branch admin accounts
  id, admin_reference, email, password_hash,
  full_name, phone, avatar_url,
  branch_id, role,
  can_approve_bookings, can_reject_bookings,
  can_delete_bookings, can_edit_bookings,
  can_view_analytics, can_manage_bays,
  can_export_data,
  is_active, is_verified, last_login,
  login_attempts, locked_until,
  created_by, notes, created_at, updated_at

super_admins           -- Super admin accounts
  id, admin_reference, email, password_hash,
  full_name, phone, avatar_url,
  role, level,
  can_manage_branches, can_manage_admins,
  can_view_all_bookings, can_delete_any_booking,
  can_view_analytics, can_export_all_data,
  can_manage_services, can_manage_pricing,
  can_access_system_settings,
  is_active, is_verified, last_login,
  login_attempts, locked_until,
  created_at, updated_at

audit_logs             -- Activity tracking
  id, action, entity_type, entity_id,
  user_type, user_id, user_email, user_name,
  old_values (JSONB), new_values (JSONB),
  description, ip_address, user_agent,
  branch_id, created_at

service_bays           -- Service bay management
  id, branch_id, bay_number, bay_name,
  bay_type, is_active, created_at
```

---

## 🎯 KEY DIFFERENCES

### 1. Booking System Comparison

**Team A's Booking:**
```sql
CREATE TABLE public.Booking (
  id text,
  customerId text,           -- References Customer
  vehicleId text,            -- References Vehicle
  branchId text,             -- References Branch
  slotStart timestamp,       -- Single timestamp
  status USER-DEFINED,       -- Enum type
  jobCardId text,            -- Links to JobCard
  service text,              -- Single service
  confirmationNumber text,
  notes text
);
-- Simple, links to JobCard system
```

**Your bookings:**
```sql
CREATE TABLE bookings (
  id SERIAL,
  booking_reference VARCHAR(50),
  branch_id INTEGER,         -- FK to branches
  customer_id INTEGER,       -- FK to customers
  vehicle_id INTEGER,        -- FK to vehicles
  preferred_date DATE,       -- Separate date
  preferred_time VARCHAR(20),-- Separate time
  status VARCHAR(30),        -- Text status
  services JSONB,            -- Multiple services
  bay_id INTEGER,            -- Bay assignment
  bay_name VARCHAR(50),      -- Bay name
  assigned_admin_id INTEGER, -- Who approved
  customer_concern TEXT,     -- Customer notes
  admin_notes TEXT,          -- Admin notes
  payment_status VARCHAR(30),-- Payment tracking
  payment_method VARCHAR(50) -- Payment method
);
-- Complete booking workflow with admin approval
```

**Differences:**
| Feature | Team A | Yours |
|---------|--------|-------|
| ID Type | text (UUID) | SERIAL (auto-increment) |
| Date/Time | slotStart (timestamp) | preferred_date + preferred_time |
| Services | Single service | JSONB array (multiple) |
| Bay Assignment | None | bay_id + bay_name |
| Admin Tracking | None | assigned_admin_id |
| Payment | Separate Invoice table | Built-in payment fields |
| Customer Concern | None | customer_concern field |

---

### 2. Customer Table Comparison

**Team A's Customer:**
```sql
CREATE TABLE public.Customer (
  id text,
  userId text,             -- Links to User
  firstName text,          -- Split name
  lastName text,
  phone text,
  email text,
  address text,
  branch text,             -- Text field
  notes text,
  status text,
  archivedAt timestamp
);
```

**Your customers:**
```sql
CREATE TABLE customers (
  id SERIAL,
  customer_reference VARCHAR(50),
  full_name VARCHAR(255),  -- Full name (not split)
  email VARCHAR(255),
  phone VARCHAR(50),
  alternate_phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  total_bookings INTEGER,  -- Booking count
  completed_bookings INTEGER,
  is_vip BOOLEAN,          -- VIP flag
  preferred_branch_id INTEGER, -- FK to branches
  notes TEXT,
  status VARCHAR(20)
);
```

**Differences:**
| Feature | Team A | Yours |
|---------|--------|-------|
| Name | firstName + lastName | full_name (single field) |
| Phone | Single phone | phone + alternate_phone |
| Branch | Text field | FK to branches table |
| Booking Stats | None | total_bookings + completed_bookings |
| VIP Flag | None | is_vip boolean |
| User Link | userId (FK to User) | No user link needed |

---

### 3. Branch Table Comparison

**Team A's Branch:**
```sql
CREATE TABLE public.Branch (
  id text,
  code text,
  name text
);
-- Very basic: only 3 fields
```

**Your branches:**
```sql
CREATE TABLE branches (
  id SERIAL,
  branch_code VARCHAR(10),
  name VARCHAR(255),
  area VARCHAR(255),         -- Area/district
  city VARCHAR(100),         -- City
  address TEXT,              -- Full address
  phone VARCHAR(50),         -- Landline
  mobile VARCHAR(50),        -- Mobile
  email VARCHAR(255),        -- Branch email
  status VARCHAR(20),        -- open/coming-soon/closed
  operating_hours VARCHAR(100),
  rating DECIMAL(2,1),       -- Google rating
  review_count INTEGER,      -- Review count
  max_bookings_per_slot INTEGER,
  total_bays INTEGER,        -- Total bays
  is_active BOOLEAN
);
-- Detailed: 17 fields with full branch info
```

---

### 4. Admin/User Comparison

**Team A's User:**
```sql
CREATE TABLE public.User (
  id text,
  email text,
  passwordHash text,
  role USER-DEFINED          -- Single role field
);
-- Generic user table for all roles
```

**Your Admins (TWO SEPARATE TABLES):**
```sql
-- Branch Admins (branch-specific)
CREATE TABLE branch_admins (
  id SERIAL,
  email VARCHAR(255),
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  branch_id INTEGER,         -- Assigned to ONE branch
  role VARCHAR(50),
  -- Granular permissions (7 fields)
  can_approve_bookings BOOLEAN,
  can_reject_bookings BOOLEAN,
  can_delete_bookings BOOLEAN,
  can_edit_bookings BOOLEAN,
  can_view_analytics BOOLEAN,
  can_manage_bays BOOLEAN,
  can_export_data BOOLEAN,
  -- Security
  is_active BOOLEAN,
  login_attempts INTEGER,
  locked_until TIMESTAMP
);

-- Super Admins (system-wide)
CREATE TABLE super_admins (
  id SERIAL,
  email VARCHAR(255),
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  role VARCHAR(50),
  level INTEGER,             -- Permission level
  -- Full system permissions (9 fields)
  can_manage_branches BOOLEAN,
  can_manage_admins BOOLEAN,
  can_view_all_bookings BOOLEAN,
  can_delete_any_booking BOOLEAN,
  can_view_analytics BOOLEAN,
  can_export_all_data BOOLEAN,
  can_manage_services BOOLEAN,
  can_manage_pricing BOOLEAN,
  can_access_system_settings BOOLEAN
);
```

**Differences:**
| Feature | Team A | Yours |
|---------|--------|-------|
| User Model | Single User table | Separate branch_admins + super_admins |
| Permissions | Single role enum | Granular boolean permissions |
| Branch Access | Not specified | branch_id FK for branch admins |
| Security | Basic | Login attempts, lockout mechanism |
| Audit Trail | Via AuditLog | Separate audit_logs table |

---

## 🛡️ SAFETY MEASURES

### 1. Separate Supabase Projects
```
Team A: https://team-a-xxxxx.supabase.co
  └─ public schema
  └─ 47 tables
  └─ Their API keys

Yours: https://hh-asia-tyre-xxxxx.supabase.co
  └─ public schema
  └─ 8 tables
  └─ Your API keys
```

### 2. Different Naming Convention
```
Team A: PascalCase (Customer, Booking, Invoice)
Yours: lowercase (customers, bookings, branch_admins)
```

### 3. Different ID Types
```
Team A: text (UUID strings)
Yours: SERIAL (auto-increment integers)
```

### 4. Verification Script
The `verify-database.js` script checks for all 47 of Team A's tables and blocks connection if any are found!

---

## ✅ CONFLICT ANALYSIS

### Table Name Conflicts?
**Answer: NO** ✅

| Reason | Explanation |
|--------|-------------|
| Different Projects | Separate Supabase instances |
| Different Cases | `Customer` vs `customers` |
| Different Purposes | CRM vs Booking system |
| Different Schemas | Completely different structure |

### Data Conflicts?
**Answer: NO** ✅

| Reason | Explanation |
|--------|-------------|
| Separate Databases | No shared data |
| Separate APIs | Different endpoints |
| Separate Users | Different admin accounts |
| Separate Branches | Independent branch data |

### Functional Overlap?
**Answer: MINIMAL** ✅

| Function | Team A | Yours | Overlap? |
|----------|--------|-------|----------|
| Bookings | Simple booking | Booking + approval workflow | Different |
| Customers | CRM profiles | Booking-focused profiles | Different |
| Branches | Basic info | Detailed branch management | Different |
| Users | Generic users | Role-specific admins | Different |

---

## 🎯 WHY YOUR SYSTEM IS BETTER FOR BOOKINGS

### Your HH Asia Tyre System Advantages:

1. **Complete Booking Workflow**
   - pending → approved → completed
   - Bay assignment during approval
   - Admin approval system
   - Rejection with reasons

2. **Granular Permissions**
   - Branch-specific access
   - 7 permission types for branch admins
   - 9 permission types for super admins
   - Account lockout security

3. **Detailed Tracking**
   - Audit logs for all actions
   - Payment tracking
   - Customer concerns
   - Admin notes
   - Booking source tracking

4. **Service Bay Management**
   - Bay assignment
   - Bay availability tracking
   - Multiple services per booking
   - Bay type support

5. **Customer Management**
   - VIP customer flag
   - Booking history
   - Preferred branch
   - Completed bookings count

---

## 📋 MIGRATION CHECKLIST

When setting up your database:

- [ ] Create SEPARATE Supabase project
- [ ] Run verification script: `node verify-database.js`
- [ ] Verify no Team A tables detected
- [ ] Run your schema SQL
- [ ] Test connection to your project only
- [ ] NEVER use Team A's credentials
- [ ] Keep `.env` file secure
- [ ] Document your project URL

---

## 🚨 RED FLAGS - STOP IMMEDIATELY IF:

1. ✅ You see Team A's table names in your database
2. ✅ Your Supabase URL contains "team-a" or "crm-inv"
3. ✅ You're asked to use Team A's API keys
4. ✅ Your database has 47+ tables
5. ✅ You see tables like `Invoice`, `Payroll`, `Inventory`

**If any of these happen:**
1. Disconnect immediately
2. Do NOT run any queries
3. Verify your Supabase project
4. Use the correct credentials
5. Contact for help

---

## ✅ GREEN FLAGS - YOU'RE SAFE IF:

1. ✅ Your project name is "hh-asia-tyre"
2. ✅ You have exactly 8 tables
3. ✅ All table names are lowercase
4. ✅ Verification script passes all checks
5. ✅ No Team A tables detected
6. ✅ Your Supabase URL contains "hh-asia"
7. ✅ You're using your own API keys

---

## 📞 FINAL VERDICT

**Can both systems coexist?**
✅ YES - They're completely separate!

**Will your system affect Team A's?**
❌ NO - Different projects, different databases!

**Is it safe to proceed?**
✅ YES - As long as you use YOUR Supabase project!

**What should you avoid?**
⛔ Never use Team A's credentials
⛔ Never connect to Team A's database
⛔ Never modify Team A's tables
⛔ Never share credentials between systems

---

**Remember: TWO SYSTEMS, TWO DATABASES, ZERO OVERLAP!** 🎯
