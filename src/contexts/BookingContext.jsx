import React from "react";
import PropTypes from "prop-types";

export const BookingCTX = React.createContext();

const BookingContext = ({ children }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    bookingDetails: {},
    passengerDetails: {},
    seatDetails: {},
  });
  const [loading, setLoading] = React.useState(false);
  const [seatSelected, setSeatSelected] = React.useState({
    departure: [],
    return: [],
  });
  const [availableTrips, setAvailableTrips] = React.useState({
    departure_trip: [],
    return_trip: [],
  });
  const [selectedTrip, setSelectedTrip] = React.useState({
    departure: {},
    return: {},
  });
  const [isChecked, setChecked] = React.useState(false);
  const [searchParams, setSearchParams] = React.useState({});
  const [tripDetails, setTripDetails] = React.useState();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [activeStep]);

  React.useEffect(() => {
    if (Object.keys(formData.seatDetails).length) {
      setSeatSelected({
        departure: [],
        return: [],
      });
      setFormData((prev) => ({
        ...prev,
        seatDetails: {},
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.bookingDetails?.total_passengers]);

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      bookingDetails: {},
      passengerDetails: {},
      seatDetails: {},
    });
    setSeatSelected({
      departure: [],
      return: [],
    });
    setAvailableTrips({
      departure_trip: [],
      return_trip: [],
    });
    setSelectedTrip({
      departure: {},
      return: {},
    });
    setChecked(false);
  };

  const ctxValue = {
    formData,
    setFormData,
    loading,
    setLoading,
    activeStep,
    setActiveStep,
    seatSelected,
    setSeatSelected,
    isChecked,
    setChecked,
    handleReset,
    searchParams,
    setSearchParams,
    availableTrips,
    setAvailableTrips,
    selectedTrip,
    setSelectedTrip,
    tripDetails,
    setTripDetails,
  };

  return <BookingCTX.Provider value={ctxValue}>{children}</BookingCTX.Provider>;
};

BookingContext.propTypes = {
  children: PropTypes.node,
};

export default BookingContext;
