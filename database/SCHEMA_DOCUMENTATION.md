# HH Asia Tyre - Complete Database Schema

## 📊 Database Tables Overview

Your database will have **8 core tables**:

| Table | Purpose | Key Fields |
|-------|---------|------------|
| **branches** | Branch locations | id, branch_code, name, area, city |
| **customers** | Customer information | id, full_name, email, phone, total_bookings |
| **vehicles** | Customer vehicles | id, customer_id, plate_number, make, model, year |
| **bookings** | Booking requests | id, booking_reference, branch_id, customer_id, status, services, bay_id |
| **branch_admins** | Branch admin accounts | id, email, password_hash, branch_id, permissions |
| **super_admins** | Super admin accounts | id, email, password_hash, role, permissions |
| **audit_logs** | Activity tracking | id, action, user_type, entity_type, description |
| **service_bays** | Bay management | id, branch_id, bay_number, bay_name |

---

## 🗄️ Complete SQL Schema

**File location:** `database/COMPLETE_SCHEMA.sql`

See the SQL file for the complete schema with all tables, indexes, and seed data.

---

## 🔑 Key Features

### 1. Customer Management
- ✅ Customer profiles with contact info
- ✅ Track booking history
- ✅ VIP customer flag
- ✅ Preferred branch
- ✅ Status tracking (Active/Inactive/Blacklisted)

### 2. Booking Requests
- ✅ Complete booking lifecycle
- ✅ Status flow: pending → approved → in_progress → completed
- ✅ Bay assignment during approval
- ✅ Service tracking (JSON array)
- ✅ Payment tracking
- ✅ Customer concerns/notes
- ✅ Admin notes
- ✅ Cancellation tracking

### 3. Branch Admin Accounts
- ✅ Email/password authentication
- ✅ Branch-specific assignment
- ✅ Granular permissions:
  - can_approve_bookings
  - can_reject_bookings
  - can_delete_bookings
  - can_edit_bookings
  - can_view_analytics
  - can_manage_bays
  - can_export_data
- ✅ Login tracking
- ✅ Account lockout (failed attempts)
- ✅ Active/inactive status

### 4. Super Admin Accounts
- ✅ System-wide access
- ✅ Higher permission level
- ✅ Can manage all branches
- ✅ Can manage branch admins
- ✅ Can delete any booking
- ✅ Can access system settings
- ✅ Can manage services and pricing

### 5. Security Features
- ✅ Password hashing (bcrypt)
- ✅ Row-level security policies
- ✅ Login attempt tracking
- ✅ Account lockout mechanism
- ✅ Audit logging for all actions
- ✅ Permission-based access control

---

## 📋 Table Relationships

```
super_admins (System-wide access)
    ↓ can manage
branch_admins (Branch-specific)
    ↓ assigned to
branches (Locations)
    ↓ has many
bookings (Requests)
    ↓ belongs to
customers (People)
    ↓ owns
vehicles (Cars)
```

**Detailed relationships:**
- 1 Branch has many Branch Admins
- 1 Branch has many Bookings
- 1 Branch has many Service Bays
- 1 Customer has many Bookings
- 1 Customer has many Vehicles
- 1 Vehicle belongs to 1 Customer
- 1 Booking belongs to 1 Branch
- 1 Booking belongs to 1 Customer
- 1 Booking belongs to 1 Vehicle
- 1 Booking is approved by 1 Branch Admin

---

## 🔐 Authentication Flow

### Branch Admin Login:
```sql
SELECT * FROM branch_admins 
WHERE email = 'admin@hhasia.com' 
AND is_active = true
AND (locked_until IS NULL OR locked_until < NOW());

-- If login successful:
UPDATE branch_admins 
SET last_login = NOW(), login_attempts = 0 
WHERE email = 'admin@hhasia.com';

-- If login failed:
UPDATE branch_admins 
SET login_attempts = login_attempts + 1,
    locked_until = CASE 
      WHEN login_attempts >= 5 THEN NOW() + INTERVAL '30 minutes'
      ELSE locked_until
    END
WHERE email = 'admin@hhasia.com';
```

### Super Admin Login:
```sql
SELECT * FROM super_admins 
WHERE email = 'superadmin@hhasia.com' 
AND is_active = true;
```

---

## 📊 Status Workflows

### Booking Status Flow:
```
pending (Customer submitted)
  ↓ (Admin approves with bay)
approved (Confirmed)
  ↓ (Customer arrives)
in_progress (Service started)
  ↓ (Service completed)
completed (Done)

Alternative paths:
pending → rejected (Admin rejects)
pending → cancelled (Customer cancels)
approved → cancelled (Customer no-show)
```

### Admin Account Status:
```
is_active: true → Can login
is_active: false → Cannot login
locked_until: timestamp → Temporarily locked (too many failed attempts)
is_verified: true → Email verified
is_verified: false → Pending verification
```

---

## 🎯 Example Queries

### Get all bookings for a branch admin:
```sql
SELECT b.*, c.full_name, c.phone, c.email, v.make, v.model, v.plate_number
FROM bookings b
JOIN customers c ON b.customer_id = c.id
JOIN vehicles v ON b.vehicle_id = v.id
JOIN branch_admins ba ON b.branch_id = ba.branch_id
WHERE ba.email = 'alabang.admin@hhasia.com'
ORDER BY b.created_at DESC;
```

### Get branch admin with their branch info:
```sql
SELECT ba.*, br.branch_code, br.name as branch_name, br.area, br.city
FROM branch_admins ba
JOIN branches br ON ba.branch_id = br.id
WHERE ba.email = 'alabang.admin@hhasia.com';
```

### Get super admin dashboard stats:
```sql
SELECT 
  (SELECT COUNT(*) FROM bookings) as total_bookings,
  (SELECT COUNT(*) FROM bookings WHERE status = 'pending') as pending_bookings,
  (SELECT COUNT(*) FROM bookings WHERE status = 'approved') as approved_bookings,
  (SELECT COUNT(*) FROM bookings WHERE status = 'completed') as completed_bookings,
  (SELECT COUNT(*) FROM customers) as total_customers,
  (SELECT COUNT(*) FROM branch_admins WHERE is_active = true) as active_admins,
  (SELECT COUNT(*) FROM branches WHERE is_active = true) as active_branches;
```

### Track admin activity:
```sql
SELECT al.*, ba.full_name as admin_name, br.branch_code
FROM audit_logs al
LEFT JOIN branch_admins ba ON al.user_id = ba.id
LEFT JOIN branches br ON al.branch_id = br.id
WHERE al.user_type = 'branch_admin'
ORDER BY al.created_at DESC
LIMIT 50;
```

---

## 🚀 Next Steps

1. **Run this schema in Supabase**
2. **Create API functions** to interact with tables
3. **Update frontend** to use Supabase client
4. **Implement authentication** for admins
5. **Add real-time subscriptions** for live updates
6. **Set up Row Level Security** policies

---

**Ready to implement?** Let me know and I'll help you:
1. Set up the Supabase project
2. Run the schema
3. Create the Supabase client code
4. Update your existing components to use the database!
