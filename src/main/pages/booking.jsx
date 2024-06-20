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
      <div className="bg-hero-pattern h-screen min-h-[1200px] w-screen bg-cover bg-no-repeat bg-center relative ">
        <div className="bg-black/40 w-full h-full absolute z-0 ">
          <div className="px-5 md:px-0 pt-32 mx-auto pb-10 md:pb-0">
            <MaterialUIStepper />
            <div className="flex justify-center gap-3 mb-3 *:bg-blue-50 *:px-2">
              <button onClick={onPrevClick}>Prev</button>
              <button onClick={onNextClick}>Next</button>
            </div>

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
  const steps = Array.from({ length: 4 }, (_, i) => i);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "300px",
        marginX: "auto",
        marginBottom: "40px",
      }}
    >
      <Stepper activeStep={activeStep}>
        {steps.map((label) => {
          return (
            <Step key={label}>
              <StepLabel
                sx={{ "& .MuiStepLabel-iconContainer": { padding: "0" } }}
              />
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};
