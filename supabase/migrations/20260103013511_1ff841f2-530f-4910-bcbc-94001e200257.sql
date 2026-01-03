-- Create validation function for movie inputs
CREATE OR REPLACE FUNCTION public.validate_movie_input()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Validate title (required, 1-200 characters)
  IF NEW.title IS NULL OR length(trim(NEW.title)) < 1 THEN
    RAISE EXCEPTION 'Title is required';
  END IF;
  IF length(NEW.title) > 200 THEN
    RAISE EXCEPTION 'Title must be less than 200 characters';
  END IF;
  
  -- Validate description length (max 2000 characters)
  IF NEW.description IS NOT NULL AND length(NEW.description) > 2000 THEN
    RAISE EXCEPTION 'Description must be less than 2000 characters';
  END IF;
  
  -- Validate year range (1800-2100)
  IF NEW.year IS NOT NULL AND (NEW.year < 1800 OR NEW.year > 2100) THEN
    RAISE EXCEPTION 'Year must be between 1800 and 2100';
  END IF;
  
  -- Validate rating range (0-10)
  IF NEW.rating IS NOT NULL AND (NEW.rating < 0 OR NEW.rating > 10) THEN
    RAISE EXCEPTION 'Rating must be between 0 and 10';
  END IF;
  
  -- Validate match_percentage range (0-100)
  IF NEW.match_percentage IS NOT NULL AND (NEW.match_percentage < 0 OR NEW.match_percentage > 100) THEN
    RAISE EXCEPTION 'Match percentage must be between 0 and 100';
  END IF;
  
  -- Validate URL formats (must start with http:// or https://)
  IF NEW.image IS NOT NULL AND NEW.image !~ '^https?://' THEN
    RAISE EXCEPTION 'Poster URL must start with http:// or https://';
  END IF;
  
  IF NEW.video_url IS NOT NULL AND NEW.video_url !~ '^https?://' THEN
    RAISE EXCEPTION 'Video URL must start with http:// or https://';
  END IF;
  
  IF NEW.trailer_url IS NOT NULL AND NEW.trailer_url !~ '^https?://' THEN
    RAISE EXCEPTION 'Trailer URL must start with http:// or https://';
  END IF;
  
  -- Validate duration format (should be like "1h 30m" or "120 min")
  IF NEW.duration IS NOT NULL AND length(NEW.duration) > 20 THEN
    RAISE EXCEPTION 'Duration must be less than 20 characters';
  END IF;
  
  -- Validate category length
  IF NEW.category IS NOT NULL AND length(NEW.category) > 50 THEN
    RAISE EXCEPTION 'Category must be less than 50 characters';
  END IF;
  
  -- Validate maturity rating length
  IF NEW.maturity_rating IS NOT NULL AND length(NEW.maturity_rating) > 10 THEN
    RAISE EXCEPTION 'Maturity rating must be less than 10 characters';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for INSERT operations
CREATE TRIGGER validate_movie_before_insert
  BEFORE INSERT ON public.movies
  FOR EACH ROW EXECUTE FUNCTION public.validate_movie_input();

-- Create trigger for UPDATE operations
CREATE TRIGGER validate_movie_before_update
  BEFORE UPDATE ON public.movies
  FOR EACH ROW EXECUTE FUNCTION public.validate_movie_input();