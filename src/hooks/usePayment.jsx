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
      // key: "pk_live_297c0c356506ae67d9de7d6a51967914d9af9567",
      key: "pk_test_5d5cd21c077f1395d701366d2880665b3e9fb0f5",
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
        // handleFakeBooking({
        //   status: "Success",
        //   trxRef: res.trxref,
        // });
      },
      onCancel() {
        handleOnlineBooking({
          status: "Canceled",
        });
        // handleFakeBooking({
        //   status: "Canceled",
        // });
      },
    });
  };

  // const handleFakeBooking = (props) => {
  //   handleOnlineRequest(props.status, formDataDemo);
  // };

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

// const formDataDemo = {
//   _id: "665a5714d2f76d6fc3d61830",
//   paid_with: "Cash",
//   amount: 102000,
//   total_passengers: 3,
//   trxRef: null,
//   status: "Pending",
//   medium: "Offline",
//   ticket_id: "f624cd",
//   seat_no: ["1", "2", "3", "4", "5", "6"],
//   trip_type: "Round Trip",
//   travel_from: "Marina, Calabar",
//   travel_to: "Nwaniba Timber Beach, Uyo",
//   departure_date:
//     "Fri Jun 14 2024 00:00:00 GMT+0100 (West Africa Standard Time)",
//   departure_time: "10:30 AM",
//   return_date: "2024-06-11T23:00:00.000Z",
//   return_time: "05:00 PM",
//   children_number: 1,
//   adults_number: 2,
//   first_name: "Engr",
//   surname: "Umesi",
//   email: "queenumesi01@gmail.com",
//   phone_number: 8083931561,
//   created_at: "2024-05-31T23:02:44.085Z",
//   __v: 0,
// };
