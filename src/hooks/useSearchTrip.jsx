import React from "react";
import { BookingCTX } from "@/contexts/BookingContext";
// import { GlobalCTX } from "@/contexts/GlobalContext";
// import axiosInstance from "@/api";
// import { UnAvailableModal } from "@/components/modals/booking";
// import { customError } from "@/lib/utils";
import { addHours, format, subHours, addMinutes } from "date-fns";

export const useSearchTrip = () => {
  const { setLoading } = React.useContext(BookingCTX);
//   const { formData, setLoading } = React.useContext(BookingCTX);
//   const { mountPortalModal } = React.useContext(GlobalCTX);

  const searchAvailableTrips = async (reqData) => {
    setLoading(true);
    const availableTrips = [
      {
        trip_code: "TRIP123",
        time: format(addHours(addMinutes(new Date(), 25), 4), "p"),
        ticket_cost: 18000,
        trip_capacity: 26,
        current_booked_seats: 26,
        trip_status: "Completed",
        ...reqData,
        date: format(reqData.date, "PP"),
      },
      {
        trip_code: "TRIP456",
        time: format(subHours(new Date(), 2), "p"),
        ticket_cost: 18000,
        trip_capacity: 26,
        current_booked_seats: 20,
        trip_status: "Upcoming",
        ...reqData,
        date: format(reqData.date, "PP"),
      },
    ];
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(availableTrips);
        setLoading(false);
      }, 1500);
    });
    // try {
    // 	const response = await axiosInstance.post("/ticket/query", reqData);
    // 	return response.data.departure_trip
    // } catch (error) {
    // 	customError(error, "Unable to retrieve available trips. Please try again.")
    // }
  };

  const checkAvailability = async () => {
    setLoading(true);
    const availableTrips = 6;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(availableTrips);
		setLoading(false);
      }, 1500);
    });
  };
  
  //   const checkAvailability = async () => {
  //     setLoading(true);
  //     const { total_passengers, departure_trip_code } = formData.bookingDetails;

  //     const response = await axiosInstance
  //       .post("/ticket/available", { departure_trip_code })
  //       .then((res) => {
  //         if (res.status === 200) {
  //           const { available_seats } = res.data;
  //           if (available_seats >= total_passengers) return available_seats;
  //           return mountPortalModal(<UnAvailableModal seats={available_seats} />);
  //         }
  //       })
  //       .catch((error) => {
  //         customError(
  //           error,
  //           "Unable to confirm this trip availability.Please try again."
  //         );
  //         setLoading(false);
  //       });

  //     return response;
  //   };

  return { searchAvailableTrips, checkAvailability };
};
