# Branch Admin Dashboard - User Guide 🎯

**Date:** April 3, 2026  
**Status:** COMPLETE & READY TO USE

---

## 🚀 QUICK START

### Access the Admin Portal:

1. Go to: **http://localhost:5176/admin/login**
2. Sign up as a branch admin (first time)
3. Or login if you already have an account

---

## 📋 FEATURES

### 1. **Admin Authentication** 🔐

- Secure login/signup system
- Each admin manages ONE branch only
- Session management with localStorage
- Automatic redirect if not authenticated

### 2. **Branch Selection** 🏢

During signup, admins choose which branch to manage:

- Alabang (Goodyear High Performance Center)
- Only "Open" branches are available
- One admin per branch restriction
- Branch info stored with admin profile

### 3. **Dashboard Overview** 📊

Real-time statistics:

- Total appointments
- Pending approvals
- Approved bookings
- Rejected requests

### 4. **Appointment Management** ✅

Admins can:

- **View** all appointments for their branch
- **Filter** by status (All, Pending, Approved, Rejected)
- **Approve** pending appointments
- **Reject** appointments
- **Edit** appointment details (date, time, notes)

---

## 🎯 HOW TO USE

### Step 1: Sign Up as Branch Admin

1. Visit `/admin/login`
2. Click "Sign Up"
3. Fill in:
   - Full Name
   - Phone Number
   - Email Address
   - Password
   - **Select Branch** (dropdown of available branches)
4. Click "Create Account"
5. You'll be automatically logged in and redirected to dashboard

**Important:**

- Each branch can only have ONE admin
- If a branch already has an admin, you cannot select it
- Choose carefully - you can't change your branch later

---

### Step 2: Login (Returning Users)

1. Visit `/admin/login`
2. Click "Sign In" (default)
3. Enter:
   - Email Address
   - Password
4. Click "Sign In"
5. Redirected to your branch dashboard

---

### Step 3: Manage Appointments

#### View Appointments

- All appointments for YOUR branch only appear
- Sorted by most recent first
- Color-coded status badges:
  - 🟡 Yellow = Pending
  - 🟢 Green = Approved
  - 🔴 Red = Rejected

#### Filter Appointments

Click filter buttons at top:

- **All** - Show everything
- **Pending** - Only awaiting approval
- **Approved** - Confirmed bookings
- **Rejected** - Declined requests

#### Approve an Appointment

1. Find appointment with "Pending" status
2. Click green **"APPROVE"** button
3. Status changes to "Approved"
4. Customer will be notified (future feature)

#### Reject an Appointment

1. Find appointment with "Pending" status
2. Click red **"REJECT"** button
3. Status changes to "Rejected"
4. Appointment removed from active list

#### Edit Appointment Details

1. Click **"EDIT"** button on any appointment
2. Modal opens with editable fields:
   - Date
   - Time
   - Notes/Special Instructions
3. Make changes
4. Click **"SAVE CHANGES"** or **"CANCEL"**

---

## 📱 TESTING THE SYSTEM

### Create Test Data:

1. **Sign up as Alabang Admin:**
   - Go to `/admin/login`
   - Sign up with:
     - Name: Juan Dela Cruz
     - Phone: 0917 123 4567
     - Email: juan@hhasia.com
     - Password: admin123
     - Branch: Goodyear High Performance Center - Alabang

2. **Make a Test Booking:**
   - Go to homepage
   - Click "Book Now" on Alabang branch card
   - Fill out booking form
   - Complete all steps
   - Submit booking

3. **Check Admin Dashboard:**
   - Go to `/admin/dashboard`
   - See your new appointment listed
   - Status should be "Pending"
   - Try approving/rejecting/editing

---

## 🔧 TECHNICAL DETAILS

### Data Storage:

All data stored in browser localStorage:

- `branchAdmins` - Array of admin accounts
- `currentAdmin` - Currently logged-in admin session
- `appointments` - All booking appointments

### Security Notes:

⚠️ **This is a prototype!** For production:

- Use proper backend API
- Hash passwords (bcrypt)
- Implement JWT tokens
- Add HTTPS
- Server-side validation
- Rate limiting
- CSRF protection

### File Structure:

```
src/pages/
├── AdminLoginPage.jsx      # Login/Signup page
├── AdminDashboard.jsx      # Main dashboard
└── BookingPage.jsx         # Updated to save appointments

src/App.jsx                 # Added admin routes
```

