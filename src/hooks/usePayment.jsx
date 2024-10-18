import React from "react";
import axiosInstance from "@/api";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { LogisticsSuccessModal } from "@/components/modals/booking";
import { v4 as uuid } from "uuid";
import { RentalSuccessModal } from "@/components/modals/booking";
import { customError } from "@/lib/utils";
import { useSearchTrip } from "./useSearchTrip";

export const usePayment = () => {
	const { formData, rentalData, setLoading: loader } = React.useContext(BookingCTX);
	const { mountPortalModal, adminProfile, setLoading, } = React.useContext(GlobalCTX);
	const { bookingDetails, passengerDetails, ticket_id } = formData;
	const { checkAvailability } = useSearchTrip();
	const total_ticket_cost =
		Number(formData.bookingDetails?.departure_ticket_cost) *
		Number(formData.bookingDetails?.total_passengers);


	const randomSeats = (availableSeats, total_passengers) => {
		const seatsArray = Array.from({ length: availableSeats }, (_, i) =>
			`${Math.floor(i / 4) + 1}${String.fromCharCode(97 + (i % 4))}`);

		return seatsArray.slice(-total_passengers); // Select the last 'total_passengers' elements
	};

	const onlinePayment = async () => {
		sessionStorage.setItem("cus_info", JSON.stringify(formData))
		const requestData = {
			...bookingDetails,
			...passengerDetails,
			total_ticket_cost,
			ticket_id: `${ticket_id}${uuid().slice(0, 2)}`,
			medium: "Online",
			payment_method: "Paystack",
			booked_by: "Customer",
			check_in: false,
			payment_status: "Pending",
			trxRef: "N/A",
			trip_status: "Upcoming",
		};

		const isAvailable = await checkAvailability();
		if (isAvailable)
			try {
				const response = await axiosInstance
					.post("/booking/test",
						{
							...requestData,
							departure_seats: randomSeats(isAvailable, bookingDetails.total_passengers),
						})
				if (response) {
					const { authorization_url } = response.data.payment
					window.location.href = authorization_url;
				}
			}
			catch (error) {
				customError(error, "An error occurred. Please try again.")
			}
			finally {
				loader(false)
			}
	}

	const offlinePayment = async (data) => {
		const requestData = {
			...bookingDetails,
			...passengerDetails,
			ticket_id: `${ticket_id}${uuid().slice(0, 2)}`,
			total_ticket_cost,
			payment_status: "Success",
			payment_method: data.payment_method,
			medium: "Offline",
			trxRef: data.transaction_ref,
			booked_by: `${adminProfile.first_name}(${adminProfile.account_type})`,
			check_in: data.check_in,
			trip_status: data.check_in ? "Completed" : "Upcoming",
		};

		const isAvailable = await checkAvailability();
		if (isAvailable)
			try {
				const res = await axiosInstance.post("/booking/newbooking", {
					...requestData,
					departure_seats: randomSeats(isAvailable, bookingDetails.total_passengers),
				})
				return res.data.booking;
			}
			catch (error) {
				customError(error, "Booking not confirmed. Please try again.")
			}
			finally {
				loader(false)
			}
	};

	const offlineRentalPayment = (data) => {
		const { transaction_ref, payment_method } = data;

		setLoading(true);
		const requestData = {
			...rentalData,
			boat_id: "bt-54321",
			rental_status: "Upcoming",
			payment_medium: "Offline",
			paid_by: `${adminProfile.first_name}(${adminProfile.account_type})`,
			payment_status: "Success",
			payment_method,
			trxRef: transaction_ref,
		};

		axiosInstance
			.post("/rent/createrent", requestData)
			.then((res) => {
				if (res.status === 200) {
					const currentRental = res.data.rent;
					mountPortalModal(<RentalSuccessModal currentRental={currentRental} />);
				}
			})
			.catch((error) => {
				customError(error, "Error occurred while creating new rental.")
			})
			.finally(() => setLoading(false));
	};

	const logisticsPayment = (data, handleReset) => {
		setLoading(true);
		const requestData = {
			...data,
			shipment_status: "Origin",
			payment_status: "Success",
			created_by: `${adminProfile.first_name}(${adminProfile.account_type})`,
		};

		axiosInstance
			.post("/logistics/new", requestData)
			.then((res) => {
				if (res.status === 200) {
					const currentShipment = res.data.logistics;
					mountPortalModal(<LogisticsSuccessModal props={{ currentShipment, handleReset }} />);
				}
			})
			.catch((error) => {
				customError(error, "Error occurred while creating new shipment.");
			})
			.finally(() => setLoading(false));
	}

	return {
		onlinePayment,
		offlinePayment,
		offlineRentalPayment,
		logisticsPayment
	};
};
