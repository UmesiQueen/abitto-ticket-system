import React from "react";
import { createPortal } from "react-dom";
import Modal from "@mui/material/Modal";
import { GlobalCTX } from "@/contexts/GlobalContext";

const ModalPortal = () => {
	const { showModal, modalContent } = React.useContext(GlobalCTX);

	return (
		<>
			{showModal &&
				createPortal(
					<Modal
						open={showModal}
						aria-labelledby="modal-portal"
						sx={{
							overflow: "scroll",
						}}
						className="no-scrollbar"
					>
						<div className=" py-20 md:my-0 min-h-screen md:h-full flex justify-center items-center px-5">
							{modalContent}
						</div>
					</Modal>,
					document.body
				)}
		</>
	);
};

export default ModalPortal;
