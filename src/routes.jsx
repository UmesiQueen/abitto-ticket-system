import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";

import App from "./App";
import Home from "./pages";
import Booking from "./pages/booking";
import PageNotFound from "./pages/pageNotFound";
import TicketSummary from "./pages/ticket-summary";
import AdminLayout from "./admin/layout";
import Dashboard from "./admin/pages/dashboard";
import BookingDetails from "./admin/pages/booking-details";
import Customers from "./admin/pages/customers";
import Payments from "./admin/pages/payments";
import Settings from "./admin/pages/settings";
import Login from "./admin/auth/login";
import { CustomerDetails } from "./admin/pages/booking-details";
import TicketDocument from "./pages/ticket-document";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<App />}>
        <Route index element={<Home />} />
        <Route path="booking" element={<Booking />} />
        <Route path="ticket-summary" element={<TicketSummary />} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="admin" element={<Navigate to="dashboard" replace />} />
        <Route path="admin">
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="booking-details" element={<BookingDetails />} />
          <Route
            path="booking-details/:bookingID"
            element={<CustomerDetails />}
          />
          <Route path="customers" element={<Customers />} />
          <Route path="payments" element={<Payments />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="ticket-summary/:bookingID" element={<TicketDocument />} />
      <Route path="login" element={<Login />} />
      <Route path="*" element={<PageNotFound />} />
    </Route>
  )
);
