import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import PrimeRadiantGuard from "./pages/PrimeRadiantGuard";
import EducationalIntelligence from "./pages/EducationalIntelligence";
import Governance from "./pages/Governance";
import Insights from "./pages/Insights";
import ContactPage from "./pages/ContactPage";
import BuildHealth from "./pages/BuildHealth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/prime-radiant-guard" element={<PrimeRadiantGuard />} />
          <Route path="/educational-intelligence" element={<EducationalIntelligence />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/build-health" element={<BuildHealth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;