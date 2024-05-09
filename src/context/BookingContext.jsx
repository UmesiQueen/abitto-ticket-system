import React from "react";
import PropTypes from "prop-types";

export const BookingCTX = React.createContext();

const BookingContext = ({ children }) => {
  const store = JSON.parse(localStorage.getItem("booking-details")) || {};
  const [formData, setFormData] = React.useState(store);
  const [alert, setAlert] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem("booking-details", JSON.stringify(formData));
  }, [formData]);

  return (
    <BookingCTX.Provider value={{ formData, setFormData, alert, setAlert }}>
      {children}
    </BookingCTX.Provider>
  );
};

BookingContext.propTypes = {
  children: PropTypes.node,
};

export default BookingContext;
