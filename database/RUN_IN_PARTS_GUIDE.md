# How to Fix the SQL Error - Run in Parts

## ❌ The Error You Got

```
ERROR: 42703: column "branch_code" of relation "branches" does not exist
```

**Why this happened:**
The SQL script had an error somewhere in the middle, which stopped execution. So the `branches` table was never created, but the INSERT statement tried to run anyway.

---

## ✅ The Fix: Run in 3 Parts

I've split the schema into **3 separate files**. Run them **ONE AT A TIME** in order.

---

## 📋 Step-by-Step Instructions

### **STEP 1: Run Part 1 (Create Tables)**

1. Open Supabase Dashboard
2. Click **"SQL Editor"**
3. Click **"New query"**
4. Open file: `database/PART1_CREATE_TABLES.sql`
5. **Copy ALL content** (198 lines)
6. **Paste** into SQL Editor
7. Click **"Run"** (or Ctrl+Enter)
8. **Wait for success**

**Expected output:**
```
table_name
------------
branches
customers
vehicles
bookings
branch_admins
super_admins
audit_logs
service_bays

(8 rows)
```

✅ **If you see 8 table names, Part 1 succeeded!**

❌ **If you see an error, stop and tell me the error message**

---

### **STEP 2: Run Part 2 (Indexes & Data)**

**ONLY run this after Part 1 succeeds!**

1. Click **"New query"** (don't close the old one)
2. Open file: `database/PART2_INDEXES_SEED_DATA.sql`
3. **Copy ALL content** (137 lines)
4. **Paste** into SQL Editor
5. Click **"Run"**
6. **Wait for success**

**Expected output:**
```
NOTICE: ============================================
NOTICE: PART 2 COMPLETE!
NOTICE: ============================================
NOTICE: Indexes created: 17
NOTICE: Branches seeded: 6
NOTICE: Service bays seeded: 24
NOTICE: Triggers created: 4
NOTICE: ============================================
```

**And you should see:**
```
id | branch_code | name                        | area     | city
1  | ALABANG     | Goodyear High Performance   | Alabang  | Metro Manila
2  | BICUTAN     | HH Asia Tyre Bicutan        | Bicutan  | Taguig
3  | BACOOR      | HH Asia Tyre Bacoor         | Bacoor   | Cavite
4  | SUCAT       | HH Asia Tyre Sucat          | Sucat    | Parañaque
5  | SUCAT2      | HH Asia Tyre Sucat 2        | Sucat 2  | Parañaque
6  | LAOAG       | HH Asia Tyre Laoag          | Laoag    | Ilocos Norte
```

✅ **If you see 6 branches, Part 2 succeeded!**

---

### **STEP 3: Run Part 3 (Security - Optional)**

**ONLY run this after Part 2 succeeds!**

1. Click **"New query"**
2. Open file: `database/PART3_ROW_LEVEL_SECURITY.sql`
3. **Copy ALL content** (64 lines)
4. **Paste** into SQL Editor
5. Click **"Run"**
6. **Wait for success**

**Expected output:**
```
NOTICE: ============================================
NOTICE: PART 3 COMPLETE!
NOTICE: ============================================
NOTICE: RLS enabled on: 8 tables
NOTICE: Policies created: 8
NOTICE: ============================================
NOTICE: DATABASE SETUP 100% COMPLETE!
NOTICE: ============================================
```

✅ **If you see this message, you're 100% done!**

---

## 🎯 Verification

After all 3 parts are done:

1. Click **"Table Editor"** in left sidebar
2. You should see **8 tables**:
   - ✅ branches (6 rows)
   - ✅ customers (0 rows)
   - ✅ vehicles (0 rows)
   - ✅ bookings (0 rows)
   - ✅ branch_admins (0 rows)
   - ✅ super_admins (0 rows)
   - ✅ audit_logs (0 rows)
   - ✅ service_bays (24 rows)

---

## 📁 Files Created

| File | Purpose | When to Run |
|------|---------|-------------|
| `PART1_CREATE_TABLES.sql` | Creates all 8 tables | FIRST |
| `PART2_INDEXES_SEED_DATA.sql` | Adds indexes, branches, bays | SECOND (after Part 1) |
| `PART3_ROW_LEVEL_SECURITY.sql` | Enables security policies | THIRD (optional) |

---

## 🆘 Troubleshooting

### Problem: "table already exists"
**Solution:** The tables were already created. Skip to Part 2.

### Problem: "relation does not exist" in Part 2
**Solution:** Part 1 didn't complete successfully. Run Part 1 again and check for errors.

### Problem: "policy already exists"
**Solution:** Part 3 was already run. You're done!

### Problem: Any other error
**Solution:** **Copy the exact error message and tell me!**

---

## ✅ What to Do Now

1. **Delete the old failed attempt** (if any tables were partially created)
   ```sql
   -- Run this in SQL Editor to clean up:
   DROP TABLE IF EXISTS service_bays CASCADE;
   DROP TABLE IF EXISTS audit_logs CASCADE;
   DROP TABLE IF EXISTS super_admins CASCADE;
   DROP TABLE IF EXISTS branch_admins CASCADE;
   DROP TABLE IF EXISTS bookings CASCADE;
   DROP TABLE IF EXISTS vehicles CASCADE;
   DROP TABLE IF EXISTS customers CASCADE;
   DROP TABLE IF EXISTS branches CASCADE;
   ```

2. **Run Part 1** → `PART1_CREATE_TABLES.sql`

3. **Run Part 2** → `PART2_INDEXES_SEED_DATA.sql`

4. **Run Part 3** → `PART3_ROW_LEVEL_SECURITY.sql`

5. **Verify** in Table Editor

6. **Tell me:** "Database setup complete!"

---

## 🎯 Quick Checklist

- [ ] Clean up old failed tables (if any)
- [ ] Run PART1_CREATE_TABLES.sql → Success?
- [ ] Run PART2_INDEXES_SEED_DATA.sql → Success?
- [ ] Run PART3_ROW_LEVEL_SECURITY.sql → Success?
- [ ] Check Table Editor → 8 tables visible?
- [ ] Check branches table → 6 rows?
- [ ] Check service_bays table → 24 rows?

**If all checkboxes are ✅, you're done!**

---

**Go ahead and run Part 1 now, then let me know if it works!** 🚀
