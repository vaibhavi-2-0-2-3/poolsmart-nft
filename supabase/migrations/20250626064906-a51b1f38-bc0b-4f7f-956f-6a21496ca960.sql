
-- Create reviews table for driver review submissions
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id uuid REFERENCES public.rides(id) ON DELETE CASCADE,
  driver_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can create reviews for rides they've booked" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;

-- Create policies for reviews
CREATE POLICY "Anyone can view reviews" 
  ON public.reviews 
  FOR SELECT 
  TO authenticated;

CREATE POLICY "Users can create reviews for rides they've booked" 
  ON public.reviews 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own reviews" 
  ON public.reviews 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = reviewer_id);

-- Update the existing profiles table with new columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS search_radius text DEFAULT '10km';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS luggage_size text DEFAULT 'medium';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hide_partial_routes boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS max_back_seat_passengers boolean DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS music boolean DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS animals boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS children boolean DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS smoking boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS instagram_handle text;

-- Update the handle_new_user function to include username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Add RLS policies for profiles (drop and recreate to avoid conflicts)
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated;
