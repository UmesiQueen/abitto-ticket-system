import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api";
import SuccessModal from "@/components/modals/success";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { customError } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export const useScheduleTrip = () => {
	const { unMountPortalModal, setModalContent } = React.useContext(GlobalCTX);
	const { setLoading } = React.useContext(BookingCTX);
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const scheduleRequest = (handleReset, formValues) => {
		setLoading(true);

		axiosInstance
			.post("/ticket/create", formValues)
			.then((res) => {
				if (res.status === 200) {
					queryClient.invalidateQueries('journeyList');
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
				customError(error, "Failed to create new trip. Please try again.");
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
				if (res.status === 200) {
					queryClient.invalidateQueries('journeyList');
					setModalContent(
						<SuccessModal
							header="Update Successful"
							onclick={() => { navigate(".", { replace: true }); }}
							text="You have successfully rescheduled this trip."
						/>
					);
				}
			})
			.catch((error) => {
				customError(error, "Failed to reschedule trip. Please try again.");
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
				if (res.status === 200) {
					queryClient.invalidateQueries('journeyList');
					setModalContent(
						<SuccessModal
							header="Cancellation Successful"
							onclick={() => { navigate(".", { replace: true }); }}
							text="You have successfully cancelled this trip."
						/>
					);
				}
			})
			.catch((error) => {
				customError(error, "Failed to cancel trip. Please try again.");
				unMountPortalModal();
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return { scheduleRequest, rescheduleRequest, cancelRequest };
};
