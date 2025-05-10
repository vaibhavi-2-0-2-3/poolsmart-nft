
# 🚗 DecentraRide - Decentralized Blockchain Carpooling Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 📌 Project Overview

DecentraRide is a modern Web3 carpooling platform that leverages blockchain technology to create a decentralized, transparent, and efficient ride-sharing ecosystem. By utilizing smart contracts for transactions and NFT-based membership tiers, we're redefining trust and security in the sharing economy.

![DecentraRide Platform](./screenshots/platform-preview.png)
*Project screenshot placeholder - replace with actual screenshots*

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for a robust, type-safe UI
- **Vite** for lightning-fast builds and development experience
- **TailwindCSS** for utility-first styling
- **shadcn/ui** for pre-built accessible UI components
- **React Router** for application routing
- **Tanstack React Query** for data fetching and state management
- **Lucide React** for consistent iconography

### Backend & Blockchain
- **Firebase** for backend services and database
- **Ethereum/Polygon** blockchain network integration
- **Web3.js/Ethers.js** for blockchain interactions
- **Smart Contracts** written in Solidity (ERC-721 for NFT membership)
- **IPFS** for decentralized file storage (profile photos, ride details)

## ⭐ Key Features

### 🔐 Web3 Authentication
- Connect with MetaMask and other Web3 wallets
- ENS name resolution support
- Passwordless authentication

### 🎫 NFT-Based Membership Tiers
- Premium members receive priority matching
- Reduced platform fees for NFT holders
- Special access to exclusive community events
- NFT staking for additional benefits

### 🚘 Ride Management
- Post rides as a driver with full route control
- Book available seats with transparent pricing
- Real-time ride status updates
- Ride history stored on blockchain for verification

### 💵 Decentralized Payments
- Direct wallet-to-wallet crypto payments
- Smart contract escrow for payment security
- Multiple cryptocurrency support
- Automated refunds for cancellations

### 🎭 Community & Governance
- DAO voting on platform updates
- Community-driven event organization
- Reputation system built on blockchain verification

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Example |
|--------|----------|-------------|---------|
| `GET` | `/api/auth/nonce/:address` | Get authentication nonce for wallet signing | `GET /api/auth/nonce/0x1234...` |
| `POST` | `/api/auth/verify` | Verify signed message for authentication | `POST /api/auth/verify {signature, address}` |

### Rides
| Method | Endpoint | Description | Example |
|--------|----------|-------------|---------|
| `GET` | `/api/rides` | Get all available rides with optional filters | `GET /api/rides?from=NYC&to=Boston` |
| `GET` | `/api/rides/:id` | Get specific ride details | `GET /api/rides/123` |
| `POST` | `/api/rides` | Create a new ride listing | `POST /api/rides {from, to, price, date, seats}` |
| `POST` | `/api/rides/:id/book` | Book seats on a ride | `POST /api/rides/123/book {seats: 2}` |

### User Profiles
| Method | Endpoint | Description | Example |
|--------|----------|-------------|---------|
| `GET` | `/api/profile/:address` | Get user profile data | `GET /api/profile/0x1234...` |
| `PUT` | `/api/profile` | Update user profile | `PUT /api/profile {name, bio, avatar}` |
| `GET` | `/api/profile/:address/rides` | Get user's rides (as driver or passenger) | `GET /api/profile/0x1234.../rides` |

### Events
| Method | Endpoint | Description | Example |
|--------|----------|-------------|---------|
| `GET` | `/api/events` | Get all community events | `GET /api/events` |
| `GET` | `/api/events/:id` | Get specific event details | `GET /api/events/abc123` |
| `POST` | `/api/events/:id/register` | Register for an event | `POST /api/events/abc123/register` |

## 🔧 Smart Contract Architecture

DecentraRide utilizes several smart contracts to manage various aspects of the platform:

### RideContract.sol
Handles ride creation, booking, payment escrow, and completion verification.

