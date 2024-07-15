import React from "react";
import PaystackPop from "@paystack/inline-js";
import axios from "axios";
import { BookingCTX } from "@/contexts/BookingContext";
import { toast } from "sonner";
import { GlobalCTX } from "@/contexts/GlobalContext";
import BookingSuccessModal from "@/components/modals/book.success";

export const usePayment = () => {
  const { formData } = React.useContext(BookingCTX);
  const { mountPortalModal, isAuth, setLoading } = React.useContext(GlobalCTX);
  const { bookingDetails, passengerDetails, seatDetails } = formData;
  const total_ticket_cost =
    (Number(formData.bookingDetails.departure_ticket_cost) +
      Number(formData.bookingDetails?.return_ticket_cost ?? 0)) *
    Number(formData.bookingDetails.total_passengers);

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
      ...seatDetails,
      ...props,
      medium: "Online",
      payment_method: "Paystack",
      booked_by: "Customer",
    };
    const isSuccess = props.status === "Success";

    if (isSuccess) setLoading(true);
    // TODO: When ticket is already logged but user wishes to retry the transaction
    // issue: ticket_id remains the same.
    axios
      .post(
        "https://abitto-api.onrender.com/api/booking/newbooking",
        requestData
      )
      .then((res) => {
        if (res.status === 200 && isSuccess) {
          mountPortalModal(<BookingSuccessModal />);
        }
      })
      .catch((err) => {
        console.error(err);
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

  const OfflinePayment = (data) => {
    setLoading(true);
    const requestData = {
      ...bookingDetails,
      ...passengerDetails,
      ...seatDetails,
      total_ticket_cost,
      status: data.payment_status,
      payment_method: data.payment_method,
      medium: "Offline",
      trxRef: data.transaction_ref,
      booked_by: `${isAuth.first_name}/${isAuth.account_type}`,
    };

    axios
      .post(
        "https://abitto-api.onrender.com/api/booking/newbooking",
        requestData
      )
      .then((res) => {
        if (res.status == 200) {
          mountPortalModal(<BookingSuccessModal />);
        }
      })
      .catch((err) => {
        toast.error("Booking not confirmed. Please try again.");
        console.error(err, "Error occurred while making new booking request.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { onlinePayment, OfflinePayment };
};
