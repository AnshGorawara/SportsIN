import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuthContext } from "@/components/auth/AuthProvider";
import { queryClient } from "../queryClient";
import { ThemeProvider } from "next-themes";

// Pages
import Home from "@/pages/home";
import Auth from "@/pages/auth";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

// Components
import Navbar from "@/components/layout/Navbar";
import Dashboard from "@/components/dashboard/Dashboard";
import JobBoard from "@/components/jobs/JobBoard";
import NILMarketplace from "@/components/nil/NILMarketplace";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

// Utils
import { seedDatabase } from "@/lib/seedData";
import { useEffect, useState } from "react";

function AppContent() {
  const { user, userData, loading } = useAuthContext();
  const [seeded, setSeeded] = useState(false);

  // Auto-seed database in development
  useEffect(() => {
    if (!seeded && !loading) {
      seedDatabase();
      setSeeded(true);
    }
  }, [seeded, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-champion rounded-xl flex items-center justify-center mb-4 animate-pulse">
            <span className="text-2xl">🏆</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-gradient mb-2">SportsIN</h1>
          <p className="text-gray-600 dark:text-gray-400">Connecting Legends...</p>
        </div>
      </div>
    );
  }

  // Show onboarding if user exists but hasn't completed onboarding
  if (user && userData && !userData.onboardingComplete) {
    return (
      <div>
        <Navbar />
        <OnboardingFlow />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/auth" component={Auth} />
          <Route path="/dashboard">
            {user ? <Dashboard /> : <Auth />}
          </Route>
          <Route path="/profile">
            {user ? <Profile /> : <Auth />}
          </Route>
          <Route path="/jobs">
            {user ? <JobBoard /> : <Auth />}
          </Route>
          <Route path="/nil">
            {user ? <NILMarketplace /> : <Auth />}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <AppContent />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;