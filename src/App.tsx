
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Login from "./pages/Login";
import DashboardLayout from "./components/Layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import BusinessSetup from "./pages/BusinessSetup";
import ProductManagement from "./pages/ProductManagement";
import CustomerManagement from "./pages/CustomerManagement";
import Billing from "./pages/Billing";
import Sales from "./pages/Sales";
import Purchase from "./pages/Purchase";
import Reports from "./pages/Reports";
import Expenses from "./pages/Expenses";
import Settings from "./pages/Settings";
import BusinessManagement from "./pages/BusinessManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<DashboardLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="billing" element={<Billing />} />
              <Route path="sales" element={<Sales />} />
              <Route path="purchase" element={<Purchase />} />
              <Route path="business-management" element={<BusinessManagement />} />
              <Route path="reports" element={<Reports />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="businesses" element={<div className="p-8 text-center text-muted-foreground">Business management coming soon...</div>} />
              <Route path="users" element={<UserManagement />} />
              <Route path="business-setup" element={<BusinessSetup />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="customers" element={<CustomerManagement />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
