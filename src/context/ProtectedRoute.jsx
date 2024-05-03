import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { BookingCTX } from "./BookingContext";

const ProtectedRoute = ({ children }) => {
  const { formData, setAlert } = React.useContext(BookingCTX);

  const toggleAlert = () => {
    setAlert(true);

    setTimeout(() => {
      setAlert(false);
    }, 5000);
  };

  if (!formData?.ticketId) {
    toggleAlert();
    return <Navigate to="/booking" />;
  }
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoute;
