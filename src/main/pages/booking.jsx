import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Helmet } from "react-helmet-async";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useStepper } from "@/hooks/useStepper";
import SeatSelection from "@/components/forms/SeatSelectionForm";
import CustomerDetails from "@/components/forms/CustomerDetailsForm";
import TravelDetails from "@/components/forms/TravelDetailsForm";
import PaymentForm from "@/components/forms/PaymentForm";

const Booking = () => {
  const { activeStep, onNextClick, onPrevClick } = useStepper();

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
      <div className="bg-hero-pattern h-screen min-h-[1500px] w-screen bg-cover bg-no-repeat bg-center relative">
        <div className="bg-black/40 w-full h-full absolute z-0 ">
          <div className="px-2 md:px-0 py-32 mx-auto ">
            <MaterialUIStepper />

            {activeStep === 0 ? (
              <TravelDetails />
            ) : activeStep === 1 ? (
              <CustomerDetails />
            ) : activeStep === 2 ? (
              <SeatSelection />
            ) : activeStep === 3 ? (
              <PaymentForm />
            ) : (
              ""
            )}
            <div className="flex gap-2 justify-center *:bg-blue-500 text-white mt-2 *:px-2">
              <button onClick={onPrevClick}>Prev</button>
              <button onClick={onNextClick}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Booking;

const MaterialUIStepper = () => {
  // const { activeStep, onNextClick, onPrevClick } = useStepper();
  const { activeStep } = useStepper();
  // const steps = Array.from({ length: 4 }, (_, i) => i);
  const steps = [
    "Trip Details",
    "Customer Details",
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
