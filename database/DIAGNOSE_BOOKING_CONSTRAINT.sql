-- ============================================
-- DIAGNOSE BOOKING_REFERENCE CONSTRAINT ISSUE
-- ============================================
-- Run this in Supabase SQL Editor to understand why
-- we're getting duplicate key errors

-- 1. Check existing booking references
SELECT 
    id,
    booking_reference,
    status,
    created_at
FROM bookings
ORDER BY created_at DESC
LIMIT 10;

-- 2. Check the unique constraint definition
SELECT
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'bookings'::regclass
AND conname LIKE '%booking_reference%';

-- 3. Check for triggers on bookings table
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE event_object_table = 'bookings';

-- 4. Check if there's a sequence or default value
SELECT
    column_name,
    column_default,
    is_nullable,
    data_type
FROM information_schema.columns
WHERE table_name = 'bookings'
AND column_name = 'booking_reference';

-- 5. List all indexes on bookings table
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'bookings';

-- 6. Check RLS policies on bookings
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'bookings';
