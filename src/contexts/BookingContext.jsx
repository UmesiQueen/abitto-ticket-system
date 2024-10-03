import React from "react";
import PropTypes from "prop-types";

export const BookingCTX = React.createContext();

const storedSession = JSON.parse(sessionStorage.getItem('cus_info'));
const BookingContext = ({ children }) => {
	const [bookingQuery, setBookingQuery] = React.useState([]);
	const [currentPageIndex, setCurrentPageIndex] = React.useState({
		rentals: 0,
		customers: 0,
		booking: 0,
		checkIn: 0,
		journeyList: 0,
		feedback: 0,
		logistics: 0
	});
	const [activeStep, setActiveStep] = React.useState(0);
	const [formData, setFormData] = React.useState(storedSession ?? {
		bookingDetails: {},
		passengerDetails: {},
	});
	const [loading, setLoading] = React.useState(false);
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
	const [tripDetails, setTripDetails] = React.useState({});
	const [rentalData, setRentalData] = React.useState({});
	const [customersData, setCustomersData] = React.useState([]);
	const [filtering, setFiltering] = React.useState("");

	React.useEffect(() => {
		if (Object.keys(formData?.bookingDetails).length)
			sessionStorage.setItem("cus_info", JSON.stringify(formData))
	}, [formData]);

	// React.useEffect(() => {
	// 	// check if pathname does not include booking 
	// handleReset();
	// 	setSearchParams({})
	// }, [pathname]);

	const handleReset = () => {
		setActiveStep(0);
		setFormData({
			bookingDetails: {},
			passengerDetails: {},
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
		resetSelectField: () => { },
	};

	return (
		<BookingCTX.Provider value={ctxValues}>{children}</BookingCTX.Provider>
	);
};

BookingContext.propTypes = {
	children: PropTypes.node,
};

export default BookingContext;
