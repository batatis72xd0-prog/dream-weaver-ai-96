-- Create image_history table for storing generated images
CREATE TABLE public.image_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.image_history ENABLE ROW LEVEL SECURITY;

-- Public read/write policies (no auth required for this app)
CREATE POLICY "Anyone can view images" 
ON public.image_history 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert images" 
ON public.image_history 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can delete images" 
ON public.image_history 
FOR DELETE 
USING (true);