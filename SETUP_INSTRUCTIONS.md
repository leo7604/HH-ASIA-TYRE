# 🚗 HH Asia Tyre Booking System - Setup & Installation Guide

**Version:** 1.0  
**Release Date:** April 2026  
**System Type:** Progressive Web App (PWA) with Supabase Backend

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [System Requirements](#requirements)
3. [Quick Start (5 Minutes)](#quick-start)
4. [Detailed Installation](#detailed-installation)
5. [Environment Configuration](#environment-config)
6. [Supabase Setup](#supabase-setup)
7. [Database Schema](#database-schema)
8. [Running the Application](#running-app)
9. [Deployment to Vercel](#deployment)
10. [Testing the System](#testing)
11. [Admin Accounts Setup](#admin-setup)
12. [Troubleshooting](#troubleshooting)
13. [Support & Resources](#support)

---

<a name="system-overview"></a>
## 1. System Overview

HH Asia Tyre is a complete **booking and management system** for a multi-branch automotive service chain.

### Key Features:

✅ **Customer Booking System**
- Multi-step booking flow (branch → vehicle → services → date/time → info → confirm)
- Real-time slot availability checking
- One customer per time slot (prevents double booking)
- Past time/date prevention (Philippines timezone)
- Instant confirmation with booking reference

✅ **Branch Management (6 Branches)**
- Alabang, Bicutan, Bacoor, Sucat (2), Laoag
- Branch-specific admin dashboards
- Bay assignment and management
- Booking approval workflow

✅ **Admin Features**
- Branch Admin: Approve/reject bookings, assign bays, mark complete
- Super Admin: Manage branch admins, view all branches
- Role-based access control

✅ **Progressive Web App (PWA)**
- Installable on mobile devices
- Offline support
- Push notifications ready
- Works on Android, iOS, and Desktop

✅ **Integration Ready**
- Supabase database backend
- CRM API integration (optional)
- Google Analytics 4
- Email/SMS notifications ready

---

<a name="requirements"></a>
## 2. System Requirements

### Minimum Requirements:

**For Development:**
- Node.js 18+ (https://nodejs.org)
- npm 9+ or yarn 1.22+
- Git (https://git-scm.com)
- Modern browser (Chrome, Firefox, Edge, Safari)
- 4GB RAM minimum
- 2GB disk space

**For Production:**
- Vercel account (free tier works)
- Supabase account (free tier works)
- Custom domain (optional)

### Supported Platforms:
- ✅ Windows 10/11
- ✅ macOS 11+
- ✅ Linux (Ubuntu 20.04+, Fedora 36+)
- ✅ Mobile (iOS 13+, Android 10+)

---

<a name="quick-start"></a>
## 3. Quick Start (5 Minutes)

### Step 1: Extract the Package
```bash
# Unzip the downloaded file
unzip hh-asia-tyre-system.zip
cd hh-asia-tyre-prototype
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your Supabase credentials
# Get these from: https://app.supabase.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Start Development Server
```bash
npm run dev
```

### Step 5: Open Browser
Navigate to: **http://localhost:5173**

**That's it! Your booking system is running! 🎉**

---

<a name="detailed-installation"></a>
## 4. Detailed Installation

### Windows:

1. **Install Node.js**
   - Download from: https://nodejs.org/en/download/
   - Run installer (LTS version recommended)
   - Verify installation:
     ```cmd
     node --version
     npm --version
     ```

2. **Extract Project Files**
   - Right-click `hh-asia-tyre-system.zip`
   - Select "Extract All..."
   - Choose destination folder
   - Open extracted folder

3. **Open Command Prompt**
   - Navigate to project folder:
     ```cmd
     cd path\to\hh-asia-tyre-prototype
     ```

4. **Install Dependencies**
   ```cmd
   npm install
   ```
   Wait for installation to complete (~2 minutes)

### macOS/Linux:

1. **Install Node.js**
   ```bash
   # Using Homebrew (macOS)
   brew install node
   
   # Or using nvm (recommended)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install --lts
   ```

2. **Extract Project**
   ```bash
   unzip hh-asia-tyre-system.zip
   cd hh-asia-tyre-prototype
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

---

<a name="environment-config"></a>
## 5. Environment Configuration

### Create `.env` File:

In the project root, create a file named `.env`:

```env
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# CRM API Integration (OPTIONAL)
VITE_CRM_API_URL=https://your-crm-api.vercel.app/api/public/bookings

# Google Analytics 4 (OPTIONAL)
VITE_GA4_ID=G-XXXXXXXXXX

# App Configuration
VITE_APP_NAME=HH Asia Tyre
VITE_APP_URL=http://localhost:5173
```

### Getting Supabase Credentials:

1. Go to https://app.supabase.com
2. Create new project or use existing
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

⚠️ **IMPORTANT:** Never commit `.env` file to Git (it's already in `.gitignore`)

---

<a name="supabase-setup"></a>
## 6. Supabase Setup

### Step 1: Create Supabase Project

1. Visit https://app.supabase.com
2. Click **"New Project"**
3. Fill in:
   - Project name: `HH Asia Tyre`
   - Database password: (create a strong password)
   - Region: Choose closest to Philippines (Singapore or Tokyo)
4. Click **"Create new project"**

### Step 2: Create Database Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Customers Table
CREATE TABLE customers (
  id BIGSERIAL PRIMARY KEY,
  customer_reference VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  total_bookings INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vehicles Table
CREATE TABLE vehicles (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT REFERENCES customers(id),
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  plate_number VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bookings Table
CREATE TABLE bookings (
  id BIGSERIAL PRIMARY KEY,
  booking_reference VARCHAR(50) UNIQUE NOT NULL,
  customer_id BIGINT REFERENCES customers(id),
  vehicle_id BIGINT REFERENCES vehicles(id),
  branch_id INTEGER NOT NULL,
  services TEXT[] NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time VARCHAR(20) NOT NULL,
  customer_concern TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  bay_id INTEGER,
  bay_name VARCHAR(50),
  confirmed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Branch Admins Table
CREATE TABLE branch_admins (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  branch_id INTEGER NOT NULL,
  branch_name VARCHAR(100),
  phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Super Admins Table
CREATE TABLE super_admins (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Step 3: Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE branch_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE super_admins ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for booking creation)
CREATE POLICY "Public can read customers" ON customers FOR SELECT USING (true);
CREATE POLICY "Public can create customers" ON customers FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read vehicles" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Public can create vehicles" ON vehicles FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Public can create bookings" ON bookings FOR INSERT WITH CHECK (true);
```

### Step 4: Create Booking Reference Trigger

```sql
-- Auto-generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_reference := 'BK-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(CAST(COALESCE((
    SELECT MAX(CAST(SPLIT_PART(booking_reference, '-', 3) AS INTEGER))
    FROM bookings
    WHERE booking_reference LIKE 'BK-' || TO_CHAR(NOW(), 'YYYYMMDD') || '%'
  ), 0) + 1 AS VARCHAR), 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_reference
BEFORE INSERT ON bookings
FOR EACH ROW
WHEN (NEW.booking_reference IS NULL)
EXECUTE FUNCTION generate_booking_reference();
```

---

<a name="database-schema"></a>
## 7. Database Schema

### Entity Relationship:

```
customers (1) ────< (many) bookings >──── (1) vehicles
                                              │
                                              └─── branch_id (1-6)
```

### Table Overview:

| Table | Purpose | Key Fields |
|-------|---------|------------|
| **customers** | Customer information | id, customer_reference, full_name, email, phone |
| **vehicles** | Vehicle details | id, customer_id, make, model, year, plate_number |
| **bookings** | Appointment records | id, booking_reference, branch_id, services, status, bay_id |
| **branch_admins** | Branch admin accounts | id, email, branch_id, branch_name |
| **super_admins** | System admin accounts | id, email, full_name |

---

<a name="running-app"></a>
## 8. Running the Application

### Development Mode:

```bash
npm run dev
```

- **URL:** http://localhost:5173
- **Features:** Hot reload, development tools
- **Stop:** Press `Ctrl+C` in terminal

### Production Build:

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

- **URL:** http://localhost:4173
- **Features:** Optimized, minified, production-ready

### Available Scripts:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

<a name="deployment"></a>
## 9. Deployment to Vercel

### Option 1: Deploy via Git (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/hh-asia-tyre.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click **"New Project"**
   - Import your GitHub repository
   - Configure environment variables
   - Click **"Deploy"**

3. **Set Environment Variables in Vercel**
   - Go to **Project Settings** → **Environment Variables**
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Click **"Save"**
   - Redeploy

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### After Deployment:

1. **Custom Domain (Optional)**
   - Go to Vercel dashboard
   - Navigate to **Project Settings** → **Domains**
   - Add your domain (e.g., `hh-asia-tyre.com`)
   - Follow DNS configuration instructions

2. **Enable HTTPS**
   - Vercel provides free SSL certificates automatically
   - Your site will be available at `https://your-domain.vercel.app`

---

<a name="testing"></a>
## 10. Testing the System

### Test Customer Booking Flow:

1. **Open application** in browser
2. Click **"Book Now"**
3. **Select branch** (e.g., Alabang)
4. **Enter vehicle details**
5. **Choose services** (e.g., Tire Rotation, Oil Change)
6. **Pick date and time**
7. **Fill customer information**
8. **Review and submit**
9. **Save booking reference** (e.g., BK-20260425-001)

### Test Branch Admin Dashboard:

1. Navigate to `/admin`
2. Login with branch admin credentials
3. View **pending bookings**
4. **Approve a booking** and assign bay
5. Check booking status changes to "Approved"
6. **Mark service complete**

### Test Super Admin Dashboard:

1. Navigate to `/super-admin`
2. Login with super admin credentials
3. View **all branches**
4. **Create branch admin** account
5. View **system-wide statistics**

---

<a name="admin-setup"></a>
## 11. Admin Accounts Setup

### Create Super Admin:

Run this in Supabase SQL Editor:

```sql
-- Insert super admin (password: Admin123!)
INSERT INTO super_admins (email, password_hash, full_name, phone, status)
VALUES (
  'admin@hh-asia.com',
  '$2b$10$YourHashedPasswordHere',
  'System Administrator',
  '09171234567',
  'active'
);
```

⚠️ **IMPORTANT:** Use proper password hashing in production!

### Create Branch Admin:

```sql
-- Insert branch admin for Alabang (ID: 1)
INSERT INTO branch_admins (email, password_hash, full_name, branch_id, branch_name, phone, status)
VALUES (
  'alabang@hh-asia.com',
  '$2b$10$YourHashedPasswordHere',
  'Alabang Branch Manager',
  1,
  'Goodyear High Performance Center',
  '09171234568',
  'active'
);
```

### Default Admin Credentials (Development Only):

| Role | Email | Password | Branch |
|------|-------|----------|--------|
| Super Admin | admin@hh-asia.com | Admin123! | All |
| Branch Admin | alabang@hh-asia.com | Admin123! | Alabang (ID: 1) |
| Branch Admin | laoag@hh-asia.com | Admin123! | Laoag (ID: 6) |

⚠️ **Change these passwords immediately in production!**

---

<a name="troubleshooting"></a>
## 12. Troubleshooting

### Common Issues:

#### Issue: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

#### Issue: Port 5173 already in use

**Solution:**
```bash
# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 3000
```

#### Issue: Supabase connection errors

**Check:**
1. `.env` file exists and has correct values
2. Supabase project is active
3. Internet connection is stable
4. CORS settings in Supabase allow your domain

#### Issue: Bookings not saving to database

**Check:**
1. Supabase RLS policies are configured
2. `.env` variables are correct
3. Browser console for error messages
4. Network tab in DevTools for failed requests

#### Issue: PWA install prompt not showing

**Check:**
1. Site is served over HTTPS (required for PWA)
2. `manifest.json` is properly configured
3. Service worker is registered
4. User has interacted with the page

#### Issue: Build fails

**Solution:**
```bash
# Clear cache
npm run build -- --force

# Check for TypeScript errors (if applicable)
npm run lint

# Update dependencies
npm update
```

### Debug Mode:

Add this to `.env` for verbose logging:

```env
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

---

<a name="support"></a>
## 13. Support & Resources

### Documentation:

- `README.md` - Project overview
- `GETTING_STARTED_GUIDE.md` - Customer guide
- `ADMIN_QUICK_START.md` - Admin guide
- `QUICK_REFERENCE_CARD.md` - Quick reference
- `DATABASE_SCHEMA.md` - Database documentation
- `SUPABASE_SETUP_GUIDE.md` - Supabase setup details

### Useful Links:

- **Supabase Docs:** https://supabase.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev

### Project Structure:

```
hh-asia-tyre-prototype/
├── src/
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── utils/             # Utilities & API clients
│   ├── data/              # Mock data
│   └── hooks/             # Custom hooks
├── public/                # Static assets
│   ├── icons/             # PWA icons
│   ├── images/            # Branch & service images
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service worker
├── database/              # SQL scripts & migrations
├── .env                   # Environment variables
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
└── vercel.json            # Vercel deployment config
```

### Getting Help:

📧 **Email:** support@hh-asia.com  
📞 **Phone:** (02) 8123-4567  
💬 **Viber:** [Viber number]  
🐛 **Bug Reports:** [GitHub Issues]  

---

## ✅ Pre-Launch Checklist

Before going live, ensure:

- [ ] All environment variables configured
- [ ] Supabase database setup complete
- [ ] RLS policies applied
- [ ] Admin accounts created
- [ ] Booking flow tested end-to-end
- [ ] Branch admin workflow tested
- [ ] Super admin workflow tested
- [ ] PWA installation tested on mobile
- [ ] Email confirmations working
- [ ] Google Analytics configured
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Performance optimized (Lighthouse score > 90)
- [ ] All branches marked as "open"
- [ ] Test data cleaned from database
- [ ] Backup strategy in place

---

## 🎉 You're Ready!

Your HH Asia Tyre booking system is now ready to serve customers across all 6 branches!

**Next Steps:**
1. Train branch admin staff
2. Promote online booking to customers
3. Monitor booking analytics
4. Collect customer feedback
5. Continuously improve the system

**Thank you for using HH Asia Tyre Booking System! 🚗✨**

---

*Version 1.0 | Last Updated: April 2026*  
*For support, contact: support@hh-asia.com*
