-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can view movies" ON public.movies;
DROP POLICY IF EXISTS "Admins can insert movies" ON public.movies;
DROP POLICY IF EXISTS "Admins can update movies" ON public.movies;
DROP POLICY IF EXISTS "Admins can delete movies" ON public.movies;

-- Create permissive policies (default behavior)
CREATE POLICY "Anyone can view movies" 
ON public.movies 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert movies" 
ON public.movies 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update movies" 
ON public.movies 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete movies" 
ON public.movies 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));