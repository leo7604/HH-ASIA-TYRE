# 👨‍💼 HH Asia Tyre - Branch Admin Quick Start Guide

**For branch administrators | Version 1.0**

---

## 🎯 What You Can Do

✅ **View all bookings** for your branch  
✅ **Approve or reject** customer bookings  
✅ **Assign service bays** during approval  
✅ **Track booking status** in real-time  
✅ **Mark services as complete**  
✅ **Delete bookings** (if needed)  
✅ **Export booking data**  

---

## 🔐 Getting Started

### Step 1: Access Admin Portal

**URL:** `https://hh-asia-tyre.vercel.app/admin`

### Step 2: Login

**Enter your credentials:**
- **Email:** (provided by Super Admin)
- **Password:** (provided by Super Admin)

⚠️ **First-time login:**
- Change your password immediately
- Verify your branch assignment

---

## 📊 Admin Dashboard Overview

### Dashboard Shows:

```
┌─────────────────────────────────────┐
│  📊 DASHBOARD OVERVIEW              │
├─────────────────────────────────────┤
│                                     │
│  📅 Today's Bookings: 8             │
│  ⏳ Pending Approval: 3             │
│  ✅ Approved: 4                     │
│  🔧 In Progress: 1                  │
│                                     │
│  🚗 Available Bays: 2/4             │
│  📈 This Week: 42 bookings          │
│                                     │
└─────────────────────────────────────┘
```

### Navigation Menu:

- **Dashboard** - Overview & stats
- **Bookings** - All bookings list
- **Pending** - Awaiting approval
- **Approved** - Confirmed bookings
- **Completed** - Finished services
- **Analytics** - Reports & insights

---

## ✅ How to Approve a Booking

### Step 1: View Pending Bookings

1. Click **"Pending"** in navigation
2. See list of bookings waiting approval
3. Each booking shows:
   - Customer name & contact
   - Services requested
   - Date & time
   - Vehicle details
   - Special requests

### Step 2: Review Booking Details

Click on a booking to see:
```
Customer: Juan Dela Cruz
Phone: 0917 123 4567
Email: juan@email.com

Vehicle: 2024 Toyota Fortuner
Plate: ABC 1234

Services: Tire Rotation, Oil Change
Date: April 25, 2026
Time: 10:00 AM

Special Requests: Please check tire pressure
```

### Step 3: Approve & Assign Bay

1. Click **"Approve"** button
2. **Select a service bay** from dropdown:
   - Bay 1 - General Service
   - Bay 2 - Tire Service
   - Bay 3 - Oil & Lube
   - Bay 4 - Brake Service
3. Add admin notes (optional)
4. Click **"Confirm Approval"**

✅ **What happens next:**
- Booking status changes to "Approved"
- Customer receives notification (email/SMS)
- Bay is reserved for that time slot
- Booking appears in "Approved" list

---

## ❌ How to Reject a Booking

### When to Reject:
- Time slot conflict
- Service unavailable
- Bay not available
- Invalid information

### Steps:

1. Click **"Reject"** button
2. **Select rejection reason:**
   - Time slot unavailable
   - Service not available
   - Bay maintenance
   - Other (specify)
3. Add detailed explanation (required)
4. Click **"Confirm Rejection"**

✅ **What happens next:**
- Booking status changes to "Rejected"
- Customer receives rejection email with reason
- Customer can re-book different time

---

## 🔧 How to Mark Service Complete

### After Service is Done:

1. Go to **"Approved"** bookings
2. Find the customer's booking
3. Click **"Mark Complete"**
4. Add completion notes (optional):
   - Services performed
   - Parts replaced
   - Recommendations
5. Click **"Confirm"**

✅ **What happens next:**
- Status changes to "Completed"
- Bay becomes available for next booking
- Customer receives completion notification
- Stats updated on dashboard

---

## 🗑️ How to Delete a Booking

### When to Delete:
- Duplicate booking
- Test booking
- Customer request
- Invalid entry

### Steps:

1. Find the booking in list
2. Click **"Delete"** button
3. **Confirm deletion** in popup
4. Booking permanently removed

⚠️ **Warning:** Deletion cannot be undone!

---

## 📋 Booking Management Tips

### Daily Workflow:

**Morning (8:00 AM):**
1. Check dashboard for today's bookings
2. Review pending approvals
3. Approve bookings & assign bays
4. Prepare service bays

