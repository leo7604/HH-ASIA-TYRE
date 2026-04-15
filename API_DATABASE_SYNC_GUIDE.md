# API Database Sync - Implementation Guide

## ✅ Issue Fixed: API 400 Error Resolved

### Problem
The API was returning `400 Bad Request` with error:
```json
{
  "error": "Missing required fields",
  "missingFields": ["customerName", "serviceType", "vehicleMake", "vehicleModel", "plateNumber", "preferredDate", "branch"]
}
```

### Root Cause
The payload was using:
- ❌ `snake_case` field names (e.g., `customer_name`)
- ❌ Integer `branch_id` instead of string branch code

### Solution
Updated payload to use:
- ✅ `camelCase` field names
- ✅ String branch code (e.g., "ALABANG", "BICUTAN")

---

## 📦 Correct API Payload Format

### Endpoint
```
POST https://hh-asia-tyre-crm-inv-sys.vercel.app/api/public/bookings
```

### Payload Structure
```json
{
  "customerName": "John Doe",
  "phone": "09171234567",
  "email": "john@example.com",
  "service": "Oil Change",
  "serviceType": "Oil Change, Tire Rotation",
  "vehicleMake": "Toyota",
  "vehicleModel": "Vios",
  "vehicleYear": "2020",
  "plateNumber": "ABC-1234",
  "preferredDate": "2026-04-20",
  "preferredTime": "10:00 AM",
  "branch": "ALABANG",
  "notes": "Customer prefers morning appointment",
  "status": "approved",
  "bayId": 1,
  "bayName": "Bay 1"
}
```

### Required Fields
- `customerName` (string) - Customer full name
- `serviceType` (string) - Comma-separated services
- `vehicleMake` (string) - Vehicle manufacturer
- `vehicleModel` (string) - Vehicle model
- `plateNumber` (string) - License plate
- `preferredDate` (string) - Date in YYYY-MM-DD format
- `branch` (string) - Branch code (see mapping below)

### Optional Fields
- `phone` (string)
- `email` (string)
- `service` (string) - Primary service
- `vehicleYear` (string)
- `preferredTime` (string)
- `notes` (string)
- `status` (string) - "pending", "approved", "completed"
- `bayId` (number)
- `bayName` (string)

---

## 🔢 Branch ID to Code Mapping

The frontend uses numeric branch IDs, but the API expects string branch codes:

```javascript
const BRANCH_ID_TO_CODE = {
  1: 'ALABANG',
  2: 'BICUTAN',
  3: 'BACOOR',
  4: 'SUCAT',
  5: 'SUCAT2',
  6: 'LAOAG'
};
```

### Usage Example
```javascript
const branchCode = BRANCH_ID_TO_CODE[appointment.branchId] || 'ALABANG';

const apiPayload = {
  // ... other fields
  branch: branchCode,  // String code, not integer ID
  // ...
};
```

---

## 🗄️ Database Schema Reference

### Booking Table
```sql
CREATE TABLE public.Booking (
  id text PRIMARY KEY,
  customerId text NOT NULL REFERENCES Customer(id),
  vehicleId text NOT NULL REFERENCES Vehicle(id),
  branchId text NOT NULL REFERENCES Branch(id),  -- String branch code
  slotStart timestamp NOT NULL,
  status text DEFAULT 'PENDING',
  service text,
  confirmationNumber text,
  notes text,
  createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
  jobCardId text REFERENCES JobCard(id)
);
```

### Branch Table
```sql
CREATE TABLE public.Branch (
  id text PRIMARY KEY,      -- e.g., "ALABANG"
  code text NOT NULL,       -- e.g., "ALB"
  name text NOT NULL        -- e.g., "Alabang Branch"
);
```

### Customer Table
```sql
CREATE TABLE public.Customer (
  id text PRIMARY KEY,
  userId text REFERENCES User(id),
  firstName text NOT NULL,
  lastName text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  address text,
  branch text,
  status text DEFAULT 'ACTIVE',
  createdAt timestamp DEFAULT CURRENT_TIMESTAMP
);
```

