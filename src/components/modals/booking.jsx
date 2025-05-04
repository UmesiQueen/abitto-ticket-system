/* eslint-disable react/prop-types */
import React from "react";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import CustomButton from "@/components/custom/Button";
import checkGIF from "@/assets/check.gif";
import RentalInvoice from "@/components/RentalInvoice";
import TicketInvoice from "@/components/TicketInvoice";
import { useReactToPrint } from "react-to-print";
import LogisticsInvoice from "@/components/LogisticInvoice";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { CancelSquareIcon } from "@/assets/icons";
import paymentFailed from "@/assets/paymentFailed.gif";

export const BookingSuccessModal = ({ currentUser, onclick = () => { } }) => {
	const { handleReset } = React.useContext(BookingCTX);
	const { unMountPortalModal } = React.useContext(GlobalCTX);
	const componentRef = React.useRef();
	const { pathname } = useLocation();

	const reset = () => {
		unMountPortalModal();
		handleReset();
		onclick();
	};

	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
		documentTitle: `Abitto Ticket - ${currentUser?.ticket_id}`,
		onAfterPrint: reset
	});

	return (
		<div className="font-poppins mx-auto py-10 px-5 md:p-16 w-full max-w-[450px] bg-white text-center flex flex-col rounded-lg">
			<div className="mx-auto w-fit">
				<img src={checkGIF} alt="checkIcon" width={200} height={100} />
			</div>
			<h2 className="font-semibold text-base md:text-lg text-[#454545] px-5 md:px-10 mb-5">
				Your Ferry Seat has been successfully booked!
			</h2>
			<p className="font-normal text-xs text-[#454545] px-10 mb-5">
				{String(pathname).includes("/backend")
					? "Print"
					: "Download"} {" "}
				ferry ticket details.
			</p>
			<TicketInvoice props={{ currentUser }} ref={componentRef} />
			<CustomButton
				className="md:py-5 w-full mb-5"
				onClick={handlePrint}
			>
				{String(pathname).includes("/backend")
					? "Print"
					: "Download"} Ticket
			</CustomButton>
			<CustomButton
				variant="outline"
				className=" md:py-5 "
				onClick={reset}
			>
				Continue
			</CustomButton>
		</div>
	);
};

export const RentalSuccessModal = ({ currentRental }) => {
	const { handleReset } = React.useContext(BookingCTX);
	const { unMountPortalModal } = React.useContext(GlobalCTX);
	const componentRef = React.useRef();

	const reset = () => {
		unMountPortalModal();
		handleReset();
	};

	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
		documentTitle: `Abitto Ticket - ${currentRental?.ticket_id}`,
		onAfterPrint: reset
	});

	return (
		<div className="font-poppins mx-auto py-10 px-5 md:p-16 w-full max-w-[450px] bg-white text-center flex flex-col rounded-lg">
			<div className="mx-auto min-w-[200px]">
				<img src={checkGIF} alt="checkIcon" width={200} height={100} />
			</div>
			<h2 className="font-semibold text-base md:text-lg text-[#454545] px-5 md:px-10 mb-5">
				Your Ferry rental has been confirmed successfully!
			</h2>
			<p className="font-normal text-xs text-[#454545] px-10 mb-5">
				Please print rental invoice details.
			</p>
			<RentalInvoice props={{ currentUser: currentRental }} ref={componentRef} />
			<CustomButton
				className="md:py-5 w-full mb-5"
				onClick={handlePrint}
			>
				Print ticket
			</CustomButton>
			<CustomButton
				variant="outline"
				className=" md:py-5 "
				onClick={reset}
			>
				Continue
			</CustomButton>
		</div>
	);
};

export const LogisticsSuccessModal = ({ props: { currentShipment, handleReset } }) => {
	const { unMountPortalModal } = React.useContext(GlobalCTX);
	const componentRef = React.useRef();

	const reset = () => {
		unMountPortalModal();
		handleReset();
	};

	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
		documentTitle: `Abitto Ticket - ${currentShipment?.shipment_id}`,
		onAfterPrint: reset
	});

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
			<LogisticsInvoice props={{ currentShipment }} ref={componentRef} />
			<CustomButton
				className="md:py-5 w-full mb-5"
				onClick={handlePrint}
			>
				Print Invoice
			</CustomButton>
			<CustomButton
				variant="outline"
				className=" md:py-5 "
				onClick={reset}
			>
				Continue
			</CustomButton>
		</div>
	);
};

export const UnAvailableModal = (seats) => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { unMountPortalModal, adminProfile } = React.useContext(GlobalCTX);

	return (
		<div className="font-poppins mx-auto pt-8 p-5 md:p-10 w-full max-w-[450px] bg-white  flex flex-col rounded-lg relative">
			<Button
				variant="ghost"
				size="icon"
				className="absolute right-0 top-0"
				onClick={unMountPortalModal}
			>
				<CancelSquareIcon />
			</Button>
			<h2 className="font-semibold text-base md:text-lg text-[#454545] mb-5 text-center">
				Sorry, There are {seats} available seats on this trip.
			</h2>
			<CustomButton
				className="md:py-5 w-full"
				onClick={() => {
					unMountPortalModal();
					pathname.includes("/booking") ?
						navigate("/booking") :
						navigate(`/backend/${adminProfile.account_type}/create/book-ticket`)
				}}
			>
				Search for more
			</CustomButton>
		</div>
	)
}

export const BookingFailedModal = () => {
	const { unMountPortalModal } = React.useContext(GlobalCTX);
	setTimeout(() => { unMountPortalModal() }, 4500);

	return (
		<div className="font-poppins mx-auto py-10 px-5 md:p-10 w-full max-w-[450px] bg-white text-center flex flex-col rounded-lg">
			<div className="mx-auto w-fit">
				<img src={paymentFailed} alt="declined icon" width={200} height={100} />
			</div>
			<h2 className="font-semibold text-base md:text-xl text-[#454545] mb-5">
				Payment Declined
			</h2>
			<p className="font-normal text-sm text-[#454545] mb-5">
				Your payment was unsuccessful. Please try again to secure your seat on
				our ferry.
			</p>
		</div>
	);
};

export const BookingRequestFailedModal = () => {
	const { unMountPortalModal } = React.useContext(GlobalCTX);

	return (
		<div className="font-poppins mx-auto py-10 px-5 md:p-10 w-full max-w-[450px] bg-white text-center flex flex-col rounded-lg">
			<div className="mx-auto w-fit">
				<img src={paymentFailed} alt="checkIcon" width={200} height={100} />
			</div>
			<h2 className="font-semibold text-base md:text-xl text-[#454545] mb-5">
				Booking request not confirmed
			</h2>
			<p className="font-normal text-sm text-[#454545] mb-5">
				{"We're "}sorry. Please take a screenshot and contact us to verify your payment immediately. Thank you.
			</p>
			<CustomButton
				className="md:py-5 w-full"
				onClick={unMountPortalModal}
			>
				Ok
			</CustomButton>
		</div>
	);
};
