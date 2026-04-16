# MODULE 3: Public Facing System - Implementation Guide
## HH Asia Tyre Booking System (Perfectly Aligned)

**Version:** 1.0  
**Date:** April 2026  
**Status:** ✅ Ready for Implementation

---

## 📋 **Overview**

This guide implements **MODULE 3: Public Facing (Booking + Astronic Landing)** specifically designed for your current HH Asia Tyre system.

### **Your Current System Architecture:**
- **Framework:** React 18 + Vite 5 ✅
- **Database:** Supabase (PostgreSQL) with RLS ✅
- **Styling:** Tailwind CSS ✅
- **Routing:** React Router 6 ✅
- **State Management:** React Hooks (useState, useEffect) ✅
- **Deployment:** Vercel ✅
- **Branches:** 6 locations (all open) ✅

---

## 🎯 **MODULE 3 Components Status:**

| Component | Status | Implementation |
|-----------|--------|----------------|
| **1. Booking System** | ✅ COMPLETE | Fully functional (1,436 lines) |
| **2. Astronic Landing** | ✅ CREATED | File added, needs routing |
| **3. Public Inventory** | 🆕 TO BUILD | Implementation guide below |
| **4. Customer Features** | 🔄 ENHANCE | Optional additions |

---

## 1️⃣ **BOOKING SYSTEM** ✅

### **Status: FULLY IMPLEMENTED & TESTED**

**Location:** `src/pages/BookingPage.jsx`

#### **✅ Features Already Working:**

**Multi-Step Booking Flow:**
- ✅ Step 1: Branch Selection (Manila/Laoag regions, 6 branches)
- ✅ Step 2: Vehicle Details (year, make, model, plate)
- ✅ Step 3: Service Selection (6 services with multi-select)
- ✅ Step 4: Date & Time (calendar + time slots with availability)
- ✅ Step 5: Customer Info (name, email, phone, vehicle details)
- ✅ Step 6: Review & Submit (confirmation page)

**Smart Validation:**
- ✅ One customer per time slot (MAX_BOOKINGS_PER_SLOT = 1)
- ✅ Past date/time prevention (Philippines timezone)
- ✅ Real-time slot availability checking
- ✅ 6-month advance booking limit
- ✅ Form validation at each step

**Database Integration:**
- ✅ Saves to Supabase (customers, vehicles, bookings tables)
- ✅ Automatic booking reference generation (BK-YYYYMMDD-XXX)
- ✅ Branch ID tracking
- ✅ Status workflow (pending → approved → completed)

**User Experience:**
- ✅ Progress indicator (Step 1/6, 2/6, etc.)
- ✅ Visual time slot status (green/yellow/red)
- ✅ Mobile responsive design
- ✅ Success animation & redirect

#### **Optional Enhancements (Future):**

```javascript
// 1. Save draft functionality
const saveBookingDraft = () => {
  localStorage.setItem('booking_draft', JSON.stringify(bookingData));
};

// 2. Returning customer auto-fill
const loadCustomerHistory = async (email) => {
  const { data } = await supabase
    .from('customers')
    .select('*')
    .eq('email', email)
    .single();
  return data;
};

// 3. SMS notification integration
const sendSMSConfirmation = (phone, bookingRef) => {
  // Integrate with Semaphore or Twilio
  console.log(`Send SMS to ${phone}: Your booking ${bookingRef} is confirmed!`);
};
```

---

## 2️⃣ **ASTRONIC LANDING PAGE** ✅

### **Status: CREATED - Needs Routing Setup**

**Location:** `src/pages/AstronicLanding.jsx` (just created!)

#### **What's Included:**

✅ Modern purple/pink gradient design  
✅ Hero section with call-to-action  
✅ Services showcase (6 services)  
✅ Portfolio section (3 projects)  
✅ About section with stats  
✅ Contact form  
✅ Responsive navigation  
✅ Link back to HH Asia Tyre  

#### **Next Step: Add to Router**

Update `src/App.jsx` to include the Astronic route:

```javascript
// Add this import
import AstronicLanding from './pages/AstronicLanding';

// Add this route
<Route path="/astronic" element={<AstronicLanding />} />
```

**Access:** `http://localhost:5173/astronic`

---

