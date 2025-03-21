import React from "react";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { toast } from "sonner";
import axiosInstance from "@/api";
import { useStepper } from "@/hooks/useStepper";
import BookingWarningModal, { UnAvailableModal } from "@/components/modals/book.warning";

export const useSearchTrip = () => {
	const { setAvailableTrips, selectedTrip, formData, setLoading: loader } = React.useContext(BookingCTX);
	const { setLoading, mountPortalModal } = React.useContext(GlobalCTX);
	const { onNextClick } = useStepper();

	const searchAvailableTrips = (reqData) => {
		setLoading(true);
		axiosInstance
			.post("/ticket/query", reqData)
			.then((res) => {
				onNextClick();
				setAvailableTrips(res.data);
			})
			.catch((error) => {
				if (
					!error.code === "ERR_NETWORK" ||
					!error.code === "ERR_INTERNET_DISCONNECTED" ||
					!error.code === "ECONNABORTED"
				)
					toast.error("Unable to retrieve available trips. Please try again.");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const checkAvailability = () => {
		loader(true)
		const requestData = {
			departure_trip_code: selectedTrip.departure.trip_code,
		}
		const { total_passengers } = formData.bookingDetails;

		axiosInstance
			.post("/ticket/available", requestData)
			.then((res) => {
				if (res.status == 200) {
					const available_departure_seats = res.data.available_seats;
					if (available_departure_seats >= total_passengers) {
						return mountPortalModal(<BookingWarningModal />);
					}
					return mountPortalModal(<UnAvailableModal type={"departure"} />);
				}
			})
			.catch((error) => {
				if (
					!error.code === "ERR_NETWORK" ||
					!error.code === "ERR_INTERNET_DISCONNECTED" ||
					!error.code === "ECONNABORTED"
				)
					toast.error("Unable to confirm this trip availability. Please try again");
				return false
			})
			.finally(() => {
				loader(false);
			});
	}

	return { searchAvailableTrips, checkAvailability };
};
