import React from "react";
import baseurl from "@/api";
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
	const rescheduleBooking = () => {};
	const updatePaymentStatus = () => {};

	return { checkInPassenger, rescheduleBooking, updatePaymentStatus };
};
