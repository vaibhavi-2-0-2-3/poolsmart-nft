
import React, { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';
import { HowItWorks } from '@/components/home/HowItWorks';
import { FeaturedEvents } from '@/components/home/FeaturedEvents';
import { initializeEventsInFirebase } from '@/lib/eventsApi';

const Index = () => {
  useEffect(() => {
    // Initialize events when the app starts
    initializeEventsInFirebase();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <FeaturedEvents />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