**Throughout Day:**
1. Update booking status as services progress
2. Mark completed services
3. Monitor bay availability
4. Handle walk-in customers

**End of Day (5:00 PM):**
1. Mark all services as complete
2. Review next day's bookings
3. Pre-approve if needed
4. Close out daily reports

---

## 🚨 Common Issues & Solutions

### "I can't see any bookings"
**Solution:**
- Verify you're logged in
- Check your branch assignment
- Ensure bookings are for your branch only

### "Cannot assign bay - all occupied"
**Solution:**
- Check for overlapping approved bookings
- Mark completed services to free bays
- Reschedule conflicting appointments

### "Customer says they didn't receive confirmation"
**Solution:**
- Check booking status (should be "Approved")
- Verify customer email/phone in booking
- Resend confirmation manually
- Ask customer to check spam folder

### "I need to change a booking time"
**Solution:**
- Reject current booking with reason
- Ask customer to re-book new time
- OR: Call customer directly to arrange

---

## 📊 Understanding Bay Management

### Bay Types:

| Bay | Type | Services |
|-----|------|----------|
| **Bay 1** | General Service | Maintenance, diagnostics |
| **Bay 2** | Tire Service | Rotation, replacement |
| **Bay 3** | Oil & Lube | Oil changes, fluids |
| **Bay 4** | Brake Service | Brake repair, inspection |

### Bay Status:

- 🟢 **Available** - Ready for use
- 🔴 **Occupied** - Service in progress
- 🟡 **Reserved** - Assigned to upcoming booking
- ⚫ **Maintenance** - Out of service

### Bay Assignment Rules:
- One booking per bay per time slot
- Match bay type to service when possible
- General bays can handle any service
- Specialized bays for specific services

---

## 📈 Analytics & Reports

### Available Metrics:

**Daily:**
- Total bookings
- Completion rate
- Average service time
- Bay utilization

**Weekly:**
- Trend analysis
- Popular services
- Peak hours
- Revenue estimate

**Monthly:**
- Customer retention
- Service distribution
- Branch performance
- Growth metrics

---

## 🔒 Security Best Practices

✅ **Do:**
- Keep password confidential
- Logout when leaving workstation
- Use strong password
- Report suspicious activity
- Verify customer identity

❌ **Don't:**
- Share login credentials
- Leave screen unlocked
- Write password on sticky notes
- Access other branches' data
- Delete bookings without reason

---

## 📱 Mobile Access

You can manage bookings from your phone!

**Steps:**
1. Open `hh-asia-tyre.vercel.app/admin`
2. Login with credentials
3. Use mobile-optimized interface
4. Same features as desktop

💡 **Tip:** Bookmark the admin URL on your phone!

---

## 🆘 Support

### Need Help?

**Contact Super Admin:**
- 📧 Email: admin@hh-asia.com
- 📞 Phone: (02) 8123-4567 ext. 100
- 💬 Viber: [Viber number]

**Technical Issues:**
- 📧 IT Support: support@hh-asia.com
- 🚨 Emergency: 0917-HH-TYRE

### Support Hours:
Mon-Sat: 8:00 AM - 6:00 PM

---

## 📝 Quick Reference

```
┌─────────────────────────────────────┐
│   BRANCH ADMIN - QUICK ACTIONS      │
└─────────────────────────────────────┘

LOGIN: hh-asia-tyre.vercel.app/admin

APPROVE BOOKING:
  1. Click "Pending"
  2. Review booking
  3. Click "Approve"
  4. Assign bay
  5. Confirm

REJECT BOOKING:
  1. Click "Reject"
  2. Select reason
  3. Add explanation
  4. Confirm

COMPLETE SERVICE:
  1. Find booking
  2. Click "Mark Complete"
  3. Add notes
  4. Confirm

DELETE BOOKING:
  1. Find booking
  2. Click "Delete"
  3. Confirm (permanent!)

KEYBOARD SHORTCUTS:
  Refresh: F5
  Logout: Ctrl+Shift+L
```

---

## 🎓 Training Checklist

Before going live, ensure you can:

- [ ] Login to admin portal
- [ ] View dashboard stats
- [ ] Approve a booking with bay assignment
- [ ] Reject a booking with reason
- [ ] Mark service as complete
- [ ] Delete a test booking
- [ ] Export booking data
- [ ] Access from mobile device
- [ ] Contact support if needed

---

**Thank you for being part of the HH Asia Tyre team! 🚗✨**

*Version 1.0 | Last updated: April 2026*
