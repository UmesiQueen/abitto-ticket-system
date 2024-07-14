// import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Helmet } from "react-helmet-async";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useStepper } from "@/hooks/useStepper";
import PassengerDetails from "@/components/PassengerDetails";
import BookingDetails from "@/components/BookingDetails";
import Payment from "@/components/Payment";
import SearchTrip from "@/components/SearchTrip";

const Booking = () => {
  // const { activeStep, onNextClick, onPrevClick } = useStepper();
  const { activeStep } = useStepper();

  return (
    <>
      <Helmet>
        <title>Booking | Abitto Ferry</title>
      </Helmet>
      <div>
        <div className="px-2 py-32 mx-auto relative ">
          <MaterialUIStepper />
          <Box
            sx={{
              maxWidth: "1000px",
              width: "100%",
              marginX: "auto",
            }}
          >
            {activeStep === 0 ? (
              <BookingDetails />
            ) : activeStep === 1 ? (
              <SearchTrip />
            ) : activeStep === 2 ? (
              <PassengerDetails />
            ) : activeStep === 3 ? (
              <Payment />
            ) : (
              ""
            )}
          </Box>

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
    "Available Trips",
    "Passenger Details",
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
            <Step
              key={label}
              sx={{
                "& .MuiStepConnector-root .MuiStepConnector-line": {
                  borderColor: "#243244",
                  borderTopWidth: "2px",
                },
                "& .MuiSvgIcon-root.MuiStepIcon-root": {
                  color: "#243244",
                },
                "& .MuiSvgIcon-root.MuiStepIcon-root.Mui-completed, & .MuiSvgIcon-root.MuiStepIcon-root.Mui-active":
                  {
                    color: "#3366CC",
                  },
              }}
            >
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": {
                    fontWeight: 400,
                    fontFamily: "Poppins, sans-serif",
                  },
                  "& .MuiStepLabel-label.Mui-active": {
                    color: "#243244",
                    fontWeight: "600",
                  },
                  "& .MuiStepLabel-label.Mui-completed": {
                    color: "#ACACAC !important",
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
