# Database Isolation Policy

## ⚠️ IMPORTANT: DO NOT MODIFY TEAM A'S DATABASE

### 🔒 ISOLATION GUARANTEE

**HH Asia Tyre Booking System** uses a **COMPLETELY SEPARATE** database from Team A's CRM/Inventory system.

---

## 📊 SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    TEAM A'S SYSTEM                           │
│  (CRM & Inventory Management System)                        │
│                                                              │
│  Supabase Project: team-a-project                           │
│  Database: team_a_database                                  │
│  Tables: users, products, inventory, orders, etc.           │
│  API Keys: team-a-api-keys                                  │
│                                                              │
│  ⛔ DO NOT TOUCH - DO NOT MODIFY - DO NOT ACCESS            │
└─────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                 HH ASIA TYRE SYSTEM                          │
│  (Booking & Appointment Management System)                  │
│                                                              │
│  Supabase Project: hh-asia-tyre-xxxxx                       │
│  Database: hh_asia_database                                 │
│  Tables: branches, customers, bookings, admins, etc.        │
│  API Keys: hh-asia-api-keys                                 │
│                                                              │
│  ✅ SEPARATE PROJECT - NO OVERLAP - NO CONFLICTS            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚫 WHAT YOU MUST NEVER DO

### ❌ NEVER Access Team A's Database:
```javascript
// WRONG - Never do this:
const teamASupabase = createClient('https://team-a-project.supabase.co', 'their-key');
```

### ❌ Never Modify Team A's Tables:
```sql
-- WRONG - Never run this on Team A's project:
ALTER TABLE users ADD COLUMN ...;
DROP TABLE products;
INSERT INTO orders ...;
```

### ❌ Never Share Credentials:
```env
# WRONG - Never mix credentials:
VITE_SUPABASE_URL=https://team-a-project.supabase.co  # Team A's URL
VITE_TEAAM_A_KEY=their-key-here                        # Team A's key
```

---

## ✅ WHAT YOU SHOULD DO

### ✅ Use Your Own Supabase Project:
```javascript
// CORRECT - Use your own credentials:
const supabase = createClient(
  'https://hh-asia-tyre-xxxxx.supabase.co',  // YOUR project
  'your-anon-key-here'                        // YOUR key
);
```

### ✅ Use Your Own Database:
```sql
-- CORRECT - Run this on YOUR Supabase project only:
CREATE TABLE bookings (...);
CREATE TABLE customers (...);
CREATE TABLE branch_admins (...);
```

### ✅ Keep Credentials Separate:
```env
# CORRECT - Your .env file (in hh-asia-tyre-prototype/.env)
VITE_SUPABASE_URL=https://hh-asia-tyre-xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-own-anon-key-here
VITE_API_BASE_URL=https://hh-asia-tyre-crm-inv-sys.vercel.app/api
```

---

## 🔐 CREDENTIAL MANAGEMENT

### Your Supabase Credentials:
- **Project URL**: `https://hh-asia-tyre-xxxxx.supabase.co` (Create your own!)
- **Anon Key**: Get from YOUR Supabase dashboard
- **Service Role Key**: Keep secret, never expose in frontend

### Team A's Credentials:
- **DO NOT REQUEST**
- **DO NOT USE**
- **DO NOT STORE** in your code
- **DO NOT ACCESS** in any way

---

## 📁 PROJECT STRUCTURE

```
hh-asia-tyre-prototype/
├── .env                          # YOUR Supabase credentials only
├── .env.example                  # Template (no real keys)
├── src/
│   ├── utils/
│   │   └── supabase.js          # YOUR Supabase client
│   └── pages/
│       ├── AdminDashboard.jsx   # Uses YOUR database
│       └── BookingPage.jsx      # Uses YOUR database
└── database/
    ├── COMPLETE_SCHEMA.sql      # YOUR schema (for YOUR project)
    └── SCHEMA_DOCUMENTATION.md  # YOUR documentation

⛔ NEVER create files that reference Team A's database
```

---

## 🎯 DATABASE SEPARATION CHECKLIST

Before running any database operations:

- [ ] Am I using MY Supabase project URL?
- [ ] Am I using MY Supabase API keys?
- [ ] Am I connected to MY database?
- [ ] Are these MY tables (not Team A's)?
- [ ] Will this affect only MY system?
- [ ] Have I verified I'm not accessing Team A's project?

**If ANY answer is NO, STOP and verify your credentials!**

---

## 🔍 HOW TO VERIFY YOU'RE IN THE RIGHT DATABASE

### Check Your Supabase Project:

1. **Login to Supabase Dashboard**
2. **Look at project name:**
   - ✅ Should say: `hh-asia-tyre`
   - ❌ Should NOT say: Team A's project name

3. **Check the URL:**
   - ✅ Should be: `https://app.supabase.com/project/hh-asia-tyre-xxxxx`
   - ❌ Should NOT be: Team A's project URL

4. **Verify tables:**
   - ✅ You should see: `branches`, `customers`, `bookings`, etc.
   - ❌ You should NOT see: Team A's tables

---

## 🛡️ SAFETY MEASURES

### 1. Environment Variables
```env
# Add this to .env to prevent mistakes
# This is YOUR database only
SUPABASE_PROJECT=hh-asia-tyre
SUPABASE_OWNER=your-email@hhasia.com
```

### 2. Code Comments
```javascript
// ⚠️ WARNING: This connects to HH ASIA TYRE database ONLY
// DO NOT change these credentials to Team A's database
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
```

### 3. Naming Convention
All your files should clearly indicate they're for HH Asia Tyre:
- `hh-asia-supabase.js`
- `hh-asia-bookings.sql`
- `hh-asia-admin-auth.js`

---

## 📞 IF SOMETHING GOES WRONG

### If You Accidentally Connect to Team A's Database:

1. **IMMEDIATELY disconnect**
2. **DO NOT run any queries**
3. **DO NOT modify any tables**
4. **Notify Team A**
5. **Check audit logs** to see if any changes were made

### Prevention:
- Always double-check project URL
- Verify project name in dashboard
- Use different browser profiles for each project
- Bookmark your own Supabase project

---

## ✅ FINAL VERIFICATION

Before deploying or running database migrations:

```bash
# Run this verification script
node verify-database.js

# Expected output:
✅ Connected to: hh-asia-tyre-xxxxx.supabase.co
✅ Project name: HH Asia Tyre
✅ Tables found: branches, customers, bookings, branch_admins, super_admins
✅ No Team A tables detected
✅ Safe to proceed!
```

---

## 📝 AGREEMENT

By proceeding with this project, you agree to:

1. ✅ Use only YOUR OWN Supabase project
2. ✅ NEVER access Team A's database
3. ✅ NEVER modify Team A's tables
4. ✅ NEVER share Team A's credentials
5. ✅ Keep both systems completely separate
6. ✅ Report any accidental access immediately
7. ✅ Maintain clear documentation of separation

---

**This isolation policy is MANDATORY and NON-NEGOTIABLE.**

**When in doubt, ASK before touching any database!**
