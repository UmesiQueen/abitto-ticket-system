import React from "react";
import PropTypes from "prop-types";
import { useSearchParam } from "@/hooks/useSearchParam";
import { useLocation } from "react-router-dom";

export const BookingCTX = React.createContext();

const getSessionStorage = () => {
	const currentTimestamp = Date.now();
	const cacheTime = 30 * 60 * 1000; // 30 mins
	const cachedData = JSON.parse(sessionStorage.getItem('cus_info'));
	if (cachedData) {
		if ((currentTimestamp - cachedData.timestamp) < cacheTime) return cachedData.data;
		sessionStorage.removeItem('cus_info');
	}
	return {
		bookingDetails: {},
		passengerDetails: {},
	}
}

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
	const [formData, setFormData] = React.useState(getSessionStorage);
	const [loading, setLoading] = React.useState(false);
	const [availableTrips, setAvailableTrips] = React.useState([]);
	const [selectedTrip, setSelectedTrip] = React.useState({});
	const [isChecked, setChecked] = React.useState(false);
	const [rentalData, setRentalData] = React.useState({});
	const { getSearchParams } = useSearchParam();
	const searchParamValues = getSearchParams();
	const [filterValue, setFilterValue] = React.useState(searchParamValues?.s ?? "");
	const { pathname } = useLocation();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		setFilterValue("")
		setActiveStep(0);
		setRentalData({});
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
		rentalData,
		setRentalData,
		bookingQuery,
		setBookingQuery,
		currentPageIndex,
		setCurrentPageIndex,
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
