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
import TicketSummary from "./pages/ticketSummary";
import AdminLayout from "./admin/layout";
import Dashboard from "./admin/pages/dashboard";
import BookingDetails from "./admin/pages/bookingDetails";
import Customers from "./admin/pages/customers";
import Payments from "./admin/pages/payments";
import Settings from "./admin/pages/settings";
import Login from "./admin/auth/login";
import { CustomerDetails } from "./admin/pages/bookingDetails";
import TicketDocument from "./components/custom/TicketSummary.doc";
// import Notice from "./pages/notice";

export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/">
			{/* <Route index element={<Notice />} /> */}
			<Route element={<App />}>
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
