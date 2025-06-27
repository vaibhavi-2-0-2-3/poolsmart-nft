
-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  image_url TEXT,
  organizer_name TEXT,
  organizer_contact TEXT,
  category TEXT DEFAULT 'general',
  max_attendees INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event RSVPs table
CREATE TABLE public.event_rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'attending' CHECK (status IN ('attending', 'maybe', 'not_attending')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Create event rides table to link rides with events
CREATE TABLE public.event_rides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  ride_id UUID NOT NULL REFERENCES public.rides(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, ride_id)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rides ENABLE ROW LEVEL SECURITY;

-- Events policies (public read, authenticated users can create)
CREATE POLICY "Anyone can view events" 
  ON public.events 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create events" 
  ON public.events 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update their events" 
  ON public.events 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Event RSVPs policies
CREATE POLICY "Users can view event RSVPs" 
  ON public.event_rsvps 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own RSVPs" 
  ON public.event_rsvps 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own RSVPs" 
  ON public.event_rsvps 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own RSVPs" 
  ON public.event_rsvps 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Event rides policies
CREATE POLICY "Users can view event rides" 
  ON public.event_rides 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can link rides to events" 
  ON public.event_rides 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Insert some sample events for Goa
INSERT INTO public.events (name, description, location, date_time, organizer_name, category) VALUES 
('Sunburn Festival 2025', 'Asia''s largest electronic dance music festival returns to Goa with world-class DJs and performers.', 'Vagator Beach, North Goa', '2025-01-15 18:00:00+05:30', 'Sunburn Events', 'music'),
('Comic Con Goa 2025', 'The ultimate celebration of comics, gaming, and pop culture in Goa. Meet artists, attend workshops, and enjoy cosplay competitions.', 'Goa Convention Center, Panaji', '2025-02-20 10:00:00+05:30', 'Comic Con India', 'entertainment'),
('Goa Food & Music Festival', 'A delightful blend of Goan cuisine and live music performances by local and international artists.', 'Miramar Beach, Panaji', '2025-01-25 17:00:00+05:30', 'Goa Tourism', 'food'),
('Shigmo Festival Parade', 'Traditional Goan spring festival celebrated with colorful parades, folk dances, and cultural performances.', 'Panaji City Center', '2025-03-10 16:00:00+05:30', 'Goa Cultural Department', 'cultural'),
('International Film Festival of India', 'Prestigious film festival showcasing cinema from around the world with screenings and celebrity interactions.', 'INOX Multiplex, Panaji', '2025-11-20 19:00:00+05:30', 'Directorate of Film Festivals', 'film');
