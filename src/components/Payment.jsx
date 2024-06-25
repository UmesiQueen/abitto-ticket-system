import React from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { formatValue } from "react-currency-input-field";
import {
  InformationCircleIcon,
  CircleArrowLeftIcon,
  CalendarIcon,
  ChairIcon,
  ClockIcon,
  Boat2Icon,
  UserIcon,
} from "@/assets/icons/index";
import { BookingCTX } from "@/contexts/BookingContext";
import Button from "@/components/custom/Button";
import { Button as IconButton } from "@/components/ui/button";
import { useStepper } from "@/hooks/useStepper";
import { usePayment } from "@/hooks/usePayment";
import checkGIF from "@/assets/check.gif";

const Payment = () => {
  const { ticketCost, loading, formData } = React.useContext(BookingCTX);
  const { onPrevClick } = useStepper();
  // const { onlinePayment } = usePayment();
  const { fakeOnlinePayment } = usePayment();

  return (
    <div className="flex flex-col h-fit p-5 bg-blue-50 w-full max-w-[1000px] mx-auto">
      <div className="p-3 md:p-5 bg-white">
        <IconButton
          variant="ghost"
          type="button"
          size="sm"
          onClick={onPrevClick}
          className="flex items-center gap-1 mb-2"
        >
          <span>
            <CircleArrowLeftIcon />
          </span>
          <h3 className="font-medium text-sm md:text-base">Return</h3>
        </IconButton>

        <section className="px-3">
          <hgroup className="md:space-y-2">
            <h3 className="text-blue-500 font-semibold  text-base md:text-xl ">
              Ticket Summary
            </h3>
            <p className="text-[#8E98A8] text-sm inline-flex items-center gap-1">
              Non-refundable <InformationCircleIcon />
            </p>
          </hgroup>

          {/* total cost */}
          <div className="w-full text-right my-3 md:my-0">
            <p className="text-xs font-bold text-[#7F7F7F] mb-1">
              Ticket total(NGN)
            </p>
            <p className="nowrap font-semibold text-4xl md:text-5xl ">
              <span className="text-2xl">₦</span>
              {formatValue({
                value: String(formData.bookingDetails.amount),
              })}
            </p>
          </div>

          <div className="text-xs md:text-base space-y-5 [&_li]:inline-flex [&_li]:items-center [&_li]:gap-1 *:pb-3 [&>*:not(:last-of-type)]:border-b">
            {/* Trip Details */}
            <div className="space-y-3">
              <hgroup>
                <h4 className="font-semibold mb-1 flex gap-1">
                  Terminals <Boat2Icon />
                </h4>
                <p>
                  {formData.bookingDetails.travel_from} -{" "}
                  {formData.bookingDetails.travel_to}
                </p>
              </hgroup>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
                <li>
                  <p className="text-xs text-gray-500 font-normal">
                    Trip Type:
                  </p>
                  <p>{formData.bookingDetails.trip_type}</p>
                </li>
                <li>
                  <p className="text-xs text-gray-500 font-normal">
                    Passenger(s):
                  </p>
                  <p>{formData.bookingDetails.total_passengers}</p>
                </li>
              </ul>
            </div>

            {/* time and return */}
            <div className="flex flex-wrap gap-x-5 gap-y-3">
              <div>
                <h5 className="font-semibold mb-1">Departure Details</h5>
                <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
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
                  <li>
                    <ChairIcon />
                    <p>{`${formData.seatDetails.departure_seats}`}</p>
                  </li>
                </ul>
              </div>
              {formData.bookingDetails.trip_type === "Round Trip" && (
                <div>
                  <h5 className="font-semibold mb-1">Return Details</h5>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
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
                    <li>
                      <ChairIcon />
                      <p>{`${formData.seatDetails?.return_seats}`}</p>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* customer details */}
            {formData.bookingDetails?.adults_number <= 1 ||
            !formData.passengerDetails?.passenger2_first_name ? (
              <div>
                <h5 className="font-semibold mb-1">Passenger Details</h5>
                <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
                  <li>
                    <span className="text-xs text-gray-500 font-normal">
                      Full name:
                    </span>{" "}
                    {`${formData.passengerDetails.first_name} ${formData.passengerDetails.surname}`}
                  </li>
                  <li>
                    <span className="text-xs text-gray-500 font-normal">
                      Phone:{" "}
                    </span>
                    {formData.passengerDetails.phone_number}
                  </li>
                  {formData.passengerDetails.email && (
                    <li>
                      <span className="text-xs text-gray-500 font-normal">
                        Email:{" "}
                      </span>
                      {formData.passengerDetails.email}
                    </li>
                  )}
                </ul>
              </div>
            ) : (
              <div>
                <h5 className="font-semibold mb-1 ">Passenger Names</h5>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <p className="flex gap-x-1 items-center">
                    <span className="text-[#ACACAC]">
                      <UserIcon />
                    </span>
                    {`${formData.passengerDetails.first_name} ${formData.passengerDetails.surname}`}
                  </p>
                  {/* FIXME: 5 shows undefined */}
                  {Array.from({
                    length: formData.bookingDetails.total_passengers - 1,
                  }).map((_, i) => {
                    const num = i + 2;
                    return (
                      <p key={num} className="flex gap-1 items-center">
                        <span className="text-[#ACACAC]">
                          <UserIcon />
                        </span>
                        {`${
                          formData.passengerDetails[
                            `passenger${num}_first_name`
                          ]
                        } ${
                          formData.passengerDetails[`passenger${num}_surname`]
                        }`}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className=" border-t-2 mt-8 pt-3 space-y-1 text-xs md:text-sm ">
            <p>
              <span className="uppercase">Notice: </span> Each ticket cost{" "}
              {formatValue({ value: String(ticketCost), prefix: "₦" })}
            </p>
            <p>
              Abitto Ferry check-in counters open <b>1 hours</b> before
              departure.
            </p>
            <p>
              Ensure to arrive early to your Terminal as boarding starts{" "}
              <b>30 minutes</b> before your scheduled take off.
            </p>
            <p>
              <strong>
                This ticket is Non-refundable and cannot be rescheduled if
                scheduled time is missed.
              </strong>
            </p>
          </div>

          <Button
            // onClick={onlinePayment}
            onClick={fakeOnlinePayment}
            loading={loading}
            text={"Pay with paystack"}
            className="w-56 uppercase mt-10 mb-5 mx-auto"
          />
        </section>
      </div>
      <SuccessModal />
    </div>
  );
};

export default Payment;

const SuccessModal = () => {
  const {
    showModal,
    setShowModal,
    setActiveStep,
    setFormData,
    confirmedTicket,
    setChecked,
  } = React.useContext(BookingCTX);

  const handleOnClick = () => {
    setShowModal(false);
    setActiveStep(0);
    setFormData({
      bookingDetails: {},
      passengerDetails: {},
      seatDetails: {},
    });
    setChecked(false);
  };

  return (
    <>
      {showModal &&
        createPortal(
          <Modal
            open={showModal}
            aria-labelledby="payment-modal"
            sx={{ backdropFilter: "blur(1px)", zIndex: 1, paddingX: "5" }}
          >
            <div className="px-3">
              <div className="font-poppins mx-auto mt-32 py-10 px-5 md:p-16 w-full max-w-[450px] bg-white text-center flex flex-col rounded-lg">
                <div className="mx-auto w-fit">
                  <img
                    src={checkGIF}
                    alt="checkIcon"
                    width={200}
                    height={100}
                  />
                </div>
                <h2 className="font-semibold text-base md:text-lg text-[#454545] px-5 md:px-10 mb-5">
                  Your Ferry Seat has been successfully booked!
                </h2>
                <p className="font-normal text-xs text-[#454545] px-10 mb-5">
                  Please check your email for important ticket details.
                </p>
                <Link
                  target={"_blank"}
                  // to={`/ticket-invoice/${confirmedTicket._id}`}
                  to={`/ticket-invoice/${confirmedTicket.ticket_id}`}
                >
                  <Button
                    text={"Print Ticket"}
                    className="md:py-5 w-full mb-5"
                    onClick={handleOnClick}
                  />
                </Link>
                <Button
                  text={"Continue"}
                  variant="outline"
                  className=" md:py-5 "
                  onClick={handleOnClick}
                />
              </div>
            </div>
          </Modal>,
          document.body
        )}
    </>
  );
};

SuccessModal.propTypes = {
  onClick: PropTypes.func,
};
