import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
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
import RentalAdmin from "./admin/pages/rental";
import Report from "./admin/pages/report";
import Rental from "./main/pages/rental";
import { TicketLoader } from "./components/TicketInvoice";
import { TripDetailsLoader } from "./admin/pages/trip-details";
import { DataQueryLoader } from "./admin/layout";
import RentalInvoice from "./components/RentalInvoice";
import { RentalInvoiceLoader } from "./components/RentalInvoice";
// import { CustomerLoader } from "./admin/pages/customers";
// import CustomerHistory from "./admin/pages/customer-history";
import RentalDetails from "./admin/pages/rental-details";
import PageNotFoundAdmin from "./admin/pages/page-not-found";
import CheckIn from "./admin/pages/check-in";
// import Reschedule from "./admin/pages/reschedule";
import { RentDetail } from "./admin/pages/rental-details";
import Feedback from "./main/pages/feedback";
import FeedbackAdmin, { FeedbackDetails } from "./admin/pages/feedback";
import Logistics from "./admin/pages/logistics";
import LogisticsDetails, {
	ShipmentDetails,
} from "./admin/pages/logistics-detail";
import GetQuote from "./main/pages/quote";
import Pricing from "./admin/pages/pricing";
import InformationBox from "./admin/pages/information-box";

export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<App />}>
			{/* <Route index element={<Notice/>} /> */}
			<Route element={<MainLayout />}>
				<Route index element={<Home />} />
				<Route path="booking" element={<Booking />} />
				<Route path="about" element={<About />} />
				<Route path="rental" element={<Rental />} />
				<Route path="feedback" element={<Feedback />} />
				<Route path="get-quote" element={<GetQuote />} />
			</Route>

			<Route path="/backend" element={<AdminLayout />} loader={DataQueryLoader}>
				<Route path="/backend/:accountType">
					<Route path="dashboard" element={<Report />} />
					<Route path="create" element={<Create />} />
					<Route path="create/book-ticket" element={<BookTicket />} />
					<Route path="create/check-in" element={<CheckIn />} />
					<Route path="create/rental" element={<RentalAdmin />} />
					<Route path="create/logistics" element={<Logistics />} />
					<Route path="booking-details" element={<BookingDetails />} />
					<Route
						path="booking-details/:bookingID"
						element={<CustomerDetails />}
					/>
					{/* <Route
						path="booking-details/:bookingID/reschedule"
						element={<Reschedule />}
					/> */}
					<Route path="rental-details" element={<RentalDetails />} />
					<Route
						path="rental-details/:rentalID"
						element={<RentDetail />}
						loader={RentalInvoiceLoader}
					/>
					<Route path="journey-list" element={<JourneyList />} />
					<Route
						path="journey-list/:tripCode"
						element={<TripDetails />}
						loader={TripDetailsLoader}
					/>
					<Route path="schedule-trip" element={<ScheduleTrip />} />
					<Route path="customers" element={<Customers />} />
					{/* <Route path="customers/:customerID" element={<CustomerHistory />} /> */}
					<Route path="settings" element={<Settings />} />
					<Route path="feedback" element={<FeedbackAdmin />} />
					<Route path="feedback/:feedbackID" element={<FeedbackDetails />} />
					<Route path="logistics" element={<LogisticsDetails />} />
					<Route path="logistics/:shipmentID" element={<ShipmentDetails />} />
					<Route path="pricing" element={<Pricing />} />
					<Route path="information" element={<InformationBox />} />
				</Route>
				<Route path="pageNotFound" element={<PageNotFoundAdmin />} />
			</Route>

			<Route
				path="ticket-invoice/:bookingID"
				element={<TicketInvoice />}
				loader={TicketLoader}
			/>
			<Route
				path="rental-invoice/:rentalID"
				element={<RentalInvoice />}
				loader={RentalInvoiceLoader}
			/>
			<Route path="/login" element={<Login />} />
			<Route path="*" element={<PageNotFound />} />
		</Route>
	)
);
