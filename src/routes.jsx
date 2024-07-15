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
import TripDetails from "./admin/pages/trip-details";
import Create from "./admin/pages/create";
import ScheduleTrip from "./admin/pages/schedule-trip";
import Report from "./admin/pages/report";
// import Rental from "./main/pages/rental";
import { TicketLoader } from "./components/TicketInvoice";
import { TripDetailsLoader } from "./admin/pages/trip-details";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* <Route index element={<Notice/>} /> */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="booking" element={<Booking />} />
        <Route path="about" element={<About />} />
        {/* <Route path="rental" element={<Rental />} /> */}
      </Route>

      <Route path="admin" element={<Navigate to="create" replace />} />
      <Route path="admin" element={<AdminLayout />}>
        <Route path="create" element={<Create />} />
        <Route path="create/book-ticket" element={<BookTicket />} />
        <Route path="create/schedule-trip" element={<ScheduleTrip />} />
        <Route path="booking-details" element={<BookingDetails />} />
        <Route
          path="booking-details/:bookingID"
          element={<CustomerDetails />}
        />
        <Route path="customers" element={<Customers />} />
        <Route path="journey-list" element={<JourneyList />} />
        <Route
          path="journey-list/:tripCode"
          element={<TripDetails />}
          loader={TripDetailsLoader}
        />
        <Route path="report" element={<Report />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route
        path="ticket-invoice/:bookingID"
        element={<TicketInvoice />}
        loader={TicketLoader}
      />
      <Route path="login" element={<Login />} />
      <Route path="*" element={<PageNotFound />} />
    </Route>
  )
);
