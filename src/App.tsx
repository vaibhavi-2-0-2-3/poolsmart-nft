
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Index from "./pages/Index";
import Rides from "./pages/Rides";
import RideDetails from "./pages/RideDetails";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Dashboard from "./pages/Dashboard";
import DriverProfile from "./pages/DriverProfile";
import DAOGovernance from "./pages/DAOGovernance";
import Documentation from "./pages/Documentation";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/rides" element={<Rides />} />
                <Route path="/ride/:id" element={<RideDetails />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/driver/:id" element={<DriverProfile />} />
                <Route path="/dao-governance" element={<DAOGovernance />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
