-- ============================================
-- BOOKINGS TABLE RLS POLICIES
-- ============================================
-- This file contains all RLS policies for the bookings table
-- Run this in Supabase SQL Editor to ensure policies are applied

-- Enable RLS on bookings table (if not already enabled)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 1. INSERT Policy - Anyone can create bookings
-- ============================================
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
CREATE POLICY "Anyone can create bookings" ON bookings
    FOR INSERT
    WITH CHECK (true);

-- ============================================
-- 2. SELECT Policy - Anyone can view bookings (for approval workflow)
-- ============================================
DROP POLICY IF EXISTS "Customers can view own bookings" ON bookings;
CREATE POLICY "Customers can view own bookings" ON bookings
    FOR SELECT
    USING (true);

-- ============================================
-- 3. UPDATE Policy - Allow status/bay updates
-- ============================================
DROP POLICY IF EXISTS "Anyone can update bookings" ON bookings;
CREATE POLICY "Anyone can update bookings" ON bookings
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- ============================================
-- 4. DELETE Policy - Allow deletion
-- ============================================
DROP POLICY IF EXISTS "Anyone can delete bookings" ON bookings;
CREATE POLICY "Anyone can delete bookings" ON bookings
    FOR DELETE
    USING (true);

-- ============================================
-- 5. Full Access Policy (for development/testing)
-- ============================================
DROP POLICY IF EXISTS "Full access for now" ON bookings;
CREATE POLICY "Full access for now" ON bookings
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Verify policies
-- ============================================
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'bookings'
ORDER BY policyname;

-- ============================================
-- Also apply policies to customers table
-- ============================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Full access customers" ON customers;
CREATE POLICY "Full access customers" ON customers
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Also apply policies to vehicles table
-- ============================================
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Full access vehicles" ON vehicles;
CREATE POLICY "Full access vehicles" ON vehicles
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Also apply policies to branches table
-- ============================================
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active branches" ON branches;
CREATE POLICY "Anyone can view active branches" ON branches
    FOR SELECT
    USING (is_active = true);

DROP POLICY IF EXISTS "Full access branches" ON branches;
CREATE POLICY "Full access branches" ON branches
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Also apply policies to service_bays table
-- ============================================
ALTER TABLE service_bays ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Full access service_bays" ON service_bays;
CREATE POLICY "Full access service_bays" ON service_bays
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Verify all policies
-- ============================================
SELECT 
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;