import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../shared/Button';
import { ArrowRight } from 'lucide-react';

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
              The world's first fully decentralized carpooling platform. Connect your wallet to start sharing rides, earning crypto, and participating in community governance.
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
              <div className="relative aspect-video overflow-hidden rounded-t-xl bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-r from-brand-50 to-brand-100 flex items-center justify-center">
                    <div className="relative w-64 h-64">
                      <div className="absolute top-0 left-0 w-full h-full rounded-full bg-brand-200/50 animate-pulse"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-brand-600">
                          <path d="M22 10V15C22 17.8284 22 19.2426 21.1213 20.1213C20.2426 21 18.8284 21 16 21H8C5.17157 21 3.75736 21 2.87868 20.1213C2 19.2426 2 17.8284 2 15V9C2 6.17157 2 4.75736 2.87868 3.87868C3.75736 3 5.17157 3 8 3H16C18.8284 3 20.2426 3 21.1213 3.87868C21.4211 4.17848 21.6186 4.54062 21.7487 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M16 8H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M12 17C12 17 12.8 16 13.5 16C14.5 16 14.6667 17 15 17C15.3333 17 15.5 16 16.5 16C17.5 16 18 17 18 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M7 16L8 17L7 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M11 12L7 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">John D.</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={i < 4 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-500">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                          ))}
                        </div>
                        <span className="ml-1 text-xs text-muted-foreground">(4.2)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5.8 11.3 2 22l10.7-3.79"></path>
                      <path d="M4 3h.01"></path>
                      <path d="M22 8h.01"></path>
                      <path d="M15 2h.01"></path>
                      <path d="M22 20h.01"></path>
                      <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"></path>
                      <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"></path>
                      <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7"></path>
                      <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"></path>
                    </svg>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-t border-border">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                          <path d="M2 12h20"></path>
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">From</div>
                        <div className="text-sm font-medium">San Francisco, CA</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">To</div>
                        <div className="text-sm font-medium">Palo Alto, CA</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-t border-border">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Departure</div>
                        <div className="text-sm font-medium">Today, 5:30 PM</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600">
                          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                          <line x1="3" x2="21" y1="9" y2="9"></line>
                          <line x1="9" x2="9" y1="21" y2="9"></line>
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Seats</div>
                        <div className="text-sm font-medium">3 available</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Price</div>
                    <div className="flex items-center">
                      <span className="text-lg font-semibold">0.015 ETH</span>
                      <span className="ml-1 text-xs text-muted-foreground">($30)</span>
                    </div>
                  </div>
                  <Button variant="primary" size="sm" iconRight={<ArrowRight className="h-4 w-4" />}>
                    Book Ride
                  </Button>
                </div>
              </div>
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
