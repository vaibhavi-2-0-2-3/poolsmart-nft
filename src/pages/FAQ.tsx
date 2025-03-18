
import React from 'react';
import { DocumentLayout } from '@/components/layout/DocumentLayout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <DocumentLayout
      title="Frequently Asked Questions"
      description="Find answers to common questions about PoolChain."
    >
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is PoolChain?</AccordionTrigger>
          <AccordionContent>
            PoolChain is a decentralized carpooling platform powered by blockchain technology. It connects drivers with empty seats to passengers traveling in the same direction, allowing them to share the cost of the journey while reducing traffic congestion and carbon emissions.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>How does PoolChain work?</AccordionTrigger>
          <AccordionContent>
            <p>PoolChain works in three simple steps:</p>
            <ol className="list-decimal ml-5 mt-2">
              <li>Drivers list their planned journeys, including departure location, destination, date, time, and available seats.</li>
              <li>Passengers search for rides that match their travel needs and book a seat.</li>
              <li>Payments are handled securely through smart contracts on the blockchain, with funds released to the driver after the ride is completed.</li>
            </ol>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Do I need cryptocurrency to use PoolChain?</AccordionTrigger>
          <AccordionContent>
            Yes, PoolChain operates on blockchain technology. You'll need a compatible wallet and some cryptocurrency to pay for rides or receive payments as a driver. We support multiple popular cryptocurrencies, and our platform is designed to make the process as simple as possible, even for crypto beginners.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>How do I connect my wallet?</AccordionTrigger>
          <AccordionContent>
            Click on the "Connect Wallet" button in the top-right corner of the website. You'll be prompted to connect using one of our supported wallet providers. Follow the instructions in your wallet app to complete the connection. Once connected, your wallet address will be displayed in the navigation bar.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>Is my personal information secure?</AccordionTrigger>
          <AccordionContent>
            We take data security seriously. While blockchain transactions are public, your personal information is protected. We only share the necessary information with drivers or passengers for a successful ride. Review our Privacy Policy for more information on how we handle your data.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
          <AccordionTrigger>How is trust established between drivers and passengers?</AccordionTrigger>
          <AccordionContent>
            PoolChain implements several trust mechanisms:
            <ul className="list-disc ml-5 mt-2">
              <li>Verified user profiles with ratings and reviews</li>
              <li>Identity verification for drivers</li>
              <li>Smart contract escrow for payments</li>
              <li>Transparency through blockchain verification</li>
              <li>Community governance to resolve disputes</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-7">
          <AccordionTrigger>What are POOL tokens?</AccordionTrigger>
          <AccordionContent>
            POOL tokens are the native utility tokens of the PoolChain ecosystem. They can be earned by actively participating in the platform (offering rides, leaving reviews) and can be used for:
            <ul className="list-disc ml-5 mt-2">
              <li>Discounted rides</li>
              <li>Priority matching</li>
              <li>Voting on platform governance proposals</li>
              <li>Accessing premium features</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-8">
          <AccordionTrigger>How are ride prices determined?</AccordionTrigger>
          <AccordionContent>
            Drivers set their own prices when listing a ride. Our platform suggests a fair price based on distance, estimated fuel costs, and market conditions, but drivers have the final say. This creates a competitive marketplace that balances fair compensation for drivers with affordable transport for passengers.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-9">
          <AccordionTrigger>What if my ride is canceled?</AccordionTrigger>
          <AccordionContent>
            If a driver cancels a ride, passengers receive an automatic refund through the smart contract. If a passenger cancels more than 24 hours before the ride, they receive a full refund. Cancellations within 24 hours may incur a fee that is paid to the driver as compensation. The exact cancellation policy is transparent and encoded in the smart contract.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-10">
          <AccordionTrigger>Can I participate in the DAO governance?</AccordionTrigger>
          <AccordionContent>
            Yes, PoolChain operates as a Decentralized Autonomous Organization (DAO). POOL token holders can propose changes, vote on platform decisions, and help shape the future of the service. Visit our DAO Governance page to learn more about active proposals and how to participate.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </DocumentLayout>
  );
};

export default FAQ;
