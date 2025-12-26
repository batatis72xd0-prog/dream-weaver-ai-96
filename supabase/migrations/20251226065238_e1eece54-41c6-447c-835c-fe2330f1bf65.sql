-- Add user_id column to image_history
ALTER TABLE public.image_history 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Anyone can delete images " ON public.image_history;
DROP POLICY IF EXISTS "Anyone can insert images " ON public.image_history;
DROP POLICY IF EXISTS "Anyone can view images " ON public.image_history;

-- Create secure RLS policies for authenticated users only
CREATE POLICY "Users can view their own images"
ON public.image_history
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own images"
ON public.image_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images"
ON public.image_history
FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own images"
ON public.image_history
FOR UPDATE
USING (auth.uid() = user_id);

-- Create storage bucket for generated images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('generated-images', 'generated-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the bucket
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'generated-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own images in storage"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'generated-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own images in storage"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'generated-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public can view all images in bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'generated-images');