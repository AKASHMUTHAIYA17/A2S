-- Fix 1: Block anonymous access to profiles table
-- Drop the existing policy and recreate without TO authenticated
-- This makes auth.uid() = id check apply to ALL roles (including anon)
-- Since auth.uid() returns NULL for anonymous users, they won't match any rows

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Also add explicit block for anonymous users for defense in depth
CREATE POLICY "Block anonymous access to profiles"
ON public.profiles FOR SELECT
TO anon
USING (false);

-- Fix 2: Add restrictive INSERT policy for user_roles
-- This prevents non-admin users from inserting role assignments
-- The handle_new_user trigger uses SECURITY DEFINER so it bypasses RLS

CREATE POLICY "Only admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));