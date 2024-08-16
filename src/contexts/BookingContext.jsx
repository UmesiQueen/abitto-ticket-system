import React from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

export const BookingCTX = React.createContext();

const BookingContext = ({ children }) => {
	const [bookingQuery, setBookingQuery] = React.useState([]);
	const [currentPageIndex, setCurrentPageIndex] = React.useState({
		rentals: 0,
		customers: 0,
		booking: 0,
		checkIn: 0,
		journeyList: 0,
		feedback: 0,
	});
	const [activeStep, setActiveStep] = React.useState(0);
	const [formData, setFormData] = React.useState({
		bookingDetails: {},
		passengerDetails: {},
		seatDetails: {},
	});
	const [loading, setLoading] = React.useState(false);
	const [seatSelected, setSeatSelected] = React.useState({
		departure: [],
		return: [],
	});
	const [availableTrips, setAvailableTrips] = React.useState({
		departure_trip: [],
		return_trip: [],
	});
	const [selectedTrip, setSelectedTrip] = React.useState({
		departure: {},
		return: {},
	});
	const [isChecked, setChecked] = React.useState(false);
	const [searchParams, setSearchParams] = React.useState({});
	const [tripDetails, setTripDetails] = React.useState();
	const [rentalData, setRentalData] = React.useState({});
	const { pathname } = useLocation();
	const [customersData, setCustomersData] = React.useState([]);
	const [filtering, setFiltering] = React.useState();

	React.useEffect(() => {
		handleReset();
	}, [pathname]);

	React.useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}, [activeStep]);

	React.useEffect(() => {
		if (Object.keys(formData.seatDetails).length) {
			setSeatSelected({
				departure: [],
				return: [],
			});
			setFormData((prev) => ({
				...prev,
				seatDetails: {},
			}));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formData.bookingDetails?.total_passengers]);

	const handleReset = () => {
		setActiveStep(0);
		setFormData({
			bookingDetails: {},
			passengerDetails: {},
			seatDetails: {},
		});
		setSeatSelected({
			departure: [],
			return: [],
		});
		setAvailableTrips({
			departure_trip: [],
			return_trip: [],
		});
		setSelectedTrip({
			departure: {},
			return: {},
		});
		setRentalData({});
		setChecked(false);
	};

	const ctxValues = {
		formData,
		setFormData,
		loading,
		setLoading,
		activeStep,
		setActiveStep,
		seatSelected,
		setSeatSelected,
		isChecked,
		setChecked,
		handleReset,
		searchParams,
		setSearchParams,
		availableTrips,
		setAvailableTrips,
		selectedTrip,
		setSelectedTrip,
		tripDetails,
		setTripDetails,
		rentalData,
		setRentalData,
		bookingQuery,
		setBookingQuery,
		currentPageIndex,
		setCurrentPageIndex,
		customersData,
		setCustomersData,
		filtering,
		setFiltering,
		resetSelectField: () => {},
	};

	return (
		<BookingCTX.Provider value={ctxValues}>{children}</BookingCTX.Provider>
	);
};

BookingContext.propTypes = {
	children: PropTypes.node,
};

export default BookingContext;