## 3️⃣ **PUBLIC INVENTORY DISPLAY** 🆕

### **Status: TO BE BUILT**

This feature allows customers to browse available products (tires, batteries, oil, etc.)

### **Implementation Plan:**

#### **Step 1: Database Setup**

Run this SQL in Supabase:

```sql
-- Create inventory table
CREATE TABLE inventory (
  id BIGSERIAL PRIMARY KEY,
  branch_id INTEGER NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  product_category VARCHAR(50) NOT NULL, -- 'tire', 'battery', 'oil', 'brake'
  brand VARCHAR(50),
  model VARCHAR(50),
  sku VARCHAR(50) UNIQUE,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Public can view available products
CREATE POLICY "Public can view available inventory" 
ON inventory FOR SELECT 
USING (is_available = true);

-- Indexes for performance
CREATE INDEX idx_inventory_branch ON inventory(branch_id);
CREATE INDEX idx_inventory_category ON inventory(product_category);
```

#### **Step 2: Add Sample Data**

```sql
-- Insert sample tire inventory
INSERT INTO inventory (branch_id, product_name, product_category, brand, model, price, stock_quantity, is_available) VALUES
(1, 'Cooper Adventurer All-Season', 'tire', 'Cooper', 'Adventurer', 4500.00, 24, true),
(1, 'Goodyear Assurance TripleMax', 'tire', 'Goodyear', 'Assurance', 5200.00, 18, true),
(1, 'GT Radial Savero', 'tire', 'GT Radial', 'Savero', 3800.00, 32, true),
(2, 'Cooper Adventurer All-Season', 'tire', 'Cooper', 'Adventurer', 4500.00, 16, true),
(3, 'Goodyear Assurance TripleMax', 'tire', 'Goodyear', 'Assurance', 5200.00, 12, true);

-- Insert batteries
INSERT INTO inventory (branch_id, product_name, product_category, brand, model, price, stock_quantity, is_available) VALUES
(1, 'Century Battery 12V 60Ah', 'battery', 'Century', '12V 60Ah', 3500.00, 8, true),
(1, 'Bosch Battery 12V 70Ah', 'battery', 'Bosch', '12V 70Ah', 4200.00, 5, true);

-- Insert oil products
INSERT INTO inventory (branch_id, product_name, product_category, brand, model, price, stock_quantity, is_available) VALUES
(1, 'Castrol Magnatec 5W-30', 'oil', 'Castrol', '5W-30 4L', 1800.00, 20, true),
(1, 'Shell Helix Ultra 5W-40', 'oil', 'Shell', '5W-40 4L', 2100.00, 15, true);
```

#### **Step 3: Create Inventory Page Component**

I'll create this for you next if you'd like!

#### **Step 4: Features to Implement**

**Product Catalog:**
- Grid view of products
- Filter by category (tire, battery, oil)
- Filter by brand
- Filter by branch availability
- Search by product name

**Product Card:**
```
┌─────────────────────────┐
│   [Product Image]       │
│                         │
│   Product Name          │
│   Brand                 │
│   ₱4,500.00             │
│                         │
│   ✓ In Stock (24 pcs)   │
│   📍 Alabang Branch     │
│                         │
│   [Add to Booking]      │
└─────────────────────────┘
```

**Integration with Booking:**
- Customer can add products to their booking
- Products show during service selection step
- Auto-calculate total estimate

---

## 4️⃣ **CUSTOMER-FACING FEATURES** 🔄

### **Status: PARTIALLY IMPLEMENTED**

#### **✅ Already Working:**
- Booking appointment flow
- Branch information display
- Service selection
- Time slot availability
- Confirmation page
- PWA support
- Mobile responsive

#### **🔄 Enhancements to Add:**

**1. Booking Status Tracking Page**

Create: `src/pages/TrackBooking.jsx`

