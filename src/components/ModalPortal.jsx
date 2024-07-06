import React from "react";
import { createPortal } from "react-dom";
import Modal from "@mui/material/Modal";
import { GlobalCTX } from "@/contexts/GlobalContext";

const ModalPortal = () => {
  const { showModal, modalContent, unMountPortalModal } =
    React.useContext(GlobalCTX);

  return (
    <>
      {showModal &&
        createPortal(
          <Modal
            open={showModal}
            onClose={unMountPortalModal}
            aria-labelledby="modal-portal"
            sx={{
              backdropFilter: "blur(1px)",
              zIndex: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div className="h-fit mt-36">{modalContent}</div>
          </Modal>,
          document.body
        )}
    </>
  );
};

export default ModalPortal;