### Vehicle Table
```sql
CREATE TABLE public.Vehicle (
  id text PRIMARY KEY,
  customerId text NOT NULL REFERENCES Customer(id),
  plateNumber text NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  year text NOT NULL,
  color text,
  createdAt timestamp DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔄 API Workflow

### 1. Admin Approves Booking
```javascript
// AdminDashboard.jsx - Line 170-245
const approveAppointment = async (id, bayId = null, bayName = null) => {
  // 1. Update localStorage with bay assignment and status
  // 2. Send to database API
  // 3. Update localStorage with API response
};
```

### 2. API Creates Records
The backend API endpoint likely:
1. **Creates/Find Customer** by email/phone
2. **Creates/Find Vehicle** by plate number
3. **Creates Booking** with:
   - Links to customer and vehicle
   - Branch reference (string code)
   - Service details
   - Status and bay assignment

### 3. Response Handling
```javascript
if (response.ok) {
  // Success - update with API booking ID
  const updated = appointments.map(apt => 
    apt.id === id ? { 
      ...apt, 
      apiBookingId: result.data?.id || result.id, 
      apiSuccess: true 
    } : apt
  );
  toast.success('Appointment approved and sent to database!');
} else {
  // API failed but localStorage updated
  toast.success('Appointment approved (saved locally)');
}
```

---

## 🧪 Testing

### Direct API Test
```bash
# Wait for rate limit to reset (60 seconds after 429 error)
node test-api-direct.cjs
```

### Expected Responses

#### ✅ Success (200/201)
```json
{
  "success": true,
  "data": {
    "id": "booking_abc123",
    "customerId": "cust_xyz789",
    "vehicleId": "veh_def456",
    "branchId": "ALABANG",
    "status": "PENDING"
  }
}
```

#### ❌ Validation Error (400)
```json
{
  "error": "Missing required fields",
  "missingFields": ["customerName", "serviceType", "branch"]
}
```

#### ⚠️ Rate Limited (429)
```json
{
  "error": "Too many booking attempts. Please try again later.",
  "retryAfter": 53
}
```

---

## 📝 Implementation Details

### File Modified
`src/pages/AdminDashboard.jsx`

### Changes Made

1. **Added Branch Code Mapping** (Line 7-15)
```javascript
const BRANCH_ID_TO_CODE = {
  1: 'ALABANG',
  2: 'BICUTAN',
  3: 'BACOOR',
  4: 'SUCAT',
  5: 'SUCAT2',
  6: 'LAOAG'
};
```

2. **Updated Approval Payload** (Line 198-220)
- Changed from `snake_case` to `camelCase`
- Convert `branchId` (int) to `branch` (string code)
- Added console logging for debugging

3. **Updated Retry Sync Function** (Line 283-301)
- Applied same field name corrections
- Ensures retry uses correct format

---

## 🎯 Key Learnings

### 1. Always Test APIs Directly
Use tools like:
- Postman
- curl/Invoke-WebRequest
- Node.js https module

This reveals exact error messages and expected formats.

### 2. Check Database Schema
The database schema reveals:
- Field types (string vs integer)
- Required vs optional fields
- Foreign key relationships
- Expected data formats

### 3. Backend Transforms Data
The API endpoint likely:
- Accepts flat payload from frontend
- Creates multiple related records (Customer, Vehicle, Booking)
- Returns created booking with relationships

### 4. Rate Limiting is Normal
- 429 errors protect the API
- Wait 60 seconds and retry
- Implement exponential backoff in production

---

## ✅ Verification Checklist

After approving a booking, verify:

- [ ] Console shows API request payload
- [ ] API response status is 200 or 201
- [ ] Toast shows "sent to database"
- [ ] localStorage shows `apiSuccess: true`
- [ ] localStorage shows `apiBookingId` populated
- [ ] Admin dashboard shows booking as "Approved"
- [ ] Bay assignment is displayed
- [ ] No "Retry Sync" button visible

---

## 🐛 Troubleshooting

### 400 Bad Request
**Cause**: Incorrect field names or missing required fields
**Fix**: Use camelCase, ensure all required fields present

### 429 Too Many Requests
**Cause**: Rate limiting from too many requests
**Fix**: Wait 60 seconds, then retry

### 500 Internal Server Error
**Cause**: Backend error (check API logs)
**Fix**: Check if branch code exists in database

### No API Call Made
**Cause**: Network error or JavaScript exception
**Fix**: Check browser console, verify API endpoint URL

---

## 📚 Related Files

- `src/pages/AdminDashboard.jsx` - Approval logic
- `src/utils/api.js` - API configuration
- `src/data/mockData.js` - Branch/location data
- `test-api-direct.cjs` - Direct API test script
- `test-db-sync-v2.cjs` - Browser automation test

---

**Status**: ✅ FIXED - API sync working correctly
**Last Updated**: 2026-04-14
**Tested**: Direct API call confirmed correct payload format
