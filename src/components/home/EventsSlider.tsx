
import React from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { EventCard, Event } from './EventCard';

// Demo events data (expanded)
export const DEMO_EVENTS: Event[] = [
  {
    id: "event-1",
    title: "RideShare Community Meetup",
    description: "Join fellow riders and drivers for a community gathering to discuss the future of decentralized ride-sharing. Food and refreshments provided!",
    date: "2025-05-15T18:00:00",
    location: "San Francisco, CA",
    organizerName: "Community DAO",
    price: 0.01,
    imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "event-2",
    title: "Blockchain & Transportation Workshop",
    description: "Learn how blockchain technology is revolutionizing transportation networks and infrastructure through hands-on workshops and expert presentations.",
    date: "2025-05-22T10:00:00",
    location: "Palo Alto, CA",
    organizerName: "Tech Innovators",
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "event-3",
    title: "Driver Certification Program",
    description: "Get certified as a verified driver on our platform. This program includes safety training, customer service best practices, and blockchain wallet setup.",
    date: "2025-05-29T14:00:00",
    location: "Mountain View, CA",
    organizerName: "Driver Guild",
    price: 0.05,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "event-4",
    title: "Web3 Transportation Summit",
    description: "A three-day conference focusing on the intersection of blockchain technology and transportation solutions. Network with industry leaders and investors.",
    date: "2025-06-03T09:00:00",
    location: "Los Angeles, CA",
    organizerName: "Web3 Transport Alliance",
    price: 0.15,
    imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "event-5",
    title: "Decentralized Insurance Workshop",
    description: "Learn about the future of ride insurance in the Web3 space. Topics include smart contracts, decentralized claims processing, and risk assessment.",
    date: "2025-06-10T13:00:00",
    location: "San Diego, CA",
    organizerName: "DeFi Insurance Group",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "event-6",
    title: "EV Integration Hackathon",
    description: "A weekend hackathon focused on integrating electric vehicles with our decentralized ride-sharing platform. Cash prizes for the top three teams!",
    date: "2025-06-15T10:00:00",
    location: "Seattle, WA",
    organizerName: "Green Transport DAO",
    price: 0.02,
    imageUrl: "https://images.unsplash.com/photo-1552083375-1447ce886485?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "event-7",
    title: "Community Governance Meeting",
    description: "Monthly governance meeting to vote on platform improvements, fee structures, and community initiatives. All token holders are encouraged to attend.",
    date: "2025-06-20T17:00:00",
    location: "Virtual Event",
    organizerName: "Protocol Governance",
    imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "event-8",
    title: "Rider Safety Workshop",
    description: "A workshop dedicated to rider safety in the decentralized transportation ecosystem. Learn best practices and help shape our safety standards.",
    date: "2025-06-25T14:00:00",
    location: "Portland, OR",
    organizerName: "Safety First Coalition",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "event-9",
    title: "Token Economics Seminar",
    description: "Deep dive into the tokenomics of our platform. Learn about staking, rewards, and how the economic model sustains and grows our ecosystem.",
    date: "2025-07-05T11:00:00",
    location: "Austin, TX",
    organizerName: "Crypto Economics Institute",
    price: 0.08,
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "event-10",
    title: "Rural Transportation Solutions",
    description: "Exploring how blockchain-based ride sharing can solve transportation challenges in rural and underserved communities.",
    date: "2025-07-12T10:00:00",
    location: "Denver, CO",
    organizerName: "Rural Tech Alliance",
    imageUrl: "https://images.unsplash.com/photo-1502786129293-79981df4e689?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "event-11",
    title: "Cross-Chain Integration Workshop",
    description: "Technical workshop on cross-chain functionality to enable payment and identity verification across multiple blockchain networks.",
    date: "2025-07-18T09:00:00",
    location: "Miami, FL",
    organizerName: "Blockchain Interoperability Alliance",
    price: 0.1,
    imageUrl: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "event-12",
    title: "Driver Appreciation Day",
    description: "A day to celebrate our community of drivers with activities, gifts, and networking opportunities. Special awards for top-rated drivers.",
    date: "2025-07-25T12:00:00",
    location: "Chicago, IL",
    organizerName: "Driver Community",
    imageUrl: "https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "event-13",
    title: "Urban Mobility Conference",
    description: "Annual conference focusing on the future of urban transportation and how decentralized solutions are reshaping city mobility.",
    date: "2025-08-02T09:00:00",
    location: "New York, NY",
    organizerName: "Urban Transport Coalition",
    price: 0.2,
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "event-14",
    title: "Platform Security Roundtable",
    description: "Expert panel discussion on securing blockchain-based transportation platforms against common threats and vulnerabilities.",
    date: "2025-08-10T15:00:00",
    location: "Washington, DC",
    organizerName: "Blockchain Security Alliance",
    imageUrl: "https://images.unsplash.com/photo-1530099486328-e021101a494a?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "event-15",
    title: "Global Ride-Sharing Summit",
    description: "International summit bringing together decentralized ride-sharing projects from around the world to share insights and forge partnerships.",
    date: "2025-08-20T09:00:00",
    location: "Boston, MA",
    organizerName: "Global Transport Consortium",
    price: 0.25,
    imageUrl: "https://images.unsplash.com/photo-1504025468847-0e438279542c?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "event-16",
    title: "Smart Cities Integration Workshop",
    description: "Exploring how our ride-sharing platform can integrate with smart city infrastructure for seamless urban transportation.",
    date: "2025-08-28T13:00:00",
    location: "Toronto, Canada",
    organizerName: "Smart City Collective",
    price: 0.05,
    imageUrl: "https://images.unsplash.com/photo-1519222970733-f546218fa6d7?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "event-17",
    title: "Rider Rewards Program Launch",
    description: "Special event to unveil our new rider loyalty program with token rewards, discounts, and exclusive benefits.",
    date: "2025-09-05T18:00:00",
    location: "Las Vegas, NV",
    organizerName: "Marketing Team",
    imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "event-18",
    title: "Sustainability in Transportation",
    description: "Forum on reducing carbon footprints through efficient ride-sharing and the integration of electric and hybrid vehicles.",
    date: "2025-09-12T10:00:00",
    location: "Vancouver, Canada",
    organizerName: "Green Transport Initiative",
    imageUrl: "https://images.unsplash.com/photo-1623390061037-47bb706f0e3c?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "event-19",
    title: "Women in Blockchain Transportation",
    description: "Networking event celebrating and promoting women's contributions to blockchain transportation technologies and leadership.",
    date: "2025-09-20T16:00:00",
    location: "Atlanta, GA",
    organizerName: "Women in Blockchain",
    price: 0.03,
    imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "event-20",
    title: "Platform 2.0 Launch Party",
    description: "Celebration of our platform's major update with new features, improved UI, and enhanced security. Join us for demos, drinks, and discussions.",
    date: "2025-09-30T19:00:00",
    location: "San Francisco, CA",
    organizerName: "Core Team",
    price: 0.1,
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000"
  }
];

export const EventsSlider: React.FC = () => {
  return (
    <div className="relative w-full">
      <Carousel
        opts={{
          align: "center",
          loop: true,
          autoplay: true,
          interval: 5000, // 5 seconds per slide
        }}
        className="w-full"
      >
        <CarouselContent>
          {DEMO_EVENTS.map((event) => (
            <CarouselItem key={event.id} className="basis-full">
              <div className="p-1">
                <EventCard event={event} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex gap-2">
          <CarouselPrevious className="relative static translate-y-0 left-0" />
          <CarouselNext className="relative static translate-y-0 right-0" />
        </div>
      </Carousel>
    </div>
  );
};
