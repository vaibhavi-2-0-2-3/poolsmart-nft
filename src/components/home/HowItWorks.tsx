
import React from 'react';
import { Card } from '../shared/Card';

const steps = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
      </svg>
    ),
    title: 'Connect Your Wallet',
    description: 'Link your preferred Web3 wallet like MetaMask or WalletConnect to authenticate securely.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
      </svg>
    ),
    title: 'Create Your Profile',
    description: 'Set up your rider or driver profile with preferences and earn initial reputation tokens.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4zM6 15a3 3 0 0 0-3 3v2h18v-2a3 3 0 0 0-3-3H6z"></path>
      </svg>
    ),
    title: 'Book or Offer Rides',
    description: 'Search for available rides or offer your own. All details are stored on the blockchain.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    ),
    title: 'Complete the Ride',
    description: 'Meet at the designated location, enjoy your ride, and confirm completion on the platform.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2"></path>
        <path d="m12 17.8 6.2 3.2-1.2-6.9 5-4.8-7-1L12 2"></path>
      </svg>
    ),
    title: 'Rate and Earn',
    description: 'Rate your experience, earn reputation NFTs, and receive or release payment through smart contracts.'
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-white to-brand-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground">
            Getting started with blockchain-powered carpooling is easy. Follow these simple steps to begin your decentralized journey.
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-brand-100 hidden md:block"></div>
          
          <div className="space-y-12 relative">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-16 md:text-right order-1' : 'md:pl-16 md:text-left md:order-3'}`}>
                  <Card className={`transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${index % 2 === 0 ? 'ml-auto mr-0' : 'mr-auto ml-0'}`}>
                    <div className="flex flex-col items-center md:items-start p-6">
                      <div className="h-12 w-12 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600 mb-4">
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-center md:text-left">{step.description}</p>
                    </div>
                  </Card>
                </div>
                
                <div className="md:order-2 flex items-center justify-center z-10">
                  <div className="h-14 w-14 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xl border-4 border-white">
                    {index + 1}
                  </div>
                </div>
                
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pl-16 md:order-3' : 'md:pr-16 md:order-1'}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { HowItWorks };
