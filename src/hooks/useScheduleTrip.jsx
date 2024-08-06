import React from "react";
import { useRevalidator } from "react-router-dom";
import baseurl from "@/api/instance";
import { toast } from "sonner";
import SuccessModal from "@/components/modals/success";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";

export const useScheduleTrip = () => {
	const { unMountPortalModal, setModalContent } = React.useContext(GlobalCTX);
	const { setLoading } = React.useContext(BookingCTX);
	const { revalidate } = useRevalidator();

	const scheduleRequest = (handleReset, formValues) => {
		setLoading(true);

		baseurl
			.post("/ticket/create", formValues)
			.then((res) => {
				if (res.status == 200) {
					setModalContent(
						<SuccessModal
							header="Creation Successful"
							text="You have successfully added a new trip schedule."
						/>
					);
					handleReset();
				}
			})
			.catch((err) => {
				console.error(err, "Error occurred while scheduling trip.");
				toast.error("Failed to create new trip. Please try again.");
				unMountPortalModal();
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const rescheduleRequest = (formValues) => {
		setLoading(true);
		baseurl
			.post("/ticket/update", formValues)
			.then((res) => {
				if (res.status == 200) {
					setModalContent(
						<SuccessModal
							header="Update Successful"
							onclick={() => revalidate()}
							text="You have successfully rescheduled this trip."
						/>
					);
				}
			})
			.catch((err) => {
				console.error(err, "Error occurred while rescheduling trip.");
				toast.error("Failed to reschedule trip. Please try again.");
				unMountPortalModal();
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const cancelRequest = (formValues) => {
		setLoading(true);
		baseurl
			.post("/ticket/update", formValues)
			.then((res) => {
				if (res.status == 200) {
					setModalContent(
						<SuccessModal
							header="Cancelation Successful"
							onclick={() => revalidate()}
							text="You have successfully cancelled this trip."
						/>
					);
				}
			})
			.catch((err) => {
				console.error(err, "Error occurred while cancelling trip.");
				toast.error("Failed to cancel trip. Please try again.");
				unMountPortalModal();
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return { scheduleRequest, rescheduleRequest, cancelRequest };
};