```javascript
const TrackBooking = () => {
  const [bookingRef, setBookingRef] = useState('');
  const [booking, setBooking] = useState(null);

  const trackBooking = async () => {
    const { data } = await supabase
      .from('bookings')
      .select(`
        *,
        customers:customer_id (full_name, email, phone),
        vehicles:vehicle_id (make, model, year, plate_number)
      `)
      .eq('booking_reference', bookingRef)
      .single();
    
    setBooking(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Track Your Booking</h1>
      
      <div className="mb-6">
        <input
          type="text"
          value={bookingRef}
          onChange={(e) => setBookingRef(e.target.value)}
          placeholder="Enter booking reference (e.g., BK-20260425-001)"
          className="w-full px-4 py-3 border rounded-lg"
        />
        <button
          onClick={trackBooking}
          className="mt-4 w-full bg-brand-yellow text-black py-3 rounded-lg font-bold"
        >
          Track Booking
        </button>
      </div>

      {booking && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Booking Details</h2>
          <p><strong>Reference:</strong> {booking.booking_reference}</p>
          <p><strong>Status:</strong> {booking.status}</p>
          <p><strong>Date:</strong> {booking.preferred_date}</p>
          <p><strong>Time:</strong> {booking.preferred_time}</p>
          <p><strong>Branch:</strong> {booking.branch_id}</p>
          {booking.bay_name && <p><strong>Bay:</strong> {booking.bay_name}</p>}
        </div>
      )}
    </div>
  );
};
```

**2. Customer Dashboard (Future)**

Features:
- View all my bookings
- Booking history
- Saved vehicles
- Profile management
- Quick rebooking

**3. Reviews & Testimonials (Future)**

Features:
- Leave review after service completion
- Star rating (1-5)
- Text feedback
- Photo uploads

**4. Promotions Page (Enhancement)**

You already have promotions in `mockData.js`! Just need to create a dedicated page.

---

## 🛠️ **Implementation Priority:**

### **Phase 1: This Week** ⭐
1. ✅ Astronic Landing (created, add to router)
2. Add Astronic route to App.jsx
3. Test navigation between pages

### **Phase 2: Next Week**
1. Create inventory database table
2. Add sample inventory data
3. Build InventoryCatalog component
4. Add inventory route

### **Phase 3: Week 3**
1. Build booking tracking page
2. Add route to App.jsx
3. Integrate with booking system
4. Test end-to-end flow

### **Phase 4: Future**
1. Customer dashboard
2. Reviews system
3. Advanced promotions
4. SMS notifications

---

## 📂 **File Structure After Implementation:**

```
src/
├── pages/
│   ├── LandingPage.jsx          ← HH Asia Tyre homepage
│   ├── BookingPage.jsx          ✅ Booking system (1,436 lines)
│   ├── AstronicLanding.jsx      ✅ NEW: Astronic brand page (276 lines)
│   ├── BranchesPage.jsx         ← Branch locations
│   ├── TrackBooking.jsx         🆕 TO CREATE: Booking tracker
│   ├── InventoryCatalog.jsx     🆕 TO CREATE: Product catalog
│   └── Admin pages...
│
├── components/
│   ├── Header.jsx               (add Astronic link)
│   ├── Footer.jsx               (add inventory link)
│   └── ProductCard.jsx          🆕 TO CREATE
│
└── data/
    └── mockData.js              (add inventory data)
```

---

## 🚀 **Quick Start:**

### **1. Add Astronic Route (5 minutes)**

Edit `src/App.jsx`:

```javascript
// Add import at top
import AstronicLanding from './pages/AstronicLanding';

// Add route in Routes section
<Route path="/astronic" element={<AstronicLanding />} />
```

### **2. Test It**

```bash
npm run dev
# Visit: http://localhost:5173/astronic
```

### **3. Next Steps**

Would you like me to:
1. ✅ Add the route to App.jsx?
2. 🆕 Create the Inventory Catalog page?
3. 🆕 Create the Booking Tracking page?
4. 🆕 Build the Product Card component?

---

## 📊 **Summary:**

### **✅ Completed:**
- Booking System (fully functional)
- Astronic Landing Page (created, needs routing)
- Database schema (customers, vehicles, bookings)
- RLS policies
- PWA support

### **🆕 Ready to Build:**
- Public Inventory Display (SQL + component)
- Booking Status Tracking
- Product catalog with filtering
- Inventory-booking integration

### **📈 Impact:**
This module transforms your system from a **booking-only platform** to a **complete customer portal** with product browsing, booking, and tracking capabilities.

---

**Next Action:** Let me know which feature you'd like me to build next! 🚀
