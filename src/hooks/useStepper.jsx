import React from "react";
import { BookingCTX } from "./BookingContext";

export const useStepper = () => {
  const { activeStep, setActiveStep } = React.useContext(BookingCTX);

  const onNextClick = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const onPrevClick = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return { onPrevClick, onNextClick, activeStep, handleReset };
};
