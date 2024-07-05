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
import AdminLayout from "./admin/layout";
import Dashboard from "./admin/pages/dashboard";
import BookingDetails from "./admin/pages/booking-details";
import Customers from "./admin/pages/customers";
import JourneyList from "./admin/pages/journey-list";
import Settings from "./admin/pages/settings";
import Login from "./admin/auth/login";
import { CustomerDetails } from "./admin/pages/booking-details";
import TicketInvoice from "./components/TicketInvoice";
// import Notice from "./pages/notice";
import MainLayout from "./main/layout";
import About from "./main/pages/about";
import BookTicket from "./admin/pages/book-ticket";
import { TripDetails } from "./admin/pages/journey-list";
import Create from "./admin/pages/create";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* <Route index element={<Notice/>} /> */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="booking" element={<Booking />} />
        <Route path="about" element={<About />} />
      </Route>

      <Route path="admin" element={<Navigate to="dashboard" replace />} />
      <Route path="admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="create" element={<Create />} />
        <Route path="book-ticket" element={<BookTicket />} />
        <Route path="booking-details" element={<BookingDetails />} />
        <Route
          path="booking-details/:bookingID"
          element={<CustomerDetails />}
        />
        <Route path="customers" element={<Customers />} />
        <Route path="journey-list" element={<JourneyList />} />
        <Route path="journey-list/:trip-code" element={<TripDetails />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="ticket-invoice/:bookingID" element={<TicketInvoice />} />
      <Route path="login" element={<Login />} />
      <Route path="*" element={<PageNotFound />} />
    </Route>
  )
);
