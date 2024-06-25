import React from "react";
import PaystackPop from "@paystack/inline-js";
import axios from "axios";
import { BookingCTX } from "@/contexts/BookingContext";
import { toast } from "sonner";

export const usePayment = () => {
  const { formData, setLoading, setConfirmedTicket, setShowModal } =
    React.useContext(BookingCTX);

  const onlinePayment = () => {
    const paystack = new PaystackPop();

    paystack.newTransaction({
      key: "pk_live_297c0c356506ae67d9de7d6a51967914d9af9567",
      // key: "pk_test_5d5cd21c077f1395d701366d2880665b3e9fb0f5",
      amount: formData?.amount * 100,
      email: formData?.email,
      firstname: formData?.first_name,
      lastname: formData?.surname,
      phone: formData?.phone_number,
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

    axios
      .post("https://abitto-api.onrender.com/api/booking/new", {
        ...formData,
        ...props,
        medium: "Online",
        paid_with: "Paystack",
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

  return { onlinePayment };
};
