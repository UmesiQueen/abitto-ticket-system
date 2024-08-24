/* eslint-disable react/prop-types */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import Button from "@/components/custom/Button";
import checkGIF from "@/assets/check.gif";

const BookingSuccessModal = ({ id }) => {
	const { handleReset } = React.useContext(BookingCTX);
	const { unMountPortalModal } = React.useContext(GlobalCTX);
	const { pathname } = useLocation();

	const reset = () => {
		unMountPortalModal();
		handleReset();
	};

	return (
		<div className="font-poppins mx-auto py-10 px-5 md:p-16 w-full max-w-[450px] bg-white text-center flex flex-col rounded-lg">
			<div className="mx-auto w-fit">
				<img src={checkGIF} alt="checkIcon" width={200} height={100} />
			</div>
			<h2 className="font-semibold text-base md:text-lg text-[#454545] px-5 md:px-10 mb-5">
				Your Ferry Seat has been successfully booked!
			</h2>
			<p className="font-normal text-xs text-[#454545] px-10 mb-5">
				Please check your email for important ticket details.
			</p>
			<Link to={`/ticket-invoice/${id}`}>
				<Button
					text={
						String(pathname).includes("/backend")
							? "Print Ticket"
							: "Download Ticket"
					}
					className="md:py-5 w-full mb-5"
					onClick={reset}
				/>
			</Link>
			<Button
				text={"Continue"}
				variant="outline"
				className=" md:py-5 "
				onClick={reset}
			/>
		</div>
	);
};

export default BookingSuccessModal;

export const RentalSuccessModal = ({ id }) => {
	const { handleReset } = React.useContext(BookingCTX);
	const { unMountPortalModal } = React.useContext(GlobalCTX);
	const { pathname } = useLocation();

	const reset = () => {
		unMountPortalModal();
		handleReset();
	};

	return (
		<div className="font-poppins mx-auto py-10 px-5 md:p-16 w-full max-w-[450px] bg-white text-center flex flex-col rounded-lg">
			<div className="mx-auto min-w-[200px]">
				<img src={checkGIF} alt="checkIcon" width={200} height={100} />
			</div>
			<h2 className="font-semibold text-base md:text-lg text-[#454545] px-5 md:px-10 mb-5">
				Your Ferry rental has been confirmed successfully!
			</h2>
			<p className="font-normal text-xs text-[#454545] px-10 mb-5">
				Please check your email for important ticket details.
			</p>
			<Link to={`/rental-invoice/${id}`}>
				<Button
					text={
						String(pathname).includes("backend")
							? "Print Ticket"
							: "Download Ticket"
					}
					className="md:py-5 w-full mb-5"
					onClick={reset}
				/>
			</Link>
			<Button
				text={"Continue"}
				variant="outline"
				className=" md:py-5 "
				onClick={reset}
			/>
		</div>
	);
};

export const LogisticsSuccessModal = ({ props: { id, handleReset } }) => {
	const { unMountPortalModal } = React.useContext(GlobalCTX);

	const reset = () => {
		unMountPortalModal();
		handleReset();
	};

	return (
		<div className="font-poppins mx-auto py-10 px-5 md:p-16 w-full max-w-[450px] bg-white text-center flex flex-col rounded-lg">
			<div className="mx-auto min-w-[200px]">
				<img src={checkGIF} alt="checkIcon" width={200} height={100} />
			</div>
			<h2 className="font-semibold text-base md:text-lg text-[#454545] px-5 md:px-10 mb-5">
				Your Shipment has been confirmed successfully!
			</h2>
			<p className="font-normal text-xs text-[#454545] px-10 mb-5">
				Print shipment invoice details.
			</p>
			<Link to={`/logistics-invoice/${id}`}>
				<Button
					text="Print Invoice"
					className="md:py-5 w-full mb-5"
					onClick={reset}
				/>
			</Link>
			<Button
				text={"Continue"}
				variant="outline"
				className=" md:py-5 "
				onClick={reset}
			/>
		</div>
	);
};
