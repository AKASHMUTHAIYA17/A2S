
-- =============================================
-- DATABASE OPTIMIZATION FOR HIGH CONCURRENCY
-- =============================================

-- 1. INDEX: movies table - frequently queried columns
CREATE INDEX IF NOT EXISTS idx_movies_category ON public.movies (category);
CREATE INDEX IF NOT EXISTS idx_movies_year ON public.movies (year DESC);
CREATE INDEX IF NOT EXISTS idx_movies_rating ON public.movies (rating DESC);
CREATE INDEX IF NOT EXISTS idx_movies_created_at ON public.movies (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_movies_category_rating ON public.movies (category, rating DESC);
CREATE INDEX IF NOT EXISTS idx_movies_category_created ON public.movies (category, created_at DESC);

-- 2. INDEX: user_favorites - heavily queried per user
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON public.user_favorites (user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_movie_id ON public.user_favorites (movie_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_movie ON public.user_favorites (user_id, movie_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_liked ON public.user_favorites (user_id) WHERE is_liked = true;
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_list ON public.user_favorites (user_id) WHERE is_in_list = true;

-- 3. INDEX: user_roles - used in every RLS check via has_role()
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles (user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_role ON public.user_roles (user_id, role);

-- 4. INDEX: profiles - queried on auth
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);

-- 5. Optimize the has_role function with better caching hint
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
