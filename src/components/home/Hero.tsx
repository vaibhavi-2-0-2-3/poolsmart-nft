
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../shared/Button';
import { ArrowRight } from 'lucide-react';
import { EventsSlider } from './EventsSlider';

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom_right,#ffffff,#f5f9ff,#edf5ff)]"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 animate-fade-in opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              <span className="flex h-2 w-2 rounded-full bg-brand-500 mr-2"></span>
              <span>Decentralized Carpooling</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl animate-fade-in opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              Ride Sharing <br />
              <span className="text-brand-600">Powered by Blockchain</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 animate-fade-in opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
              Connect with fellow travelers, share rides to events, and make every journey memorable while reducing your carbon footprint.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4 animate-fade-in opacity-0" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
              <Link to="/rides">
                <Button variant="primary" size="lg" iconRight={<ArrowRight className="h-5 w-5" />}>
                  Find a Ride
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg">
                  Offer a Ride
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 animate-fade-in opacity-0" style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl font-bold text-foreground">5K+</span>
                <span className="text-sm text-muted-foreground">Users</span>
              </div>
              <div className="h-10 w-px bg-border"></div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl font-bold text-foreground">10K+</span>
                <span className="text-sm text-muted-foreground">Rides</span>
              </div>
              <div className="h-10 w-px bg-border"></div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl font-bold text-foreground">50+</span>
                <span className="text-sm text-muted-foreground">Cities</span>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 relative animate-fade-in opacity-0" style={{ animationDelay: '1.3s', animationFillMode: 'forwards' }}>
            <div className="glass rounded-2xl overflow-hidden border border-gray-200 shadow-xl">
              <EventsSlider />
            </div>

            <div className="absolute -z-10 -top-8 -right-8 h-64 w-64 rounded-full bg-pink-100 blur-3xl opacity-30"></div>
            <div className="absolute -z-10 -bottom-8 -left-8 h-64 w-64 rounded-full bg-brand-100 blur-3xl opacity-30"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
