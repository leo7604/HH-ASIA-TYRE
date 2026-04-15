-- ============================================
-- FIX BOOKING_REFERENCE TRIGGER ISSUE
-- ============================================
-- This fixes the duplicate key constraint error
-- Run this in Supabase SQL Editor

-- Step 1: Find and drop the problematic trigger
-- First, let's see what triggers exist
SELECT
    trigger_name,
    event_manipulation,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE event_object_table = 'bookings';

-- Step 2: Drop ALL triggers on bookings table (we'll recreate if needed)
-- Replace 'trigger_name_here' with actual trigger name from Step 1
-- If you see a trigger like 'set_booking_reference' or similar, drop it:

DROP TRIGGER IF EXISTS set_booking_reference_trigger ON bookings;
DROP TRIGGER IF EXISTS generate_booking_reference ON bookings;
DROP TRIGGER IF EXISTS bookings_before_insert ON bookings;
DROP TRIGGER IF EXISTS auto_booking_reference ON bookings;

-- If you don't know the trigger name, use this to find and drop all:
DO $$
DECLARE
    trig RECORD;
BEGIN
    FOR trig IN 
        SELECT trigger_name 
        FROM information_schema.triggers 
        WHERE event_object_table = 'bookings'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON bookings', trig.trigger_name);
        RAISE NOTICE 'Dropped trigger: %', trig.trigger_name;
    END LOOP;
END $$;

-- Step 3: Check if booking_reference has a DEFAULT value
SELECT
    column_name,
    column_default
FROM information_schema.columns
WHERE table_name = 'bookings'
AND column_name = 'booking_reference';

-- Step 4: Remove DEFAULT if it exists (we'll generate in application code)
ALTER TABLE bookings ALTER COLUMN booking_reference DROP DEFAULT;

-- Step 5: Verify the constraint is still there (we want to keep it)
SELECT
    conname,
    pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'bookings'::regclass
AND conname LIKE '%booking_reference%';

-- Step 6: Test insert with a unique reference
INSERT INTO bookings (
    booking_reference,
    branch_id,
    customer_id,
    vehicle_id,
    preferred_date,
    preferred_time,
    services,
    status,
    source
) VALUES (
    'BK-TEST-' || EXTRACT(EPOCH FROM NOW())::BIGINT::TEXT,
    1,
    (SELECT id FROM customers LIMIT 1),
    (SELECT id FROM vehicles LIMIT 1),
    '2026-05-01',
    '10:00',
    '["Test"]',
    'pending',
    'manual_test'
) RETURNING id, booking_reference, status;

-- Success should show: id | booking_reference | status
