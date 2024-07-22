import React from "react";
import { format } from "date-fns";
import { formatValue } from "react-currency-input-field";
import {
  CalendarIcon,
  ChairIcon,
  ClockIcon,
  Boat2Icon,
  UsersIcon,
  CancelSquareIcon,
} from "@/assets/icons/index";
import { BookingCTX } from "@/contexts/BookingContext";
import Button from "@/components/custom/Button";
import { Button as IconButton } from "./ui/button";
import { useStepper } from "@/hooks/useStepper";
import { usePayment } from "@/hooks/usePayment";
import { GlobalCTX } from "@/contexts/GlobalContext";

const Payment = () => {
  const { loading, formData } = React.useContext(BookingCTX);
  const { mountPortalModal } = React.useContext(GlobalCTX);
  const { onPrevClick } = useStepper();
  const { onlinePayment } = usePayment();
  // const { testOnlinePayment } = usePayment();
  const total_ticket_cost =
    (Number(formData.bookingDetails.departure_ticket_cost) +
      Number(formData.bookingDetails?.return_ticket_cost ?? 0)) *
    Number(formData.bookingDetails.total_passengers);

  return (
    <div className="p-5 md:p-12 !bg-white mx-auto flex flex-col gap-2">
      <div className="flex gap-5 justify-between items-center">
        <img
          alt="logo"
          src="https://i.ibb.co/Zh8H4Wz/logo3.png"
          width={176}
          height={60}
          className="w-32 md:w-40"
        />
        <p className="text-sm md:text-base">Ticket ID: {formData.ticket_id}</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h3 className="text-blue-500 font-semibold text-base md:text-xl ">
          Ticket Summary
        </h3>
        {/* total cost */}
        <div className="text-right">
          <p className="text-xs md:text-sm font-bold text-gray-500 mb-1">
            Ticket total(NGN)
          </p>
          <p className="nowrap font-semibold text-4xl md:text-5xl ">
            <span className="text-2xl">₦</span>
            {formatValue({
              value: String(total_ticket_cost),
            })}
          </p>
        </div>
      </div>

      <div className="text-xs md:text-base space-y-5 *:pb-3 [&>*:not(:last-of-type)]:border-b">
        {/* Trip Details */}
        <div className="space-y-1">
          <hgroup>
            <h4 className="font-semibold text-sm">Terminals</h4>
            <p>
              {formData.bookingDetails.travel_from} -{" "}
              {formData.bookingDetails.travel_to}
            </p>
          </hgroup>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1 [&_li]:inline-flex [&_li]:items-center [&_li]:gap-1">
            <li>
              <Boat2Icon />
              <p>{formData.bookingDetails.trip_type}</p>
            </li>
            <li>
              <UsersIcon />
              <p>{formData.bookingDetails.total_passengers} Passenger(s)</p>
            </li>
          </ul>
        </div>

        {/* time and return */}
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          <div>
            <h4 className="font-semibold text-sm mb-1">Departure Details</h4>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1  [&_li]:inline-flex [&_li]:items-center [&_li]:gap-1">
              <li>
                <CalendarIcon />
                <p>
                  {format(
                    new Date(formData.bookingDetails.departure_date),
                    "PP"
                  )}
                </p>
              </li>
              <li>
                <ClockIcon />
                <p>{formData.bookingDetails.departure_time}</p>
              </li>
              <li className="tracking-wide ">
                <ChairIcon />
                <p>
                  Seats:{" "}
                  {`${formData.seatDetails.departure_seats ?? "Not Selected"}`}
                </p>
              </li>
            </ul>
          </div>
          {formData.bookingDetails.trip_type === "Round Trip" && (
            <div>
              <h5 className="font-semibold text-sm mb-1">Return Details</h5>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1 [&_li]:inline-flex [&_li]:items-center [&_li]:gap-1">
                <li>
                  <CalendarIcon />
                  <p>
                    {format(
                      new Date(formData.bookingDetails?.return_date),
                      "PP"
                    )}
                  </p>
                </li>
                <li>
                  <ClockIcon />
                  <p>{formData.bookingDetails?.return_time}</p>
                </li>
                <li className="tracking-wider">
                  <ChairIcon />
                  <p>
                    Seats:{" "}
                    {`${formData.seatDetails?.return_seats ?? "Not Selected"}`}
                  </p>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* customer details */}
        <button
          onClick={() => {
            mountPortalModal(<PassengerDetailsModal />);
          }}
          className="md:hidden text-blue-500 font-medium hover:text-blue-700"
        >
          Click here to see all Passengers Details {">"}
        </button>
        <div className="hidden md:block">
          <PassengerDetails />
        </div>
      </div>

      <div className="border-y-2 border-dashed py-3 md:mt-5">
        <table className="w-full [&_td:last-of-type]:text-right [&_td]:py-[2px] ">
          <tbody>
            {/* <tr>
              <td className="text-xs md:text-sm text-[#444444]">
                Ride Insurance
              </td>
              <td className="text-xs md:text-sm text-[#444444]">₦0</td>
            </tr> */}
            <tr>
              <td className="text-xs md:text-sm text-[#444444]">
                Ticket Price
              </td>
              <td className="text-xs md:text-sm text-[#444444]">
                {formatValue({
                  value: String(formData.bookingDetails.departure_ticket_cost),
                  prefix: "₦",
                })}
                {formData.bookingDetails.trip_type === "Round Trip" && (
                  <>
                    {" + "}
                    {formatValue({
                      value: String(formData.bookingDetails.return_ticket_cost),
                      prefix: "₦",
                    })}
                  </>
                )}{" "}
                x {formData.bookingDetails.total_passengers}
              </td>
            </tr>
            <tr>
              <td className="font-medium text-base md:text-lg">Total</td>
              <td className="font-medium text-base md:text-lg">
                ₦
                {formatValue({
                  value: String(total_ticket_cost),
                })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 space-y-1 text-xs md:text-sm ">
        <p>
          <span className="uppercase">Notice: </span>
          Abitto Ferry check-in counters open <b>1 hours</b> before departure.
        </p>
        <p>
          Ensure to arrive early to your Terminal as boarding starts{" "}
          <b>30 minutes</b> before your scheduled take off.
        </p>
        <p>
          <strong>
            This ticket is Non-refundable and cannot be rescheduled if scheduled
            time is missed.
          </strong>
        </p>
      </div>

      <div className="my-5 md:mt-8 md:mb-0 space-y-5">
        <Button
          onClick={onlinePayment}
          id="paystack-btn"
          loading={loading}
          text={"Pay with paystack"}
          className="uppercase w-full md:py-6"
        />
        <Button
          onClick={onPrevClick}
          text="Back"
          variant="outline"
          className="w-full md:py-6"
        />
      </div>
    </div>
  );
};

export default Payment;

const PassengerDetails = () => {
  const { formData } = React.useContext(BookingCTX);

  return (
    <div className="space-y-2">
      <div id="Passenger01">
        <h4 className="font-semibold text-sm">Passenger 01</h4>
        <ul className="mt-2 border-2 rounded-lg py-3 px-5 flex flex-wrap gap-y-3 gap-x-5 md:gap-x-12 [&_p:first-of-type]:text-xs  [&_p:first-of-type]:font-semibold  [&_p:last-of-type]:text-gray-500  [&_li]:space-y-1  ">
          <li>
            <p>First Name</p>
            <p>{formData.passengerDetails.passenger1_first_name}</p>
          </li>
          <li>
            <p>Surname</p>
            <p>{formData.passengerDetails.passenger1_surname}</p>
          </li>
          <li>
            <p>Phone Number</p>
            <p>{formData.passengerDetails.passenger1_phone_number}</p>
          </li>
          <li>
            <p>Email Address</p>
            <p>{formData.passengerDetails?.passenger1_email}</p>
          </li>
        </ul>
      </div>
      {formData.bookingDetails?.adults_number > 1 &&
      formData.passengerDetails?.passenger2_first_name ? (
        <>
          {Array.from({
            length: formData.bookingDetails.adults_number - 1,
          }).map((_, i) => {
            const num = i + 2;
            return (
              <div id={`Passenger0${num}`} key={`Passenger0${num}`}>
                <h4 className="font-semibold text-sm">Passenger 0{num}</h4>
                <ul className="mt-2 border-2 rounded-lg py-3 px-5 flex flex-wrap gap-y-3 gap-x-5 md:gap-x-12 [&_p:first-of-type]:text-xs  [&_p:first-of-type]:font-semibold  [&_p:last-of-type]:text-gray-500 [&_li]:space-y-1">
                  <li>
                    <p>First Name</p>
                    <p>
                      {formData.passengerDetails[`passenger${num}_first_name`]}
                    </p>
                  </li>
                  <li>
                    <p>Surname</p>
                    <p>
                      {formData.passengerDetails[`passenger${num}_surname`]}
                    </p>
                  </li>
                  <li>
                    <p>Phone Number</p>
                    <p>
                      {
                        formData.passengerDetails[
                          `passenger${num}_phone_number`
                        ]
                      }
                    </p>
                  </li>
                  <li>
                    <p>Email Address</p>
                    <p>
                      {formData.passengerDetails?.[`passenger${num}_email`]}
                    </p>
                  </li>
                </ul>
              </div>
            );
          })}
        </>
      ) : (
        ""
      )}
    </div>
  );
};

const PassengerDetailsModal = () => {
  const { unMountPortalModal } = React.useContext(GlobalCTX);
  return (
    <div className="bg-white rounded-lg p-5 pb-10 flex flex-col">
      <IconButton
        variant="ghost"
        size="icon"
        className="ml-auto"
        onClick={unMountPortalModal}
      >
        <CancelSquareIcon />
      </IconButton>
      <PassengerDetails />
    </div>
  );
};
