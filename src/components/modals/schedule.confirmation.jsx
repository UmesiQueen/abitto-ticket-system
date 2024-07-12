/* eslint-disable react/prop-types */
import React from "react";
import { Warning2 } from "iconsax-react";
import Button from "@/components/custom/Button";
import { GlobalCTX } from "@/contexts/GlobalContext";
import ScheduleSuccessModal from "@/components/modals/schedule.success";
import axios from "axios";
import { toast } from "sonner";

const ScheduleConfirmationModal = ({ props: { handleReset, formValues } }) => {
  const { unMountPortalModal, setModalContent } = React.useContext(GlobalCTX);
  const [loading, setLoading] = React.useState(false);

  const makeScheduleRequest = () => {
    setLoading(true);

    axios
      .post("https://abitto-api.onrender.com/api/ticket/create", formValues[0])
      .then((res) => {
        if (res.status == 200) {
          setModalContent(<ScheduleSuccessModal />);
          handleReset();
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error occurred. Please try again.");
        unMountPortalModal();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-96 px-5 py-10 rounded-lg bg-white space-y-5">
      <h2 className="font-semibold text-center">
        Are you sure you want to add this changes?
      </h2>
      <div className="bg-orange-50 text-orange-500 p-3 text-sm inline-flex gap-1">
        <Warning2 />
        <p>
          Whatever changes you make{" "}
          <strong> will reflect across the entire platform</strong>.
        </p>
      </div>

      <div className="flex gap-5 justify-between !mt-10">
        <Button
          text="Cancel"
          variant="outline"
          className="w-56"
          onClick={unMountPortalModal}
        />
        <Button
          text="Save Changes"
          className="w-56"
          loading={loading}
          onClick={makeScheduleRequest}
        />
      </div>
    </div>
  );
};

export default ScheduleConfirmationModal;
