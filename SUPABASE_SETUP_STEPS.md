# Supabase Setup Guide - HH Asia Tyre

## 🎯 Overview

This guide will help you:
1. ✅ Create your own Supabase project (isolated from Team A)
2. ✅ Run the database schema
3. ✅ Configure your project
4. ✅ Set up environment variables
5. ✅ Install Supabase client
6. ✅ Verify everything works

**Time needed:** 15-20 minutes

---

## 📋 Before You Start

**You need:**
- [ ] GitHub account
- [ ] Web browser
- [ ] HH Asia Tyre project open in editor

**We'll create:**
- Separate Supabase project (NOT Team A's)
- 8 database tables
- 6 branch records
- Row-level security
- Performance indexes

---

## 🚀 STEP 1: Create Supabase Project (5 min)

### 1.1 Go to Supabase

Open browser and navigate to:
```
https://supabase.com
```

### 1.2 Sign In

1. Click **"Start your project"** or **"Sign In"**
2. Choose **"Continue with GitHub"**
3. Authorize if prompted

### 1.3 Create New Project

1. Click **"New Project"** (green button, top right)

2. Fill in details:

   **Organization:** Your personal org
   
   **Project Details:**
   ```
   Name: hh-asia-tyre
   Database Password: HHAsia2026!Secure#DB
   Region: Singapore (Southeast Asia) ← IMPORTANT!
   Pricing Plan: Free
   ```

3. Click **"Create new project"**

4. Wait 2-3 minutes for setup

### 1.5 Verify

You should see:
- ✅ Dashboard with sidebar
- ✅ Project name: `hh-asia-tyre`
- ✅ Status: "Your project is ready!"

---

## 🔑 STEP 2: Get API Credentials (2 min)

### 2.1 Navigate to API Settings

1. Click **"Project Settings"** (gear icon, bottom left)
2. Click **"API"** in settings menu

### 2.2 Copy Credentials

**Copy these TWO values:**

```
Project URL:
https://xxxxxxxxxxxxx.supabase.co
(copy the full URL)

anon/public key:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
(copy the entire key)
```

⚠️ **IMPORTANT:**
- Use `anon/public` key (SAFE for frontend)
- NEVER use `service_role` key in frontend
- Save both values securely

---

## 🗄️ STEP 3: Run Database Schema (5 min)

### 3.1 Open SQL Editor

1. Click **"SQL Editor"** in left sidebar
2. Click **"New query"** (top right)

### 3.2 Copy Schema SQL

**File location:** `database/FINAL_SCHEMA.sql`

Open that file and copy **ALL** the content (501 lines).

### 3.3 Execute Schema

1. Paste the entire SQL into the editor
2. Click **"Run"** button (or press `Ctrl+Enter`)
3. Wait for execution (5-10 seconds)

### 3.4 Verify Success

You should see:
```
NOTICE: ============================================
NOTICE: HH ASIA TYRE DATABASE SETUP COMPLETE!
NOTICE: ============================================
NOTICE: Tables created: 8
NOTICE: Branches seeded: 6
NOTICE: Service bays seeded: 24 (4 per branch)
NOTICE: Indexes created: 17
NOTICE: RLS policies enabled: Yes
NOTICE: ============================================
```

### 3.5 Check Tables

1. Click **"Table Editor"** in left sidebar
2. You should see 8 tables:
   - ✅ branches (6 rows)
   - ✅ customers (0 rows)
   - ✅ vehicles (0 rows)
   - ✅ bookings (0 rows)
   - ✅ branch_admins (0 rows)
   - ✅ super_admins (0 rows)
   - ✅ audit_logs (0 rows)
   - ✅ service_bays (24 rows)

---

## 🔧 STEP 4: Configure Environment Variables (2 min)

### 4.1 Create .env File

In your project root (`hh-asia-tyre-prototype/.env`):

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...your-key-here...

# App Configuration
VITE_APP_NAME=HH Asia Tyre
VITE_APP_URL=http://localhost:5173
```

**Replace:**
- `https://xxxxxxxxxxxxx.supabase.co` with your actual Project URL
- `eyJhbGci...your-key-here...` with your actual anon/public key

### 4.2 Update .gitignore

Make sure `.env` is in your `.gitignore`:

```bash
# Add this line to .gitignore
.env
```

---

## 💻 STEP 5: Install Supabase Client (1 min)

Open terminal in your project directory:

```bash
cd hh-asia-tyre-prototype
npm install @supabase/supabase-js
```

**Expected output:**
```
added 1 package, and audited 500 packages in 5s
```

---

## ✅ STEP 6: Verify Database Connection (2 min)

### 6.1 Run Verification Script

```bash
node verify-database.js
```

### 6.2 Expected Output

```
🔍 DATABASE VERIFICATION
========================

Step 1: Checking credentials...
✅ Credentials found

Step 2: Checking for Team A database...
✅ Not Team A's database

Step 3: Verifying HH Asia Tyre project...
✅ HH Asia Tyre project confirmed

Step 4: Connecting to database...
✅ Database connection successful

Step 5: Checking for HH Asia Tyre tables...
✅ branches table exists
✅ customers table exists
✅ bookings table exists
✅ branch_admins table exists

Step 6: Checking for Team A tables (should not exist)...
         Scanning all 47 Team A tables...
✅ No Team A tables found (scanned 47 tables)
✅ Database is 100% isolated

========================
✅ VERIFICATION PASSED!
========================

Database URL: https://xxxxxxxxxxxxx.supabase.co
Project: HH Asia Tyre
Status: Safe to use

You can now:
  - Run database migrations
  - Deploy to production
  - Test database operations
  - Make schema changes

⚠️  Remember: NEVER share these credentials with Team A!
```

---

## 🎉 SUCCESS! Your Database is Ready!

### What You Have Now:

✅ **Supabase Project:** `hh-asia-tyre`
✅ **Database:** PostgreSQL (isolated from Team A)
✅ **Tables:** 8 tables created
✅ **Data:** 6 branches, 24 service bays
✅ **Security:** Row-level policies enabled
✅ **Performance:** 17 indexes created
✅ **Client:** @supabase/supabase-js installed
✅ **Verified:** No Team A overlap

---

## 📊 Database Summary

### Tables Created:

| Table | Rows | Purpose |
|-------|------|---------|
| branches | 6 | Branch locations |
| customers | 0 | Customer profiles |
| vehicles | 0 | Customer vehicles |
| bookings | 0 | Booking requests |
| branch_admins | 0 | Branch admin accounts |
| super_admins | 0 | Super admin accounts |
| audit_logs | 0 | Activity tracking |
| service_bays | 24 | Service bay management |

### Branches Seeded:

1. Alabang - Goodyear High Performance Center
2. Bicutan - HH Asia Tyre Bicutan
3. Bacoor - HH Asia Tyre Bacoor
4. Sucat - HH Asia Tyre Sucat
5. Sucat 2 - HH Asia Tyre Sucat 2
6. Laoag - HH Asia Tyre Laoag

---

## 🚀 Next Steps

Now that your database is set up, you can:

### 1. Create Supabase Client Code
I can create `src/utils/supabase.js` with all database operations.

### 2. Update Components to Use Database
I can update:
- `BookingPage.jsx` - Save bookings to database
- `AdminDashboard.jsx` - Fetch bookings from database
- Authentication for admins

### 3. Add Real-time Features
Supabase supports real-time subscriptions for live updates.

### 4. Deploy to Production
Push to Vercel with database connected.

---

## 🔐 Security Checklist

- [x] Created separate Supabase project
- [x] Using `anon/public` key (safe for frontend)
- [x] `service_role` key kept secret
- [x] `.env` file in `.gitignore`
- [x] Row-level security enabled
- [x] No Team A credentials used
- [x] Verification script passed

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `database/FINAL_SCHEMA.sql` | Complete database schema (501 lines) |
| `verify-database.js` | Automated verification script |
| `DATABASE_ISOLATION_POLICY.md` | Safety documentation |
| `database/TEAM_A_VS_HH_ASIA_COMPARISON.md` | Comparison document |

---

## 🆘 Troubleshooting

### Problem: "Project already exists"
**Solution:** Use a different name like `hh-asia-tyre-booking`

### Problem: SQL execution error
**Solution:** 
1. Check if you copied the entire `FINAL_SCHEMA.sql`
2. Make sure you're in YOUR project, not Team A's
3. Check error message for details

### Problem: Verification script fails
**Solution:**
1. Check `.env` file has correct credentials
2. Make sure you ran `npm install @supabase/supabase-js`
3. Verify you're in the correct project directory

### Problem: Can't see tables in Table Editor
**Solution:**
1. Refresh the page
2. Check if SQL execution succeeded
3. Look for error messages in SQL editor

---

## 📞 Need Help?

If you encounter any issues:

1. Check the error message
2. Verify you're using YOUR Supabase credentials
3. Make sure Team A's database is not being accessed
4. Review the verification script output
5. Check Supabase logs (Dashboard → Logs)

---

**Ready to proceed?** 

Follow the steps above, then tell me: **"Database setup complete"** and I'll help you integrate it with your frontend! 🎯
