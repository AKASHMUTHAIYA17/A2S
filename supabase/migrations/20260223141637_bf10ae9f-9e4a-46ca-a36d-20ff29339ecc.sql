-- Create storage bucket for APK files
INSERT INTO storage.buckets (id, name, public)
VALUES ('app-downloads', 'app-downloads', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public can download APK files"
ON storage.objects FOR SELECT
USING (bucket_id = 'app-downloads');

-- Allow authenticated admins to upload
CREATE POLICY "Admins can upload APK files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'app-downloads'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete APK files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'app-downloads'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);