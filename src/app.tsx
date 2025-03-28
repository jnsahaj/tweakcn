import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import Marketing from "./pages/marketing";
import NotFound from "./pages/not-found";
import { ThemeProvider } from "./components/theme-provider";
import { PostHogProvider } from "posthog-js/react";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();
const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
};

const App = () => (
  <HelmetProvider>
    <ThemeProvider defaultTheme="light">
      <PostHogProvider
        apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
        options={options}
      >
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Marketing />} />
                <Route path="/editor/:editorType" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </PostHogProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
