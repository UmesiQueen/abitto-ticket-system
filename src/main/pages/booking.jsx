import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Helmet } from "react-helmet-async";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useStepper } from "@/hooks/useStepper";
import SeatSelection from "@/components/SeatSelection";
import PassengerDetails from "@/components/PassengerDetailsForm";
import BookingDetails from "@/components/BookingDetailsForm";
import Payment from "@/components/Payment";

const Booking = () => {
  // const { activeStep, onNextClick, onPrevClick } = useStepper();
  const { activeStep } = useStepper();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [activeStep]);

  return (
    <>
      <Helmet>
        <title>Booking | Abitto Ferry</title>
      </Helmet>
      <div className="bg-hero-pattern min-h-screen w-screen bg-cover bg-no-repeat bg-center relative">
        <div className="bg-black/40 w-full h-full absolute" />

        <div className="px-2 md:px-0 py-32 mx-auto relative ">
          <MaterialUIStepper />
          {activeStep === 0 ? (
            <BookingDetails />
          ) : activeStep === 1 ? (
            <PassengerDetails />
          ) : activeStep === 2 ? (
            <SeatSelection />
          ) : activeStep === 3 ? (
            <Payment />
          ) : (
            ""
          )}
          {/* <div className="flex gap-2 justify-center *:bg-blue-500 text-white mt-2 *:px-2">
                <button onClick={onPrevClick}>Prev</button>
                <button onClick={onNextClick}>Next</button>
              </div> */}
        </div>
      </div>
    </>
  );
};

export default Booking;

const MaterialUIStepper = () => {
  const { activeStep } = useStepper();
  const steps = [
    "Booking Details",
    "Passenger Details",
    "Seat Selection",
    "Payment",
  ];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "600px",
        marginX: "auto",
        marginBottom: "40px",
      }}
    >
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => {
          return (
            <Step key={label}>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": {
                    color: "white",
                    fontWeight: "500",
                    fontFamily: "Poppins, sans-serif",
                  },
                  "& .MuiStepLabel-label.Mui-active, & .MuiStepLabel-label.Mui-completed":
                    {
                      color: "rgba(250,250,250, 0.7) !important",
                      fontWeight: 400,
                    },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};
