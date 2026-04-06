# Super Admin System - Setup Guide 🎯

**Created:** April 3, 2026  
**Purpose:** Manage all branch administrators from one central dashboard  
**Status:** Ready to Use

---

## 🚀 **QUICK START**

### Step 1: Access Super Admin Login

Open your browser and go to:

```
http://localhost:5173/super-admin/login
```

### Step 2: Create First Super Admin Account

1. Click **"Sign Up"** tab
2. Fill in the form:
   - **Full Name:** Your name (e.g., "John Manager")
   - **Email:** Your email (e.g., "superadmin@hhasia.com")
   - **Password:** Create password (min 6 characters)
   - **Confirm Password:** Re-enter password
3. Click **"Create Account"**
4. You'll see success message

### Step 3: Login

1. Switch to **"Login"** tab
2. Enter your email and password
3. Click **"Login"**
4. You'll be redirected to the Super Admin Dashboard

---

## 📊 **SUPER ADMIN DASHBOARD FEATURES**

### Overview Stats

At the top of the dashboard, you'll see:

- **Total Branches:** Number of branches in the system
- **Active Admins:** Branch admins currently active
- **Inactive Admins:** Branch admins currently disabled
- **Unassigned Branches:** Branches without an admin

### Branch Administrators Table

Shows all branch admins with:

- Admin name and email
- Assigned branch
- Status (Active/Inactive)
- Creation date
- Action buttons (Edit/Delete)

### Actions You Can Perform:

#### 1. **Create New Branch Admin**

- Click **"Add Branch Admin"** button
- Fill in the form:
  - Full Name
  - Email Address
  - Select Branch (dropdown)
  - Password (min 6 chars)
  - Confirm Password
- Click **"Create"**
- Admin can now login at `/admin` route

#### 2. **Edit Branch Admin**

- Click **"Edit"** button on any admin
- Update their details:
  - Change name
  - Change email
  - Reset password (optional)
  - Note: Branch cannot be changed
- Click **"Update"**

#### 3. **Delete Branch Admin**

- Click **"Delete"** button on any admin
- Confirm deletion
- Admin account is permanently removed

#### 4. **Toggle Admin Status**

- Click on the status badge (Active/Inactive)
- Active admins can login
- Inactive admins cannot login
- Useful for temporary suspension

#### 5. **Assign Admin to Unassigned Branch**

- Scroll to "Branches Without Admin" section
- Find the branch you want to assign
- Click **"Assign Admin"** button
- Modal opens with branch pre-selected
- Fill in admin details and create

---

## 🔐 **SECURITY FEATURES**

### Authentication

- Super admins have separate login from branch admins
- Session stored in localStorage
- Auto-redirect if not authenticated
- Logout clears session

### Validation

- Email must be unique
- One admin per branch (enforced)
- Password minimum 6 characters
- Password confirmation required
- Branch cannot be changed after creation

### Data Storage

All data stored in localStorage:

- `super_admins` - Super admin accounts
- `branch_admins` - Branch admin accounts
- `superadmin_session` - Current session

---

## 👥 **USER ROLES**

### Super Admin

**Access:** `/super-admin`  
**Capabilities:**

- ✅ Create branch admins
- ✅ Edit branch admins
- ✅ Delete branch admins
- ✅ View all branches
- ✅ Assign admins to branches
- ✅ Activate/deactivate admins
- ❌ Cannot manage appointments
- ❌ Cannot view customer data

### Branch Admin

**Access:** `/admin`  
**Capabilities:**

- ✅ View appointments for their branch
- ✅ Approve/reject appointments
- ✅ Edit appointment details
- ❌ Cannot manage other branches
- ❌ Cannot create/edit admins
- ❌ Cannot access super admin panel

---

## 📝 **WORKFLOW EXAMPLES**

### Example 1: Onboard New Branch Admin

**Scenario:** Alabang branch needs an admin

1. Login as Super Admin
2. Click **"Add Branch Admin"**
3. Fill form:
   ```
   Full Name: Maria Santos
   Email: maria.santos@hhasia.com
   Branch: Alabang - Goodyear High Performance Center
   Password: alabang2026
   Confirm: alabang2026
   ```
4. Click **"Create"**
5. Give credentials to Maria
6. Maria logs in at `/admin` with her credentials
7. She can now manage Alabang appointments

---

### Example 2: Transfer Admin to Different Branch

**Scenario:** Admin moving from Alabang to Laoag