### Routes:

- `/admin/login` - Authentication page
- `/admin/dashboard` - Branch admin panel
- Protected routes redirect to login if not authenticated

---

## 🎨 UI/UX FEATURES

### Design Elements:

✅ Dark theme matching brand colors  
✅ Responsive layout (mobile-friendly)  
✅ Real-time stats cards  
✅ Color-coded status badges  
✅ Smooth transitions and hover effects  
✅ Modal dialogs for editing  
✅ Empty states with helpful messages

### Accessibility:

✅ Keyboard navigation support  
✅ Clear labels and instructions  
✅ High contrast text  
✅ Focus indicators

---

## 📊 SAMPLE WORKFLOW

### Customer Books Appointment:

```
Customer clicks "Book Now"
  → Fills vehicle details
  → Selects services
  → Chooses date/time
  → Enters contact info
  → Submits booking
  → Status: PENDING
  → Saved to localStorage
```

### Admin Reviews Booking:

```
Admin logs into dashboard
  → Sees new appointment (yellow badge)
  → Reviews customer details
  → Checks requested services
  → Verifies date/time availability
  → Clicks "APPROVE" or "REJECT"
  → Status updates immediately
```

---

## ⚙️ ADMIN CAPABILITIES

### Can Do:

✅ View all appointments for their branch  
✅ Approve pending bookings  
✅ Reject unsuitable bookings  
✅ Edit appointment date/time  
✅ Add notes to appointments  
✅ Filter by status  
✅ See real-time statistics  
✅ Logout securely

### Cannot Do:

❌ Access other branches' data  
❌ Delete appointments (only reject)  
❌ Change their assigned branch  
❌ Create new admin accounts  
❌ View customer payment info  
❌ Send notifications (future feature)

---

## 🚨 TROUBLESHOOTING

### Problem: "Branch already has an admin"

**Solution:** That branch is taken. Choose a different branch or contact the existing admin.

### Problem: Can't see appointments

**Solution:**

1. Make sure you completed a booking AFTER setting up admin
2. Check that the booking was for YOUR branch
3. Refresh the dashboard page

### Problem: Redirected to login

**Solution:** Your session expired. Just log in again.

### Problem: Changes not saving

**Solution:**

1. Check browser console for errors
2. Make sure localStorage is enabled
3. Try clearing browser cache

---

## 🔮 FUTURE ENHANCEMENTS

### Planned Features:

1. **Email Notifications** - Auto-email customers on approval/rejection
2. **SMS Alerts** - Text message confirmations
3. **Calendar View** - Visual calendar of appointments
4. **Export Data** - Download appointments as CSV/Excel
5. **Analytics** - Charts and graphs of booking trends
6. **Multi-Admin Support** - Allow multiple admins per branch with roles
7. **Staff Management** - Assign technicians to appointments
8. **Service History** - Track customer's past visits
9. **Automated Reminders** - Send reminders before appointments
10. **Mobile App** - Native iOS/Android admin app

---

## 💡 BEST PRACTICES

### For Admins:

1. **Check dashboard daily** - Review new bookings promptly
2. **Respond quickly** - Approve/reject within 24 hours
3. **Add notes** - Document special requests or issues
4. **Keep schedule updated** - Edit dates if conflicts arise
5. **Logout when done** - Especially on shared computers

### For Developers:

1. **Test thoroughly** - Try all CRUD operations
2. **Validate inputs** - Ensure data integrity
3. **Handle errors** - Graceful error messages
4. **Backup data** - Export localStorage periodically
5. **Monitor performance** - Watch for slow queries

---

## 📞 SUPPORT

For issues or questions:

- Check browser console for errors
- Review this documentation
- Contact development team
- Check localStorage data in DevTools

---

## ✅ CHECKLIST

Before going live:

- [ ] Test signup flow
- [ ] Test login flow
- [ ] Verify branch selection works
- [ ] Confirm one-admin-per-branch rule
- [ ] Test appointment creation
- [ ] Test approve/reject functions
- [ ] Test edit functionality
- [ ] Verify filters work
- [ ] Check responsive design
- [ ] Test logout
- [ ] Verify authentication guards
- [ ] Add production security measures

---

**System Status:** ✅ OPERATIONAL  
**Version:** 1.0.0 (Prototype)  
**Last Updated:** April 3, 2026
