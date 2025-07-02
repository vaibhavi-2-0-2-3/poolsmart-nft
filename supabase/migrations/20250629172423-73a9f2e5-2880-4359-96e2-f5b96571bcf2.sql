
-- Fix the get_event_rides function to cast COUNT result to integer
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
    (r.seats - COALESCE(accepted_requests.count, 0)::integer) as available_seats
  FROM public.rides r
  INNER JOIN public.event_rides er ON r.id = er.ride_id
  LEFT JOIN public.profiles p ON r.user_id = p.id
  LEFT JOIN (
    SELECT rr.ride_id, COUNT(*)::integer as count
    FROM public.ride_requests rr
    WHERE rr.status = 'accepted'
    GROUP BY rr.ride_id
  ) accepted_requests ON r.id = accepted_requests.ride_id
  WHERE er.event_id = event_uuid
  AND r.status = 'active'
  AND r.date > NOW();
END;
$$;
