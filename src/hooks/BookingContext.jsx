import React from "react";
import PropTypes from "prop-types";

export const BookingCTX = React.createContext();

const BookingContext = ({ children }) => {
  const [formData, setFormData] = React.useState([]);
  const [paymentStatus, setPaymentStatus] = React.useState({
    requestState: "",
    status: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [confirmedTicket, setConfirmedTicket] = React.useState();

  const ctxValue = {
    formData,
    setFormData,
    paymentStatus,
    setPaymentStatus,
    loading,
    setLoading,
    confirmedTicket,
    setConfirmedTicket,
  };

  return <BookingCTX.Provider value={ctxValue}>{children}</BookingCTX.Provider>;
};

BookingContext.propTypes = {
  children: PropTypes.node,
};

export default BookingContext;
