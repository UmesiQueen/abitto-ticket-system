import React from "react";
import PropTypes from "prop-types";

export const BookingCTX = React.createContext();

const BookingContext = ({ children }) => {
  const [formData, setFormData] = React.useState([]);
  const [paymentState, setPaymentState] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  return (
    <BookingCTX.Provider
      value={{
        formData,
        setFormData,
        paymentState,
        setPaymentState,
        loading,
        setLoading,
      }}
    >
      {children}
    </BookingCTX.Provider>
  );
};

BookingContext.propTypes = {
  children: PropTypes.node,
};

export default BookingContext;
