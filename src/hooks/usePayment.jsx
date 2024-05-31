import React from "react";
import PaystackPop from "@paystack/inline-js";
import axios from "axios";
import { BookingCTX } from "@/hooks/BookingContext";
import { GlobalCTX } from "@/hooks/GlobalContext";

export const usePayment = () => {
  const { handleAlert } = React.useContext(GlobalCTX);
  const { formData, setPaymentState, setLoading } =
    React.useContext(BookingCTX);

  const onlinePayment = () => {
    const paystack = new PaystackPop();

    paystack.newTransaction({
      key: "pk_live_297c0c356506ae67d9de7d6a51967914d9af9567",
      amount: formData?.amount * 100,
      email: formData?.email,
      firstname: formData?.first_name,
      onSuccess(res) {
        requestBooking({
          status: "Success",
          trxRef: res.trxref,
          medium: "Online",
          paid_with: "Paystack",
        });
      },
      onCancel() {
        requestBooking({
          status: "Cancelled",
          trxRef: null,
          medium: "Online",
          paid_with: "Paystack",
        });
      },
    });
  };

  const offlinePayment = () => {
    setTimeout(() => {
      requestBooking({
        status: "Pending",
        trxRef: null,
        medium: "Offline",
        paid_with: "Cash",
      });
    }, 1500);
  };

  const requestBooking = (props) => {
    setLoading(true);
    axios
      .post("https://abitto-api.onrender.com/api/booking/new", {
        ...formData,
        ...props,
      })
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          setPaymentState(true);
        }
      })
      .catch(() => {
        setLoading(false);
        handleAlert("error");
        setPaymentState(false);
      });
  };

  return { onlinePayment, offlinePayment };
};
