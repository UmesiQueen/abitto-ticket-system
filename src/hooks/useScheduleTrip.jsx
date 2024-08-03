import React from "react";
import axios from "axios";
import { toast } from "sonner";
import SuccessModal from "@/components/modals/success";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";

export const useScheduleTrip = () => {
  const { unMountPortalModal, setModalContent } = React.useContext(GlobalCTX);
  const { setLoading } = React.useContext(BookingCTX);

  const scheduleRequest = (handleReset, formValues) => {
    setLoading(true);

    axios
      .post("https://abitto-api.onrender.com/api/ticket/create", formValues)
      .then((res) => {
        if (res.status == 200) {
          setModalContent(
            <SuccessModal
              header="Creation Successful"
              text="You have successfully added a new trip schedule."
            />
          );
          handleReset();
        }
      })
      .catch((err) => {
        console.error(err, "Error occurred while scheduling trip.");
        toast.error("Failed to create new trip. Please try again.");
        unMountPortalModal();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const rescheduleRequest = (formValues) => {
    setLoading(true);
    axios
      .post("https://abitto-api.onrender.com/api/ticket/update", formValues)
      .then((res) => {
        if (res.status == 200) {
          setModalContent(
            <SuccessModal
              header="Update Successful"
              text="You have successfully rescheduled this trip."
            />
          );
        }
      })
      .catch((err) => {
        console.error(err, "Error occurred while rescheduling trip.");
        toast.error("Failed to reschedule trip. Please try again.");
        unMountPortalModal();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const cancelRequest = (formValues) => {
    setLoading(true);
    axios
      .post("https://abitto-api.onrender.com/api/ticket/update", formValues)
      .then((res) => {
        if (res.status == 200) {
          console.log(res.data, "cancelation");
          setModalContent(
            <SuccessModal
              header="Cancelation Successful"
              text="You have successfully cancelled this trip."
            />
          );
        }
      })
      .catch((err) => {
        console.error(err, "Error occurred while cancelling trip.");
        toast.error("Failed to cancel trip. Please try again.");
        unMountPortalModal();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { scheduleRequest, rescheduleRequest, cancelRequest };
};
