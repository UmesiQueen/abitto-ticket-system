/* eslint-disable react/prop-types */
import React from "react";
import CustomButton from "@/components/custom/Button";
import checkGIF from "@/assets/check.gif";
import { GlobalCTX } from "@/contexts/GlobalContext";

const SuccessModal = ({ header, text, onclick = () => { } }) => {
	const { unMountPortalModal } = React.useContext(GlobalCTX);
	return (
		<div className="w-96 px-5 pt-16 pb-10 rounded-lg bg-white flex flex-col items-center">
			<div className="w-36 h-36">
				<img src={checkGIF} alt="checkIcon" width={200} height={100} />
			</div>
			<h2 className="font-semibold text-lg mb-3">{header}</h2>
			<p className="text-gray-500 mb-10 text-center">{text}</p>
			<CustomButton
				className="w-full"
				onClick={() => {
					unMountPortalModal();
					onclick();
				}}
			>
				Continue
			</CustomButton>
		</div>
	);
};

export default SuccessModal;
