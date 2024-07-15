/* eslint-disable react/prop-types */
import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLoaderData } from "react-router-dom";
import { format } from "date-fns";
import { Button as IconButton } from "@/components/ui/button";
import Button from "@/components/custom/Button";
import { cn } from "@/lib/utils";
import { DeleteIcon, PrinterIcon, CircleArrowLeftIcon } from "@/assets/icons";
import { GlobalCTX } from "@/contexts/GlobalContext";
import Logo from "@/assets/logo.svg";
import axios from "axios";
import RescheduleEditModal from "@/components/modals/reschedule.edit";
import { BookingCTX } from "@/contexts/BookingContext";
import { useScheduleTrip } from "@/hooks/useScheduleTrip";
import ConfirmationModal from "@/components/modals/confirmation";

const TripDetails = () => {
  const { mountPortalModal } = React.useContext(GlobalCTX);
  const { tripDetails, setTripDetails } = React.useContext(BookingCTX);
  const navigate = useNavigate();
  const selectedTrip = useLoaderData();
  const { cancelRequest } = useScheduleTrip();

  React.useEffect(() => {
    setTripDetails(selectedTrip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrip]);

  const getTotalBooked = () => {
    let totalSeats = 29;
    const totalBooked = totalSeats - selectedTrip.available_seats.length;
    return totalBooked;
  };

  const handleCancel = () => {
    mountPortalModal(
      <ConfirmationModal
        props={{
          header: "Are you sure you want to delete Journey List?",
          handleRequest: () => {
            cancelRequest({
              ...tripDetails,
              trip_status: "Canceled",
            });
          },
          severity: "delete",
        }}
      />
    );
  };

  return (
    <>
      <Helmet>
        <title>Journey Details | Admin</title>
      </Helmet>

      <section>
        <div className="flex gap-1 items-center mb-8 ">
          <IconButton size="icon" variant="ghost" onClick={() => navigate(-1)}>
            <CircleArrowLeftIcon />
          </IconButton>{" "}
          <h1 className="text-lg font-semibold">Journey Details</h1>
        </div>
        <div className="bg-white rounded-lg">
          <ul className="p-5 flex items-center">
            <li className="basis-2/12">
              <img
                src={Logo}
                alt="logo"
                className="w-1/2 mx-auto object-cover"
              />
            </li>
            <li className="basis-6/12 [&_strong]:pr-2 [&_strong]:font-semibold ">
              <p>
                <strong>Route: </strong>
                {selectedTrip.departure} - {selectedTrip.arrival}
              </p>
              <p>
                <strong>Date:</strong>
                {format(selectedTrip.date, "PPPP")}
              </p>
              <p>
                <strong>Time:</strong>
                {selectedTrip.time}
              </p>
              <p>
                <strong>Trip Status:</strong>
                <span
                  className={cn("font-semibold", {
                    "text-green-700": selectedTrip.trip_status === "Completed",
                    "text-[#E78913] ": selectedTrip.trip_status === "Upcoming",
                    "text-[#F00000] ": selectedTrip.trip_status === "Canceled",
                  })}
                >
                  {selectedTrip.trip_status}
                </span>
              </p>
              <p>
                <strong>Total Booked:</strong>
                {getTotalBooked()}
              </p>
            </li>
            <li className="basis-3/12 self-end ml-auto flex justify-end gap-2">
              <Button
                text="Re-schedule Trip"
                variant="outline"
                className="text-nowrap h-10"
                onClick={() => {
                  mountPortalModal(<RescheduleEditModal />);
                }}
              />
              <IconButton
                variant="destructive"
                size="icon"
                onClick={handleCancel}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton size="icon" className="bg-blue-500">
                <PrinterIcon />
              </IconButton>
            </li>
          </ul>
          <div
            className={cn("border-t-4 mt-5", {
              "border-green-700": selectedTrip.trip_status === "Completed",
              "border-[#E78913] ": selectedTrip.trip_status === "Upcoming",
              "border-[#F00000] ": selectedTrip.trip_status === "Canceled",
            })}
          />
        </div>
      </section>
    </>
  );
};

export default TripDetails;

export const TripDetailsLoader = async ({ params }) => {
  try {
    const response = await axios.post(
      "https://abitto-api.onrender.com/api/ticket/tripcode",
      { trip_code: params.tripCode }
    );
    return response.data.ticket;
  } catch (error) {
    console.error(error);
    return null;
  }
};
