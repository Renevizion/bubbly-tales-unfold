
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoryProvider } from "./contexts/StoryContext";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import StoryDisplay from "./components/StoryDisplay";
import StoryHistory from "./components/StoryHistory";
import StoryInput from "./components/StoryInput";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StoryProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-bubbly-gray bg-opacity-30">
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/story/:id" element={<StoryDisplay />} />
              <Route path="/history" element={<StoryHistory />} />
              <Route path="/create" element={<StoryInput />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </StoryProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
