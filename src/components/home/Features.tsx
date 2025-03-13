
import React from 'react';
import { Card } from '../shared/Card';

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="8" y1="3" x2="9.5" y2="9"></line>
        <line x1="11" y1="3" x2="12.5" y2="9"></line>
        <line x1="16" y1="3" x2="14.5" y2="9"></line>
        <line x1="20" y1="6" x2="14" y2="10"></line>
        <line x1="22" y1="10" x2="16" y2="12"></line>
        <line x1="22" y1="14" x2="16" y2="16"></line>
        <line x1="20" y1="18" x2="14" y2="14"></line>
        <line x1="16" y1="21" x2="14.5" y2="15"></line>
        <line x1="12" y1="22" x2="12.5" y2="16"></line>
        <line x1="8" y1="21" x2="9.5" y2="15"></line>
        <line x1="4" y1="18" x2="10" y2="14"></line>
        <line x1="2" y1="14" x2="8" y2="12"></line>
        <line x1="2" y1="10" x2="8" y2="8"></line>
        <line x1="4" y1="6" x2="10" y2="10"></line>
      </svg>
    ),
    title: 'Decentralized Authentication',
    description: 'Connect with your Web3 wallet for secure, password-free access. Own your identity and control your data.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"></path>
        <path d="M12 10h4v4"></path>
        <path d="m12 14 4-4"></path>
        <path d="M16 18a2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2H8"></path>
        <path d="M18 12a2 2 0 0 0 2-2 2 2 0 0 0-2-2 2 2 0 0 0-2 2v10"></path>
      </svg>
    ),
    title: 'Smart Contract Rides',
    description: 'Rides are managed through immutable smart contracts, ensuring transparency and preventing cancellation disputes.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    ),
    title: 'Crypto Payments & Escrow',
    description: 'Pay for rides with cryptocurrency. Funds are held in escrow and only released when the ride is completed.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2"></path>
        <path d="m12 17.8 6.2 3.2-1.2-6.9 5-4.8-7-1L12 2"></path>
      </svg>
    ),
    title: 'NFT Reputation System',
    description: 'Earn and display reputation-based NFTs. Build trust through verifiable on-chain history and ratings.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" x2="21" y1="9" y2="9"></line>
        <line x1="9" x2="9" y1="21" y2="9"></line>
      </svg>
    ),
    title: 'DAO Governance',
    description: "Participate in community governance through token voting. Shape the platform's future and fee structure."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.29 7 12 12 20.71 7"></polyline>
        <line x1="12" y1="22" x2="12" y2="12"></line>
      </svg>
    ),
    title: 'AI-Powered Matching',
    description: 'Our AI optimizes routes and recommends drivers and riders based on preferences and past interactions.'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powered by Blockchain & AI</h2>
          <p className="text-lg text-muted-foreground">
            Our platform combines the security of blockchain with the intelligence of AI to create a trustless, efficient carpooling experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              padding="lg"
            >
              <div className="h-12 w-12 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600 mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Features };
