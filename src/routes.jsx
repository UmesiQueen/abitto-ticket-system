import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";

import App from "./App";
import Home from "./main/pages";
import Booking from "./main/pages/booking";
import PageNotFound from "./main/pages/404";
import TicketSummary from "./main/pages/ticket-summary";
import AdminLayout from "./admin/layout";
import Dashboard from "./admin/pages/dashboard";
import BookingDetails from "./admin/pages/booking-details";
import Customers from "./admin/pages/customers";
import Payments from "./admin/pages/payments";
import Settings from "./admin/pages/settings";
import Login from "./admin/auth/login";
import { CustomerDetails } from "./admin/pages/booking-details";
import TicketDocument from "./components/custom/TicketSummary.doc";
// import Notice from "./pages/notice";
import MainLayout from "./main/layout";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* <Route index element={<Notice/>} /> */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="booking" element={<Booking />} />
        <Route path="ticket-summary" element={<TicketSummary />} />
      </Route>

      <Route path="admin" element={<Navigate to="dashboard" replace />} />
      <Route path="admin" element={<AdminLayout />}>
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

      <Route path="ticket-summary/:bookingID" element={<TicketDocument />} />
      <Route path="login" element={<Login />} />
      <Route path="*" element={<PageNotFound />} />
    </Route>
  )
);
