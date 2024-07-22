import React from "react";
import { Link } from "react-router-dom";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import Button from "@/components/custom/Button";
import checkGIF from "@/assets/check.gif";

const BookingSuccessModal = () => {
  const { formData, handleReset } = React.useContext(BookingCTX);
  const { unMountPortalModal } = React.useContext(GlobalCTX);

  const reset = () => {
    unMountPortalModal();
    handleReset();
  };

  return (
    <div className="font-poppins mx-auto py-10 px-5 md:p-16 w-full max-w-[450px] bg-white text-center flex flex-col rounded-lg">
      <div className="mx-auto w-fit">
        <img src={checkGIF} alt="checkIcon" width={200} height={100} />
      </div>
      <h2 className="font-semibold text-base md:text-lg text-[#454545] px-5 md:px-10 mb-5">
        Your Ferry Seat has been successfully booked!
      </h2>
      <p className="font-normal text-xs text-[#454545] px-10 mb-5">
        Please check your email for important ticket details.
      </p>
      <Link target={"_blank"} to={`/ticket-invoice/${formData.ticket_id}`}>
        <Button
          text={"Print Ticket"}
          className="md:py-5 w-full mb-5"
          onClick={reset}
        />
      </Link>
      <Button
        text={"Continue"}
        variant="outline"
        className=" md:py-5 "
        onClick={reset}
      />
    </div>
  );
};

export default BookingSuccessModal;