**Note:** Branch cannot be changed directly. Follow these steps:

1. Delete current admin (Alabang)
2. Create new admin for Laoag:
   ```
   Full Name: Same person
   Email: Same or new email
   Branch: Laoag - Ilocos Norte
   Password: New password
   ```
3. Provide new credentials

---

### Example 3: Temporarily Suspend Admin

**Scenario:** Admin on leave

1. Find admin in table
2. Click status badge (shows "Active")
3. Status changes to "Inactive"
4. Admin cannot login while inactive
5. When ready to return, click badge again to reactivate

---

### Example 4: Reset Admin Password

**Scenario:** Admin forgot password

1. Click **"Edit"** on admin
2. Enter new password in Password field
3. Confirm new password
4. Click **"Update"**
5. Provide new password to admin

---

## 🎨 **UI ELEMENTS**

### Color Coding

- **Yellow (#FFD700):** Primary actions, buttons
- **Green:** Active status, success messages
- **Red:** Delete actions, error messages
- **Blue:** Edit actions
- **Gray:** Inactive status, secondary info

### Icons

- ➕ Add/Create
- ✏️ Edit
- 🗑️ Delete
- 👤 User/Admin
- 🏢 Branch

---

## 📱 **RESPONSIVE DESIGN**

The dashboard works on all devices:

- **Desktop:** Full table view with all columns
- **Tablet:** Scrollable table
- **Mobile:** Stacked cards for better readability

---

## 🔧 **TECHNICAL DETAILS**

### Routes

- `/super-admin/login` - Login/Signup page
- `/super-admin` - Dashboard (protected)

### Components Created

1. `SuperAdminLogin.jsx` - Authentication page
2. `SuperAdminDashboard.jsx` - Management dashboard

### LocalStorage Keys

```javascript
"super_admins"; // Array of super admin objects
"branch_admins"; // Array of branch admin objects
"superadmin_session"; // Current session data
```

### Data Structure

**Super Admin:**

```javascript
{
  id: 1234567890,
  email: "admin@hhasia.com",
  password: "password123",
  fullName: "John Manager",
  role: "super_admin",
  createdAt: "2026-04-03T..."
}
```

**Branch Admin:**

```javascript
{
  id: 1234567891,
  email: "maria@hhasia.com",
  password: "alabang2026",
  fullName: "Maria Santos",
  branchId: 1,
  role: "branch_admin",
  status: "active",
  createdAt: "2026-04-03T..."
}
```

---

## ⚠️ **IMPORTANT NOTES**

### Data Persistence

- All data is in localStorage (browser storage)
- Clearing browser data will delete all admins
- For production, use a real database (Supabase, etc.)

### Security Limitations (Prototype)

- Passwords stored in plain text (not encrypted)
- No email verification
- No password recovery
- No session timeout
- For production, implement proper authentication

### Branch Assignment Rules

- Each branch can have only ONE admin
- Cannot change admin's branch after creation
- Must delete and recreate to change branch
- Unassigned branches shown separately

---

## 🚀 **NEXT STEPS**

### Recommended Enhancements:

1. **Email Notifications**
   - Send credentials to new admins
   - Password reset emails

2. **Activity Logs**
   - Track admin actions
   - Login history

3. **Permissions System**
   - Granular permissions
   - Role-based access control

4. **Database Integration**
   - Move from localStorage to Supabase
   - Persistent data across devices

5. **Two-Factor Authentication**
   - Extra security layer
   - SMS or authenticator app

---

## 📞 **SUPPORT**

### Common Issues:

**Problem:** Can't login after creating account  
**Solution:** Make sure you're using correct email/password. Check caps lock.

**Problem:** "Email already registered" error  
**Solution:** Email is already in use. Try different email or login with existing account.

**Problem:** "Branch already has an admin" error  
**Solution:** Each branch can have only one admin. Delete existing admin first or choose different branch.

**Problem:** Dashboard shows blank  
**Solution:** Check if you're logged in. Try logging out and back in.

---

## ✅ **CHECKLIST**

Before going live:

- [ ] Create super admin account
- [ ] Test login/logout
- [ ] Create test branch admin
- [ ] Test branch admin can login at `/admin`
- [ ] Verify branch assignment works
- [ ] Test edit/delete functions
- [ ] Test activate/deactivate
- [ ] Verify responsive design on mobile
- [ ] Document credentials securely

---

**System Version:** 1.0  
**Last Updated:** April 3, 2026  
**Ready for Use:** ✅ Yes
