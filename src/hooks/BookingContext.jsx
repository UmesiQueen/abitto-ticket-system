import React from "react";
import PropTypes from "prop-types";

export const BookingCTX = React.createContext();
const formDataDemo = {
  _id: "665a5714d2f76d6fc3d61830",
  paid_with: "Cash",
  amount: 102000,
  total_passengers: 6,
  trxRef: null,
  status: "Pending",
  medium: "Offline",
  ticket_id: "f624cd",
  seat_no: ["1", "2", "3", "4", "5", "6"],
  trip_type: "Round Trip",
  travel_from: "Marina, Calabar",
  travel_to: "Nwaniba Timber Beach, Uyo",
  departure_date:
    "Fri Jun 14 2024 00:00:00 GMT+0100 (West Africa Standard Time)",
  departure_time: "10:30 AM",
  return_date: "2024-06-11T23:00:00.000Z",
  return_time: "05:00 PM",
  children_number: 4,
  adults_number: 2,
  first_name: "Engr",
  surname: "Umesi",
  email: "queenumesi01@gmail.com",
  phone_number: 8083931561,
  created_at: "2024-05-31T23:02:44.085Z",
  __v: 0,
};

const BookingContext = ({ children }) => {
  // const store = localStorage.getItem("formData") ?? [];
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState(formDataDemo);
  const [paymentStatus, setPaymentStatus] = React.useState({
    requestState: "",
    status: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [confirmedTicket, setConfirmedTicket] = React.useState();
  const ticketCost = 8800;

  React.useEffect(() => {
    localStorage.setItem("formData", formData);
  }, [formData]);

  const ctxValue = {
    formData,
    setFormData,
    paymentStatus,
    setPaymentStatus,
    loading,
    setLoading,
    confirmedTicket,
    setConfirmedTicket,
    ticketCost,
    activeStep,
    setActiveStep,
  };

  return <BookingCTX.Provider value={ctxValue}>{children}</BookingCTX.Provider>;
};

BookingContext.propTypes = {
  children: PropTypes.node,
};

export default BookingContext;
