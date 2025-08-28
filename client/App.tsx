import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import DashboardLayout from "@/components/dashboard-layout";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Units from "./pages/Units";
import Customers from "./pages/Customers";
import CreateInvoice from "./pages/CreateInvoice";
import CreditNotes from "./pages/CreditNotes";
import Quotations from "./pages/Quotations";
import CreateQuotation from "./pages/CreateQuotation";
import QuotationDetails from "./pages/QuotationDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InvoiceTemplates from "./pages/InvoiceTemplates";
import InvoiceDetails from "./pages/InvoiceDetails";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // For demo purposes, automatically set authentication
  if (
    typeof window !== "undefined" &&
    !localStorage.getItem("isAuthenticated")
  ) {
    localStorage.setItem("isAuthenticated", "true");
  }

  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="kanakku-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Main Dashboard Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Admin Dashboard"
                    description="Administrative overview and management tools."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard-2"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Admin Dashboard 2"
                    description="Secondary administrative dashboard view."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer-dashboard"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Customer Dashboard"
                    description="Customer-focused dashboard and analytics."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/super-admin-dashboard"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Super Admin Dashboard"
                    description="Super admin oversight and system management."
                  />
                </ProtectedRoute>
              }
            />

            {/* Super Admin Routes */}
            <Route
              path="/super-admin"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Super Admin Dashboard"
                    description="Super Admin dashboard with company management, subscriptions, and more."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/super-admin/companies"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Companies Management"
                    description="Manage all companies and their configurations."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/super-admin/subscriptions"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Subscriptions"
                    description="View and manage all subscription plans and billing."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/super-admin/packages"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Packages"
                    description="Configure service packages and pricing tiers."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/super-admin/domain"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Domain Management"
                    description="Manage domains and DNS configurations."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/super-admin/transactions"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Purchase Transactions"
                    description="View all purchase transactions and payment history."
                  />
                </ProtectedRoute>
              }
            />

            {/* Application Routes */}
            <Route
              path="/app/chat"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Chat"
                    description="Real-time messaging and communication center."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/calls"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Calls"
                    description="Voice and video calling interface."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/calls/voice"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Voice Call"
                    description="Initiate and manage voice calls."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/calls/video"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Video Call"
                    description="Start video calls and conferences."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/calls/outgoing"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Outgoing Call"
                    description="Manage outgoing call activities."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/calls/incoming"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Incoming Call"
                    description="Handle incoming call notifications."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/calls/history"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Call History"
                    description="View call logs and history."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/calendar"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Calendar"
                    description="Schedule and manage appointments and events."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/email"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Email"
                    description="Email management and communication."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/todo"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="To-Do"
                    description="Task management and productivity tools."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/notes"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Notes"
                    description="Note-taking and documentation system."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/social"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Social Feed"
                    description="Social media integration and activity feed."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/files"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="File Manager"
                    description="File storage and document management."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/kanban"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Kanban Board"
                    description="Project management with kanban boards."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/contacts"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Contacts"
                    description="Customer and contact management system."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/invoices"
              element={
                <ProtectedRoute>
                  <Invoices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/search"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Search"
                    description="Advanced search and filtering capabilities."
                  />
                </ProtectedRoute>
              }
            />

            {/* Inventory & Sales Routes */}
            <Route
              path="/inventory/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory/categories"
              element={
                <ProtectedRoute>
                  <Categories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory/units"
              element={
                <ProtectedRoute>
                  <Units />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Inventory"
                    description="Track stock levels and inventory management."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices"
              element={
                <ProtectedRoute>
                  <Invoices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/create"
              element={
                <ProtectedRoute>
                  <CreateInvoice />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/details"
              element={
                <ProtectedRoute>
                  <InvoiceDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/details/:id"
              element={
                <ProtectedRoute>
                  <InvoiceDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/templates"
              element={
                <ProtectedRoute>
                  <InvoiceTemplates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/recurring"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Recurring Invoices"
                    description="Set up and manage recurring billing."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/credit-notes"
              element={
                <ProtectedRoute>
                  <CreditNotes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quotations"
              element={
                <ProtectedRoute>
                  <Quotations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quotations/create"
              element={
                <ProtectedRoute>
                  <CreateQuotation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quotations/details/:id"
              element={
                <ProtectedRoute>
                  <QuotationDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delivery-challans"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Delivery Challans"
                    description="Track delivery notes and shipping documents."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers/:id"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Customer Details"
                    description="View detailed customer information and history."
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers/details"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Customer Details"
                    description="Manage customer information and view transaction history."
                  />
                </ProtectedRoute>
              }
            />

            {/* Settings and Profile */}

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Settings"
                    description="Application settings and configuration."
                  />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
