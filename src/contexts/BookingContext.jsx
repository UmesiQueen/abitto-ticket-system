import React from "react";
import PropTypes from "prop-types";
import { useSearchParam } from "@/hooks/useSearchParam";
import { useLocation } from "react-router-dom";

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
		logistics: 0,
		tripDetails: 0,
	});
	const [activeStep, setActiveStep] = React.useState(0);
	const [formData, setFormData] = React.useState(storedSession ?? {
		bookingDetails: {},
		passengerDetails: {},
	});
	const [loading, setLoading] = React.useState(false);
	const [availableTrips, setAvailableTrips] = React.useState([]);
	const [selectedTrip, setSelectedTrip] = React.useState({});
	const [isChecked, setChecked] = React.useState(false);
	const [tripDetails, setTripDetails] = React.useState({});
	const [rentalData, setRentalData] = React.useState({});
	const [customersData, setCustomersData] = React.useState([]);
	const { getSearchParams } = useSearchParam();
	const searchParamValues = getSearchParams();
	const [filterValue, setFilterValue] = React.useState(searchParamValues?.s ?? "");
	const { pathname } = useLocation();

	React.useEffect(() => {
		if (pathname) {
			setFilterValue("")
			setActiveStep(0);
			setRentalData({});
		}
	}, [pathname]);

	const handleReset = () => {
		setActiveStep(0);
		setFormData({
			bookingDetails: {},
			passengerDetails: {},
		});
		setAvailableTrips([]);
		setSelectedTrip({});
		setRentalData({});
		setChecked(false);
	};

	const resetPageIndex = (page) => {
		setCurrentPageIndex((prev) => ({
			...prev,
			[page]: 0
		}));
	}

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
		filterValue,
		setFilterValue,
		resetPageIndex
	};

	return (
		<BookingCTX.Provider value={ctxValues}>{children}</BookingCTX.Provider>
	);
};

BookingContext.propTypes = {
	children: PropTypes.node,
};

export default BookingContext;
