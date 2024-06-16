import React from "react";
import { createPortal } from "react-dom";
// import SeatSelection from "../modals/seat-selection.modal";
import { CancelSquareIcon } from "@/assets/icons";
import { GlobalCTX } from "@/hooks/GlobalContext";
import Modal from "@mui/material/Modal";
// import PropTypes from "prop-types";
import SeatSelection from "../modals/seat-selection.modal";

const Overlays = () => {
  const { showModal, toggleModal } = React.useContext(GlobalCTX);

  return (
    <>
      {createPortal(
        <>
          {showModal && (
            <Modal
              open={showModal}
              aria-labelledby="overlay-modal"
              sx={{ backdropFilter: "blur(1px)", zIndex: 3 }}
            >
              <div className="pt-10 flex items-center justify-center h-full">
                <div className="relative">
                  <button
                    onClick={toggleModal}
                    className=" hover:scale-[.9] rounded-lg transition duration-150 ease-in-out bg-white  absolute md:-right-10 right-0 -top-10 md:-top-5 "
                  >
                    <CancelSquareIcon />
                  </button>
                  <SeatSelection />
                  {/* {children} */}
                </div>
              </div>
            </Modal>
          )}
        </>,
        document.body
      )}
    </>
  );
};

export default Overlays;

// Overlays.propTypes = {
//   children: PropTypes.node,
// };
