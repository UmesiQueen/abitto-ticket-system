import React from "react";
import PaystackPop from "@paystack/inline-js";
import axiosInstance from "@/api";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { LogisticsSuccessModal } from "@/components/modals/book.success";
import { v4 as uuid } from "uuid";
import { RentalSuccessModal } from "@/components/modals/book.success";
import BookingFailedModal, {
	BookingRequestFailedModal,
} from "@/components/modals/book.failure";
import { customError } from "@/lib/utils";
import { useSearchTrip } from "./useSearchTrip";

export const usePayment = () => {
	const { formData, rentalData, setLoading: loader } = React.useContext(BookingCTX);
	const {
		mountPortalModal,
		setModalContent,
		setShowModal,
		adminProfile,
		setLoading,
	} = React.useContext(GlobalCTX);
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
				customError(error, "Payment initialization failed. Try Again.")
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
				return res.data.booking.ticket_id
			}
			catch (error) {
				customError(error, "Booking not confirmed. Please try again.")
			}
			finally {
				loader(false)
			}
	};

	const onlineRentalPayment = () => {
		setShowModal(false);
		const paystack = new PaystackPop();

		paystack.newTransaction({
			key: "pk_live_b25d12c8f8e8a5b151d6015b71ae2e99d1e4e243", //abitto
			// key: "pk_test_5d5cd21c077f1395d701366d2880665b3e9fb0f5", // queen
			amount: rentalData.total_cost * 100,
			email: rentalData.email,
			firstname: rentalData.first_name,
			lastname: rentalData.surname,
			phone: rentalData.phone_number,
			onSuccess(res) {
				handleOnlineRental({
					payment_status: "Success",
					trxRef: res.trxref,
				});
			},
			onCancel() {
				handleOnlineRental({
					payment_status: "Canceled",
					trxRef: "N/A",
				});
				setShowModal(true);
				setModalContent(<BookingFailedModal />);
			},
		});
	};

	const handleOnlineRental = ({ payment_status, trxRef }) => {
		setLoading(true);
		const requestData = {
			...rentalData,
			boat_id: "bt-54321",
			rental_status: "Upcoming",
			payment_method: "Paystack",
			payment_medium: "Online",
			paid_by: "Customer",
			payment_status,
			trxRef,
		};

		const isSuccess = payment_status === "Success";

		axiosInstance
			.post("/rent/createrent", requestData)
			.then((res) => {
				if (res.status === 200 && isSuccess) {
					const ticket_id = res.data.rent.ticket_id;
					setModalContent(<RentalSuccessModal id={ticket_id} />);
				}
			})
			.catch(() => {
				if (isSuccess) {
					document.getElementById("rental_payment_btn").disabled = true;
					document.getElementById("rental_next_btn").innerHTML = "Clear";
					setModalContent(<BookingRequestFailedModal header={"Rental"} />);
				}
			})
			.finally(() => {
				setShowModal(true);
				setLoading(false);
			});
	};

	const offlineRentalPayment = (data) => {
		const { payment_status, transaction_ref, payment_method } = data;

		setLoading(true);
		const requestData = {
			...rentalData,
			boat_id: "bt-54321",
			rental_status: "Upcoming",
			payment_medium: "Offline",
			paid_by: `${adminProfile.first_name}(${adminProfile.account_type})`,
			payment_status,
			payment_method,
			trxRef: transaction_ref,
		};

		axiosInstance
			.post("/rent/createrent", requestData)
			.then((res) => {
				if (res.status === 200) {
					const ticket_id = res.data.rent.ticket_id;
					mountPortalModal(<RentalSuccessModal id={ticket_id} />);
				}
			})
			.catch((error) => {
				customError(error, "Error occurred while creating new rental.")
			})
			.finally(() => setLoading(false));
	};

	const handleLogisticsPayment = (data, handleReset) => {
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
					const id = res.data.logistics.shipment_id;
					mountPortalModal(<LogisticsSuccessModal props={{ id, handleReset }} />);
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
		onlineRentalPayment,
		offlineRentalPayment,
		handleLogisticsPayment
	};
};
