import React from "react";
import PaystackPop from "@paystack/inline-js";
import axios from "axios";
import { BookingCTX } from "@/contexts/BookingContext";
import { toast } from "sonner";
import { GlobalCTX } from "@/contexts/GlobalContext";
import BookingSuccessModal from "@/components/modals/book.success";
import { v4 as uuid } from "uuid";
import { sampleSize } from "lodash";
import { RentalSuccessModal } from "@/components/modals/book.success";

export const usePayment = () => {
  const { formData, rentalData, selectedTrip } = React.useContext(BookingCTX);
  const { mountPortalModal, adminProfile, setLoading } =
    React.useContext(GlobalCTX);
  const { bookingDetails, passengerDetails, seatDetails, ticket_id } = formData;
  const total_ticket_cost =
    (Number(formData.bookingDetails.departure_ticket_cost) +
      Number(formData.bookingDetails?.return_ticket_cost ?? 0)) *
    Number(formData.bookingDetails.total_passengers);

  const randomSeats = (type) => {
    const availableSeats = selectedTrip[type]?.available_seats;
    return sampleSize(availableSeats, formData.bookingDetails.total_passengers);
  };
  const departure_seats =
    seatDetails?.departure_seats ?? randomSeats("departure");
  const return_seats = seatDetails?.return_seats ?? randomSeats("return");

  const onlinePayment = () => {
    const paystack = new PaystackPop();

    paystack.newTransaction({
      // key: "pk_live_297c0c356506ae67d9de7d6a51967914d9af9567",
      key: "pk_test_5d5cd21c077f1395d701366d2880665b3e9fb0f5",
      amount: total_ticket_cost * 100,
      email: formData.passengerDetails?.passenger1_email,
      firstname: formData.passengerDetails?.passenger1_first_name,
      lastname: formData.passengerDetails?.passenger1_surname,
      phone: formData.passengerDetails?.passenger1_phone_number,
      onSuccess(res) {
        handleOnlineRequest({
          status: "Success",
          trxRef: res.trxref,
        });
      },
      onCancel() {
        handleOnlineRequest({
          status: "Canceled",
          trxRef: "N/A",
        });
        toast.error("Transaction failed. Please try again.");
      },
    });
  };

  const handleOnlineRequest = (props) => {
    const requestData = {
      ...bookingDetails,
      ...passengerDetails,
      departure_seats,
      total_ticket_cost,
      ...(bookingDetails.trip_type == "Round Trip" && { return_seats }),
      ticket_id: `${ticket_id}${uuid().slice(0, 2)}`,
      ...props,
      medium: "Online",
      payment_method: "Paystack",
      booked_by: "Customer",
    };
    const isSuccess = props.status === "Success";

    if (isSuccess) setLoading(true);
    axios
      .post(
        "https://abitto-api.onrender.com/api/booking/newbooking",
        requestData
      )
      .then((res) => {
        if (res.status == 200 && isSuccess) {
          const ticket_id = res.data.booking.ticket_id;
          mountPortalModal(<BookingSuccessModal id={ticket_id} />);
        }
      })
      .catch((err) => {
        console.error(err, "Error occurred while sending new booking request.");
        // FIXME: FIX THIS LOGIC
        if (isSuccess) {
          document.getElementById("paystack_btn").disabled = true;
          toast.error(
            "Oops! Booking not confirmed. Please contact us to verify."
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const offlinePayment = (data) => {
    setLoading(true);
    const requestData = {
      ...bookingDetails,
      ...passengerDetails,
      departure_seats,
      ...(bookingDetails.trip_type == "Round Trip" && { return_seats }),
      ticket_id: `${ticket_id}${uuid().slice(0, 2)}`,
      total_ticket_cost,
      status: data.payment_status,
      payment_method: data.payment_method,
      medium: "Offline",
      trxRef: data.transaction_ref,
      booked_by: `${adminProfile.first_name}(${adminProfile.account_type})`,
    };

    axios
      .post(
        "https://abitto-api.onrender.com/api/booking/newbooking",
        requestData
      )
      .then((res) => {
        if (res.status == 200) {
          const ticket_id = res.data.booking.ticket_id;
          mountPortalModal(<BookingSuccessModal id={ticket_id} />);
        }
      })
      .catch((err) => {
        toast.error("Booking not confirmed. Please try again.");
        console.error(err, "Error occurred while sending new booking request.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onlineRentalPayment = () => {
    const paystack = new PaystackPop();

    paystack.newTransaction({
      // key: "pk_live_297c0c356506ae67d9de7d6a51967914d9af9567",
      key: "pk_test_5d5cd21c077f1395d701366d2880665b3e9fb0f5",
      amount: rentalData.total_cost * 100,
      email: rentalData.email,
      firstname: rentalData.first_name,
      lastname: rentalData.surname,
      phone: rentalData.phone_number,
      onSuccess(res) {
        handleOnlineRental({
          payment_status: "Success",
          trxRef: res.trxref,
        });
      },
      onCancel() {
        handleOnlineRental({
          payment_status: "Canceled",
          trxRef: "N/A",
        });
        toast.error("Transaction failed. Please try again.");
      },
    });
  };

  const handleOnlineRental = ({ payment_status, trxRef }) => {
    setLoading(true);
    const requestData = {
      ...rentalData,
      boat_id: "bt-54321",
      rental_status: "Upcoming",
      payment_method: "Paystack",
      payment_medium: "Online",
      paid_by: "Customer",
      payment_status,
      trxRef,
    };

    const isSuccess = payment_status === "Success";

    axios
      .post("https://abitto-api.onrender.com/api/rent/createrent", requestData)
      .then((res) => {
        if (res.status == 200 && isSuccess) {
          const ticket_id = res.data.rent.ticket_id;
          mountPortalModal(<RentalSuccessModal id={ticket_id} />);
        }
      })
      .catch((err) => {
        console.error(err, "Error occurred while sending new rental request.");
        if (isSuccess) {
          document.getElementById("rental_payment_btn").disabled = true;
          toast.error(
            "Oops! Rental not confirmed. Please contact us to verify."
          );
        }
      })
      .finally(() => setLoading(false));
  };

  const offlineRentalPayment = (data) => {
    const { payment_status, transaction_ref, payment_method } = data;

    setLoading(true);
    const requestData = {
      ...rentalData,
      boat_id: "bt-54321",
      rental_status: "Upcoming",
      payment_medium: "Offline",
      paid_by: `${adminProfile.first_name}(${adminProfile.account_type})`,
      payment_status,
      payment_method,
      trxRef: transaction_ref,
    };

    axios
      .post("https://abitto-api.onrender.com/api/rent/createrent", requestData)
      .then((res) => {
        if (res.status == 200) {
          const ticket_id = res.data.rent.ticket_id;
          mountPortalModal(<RentalSuccessModal id={ticket_id} />);
        }
      })
      .catch((err) => {
        console.error(err, "Error rental");
        toast.error("Error");
      })
      .finally(() => setLoading(false));
  };

  return {
    onlinePayment,
    offlinePayment,
    onlineRentalPayment,
    offlineRentalPayment,
  };
};
