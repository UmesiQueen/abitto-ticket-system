// import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Helmet } from "react-helmet-async";
import { Outlet, useLocation, matchPath } from "react-router-dom";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";


const Booking = () => {
  return (
    <>
      <Helmet>
        <title>Booking | Abitto Ferry</title>
      </Helmet>
      <div className="px-2 py-32 mx-auto relative ">
        <MaterialUIStepper />
        <Box
          sx={{
            maxWidth: "1000px",
            width: "100%",
            marginX: "auto",
          }}
        >
          <Outlet />
        </Box>
      </div>
    </>
  );
};

export default Booking;

const MaterialUIStepper = () => {
  const location = useLocation();

  // Define the base paths (without dynamic params)
  const stepMap = ['/booking', '/booking/available-trips', '/booking/passenger-details', '/booking/payment'];

  // Determine which path matches and find the step index
  const currentStep = stepMap.findIndex((path) =>
    matchPath(path, location.pathname)
  );

  // Fallback to step 0 if no match is found
  const activeStep = currentStep !== -1 ? currentStep : 0;

  const steps = [
    "Trip Details",
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
