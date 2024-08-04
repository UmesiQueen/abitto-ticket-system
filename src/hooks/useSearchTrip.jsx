import React from "react";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { toast } from "sonner";
import axios from "axios";
import { useStepper } from "@/hooks/useStepper";

export const useSearchTrip = () => {
	const { setAvailableTrips } = React.useContext(BookingCTX);
	const { setLoading } = React.useContext(GlobalCTX);
	const { onNextClick } = useStepper();

	const searchAvailableTrips = (reqData) => {
		setLoading(true);
		axios
			.post("https://abitto-api.onrender.com/api/ticket/query", reqData)
			.then((res) => {
				onNextClick();
				setAvailableTrips(res.data);
			})
			.catch((err) => {
				console.error(err, "Error occurred while retrieving available trips.");
				toast.error("Unable to retrieve available trips. Please try again.");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return { searchAvailableTrips };
};
