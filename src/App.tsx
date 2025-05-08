
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Rides from "./pages/Rides";
import Dashboard from "./pages/Dashboard";
import DriverProfile from "./pages/DriverProfile";
import NotFound from "./pages/NotFound";
import { Web3Provider } from "@/hooks/useWeb3";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import FAQ from "./pages/FAQ";
import Documentation from "./pages/Documentation";
import DAOGovernance from "./pages/DAOGovernance";
import EventDetails from "./pages/EventDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Web3Provider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/rides" element={<Rides />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/driver/:driverId" element={<DriverProfile />} />
            <Route path="/events/:eventId" element={<EventDetails />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/dao-governance" element={<DAOGovernance />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </Web3Provider>
  </QueryClientProvider>
);

export default App;
