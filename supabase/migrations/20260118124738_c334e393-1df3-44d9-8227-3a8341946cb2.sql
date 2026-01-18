-- Fix profiles table RLS policies
-- Remove the conflicting "Block anonymous access" policy and keep only the proper user-scoped policy

-- Drop the potentially problematic policy
DROP POLICY IF EXISTS "Block anonymous access to profiles" ON public.profiles;

-- Ensure the existing user policy is correct (recreate to be safe)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Add INSERT policy so users can create their own profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);