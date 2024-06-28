import React from "react";
import PaystackPop from "@paystack/inline-js";
import axios from "axios";
import { BookingCTX } from "@/contexts/BookingContext";
import { toast } from "sonner";

export const usePayment = () => {
  const {
    formData,
    setLoading,
    setConfirmedTicket,
    setShowModal,
    ticketCost,
    handleReset,
  } = React.useContext(BookingCTX);

  const onlinePayment = () => {
    const paystack = new PaystackPop();

    paystack.newTransaction({
      key: "pk_live_297c0c356506ae67d9de7d6a51967914d9af9567",
      // key: "pk_test_5d5cd21c077f1395d701366d2880665b3e9fb0f5",
      amount: formData.bookingDetails?.amount * 100,
      email: formData.passengerDetails?.email,
      firstname: formData.passengerDetails?.first_name,
      lastname: formData.passengerDetails?.surname,
      phone: formData.passengerDetails?.phone_number,
      onSuccess(res) {
        handleOnlineBooking({
          status: "Success",
          trxRef: res.trxref,
        });
      },
      onCancel() {
        handleOnlineBooking({
          status: "Canceled",
        });
      },
    });
  };

  const handleOnlineBooking = (props) => {
    setLoading(true);
    // const BASE_URL = import.meta.env.DEV  ?
    //    import.meta.env.VITE_ABITTO_BASE_URL
    //   : import.meta.env.ABITTO_BASE_URL;
    const { ticket_id, bookingDetails, passengerDetails, seatDetails } =
      formData;

    axios
      .post("https://abitto-api.onrender.com/api/booking/new", {
        ticket_id,
        medium: "Online",
        paid_with: "Paystack",
        ...props,
        ...bookingDetails,
        ...passengerDetails,
        ...seatDetails,
      })
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          handleOnlineRequest(props.status, res.data.booking);
        }
      })
      .catch(() => {
        setLoading(false);
        handleBadRequest();
      });
  };

  const handleOnlineRequest = (status, resData) => {
    if (status === "Success") {
      setConfirmedTicket(resData);
      setShowModal(true);
    }

    if (status === "Canceled") {
      toast.error("Transaction Canceled. Retry Payment.");
    }
  };

  const handleBadRequest = () => {
    toast.error("Request failed. Please try again later.");
  };

  const testOnlinePayment = () => {
    const { ticket_id, bookingDetails, passengerDetails, seatDetails } =
      formData;
    const requestData = {
      ticket_id,
      ...bookingDetails,
      ...passengerDetails,
      ...seatDetails,
      medium: "Online",
      paid_with: "Paystack",
      status: "Success",
    };

    const paystack = new PaystackPop();

    paystack.newTransaction({
      key: "pk_test_5d5cd21c077f1395d701366d2880665b3e9fb0f5",
      amount: formData.bookingDetails?.amount * 100,
      email: formData.passengerDetails?.email,
      firstname: formData.passengerDetails?.first_name,
      lastname: formData.passengerDetails?.surname,
      phone: formData.passengerDetails?.phone_number,
      onSuccess(res) {
        setConfirmedTicket({ trxRef: res.trxref, ...requestData });
        setShowModal(true);
      },
      onCancel() {
        toast.error("Transaction failed. Please try again.");
      },
    });
  };

  const testOfflinePayment = (data) => {
    setLoading(true);
    const { bookingDetails, passengerDetails, seatDetails } = formData;
    const requestData = {
      ticket_id: formData.ticket_id,
      ...bookingDetails,
      ...passengerDetails,
      ...seatDetails,
      status: data.payment_status,
      paid_with: data.payment_method,
      trxRef: data.transaction_ref,
      medium: "Offline",
      booked_by: "Queen",
      ticket_price: ticketCost,
    };

    const status = data.payment_status;

    setTimeout(() => {
      // setConfirmedTicket(requestData);
      console.log(requestData, "test booking");
      status === "Success"
        ? toast.success("Booking successful.")
        : status === "Pending"
        ? toast.warning("Booking Pending.")
        : status === "Canceled"
        ? toast.error("Booking Canceled.")
        : null;
      handleReset();
      setLoading(false);
    }, 1000);
  };

  return { onlinePayment, testOnlinePayment, testOfflinePayment };
};
