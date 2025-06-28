
-- Create ride_requests table for seat requests
CREATE TABLE public.ride_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ride_id UUID NOT NULL REFERENCES public.rides(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(ride_id, user_id)
);

-- Add phone number to profiles table if not exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Enable RLS on ride_requests
ALTER TABLE public.ride_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for ride_requests
CREATE POLICY "Users can view ride requests for their rides" 
  ON public.ride_requests 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.rides 
      WHERE rides.id = ride_requests.ride_id 
      AND rides.user_id = auth.uid()
    )
    OR ride_requests.user_id = auth.uid()
  );

CREATE POLICY "Users can create ride requests" 
  ON public.ride_requests 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ride requests" 
  ON public.ride_requests 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Ride owners can update requests for their rides" 
  ON public.ride_requests 
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.rides 
      WHERE rides.id = ride_requests.ride_id 
      AND rides.user_id = auth.uid()
    )
  );

-- Add function to get event rides with driver details
CREATE OR REPLACE FUNCTION get_event_rides(event_uuid UUID)
RETURNS TABLE (
  ride_id UUID,
  driver_name TEXT,
  driver_email TEXT,
  driver_phone TEXT,
  origin TEXT,
  departure_time TIMESTAMP WITH TIME ZONE,
  seats INTEGER,
  price NUMERIC,
  available_seats INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id as ride_id,
    COALESCE(p.full_name, r.driver_name) as driver_name,
    COALESCE(p.email, r.driver_email) as driver_email,
    p.phone_number as driver_phone,
    r.origin,
    r.date as departure_time,
    r.seats,
    r.price,
    (r.seats - COALESCE(booking_count.count, 0)) as available_seats
  FROM public.rides r
  INNER JOIN public.event_rides er ON r.id = er.ride_id
  LEFT JOIN public.profiles p ON r.user_id = p.id
  LEFT JOIN (
    SELECT ride_id, COUNT(*) as count
    FROM public.bookings
    WHERE status = 'confirmed'
    GROUP BY ride_id
  ) booking_count ON r.id = booking_count.ride_id
  WHERE er.event_id = event_uuid
  AND r.status = 'active'
  AND r.date > NOW();
END;
$$;
