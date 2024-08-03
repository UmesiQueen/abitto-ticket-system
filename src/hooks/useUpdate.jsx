import React from "react";
import axios from "axios";
import { toast } from "sonner";
import SuccessModal from "@/components/modals/success";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";

export const useUpdate = () => {
	const { unMountPortalModal, setModalContent } = React.useContext(GlobalCTX);
	const { setLoading } = React.useContext(BookingCTX);

	const checkInPassenger = (ticket_id) => {
		setLoading(true);
		const formValues = {
			check_in: true,
			trip_status: "Completed",
			ticket_id,
		};

		axios
			.patch("https://abitto-api.onrender.com/api/booking/update", formValues)
			.then((res) => {
				if (res.status == 200)
					setModalContent(
						<SuccessModal
							header="Check-in Successful"
							text="This passenger is successfully checked-in."
						/>
					);
			})
			.catch((err) => {
				unMountPortalModal();
				console.error(err, "Error occurred while checking-in.");
				if (err.code == "ERR_NETWORK")
					return toast.error("Please check your internet connection.");
				if (err.code == "ERR_BAD_REQUEST") return toast.error("bad request.");
				return toast.error("Error occurred while checking-in. Try again.");
			})
			.finally(() => setLoading(false));
	};
	const rescheduleBooking = () => {};
	const updatePaymentStatus = () => {};

	return { checkInPassenger, rescheduleBooking, updatePaymentStatus };
};
