
import React from 'react';
import { DocumentLayout } from '@/components/layout/DocumentLayout';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  File, 
  UserCircle, 
  Car, 
  CreditCard, 
  Shield 
} from 'lucide-react';

const Documentation = () => {
  return (
    <DocumentLayout
      title="Documentation"
      description="Technical documentation and guides for using PoolChain's platform."
    >
      <Tabs defaultValue="getting-started" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="riders">For Riders</TabsTrigger>
          <TabsTrigger value="drivers">For Drivers</TabsTrigger>
          <TabsTrigger value="wallet">Wallet Integration</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="getting-started" className="mt-6">
          <div className="flex items-start mb-6">
            <File className="h-6 w-6 mr-2 text-brand-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold mb-3">Getting Started with PoolChain</h2>
              <p className="mb-4">
                PoolChain is a decentralized carpooling platform that leverages blockchain technology to create a trustless, efficient, and cost-effective transportation solution.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-3">Creating Your Account</h3>
          <ol className="list-decimal ml-5 mb-6 space-y-2">
            <li>Connect your wallet by clicking the "Connect Wallet" button in the top right corner.</li>
            <li>Complete your profile by adding your personal information, profile picture, and preferences.</li>
            <li>Verify your identity to build trust with other users (required for drivers, optional for riders).</li>
            <li>Set up your payment methods by linking your cryptocurrency wallet.</li>
          </ol>

          <h3 className="text-lg font-medium mb-3">Platform Overview</h3>
          <p className="mb-4">
            The PoolChain platform consists of several key components:
          </p>
          <ul className="list-disc ml-5 mb-6 space-y-2">
            <li><strong>Ride Marketplace:</strong> Where drivers list available rides and passengers can search and book.</li>
            <li><strong>Smart Contracts:</strong> Handle secure payments, escrow, and ride agreements.</li>
            <li><strong>Rating System:</strong> Builds reputation for both drivers and passengers based on past experiences.</li>
            <li><strong>DAO Governance:</strong> Allows token holders to propose and vote on platform changes.</li>
            <li><strong>Token Economy:</strong> POOL tokens that provide utility and governance rights within the ecosystem.</li>
          </ul>
        </TabsContent>
        
        <TabsContent value="riders" className="mt-6">
          <div className="flex items-start mb-6">
            <UserCircle className="h-6 w-6 mr-2 text-brand-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold mb-3">Rider's Guide</h2>
              <p className="mb-4">
                This guide covers everything you need to know as a passenger using the PoolChain platform.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-3">Finding and Booking Rides</h3>
          <ol className="list-decimal ml-5 mb-6 space-y-2">
            <li>Navigate to the "Find Rides" page from the main menu.</li>
            <li>Enter your origin, destination, date, and number of passengers.</li>
            <li>Browse available rides that match your criteria.</li>
            <li>View driver profiles, ratings, and vehicle details.</li>
            <li>Select your preferred ride and click "Book Now".</li>
            <li>Confirm the booking and complete the payment through your connected wallet.</li>
          </ol>

          <h3 className="text-lg font-medium mb-3">During and After Your Ride</h3>
          <ul className="list-disc ml-5 mb-6 space-y-2">
            <li>Use the in-app messaging to communicate with your driver.</li>
            <li>Track your ride and estimated arrival time.</li>
            <li>After the ride, confirm completion to release the payment to the driver.</li>
            <li>Rate your experience and leave feedback for the driver.</li>
            <li>Earn POOL tokens for active participation and positive contributions.</li>
          </ul>
        </TabsContent>
        
        <TabsContent value="drivers" className="mt-6">
          <div className="flex items-start mb-6">
            <Car className="h-6 w-6 mr-2 text-brand-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold mb-3">Driver's Guide</h2>
              <p className="mb-4">
                Learn how to offer rides, set prices, and maximize your earnings as a PoolChain driver.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-3">Listing a Ride</h3>
          <ol className="list-decimal ml-5 mb-6 space-y-2">
            <li>Complete your driver profile and verification (including license and vehicle details).</li>
            <li>Navigate to the "Dashboard" and click "List a Ride".</li>
            <li>Enter your departure location, destination, date, time, and available seats.</li>
            <li>Set your price (our system will suggest a fair market rate).</li>
            <li>Add any additional details about the ride (luggage space, stops, etc.).</li>
            <li>Publish your listing to make it visible to potential passengers.</li>
          </ol>

          <h3 className="text-lg font-medium mb-3">Managing Your Rides</h3>
          <ul className="list-disc ml-5 mb-6 space-y-2">
            <li>View and manage all your listings from your Driver Dashboard.</li>
            <li>Review passenger requests and approve or decline them.</li>
            <li>Communicate with passengers through the secure messaging system.</li>
            <li>Track your earnings and ride history.</li>
            <li>Build your reputation through positive ratings and reviews.</li>
          </ul>
        </TabsContent>
        
        <TabsContent value="wallet" className="mt-6">
          <div className="flex items-start mb-6">
            <CreditCard className="h-6 w-6 mr-2 text-brand-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold mb-3">Wallet Integration Guide</h2>
              <p className="mb-4">
                Understanding how to connect and use your blockchain wallet with PoolChain.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-3">Supported Wallets</h3>
          <p className="mb-4">
            PoolChain supports the following wallet types:
          </p>
          <ul className="list-disc ml-5 mb-6 space-y-2">
            <li>MetaMask</li>
            <li>WalletConnect</li>
            <li>Coinbase Wallet</li>
            <li>Trust Wallet</li>
          </ul>

          <h3 className="text-lg font-medium mb-3">Connecting Your Wallet</h3>
          <ol className="list-decimal ml-5 mb-6 space-y-2">
            <li>Click the "Connect Wallet" button in the navigation bar.</li>
            <li>Select your preferred wallet provider from the options.</li>
            <li>Follow the prompts in your wallet application to authorize the connection.</li>
            <li>Once connected, your wallet address will appear in the navigation bar.</li>
          </ol>

          <h3 className="text-lg font-medium mb-3">Managing Payments</h3>
          <p className="mb-4">
            All transactions on PoolChain are facilitated through smart contracts:
          </p>
          <ul className="list-disc ml-5 mb-6 space-y-2">
            <li>When booking a ride, the payment amount is held in escrow.</li>
            <li>Funds are only released to the driver after ride completion is confirmed.</li>
            <li>In case of disputes, the DAO governance system can help resolve issues.</li>
            <li>Gas fees for transactions are paid by the user initiating the transaction.</li>
          </ul>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <div className="flex items-start mb-6">
            <Shield className="h-6 w-6 mr-2 text-brand-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold mb-3">Security Best Practices</h2>
              <p className="mb-4">
                Learn how to keep your account and funds secure while using PoolChain.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-3">Account Security</h3>
          <ul className="list-disc ml-5 mb-6 space-y-2">
            <li>Never share your wallet's private keys or seed phrases with anyone.</li>
            <li>Enable two-factor authentication (2FA) on your wallet if available.</li>
            <li>Be cautious of phishing attempts - always verify the website URL.</li>
            <li>Use a secure and unique password for your email account associated with PoolChain.</li>
            <li>Regularly update your wallet software to the latest version.</li>
          </ul>

          <h3 className="text-lg font-medium mb-3">Smart Contract Security</h3>
          <p className="mb-4">
            PoolChain's smart contracts have undergone rigorous security audits:
          </p>
          <ul className="list-disc ml-5 mb-6 space-y-2">
            <li>All contracts are open-source and have been audited by reputable security firms.</li>
            <li>We implement formal verification for critical contract components.</li>
            <li>The platform includes built-in safeguards against common attack vectors.</li>
            <li>Bug bounty programs are in place to incentivize security researchers.</li>
          </ul>

          <h3 className="text-lg font-medium mb-3">Ride Safety</h3>
          <p className="mb-4">
            Your physical safety is also a priority:
          </p>
          <ul className="list-disc ml-5 mb-6 space-y-2">
            <li>All drivers undergo identity verification before offering rides.</li>
            <li>Share your ride details with friends or family before departing.</li>
            <li>Use the in-app emergency features if you feel unsafe during a ride.</li>
            <li>Report any suspicious behavior through the platform.</li>
          </ul>
        </TabsContent>
      </Tabs>
    </DocumentLayout>
  );
};

export default Documentation;
