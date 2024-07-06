import React from "react";
import Button from "@/components/custom/Button";
import checkGIF from "@/assets/check.gif";
import { GlobalCTX } from "@/contexts/GlobalContext";

const ScheduleSuccessModal = () => {
  const { unMountPortalModal } = React.useContext(GlobalCTX);
  return (
    <div className="w-96 px-5 pt-16 pb-10 rounded-lg bg-white flex flex-col items-center">
      <div className="w-36 h-36">
        <img src={checkGIF} alt="checkIcon" width={200} height={100} />
      </div>
      <h2 className="font-semibold text-lg mb-3">Update Successful</h2>
      <p className="text-gray-500 mb-10">
        You have successfully added a new trip schedule
      </p>
      <Button text="Continue" className="w-full" onClick={unMountPortalModal} />
    </div>
  );
};

export default ScheduleSuccessModal;
