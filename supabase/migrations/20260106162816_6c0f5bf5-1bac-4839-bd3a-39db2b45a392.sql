-- Create storage bucket for movie images
INSERT INTO storage.buckets (id, name, public) VALUES ('movie-images', 'movie-images', true);

-- Allow anyone to view movie images
CREATE POLICY "Anyone can view movie images"
ON storage.objects FOR SELECT
USING (bucket_id = 'movie-images');

-- Allow admins to upload movie images
CREATE POLICY "Admins can upload movie images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'movie-images' AND has_role(auth.uid(), 'admin'));

-- Allow admins to update movie images
CREATE POLICY "Admins can update movie images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'movie-images' AND has_role(auth.uid(), 'admin'));

-- Allow admins to delete movie images
CREATE POLICY "Admins can delete movie images"
ON storage.objects FOR DELETE
USING (bucket_id = 'movie-images' AND has_role(auth.uid(), 'admin'));