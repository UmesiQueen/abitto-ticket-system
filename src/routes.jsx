import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import App from "./App";
import Home from "./pages";
import Booking from "./pages/booking";
import PageNotFound from "./pages/pageNotFound";
import TicketSummary from "./pages/ticket-summary";
import ProtectedRoute from "./context/ProtectedRoute";
import AdminLayout from "./admin/layout";
import Dashboard from "./admin/pages/dashboard";
import BookingDetails from "./admin/pages/booking-details";
import Customers from "./admin/pages/customers";
import Payments from "./admin/pages/payments";
import Settings from "./admin/pages/settings";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<App />}>
        <Route index element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route
          path="/ticket-summary"
          element={
            <ProtectedRoute>
              <TicketSummary />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/booking-details" element={<BookingDetails />} />
        <Route path="/admin/customers" element={<Customers />} />
        <Route path="/admin/payments" element={<Payments />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Route>
  )
);
