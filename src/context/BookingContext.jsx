import React from "react";
import PropTypes from "prop-types";

export const BookingCTX = React.createContext();

const BookingContext = ({ children }) => {
  const [formData, setFormData] = React.useState("");

  React.useEffect(() => {
    console.log(formData, ">>> form data");
  }, [formData]);

  return (
    <BookingCTX.Provider value={{ formData, setFormData }}>
      {children}
    </BookingCTX.Provider>
  );
};

BookingContext.propTypes = {
  children: PropTypes.node,
};

export default BookingContext;
