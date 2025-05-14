import React from "react";
import axiosInstance from "@/api";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { LogisticsSuccessModal } from "@/components/modals/booking";
import { v4 as uuid } from "uuid";
import { RentalSuccessModal } from "@/components/modals/booking";
import { customError } from "@/lib/utils";
import { useSearchTrip } from "./useSearchTrip";
import PaystackPop from "@paystack/inline-js";
import {
	BookingSuccessModal,
	BookingRequestFailedModal,
	BookingFailedModal
} from "@/components/modals/booking";

export const usePayment = () => {
	const { formData, rentalData, setLoading: loader } = React.useContext(BookingCTX);
	const { mountPortalModal, adminProfile, setLoading } = React.useContext(GlobalCTX);
	const { bookingDetails, passengerDetails, ticket_id } = formData;
	const { checkAvailability } = useSearchTrip();
	const total_ticket_cost =
		Number(formData.bookingDetails?.departure_ticket_cost) *
		Number(formData.bookingDetails?.total_passengers);

	const randomSeats = (availableSeats) => {
		const seatsArray = Array.from({ length: availableSeats }, (_, i) =>
			`${Math.floor(i / 4) + 1}${String.fromCharCode(97 + (i % 4))}`);

		return seatsArray.slice(-bookingDetails.total_passengers); // Select the last elements from the 'seatsArray'
	};

	const onlinePayment = async () => {
		sessionStorage.setItem("cus_info", JSON.stringify({ data: formData, timestamp: Date.now() }))

		const isAvailable = await checkAvailability();
		if (isAvailable) {
			// TODO: replace with paystack initialize transaction and webhook
			const paystack = new PaystackPop();

			paystack.newTransaction({
				key: "pk_live_b25d12c8f8e8a5b151d6015b71ae2e99d1e4e243", // abitto
				amount: total_ticket_cost * 100,
				email: formData.passengerDetails?.passenger1_email,
				firstname: formData.passengerDetails?.passenger1_first_name,
				lastname: formData.passengerDetails?.passenger1_last_name,
				phone: formData.passengerDetails?.passenger1_phone_number,
				onSuccess(res) {
					handleOnlineRequest({
						payment_status: "Success",
						trxRef: res.trxref,
						trip_status: "Upcoming",
						availableSeats: isAvailable
					});
				},
				onCancel() {
					handleOnlineRequest({
						payment_status: "Canceled",
						trxRef: "N/A",
						trip_status: "Canceled",
						availableSeats: isAvailable
					});
					mountPortalModal(<BookingFailedModal />);
				},
			});
		}
	};

	const handleOnlineRequest = (props) => {
		const isSuccess = props.payment_status === "Success";
		const { availableSeats, ...otherProps } = props;

		const requestData = {
			...bookingDetails,
			...passengerDetails,
			...otherProps,
			departure_seats: isSuccess
				? randomSeats(availableSeats)
				: [],
			total_ticket_cost,
			ticket_id: `${ticket_id}${uuid().slice(0, 2)}`,
			medium: "Online",
			payment_method: "Paystack",
			booked_by: "Customer",
			check_in: false,
			children: null,
		};

		axiosInstance
			.post("/booking/newbooking", requestData)
			.then((res) => {
				if ((res.status === 200) & isSuccess) {
					const currentUser = res.data.booking;
					mountPortalModal(<BookingSuccessModal
						currentUser={currentUser}
						onclick={() => { window.location.href = "/booking" }}
					/>);
				}
			})
			.catch(() => {
				if (isSuccess) {
					mountPortalModal(<BookingRequestFailedModal />);
					// hide paystack btn 
					const element = document.getElementById("conceal");
					element.style.display = "none";

					// display clear btn
					const reset = document.getElementById("reset-btn");
					reset.style.display = "block";
				}
			})
			.finally(() => {
				loader(false);  // stop button loader
			});
	};


	const offlinePayment = async (data) => {
		const requestData = {
			...bookingDetails,
			...passengerDetails,
			ticket_id: `${ticket_id}${uuid().slice(0, 3)}`,
			total_ticket_cost,
			payment_status: "Success",
			payment_method: data.payment_method,
			medium: "Offline",
			trxRef: data.transaction_ref,
			booked_by: `${adminProfile.first_name}(${adminProfile.account_type})`,
			check_in: data.check_in,
			trip_status: data.check_in ? "Completed" : "Upcoming",
		};

		// confirm availability of seats
		const isAvailable = await checkAvailability();
		if (isAvailable)
			try {
				const res = await axiosInstance.post("/booking/newbooking", {
					...requestData,
					departure_seats: randomSeats(isAvailable),
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
			boat_id: "bt-54321", // default boat id
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


