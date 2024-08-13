/* eslint-disable react/prop-types */
import React from "react";
import { GlobalCTX } from "@/contexts/GlobalContext";
import Button from "@/components/custom/Button";
import paymentFailed from "@/assets/paymentFailed.gif";
import { usePayment } from "@/hooks/usePayment";
import { useLocation } from "react-router-dom";

const BookingFailedModal = () => {
	const { unMountPortalModal } = React.useContext(GlobalCTX);
	const { onlinePayment, onlineRentalPayment } = usePayment();
	const { pathname } = useLocation();

	return (
		<div className="font-poppins mx-auto py-10 px-5 md:p-10 w-full max-w-[450px] bg-white text-center flex flex-col rounded-lg">
			<div className="mx-auto w-fit">
				<img src={paymentFailed} alt="declined icon" width={200} height={100} />
			</div>
			<h2 className="font-semibold text-base md:text-xl text-[#454545] mb-5">
				Payment Declined.
			</h2>
			<p className="font-normal text-sm text-[#454545] mb-5">
				Your payment was unsuccessful. Please try again to secure your seat on
				our ferry.
			</p>

			<Button
				text="Retry Payment"
				className="md:py-5 w-full mb-5"
				onClick={() => {
					pathname.includes("/rental")
						? onlineRentalPayment()
						: pathname.includes("/booking")
						? onlinePayment()
						: "";
				}}
			/>

			<Button
				text={"Cancel"}
				variant="outline"
				className=" md:py-5 "
				onClick={unMountPortalModal}
			/>
		</div>
	);
};

export default BookingFailedModal;

export const BookingRequestFailedModal = ({ header }) => {
	const { unMountPortalModal } = React.useContext(GlobalCTX);

	return (
		<div className="font-poppins mx-auto py-10 px-5 md:p-10 w-full max-w-[450px] bg-white text-center flex flex-col rounded-lg">
			<div className="mx-auto w-fit">
				<img src={paymentFailed} alt="checkIcon" width={200} height={100} />
			</div>
			<h2 className="font-semibold text-base md:text-xl text-[#454545] mb-5">
				{header} Request not Confirmed.
			</h2>
			<p className="font-normal text-sm text-[#454545] mb-5">
				{"We're "}sorry. Your booking was not confirmed.
				<br /> Please contact us to verify your payment before your scheduled
				trip date. <br />
				Thank you.
			</p>
			<Button
				text={"Return"}
				className=" md:py-5 "
				onClick={unMountPortalModal}
			/>
		</div>
	);
};
