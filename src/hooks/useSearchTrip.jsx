import React from "react";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import axiosInstance from "@/api";
import { UnAvailableModal } from "@/components/modals/booking";
import { customError } from "@/lib/utils";

export const useSearchTrip = () => {
	const { formData, setLoading } = React.useContext(BookingCTX);
	const { mountPortalModal } = React.useContext(GlobalCTX);

	const searchAvailableTrips = async (reqData) => {
		try {
			const response = await axiosInstance.post("/ticket/query", reqData);
			return response.data
		} catch (error) {
			customError(error, "Unable to retrieve available trips. Please try again.")
		}
	};

	const checkAvailability = async () => {
		setLoading(true)
		const { total_passengers, departure_trip_code } = formData.bookingDetails;

		const response = await axiosInstance
			.post("/ticket/available", { departure_trip_code })
			.then((res) => {
				if (res.status === 200) {
					const { available_seats } = res.data
					if (available_seats >= total_passengers)
						return available_seats;
					return mountPortalModal(<UnAvailableModal />);
				}
			})
			.catch((error) => {
				customError(error, "Unable to confirm this trip availability.Please try again.")
				setLoading(false)
			})

		return response
	}

	return { searchAvailableTrips, checkAvailability };
};