```solidity
// Key functions
function createRide(address driver, string memory from, string memory to, uint256 price, uint256 seats) public returns (uint256);
function bookRide(uint256 rideId, uint256 seats) public payable;
function startRide(uint256 rideId) public onlyDriver(rideId);
function completeRide(uint256 rideId) public onlyDriver(rideId);
```

### MembershipNFT.sol
ERC-721 contract for membership tiers with utility functions.

```solidity
// Key functions
function mintMembership(address to, uint256 tier) public payable;
function getMembershipTier(address user) public view returns (uint256);
function upgradeNFTTier(uint256 tokenId, uint256 newTier) public payable;
```

### GovernanceToken.sol
ERC-20 token for DAO governance rights.

```solidity
// Key functions
function proposeChange(string memory description, bytes memory transactionData) public returns (uint256);
function vote(uint256 proposalId, bool support) public;
function executeProposal(uint256 proposalId) public;
```

## 🚀 Local Development Setup

### Prerequisites
- Node.js v18+ and npm/yarn
- MetaMask or other Web3 wallet browser extension
- Local blockchain environment (Hardhat, Ganache, or similar)

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/decentra-ride.git
cd decentra-ride

# Install dependencies
npm install

# Start development server
npm run dev
```

### Smart Contract Deployment (Local)
```bash
# Install Hardhat (if not using the repo's package.json)
npm install --save-dev hardhat

# Run local blockchain
npx hardhat node

# Deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

### Environment Configuration
Create a `.env` file in the project root with the following variables:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Smart contract addresses (after deployment)
VITE_RIDE_CONTRACT_ADDRESS=0x...
VITE_MEMBERSHIP_NFT_ADDRESS=0x...
VITE_GOVERNANCE_TOKEN_ADDRESS=0x...
```

## 📁 Project Structure

```
decentra-ride/
├── public/                  # Static assets
├── src/
│   ├── components/          # React components
│   │   ├── events/          # Event-related components
│   │   ├── home/            # Homepage components
│   │   ├── layout/          # Layout components (navbar, footer)
│   │   ├── profile/         # User profile components
│   │   ├── rides/           # Ride listing and booking components
│   │   ├── shared/          # Shared UI components
│   │   ├── ui/              # Base UI components (shadcn)
│   │   └── wallet/          # Wallet connection components
│   ├── contracts/           # Smart contract ABIs and addresses
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and API clients
│   │   ├── blockchain/      # Blockchain interaction utilities
│   │   ├── firebase.ts      # Firebase configuration
│   │   └── web3.ts          # Web3 utilities
│   ├── pages/               # Application pages/routes
│   └── main.tsx             # Application entry point
├── contracts/               # Solidity smart contracts
│   ├── RideContract.sol     # Ride management contract
│   ├── MembershipNFT.sol    # NFT membership contract
│   └── GovernanceToken.sol  # DAO governance token contract
├── scripts/                 # Deployment and utility scripts
└── hardhat.config.js        # Hardhat configuration
```

## 🧪 Testing

### Frontend Tests
```bash
# Run frontend tests
npm run test
```

### Smart Contract Tests
```bash
# Run smart contract tests
npx hardhat test
```

## 🚨 Known Issues & Limitations

- MetaMask mobile app support is limited
- Gas fee estimations may vary based on network congestion
- NFT membership features require testnet ETH for testing purposes

## 🛣️ Roadmap

- [ ] Cross-chain support for multiple blockchain networks
- [ ] Mobile application development
- [ ] Integration with traditional ridesharing APIs
- [ ] Advanced reputation system with zero-knowledge proofs
- [ ] Real-time ride tracking with IoT integration

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract templates
- [Ethereum Foundation](https://ethereum.org/) for Web3 development resources
- [shadcn/ui](https://ui.shadcn.com/) for accessible React components

---

*This README was generated for the DecentraRide project. For questions or support, please open an issue in the repository.*
