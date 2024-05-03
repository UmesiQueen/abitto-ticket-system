import React from "react";
import PropTypes from "prop-types";

export const BookingCTX = React.createContext();

const BookingContext = ({ children }) => {
  const [formData, setFormData] = React.useState("");
  const [alert, setAlert] = React.useState(false);

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
