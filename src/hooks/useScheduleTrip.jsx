import React from "react";
import { useRevalidator } from "react-router-dom";
import axiosInstance from "@/api";
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

		axiosInstance
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
			.catch((error) => {
				if (
					!error.code === "ERR_NETWORK" ||
					!error.code === "ERR_INTERNET_DISCONNECTED" ||
					!error.code === "ECONNABORTED"
				)
					toast.error("Failed to create new trip. Please try again.");
				unMountPortalModal();
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const rescheduleRequest = (formValues) => {
		setLoading(true);
		axiosInstance
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
			.catch((error) => {
				if (
					!error.code === "ERR_NETWORK" ||
					!error.code === "ERR_INTERNET_DISCONNECTED" ||
					!error.code === "ECONNABORTED"
				)
					toast.error("Failed to reschedule trip. Please try again.");
				unMountPortalModal();
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const cancelRequest = (formValues) => {
		setLoading(true);
		axiosInstance
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
			.catch((error) => {
				if (
					!error.code === "ERR_NETWORK" ||
					!error.code === "ERR_INTERNET_DISCONNECTED" ||
					!error.code === "ECONNABORTED"
				)
					toast.error("Failed to cancel trip. Please try again.");
				unMountPortalModal();
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return { scheduleRequest, rescheduleRequest, cancelRequest };
};
