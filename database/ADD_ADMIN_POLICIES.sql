-- Add INSERT policies for super_admins and branch_admins tables
-- This allows public signup/login without authentication

-- Super Admins policies
DROP POLICY IF EXISTS "Anyone can insert super_admins" ON super_admins;
CREATE POLICY "Anyone can insert super_admins" ON super_admins
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can select super_admins" ON super_admins;
CREATE POLICY "Anyone can select super_admins" ON super_admins
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Anyone can update super_admins" ON super_admins;
CREATE POLICY "Anyone can update super_admins" ON super_admins
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete super_admins" ON super_admins;
CREATE POLICY "Anyone can delete super_admins" ON super_admins
    FOR DELETE
    USING (true);

-- Branch Admins policies
DROP POLICY IF EXISTS "Anyone can insert branch_admins" ON branch_admins;
CREATE POLICY "Anyone can insert branch_admins" ON branch_admins
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can select branch_admins" ON branch_admins;
CREATE POLICY "Anyone can select branch_admins" ON branch_admins
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Anyone can update branch_admins" ON branch_admins;
CREATE POLICY "Anyone can update branch_admins" ON branch_admins
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete branch_admins" ON branch_admins;
CREATE POLICY "Anyone can delete branch_admins" ON branch_admins
    FOR DELETE
    USING (true);

-- Verify policies were created
SELECT tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('super_admins', 'branch_admins')
ORDER BY tablename, policyname;