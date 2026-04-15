# 🚀 Quick Start: Supabase Setup

## Follow These Steps (15 minutes)

### 1️⃣ Create Supabase Project (5 min)
```
1. Go to https://supabase.com
2. Sign in with GitHub
3. Click "New Project"
4. Fill in:
   - Name: hh-asia-tyre
   - Password: HHAsia2026!Secure#DB (SAVE IT!)
   - Region: Singapore
   - Plan: Free
5. Click "Create new project"
6. Wait 2-3 minutes
```

### 2️⃣ Get API Credentials (2 min)
```
1. Click "Project Settings" → "API"
2. Copy TWO things:
   - Project URL: https://xxxxx.supabase.co
   - anon/public key: eyJhbGci...
3. Save them securely
```

### 3️⃣ Run Database Schema (5 min)
```
1. Click "SQL Editor" → "New query"
2. Open file: database/FINAL_SCHEMA.sql
3. Copy ALL content (501 lines)
4. Paste into SQL Editor
5. Click "Run" (Ctrl+Enter)
6. Wait for success message
```

### 4️⃣ Create .env File (1 min)
```
Create file: hh-asia-tyre-prototype/.env

Add:
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...your-key...
```

### 5️⃣ Install Client (1 min)
```bash
cd hh-asia-tyre-prototype
npm install @supabase/supabase-js
```

### 6️⃣ Verify (1 min)
```bash
node verify-database.js
```

**Expected:** ✅ VERIFICATION PASSED!

---

## ✅ Done!

Your database is ready with:
- 8 tables
- 6 branches
- 24 service bays
- Row-level security
- 17 performance indexes

**Next:** Tell me "Database setup complete" and I'll integrate it with your app!

---

## 📁 Important Files

| File | What It Does |
|------|--------------|
| `SUPABASE_SETUP_STEPS.md` | Detailed step-by-step guide |
| `database/FINAL_SCHEMA.sql` | Complete database schema |
| `verify-database.js` | Verification script |
| `DATABASE_ISOLATION_POLICY.md` | Safety rules |

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| SQL error | Check you're in YOUR project, not Team A's |
| Can't find tables | Refresh Table Editor page |
| Verification fails | Check .env has correct credentials |
| Project exists | Use name: hh-asia-tyre-booking |

---

**Full guide:** See `SUPABASE_SETUP_STEPS.md`
