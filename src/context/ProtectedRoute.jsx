import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { BookingCTX } from "./BookingContext";
import { GlobalCTX } from "./GlobalContext";

const ProtectedRoute = ({ children }) => {
  const { formData } = React.useContext(BookingCTX);
  const { handleAlert } = React.useContext(GlobalCTX);

  if (!formData?.ticket_id) {
    handleAlert("warning");
    return <Navigate to="/booking" />;
  }
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoute;
