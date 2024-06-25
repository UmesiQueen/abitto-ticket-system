import React from "react";
import PropTypes from "prop-types";

export const BookingCTX = React.createContext();

const BookingContext = ({ children }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const ticketStore = JSON.parse(localStorage.getItem("ticket")) ?? null;
  const [confirmedTicket, setConfirmedTicket] = React.useState(ticketStore);
  const [showModal, setShowModal] = React.useState(false);
  const [seatSelected, setSeatSelected] = React.useState({
    departure: formData?.departure_seat ?? [],
    return: formData?.return_seat ?? [],
  });
  const [isChecked, setChecked] = React.useState(false);
  const ticketCost = 8800;

  React.useEffect(() => {
    if (confirmedTicket)
      localStorage.setItem("ticket", JSON.stringify(confirmedTicket));
  }, [confirmedTicket]);

  React.useEffect(() => {
    console.log(formData, "formData");
  }, [formData]);

  const ctxValue = {
    formData,
    setFormData,
    loading,
    setLoading,
    confirmedTicket,
    setConfirmedTicket,
    ticketCost,
    activeStep,
    setActiveStep,
    showModal,
    setShowModal,
    seatSelected,
    setSeatSelected,
    isChecked,
    setChecked,
  };

  return <BookingCTX.Provider value={ctxValue}>{children}</BookingCTX.Provider>;
};

BookingContext.propTypes = {
  children: PropTypes.node,
};

export default BookingContext;

// const formDataDemo = {
//   _id: "665a5714d2f76d6fc3d61830",
//   paid_with: "Cash",
//   amount: 102000,
//   total_passengers: 3,
//   trxRef: null,
//   status: "Pending",
//   medium: "Offline",
//   ticket_id: "f624cd",
//   seat_no: ["1", "2", "3"],
//   departure_seat: ["2D", "4D", "5D"],
//   return_seat: [],
//   trip_type: "One-Way Trip",
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
