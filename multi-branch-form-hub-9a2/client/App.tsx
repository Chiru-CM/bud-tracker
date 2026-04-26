import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Branch1 from "./pages/Branch1";
import Branch2 from "./pages/Branch2";
import Branch3 from "./pages/Branch3";
import TeamForm from "./pages/TeamForm";
import RunDetails from "./pages/RunDetails";
import CategoryTeams from "./pages/CategoryTeams";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Layout><Index /></Layout></ProtectedRoute>} />
            <Route path="/branch1" element={<ProtectedRoute><Layout><Branch1 /></Layout></ProtectedRoute>} />
            <Route path="/branch2" element={<ProtectedRoute><Layout><Branch2 /></Layout></ProtectedRoute>} />
            <Route path="/branch3" element={<ProtectedRoute><Layout><Branch3 /></Layout></ProtectedRoute>} />
            <Route path="/:branch/:category" element={<ProtectedRoute><Layout><CategoryTeams /></Layout></ProtectedRoute>} />
            <Route path="/:branch/:category/:teamPath" element={<ProtectedRoute><Layout><TeamForm /></Layout></ProtectedRoute>} />
            <Route path="/:branch/:category/:teamPath/:runId" element={<ProtectedRoute><Layout><RunDetails /></Layout></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
