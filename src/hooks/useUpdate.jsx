import React from "react";
import baseurl from "@/api";
import { toast } from "sonner";
import SuccessModal from "@/components/modals/success";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import BookingSuccessModal from "@/components/modals/book.success";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid"

export const useUpdate = () => {
	const { unMountPortalModal, setModalContent, mountPortalModal, adminProfile } = React.useContext(GlobalCTX);
	const { setLoading } = React.useContext(BookingCTX);
	const navigate = useNavigate()

	const checkInPassenger = (ticket_id) => {
		setLoading(true);
		const formValues = {
			check_in: true,
			trip_status: "Completed",
			ticket_id,
		};

		baseurl
			.patch("/booking/update", formValues)
			.then((res) => {
				if (res.status == 200)
					setModalContent(
						<SuccessModal
							header="Check-in Successful"
							text="This passenger is successfully checked-in."
						/>
					);
			})
			.catch((error) => {
				unMountPortalModal();
				if (
					!error.code === "ERR_NETWORK" ||
					!error.code === "ERR_INTERNET_DISCONNECTED" ||
					!error.code === "ECONNABORTED"
				)
					toast.error("Error occurred while checking-in. Try again.");
			})
			.finally(() => setLoading(false));
	};

	const rescheduleBooking = (prevDetails, newDetails) => {
		setLoading(true);
		const updatePrev = {
			ticket_id: prevDetails.ticket_id,
			trip_status: "Rescheduled"
		}
		const rescheduleData = {
			...newDetails,
			ticket_id: `${prevDetails.ticket_id.slice(0, 6)}${uuid().slice(0, 2)}`,
			medium: "Offline",
			trxRef: newDetails.transaction_ref,
			booked_by: `${adminProfile.first_name}(${adminProfile.account_type})`,
			trip_status: newDetails.check_in ? "Completed" : "Upcoming",
		}

		baseurl
			.post("booking/reschedule", updatePrev)
			.then((res) => {
				if (res.status == 200) {
					// book new ticket here
					baseurl
						.post("/booking/newbooking", rescheduleData)
						.then((res) => {
							if (res.status == 200) {
								const ticket_id = res.data.booking.ticket_id;
								mountPortalModal(<BookingSuccessModal
									id={ticket_id}
									onClick={() => { navigate(`/backend/${adminProfile.account_type}/booking-details/${ticket_id}`) }}
								/>);
							}
						})
						.catch((error) => {
							if (
								!error.code === "ERR_NETWORK" ||
								!error.code === "ERR_INTERNET_DISCONNECTED" ||
								!error.code === "ECONNABORTED"
							)
								toast.error("New booking not confirmed.", { description: "Error occurred while making new booking request." });
						})
				}
			}).catch((error) => {
				if (
					!error.code === "ERR_NETWORK" ||
					!error.code === "ERR_INTERNET_DISCONNECTED" ||
					!error.code === "ECONNABORTED"
				)
					toast.error("Error occurred while Rescheduling. Please try again.");

			}).finally(() => setLoading(false))
	};

	const updatePaymentStatus = () => { };

	const updateShipmentStatus = (reqData, onSuccess) => {
		const { shipment_status } = reqData;
		setLoading(true);
		baseurl.patch("logistics/update", reqData)
			.then((res) => {
				if (res.status == 200)
					setModalContent(
						<SuccessModal
							header={`Shipment status updated to '${shipment_status}'`}
							text={shipment_status == "Arrived"
								? "You have confirmed that this shipment has arrived your terminal. Please notify receiver for collection."
								: shipment_status == "Collected"
									? "You have confirmed that this shipment has been collected."
									: "Unknown Request."}
							onclick={onSuccess}
						/>
					);
			})
			.catch((error) => {
				if (
					!error.code === "ERR_NETWORK" ||
					!error.code === "ERR_INTERNET_DISCONNECTED" ||
					!error.code === "ECONNABORTED"
				)
					toast.error("Error occurred while updating shipment status. Try again.");
			})
			.finally(() => setLoading(false));
	}

	const updatePrices = (reqData, onSuccess) => {
		setLoading(true);
		baseurl.patch("price/edit", reqData)
			.then((res) => {
				if (res.status == 200)
					setModalContent(
						<SuccessModal
							header="Prices Update Successful"
							text={"You have successfully updated the prices across the platform."}
							onclick={onSuccess}
						/>
					);
			})
			.catch((error) => {
				if (
					!error.code === "ERR_NETWORK" ||
					!error.code === "ERR_INTERNET_DISCONNECTED" ||
					!error.code === "ECONNABORTED"
				)
					toast.error("Error occurred while updating price. Try again.");
			})
			.finally(() => setLoading(false));
	}

	return { checkInPassenger, rescheduleBooking, updatePaymentStatus, updateShipmentStatus, updatePrices };
};
