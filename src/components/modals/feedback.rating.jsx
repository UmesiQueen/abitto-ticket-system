/* eslint-disable react/prop-types */
import React from "react";
import Button from "@/components/custom/Button";
import { GlobalCTX } from "@/contexts/GlobalContext";
import Rating from "@mui/material/Rating";
import { Button as ButtonUI } from "@/components/ui/button";
import WaveSVG from "@/assets/layered-peaks-haikei.svg";

const FeedbackRatingModal = () => {
	const { unMountPortalModal, starRating, setStarRating } =
		React.useContext(GlobalCTX);

	const ratingRemark = (rating) => {
		switch (rating) {
			case 1:
				return "Bad";
			case 2:
				return "Poor";
			case 3:
				return "Fair";
			case 4:
				return "Good";
			case 5:
				return "Excellent";
			default:
				break;
		}
	};

	return (
		<div className="w-96 rounded-lg bg-white  relative overflow-hidden">
			<div className="absolute w-full top-0">
				<img src={WaveSVG} alt="checkIcon" className="w-full h-fit" />
			</div>
			<div className=" flex flex-col items-center gap-2 px-5 mt-28 pb-10 relative z-1">
				<h2 className="font-semibold text-base md:text-lg mb-3 text-center px-2">
					How would you rate your experience?
				</h2>
				<div>
					<Rating
						name="simple-controlled"
						value={starRating}
						onChange={(_, newValue) => {
							setStarRating(newValue);
						}}
						size="large"
						sx={{
							"& .MuiRating-iconFilled": {
								color: "#3366CC",
							},
							"& .MuiRating-iconHover": {
								color: "#0167ff",
							},
						}}
					/>
				</div>
				<p>{ratingRemark(starRating)}</p>
				<Button
					text="Continue"
					className="w-full mt-10 "
					onClick={() => {
						unMountPortalModal();
					}}
				/>
				<ButtonUI
					variant="ghost"
					className="w-full h-10 md:h-12 "
					onClick={() => {
						unMountPortalModal();
					}}
				>
					No, thanks
				</ButtonUI>
			</div>
		</div>
	);
};

export default FeedbackRatingModal;
