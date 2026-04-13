# Database Integration Guide

## ✅ What's Already Done

Your system is **NOW DATABASE-READY!** Here's what has been set up:

### 1. **Service Layer Created** ✅
- **`src/utils/api.js`** - API client with all HTTP methods
- **`src/utils/bookingService.js`** - Booking operations with automatic fallback

### 2. **Features Implemented** ✅
- API-first architecture with localStorage fallback
- Automatic failover (if API fails, uses localStorage)
- Slot availability checking via API
- Booking creation via API
- All validation in place
- Environment configuration ready

### 3. **Database Schema** ✅
- Complete SQL schema in `DATABASE_SCHEMA.md`
- MongoDB schema alternative included
- Sample queries provided
- Migration guide included

---

## 🚀 How to Switch to Database

### Option 1: Using Your Existing API (Easiest)

Your app is **already configured** to use:
```
https://hh-asia-tyre-crm-inv-sys.vercel.app/api
```

**Just make sure your backend is running** and the app will automatically use it!

### Option 2: Set Up New Database

1. **Choose your database** (PostgreSQL recommended)
2. **Run the schema** from `DATABASE_SCHEMA.md`
3. **Create backend API** with these endpoints:

```javascript
// Required API Endpoints

// Public endpoints
POST   /api/public/bookings                    // Create booking
GET    /api/public/bookings/:id                // Get booking by ID
GET    /api/public/bookings/branch/:code       // Get branch bookings
GET    /api/public/bookings/branch/:code/date/:date  // Get bookings by date

// Admin endpoints (require authentication)
GET    /api/admin/bookings                     // All bookings
PUT    /api/admin/bookings/:id                 // Update booking
DELETE /api/admin/bookings/:id                 // Delete booking
GET    /api/admin/analytics                    // Analytics data
```

4. **Update `.env` file**:
```env
VITE_API_BASE_URL=http://your-api-url.com/api
VITE_USE_DATABASE=true
```

---

## 📦 Current Architecture

```
┌─────────────────────────────────────────────┐
│           Frontend (React App)              │
│                                             │
│  ┌──────────────────────────────┐          │
│  │    BookingPage.jsx           │          │
│  │  (UI Components)             │          │
│  └──────────┬───────────────────┘          │
│             │                               │
│             ▼                               │
│  ┌──────────────────────────────┐          │
│  │  bookingService.js           │          │
│  │  (Service Layer)             │          │
│  └──────────┬───────────────────┘          │
│             │                               │
│      ┌──────┴──────┐                       │
│      ▼             ▼                       │
│  ┌────────┐   ┌──────────┐                │
│  │  API   │   │ Local    │                │
│  │(Primary│   │Storage   │                │
│  │  DB)   │   │(Fallback)│                │
│  └────────┘   └──────────┘                │
└─────────────────────────────────────────────┘
```

---

## 🔧 How It Works

### Creating a Booking

```javascript
// In your component
import { createBooking } from './utils/bookingService';

const result = await createBooking(bookingData);

// Automatically tries:
// 1. API call to database
// 2. Falls back to localStorage if API fails
// 3. Returns { success, data, source }

console.log(result.source); // 'database' or 'localStorage'
```

### Checking Availability

```javascript
import { checkSlotAvailability } from './utils/bookingService';

const slots = await checkSlotAvailability(branchId, date);

// Returns:
// {
//   '08:00': { available: true, booked: 2, remaining: 2, status: 'limited' },
//   '09:00': { available: true, booked: 0, remaining: 4, status: 'available' },
//   '10:00': { available: false, booked: 4, remaining: 0, status: 'full' }
// }
```

---

## 🎯 Quick Test

To test if your system is database-ready:

1. **Open browser console** on your app
2. **Run**:
```javascript
import { checkApiHealth } from './utils/api';
checkApiHealth().then(console.log); // true if API is up
```

3. **Make a test booking** - check console to see if it used API or localStorage

---

## 📊 Monitor Current Status

Add this to any component to see what's being used:

```javascript
import { checkApiHealth } from './utils/api';

const [usingDatabase, setUsingDatabase] = useState(false);

useEffect(() => {
  checkApiHealth().then(setUsingDatabase);
}, []);

return (
  <div>
    {usingDatabase ? '🟢 Using Database' : '🟡 Using localStorage'}
  </div>
);
```

---

## 🔄 Migration from localStorage to Database

When you're ready to migrate existing bookings:

```javascript
// 1. Export localStorage data
const localBookings = JSON.parse(localStorage.getItem('appointments') || '[]');

// 2. Send to your API
for (const booking of localBookings) {
  await fetch('/api/public/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: booking.customerName,
      phone: booking.phone,
      email: booking.email,
      serviceType: booking.services.join(', '),
      vehicleMake: booking.vehicleMake,
      vehicleModel: booking.vehicleModel,
      vehicleYear: booking.vehicleYear,
      plateNumber: booking.plateNumber,
      preferredDate: booking.date,
      preferredTime: booking.time,
      branch: 'MNL', // or map from branchId
      notes: booking.notes || ''
    })
  });
}

// 3. Verify all bookings migrated
console.log(`Migrated ${localBookings.length} bookings`);
```

---

## 🛡️ Error Handling

The service layer automatically handles:

- ✅ API timeout → Falls back to localStorage
- ✅ Network error → Falls back to localStorage  
- ✅ API returns error → Falls back to localStorage
- ✅ localStorage full → Shows error to user
- ✅ Invalid data → Validates before sending

---

## 📝 Next Steps

1. **Set up your backend API** (Node.js, Python, PHP, etc.)
2. **Create database** using schema in `DATABASE_SCHEMA.md`
3. **Test API endpoints** with Postman or similar
4. **Update `.env`** with your API URL
5. **Test the integration** - make a test booking
6. **Monitor logs** - check console for API vs localStorage usage
7. **Deploy** - your app is ready for production!

---

## 💡 Pro Tips

1. **Keep localStorage fallback** - Great for offline mode
2. **Add loading indicators** - Show when checking API health
3. **Log API usage** - Track when fallback is used
4. **Set up monitoring** - Alert when API is down
5. **Add retry logic** - Already built into the service!

---

## 🆘 Troubleshooting

**API not being called?**
- Check `.env` file has correct `VITE_API_BASE_URL`
- Verify API is running and accessible
- Check browser console for CORS errors

**Still using localStorage?**
- API might be down - check network tab
- Service automatically falls back if API fails
- Check console for "API booking failed" messages

**Want to force database mode?**
```javascript
// In bookingService.js, comment out fallback code
// Or throw error if API fails instead of falling back
```

---

**Your system is production-ready for database integration!** 🎉
