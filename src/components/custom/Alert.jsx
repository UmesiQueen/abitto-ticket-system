import React from "react";
import { GlobalCTX } from "@/hooks/GlobalContext";
import Alert from "@mui/material/Alert";

const Alert_ = () => {
  const {
    alert: { state, variant = "warning" },
  } = React.useContext(GlobalCTX);

  const variantOptions = {
    error: {
      severity: "error",
      borderColor: "#5d0303",
      backgroundColor: "#ff000080",
      text: "Request failed. Please try again later.",
    },
    cancel: {
      severity: "error",
      borderColor: "#5d0303",
      backgroundColor: "#ff000080",
      text: "Booking Canceled. Retry Payment.",
    },
    invalid: {
      severity: "error",
      borderColor: "#5d0303",
      backgroundColor: "#ff000080",
      text: "Incorrect email or password.",
    },
    success: {
      severity: "success",
      borderColor: "#5E7B24",
      backgroundColor: "#85AD33",
      text: "Request sent successfully.",
    },
    info: {
      severity: "info",
      borderColor: "#244891",
      backgroundColor: "#3366CC83",
      text: "Please a book a ticket to view summary.",
    },
    warning: {
      severity: "warning",
      borderColor: "#ff4500",
      backgroundColor: "#ff45009e",
      text: "Unable to handle request. Please try again later.",
    },
  };

  return (
    <>
      {state && (
        <div className="fixed top-20  w-fit left-0 right-0 mx-auto z-[4] ">
          <Alert
            variant="outlined"
            className=" backdrop-blur"
            sx={{
              color: "#fff",
              borderColor: variantOptions[variant]?.borderColor,
              borderWidth: "2px",
              backgroundColor: variantOptions[variant]?.backgroundColor,
              "& .MuiAlert-icon": { color: "#fff" },
            }}
            severity={variantOptions[variant]?.severity}
          >
            {variantOptions[variant]?.text}
          </Alert>
        </div>
      )}
    </>
  );
};

export default Alert_;
