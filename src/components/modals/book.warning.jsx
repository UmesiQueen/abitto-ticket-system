/* eslint-disable react/prop-types */
import React from "react";
import { GlobalCTX } from "@/contexts/GlobalContext";
import Button from "@/components/custom/Button";
import { Button as IconButton } from "@/components/ui/button";
import { usePayment } from "@/hooks/usePayment";
import { useLocation } from "react-router-dom";
import cautionSVG from "@/assets/caution.gif";
import { BookingCTX } from "@/contexts/BookingContext";
import { CancelSquareIcon } from "@/assets/icons";


const BookingWarningModal = () => {
	const { unMountPortalModal } = React.useContext(GlobalCTX);
	const { onlinePayment, onlineRentalPayment } = usePayment();
	const { pathname } = useLocation();

	return (
		<div className="font-poppins mx-auto pt-8 p-5 md:p-10 w-full max-w-[450px] bg-white  flex flex-col rounded-lg">
			<div className="mx-auto w-fit">
				<img src={cautionSVG} alt="caution icon" width={200} height={100} />
			</div>
			<h2 className="font-semibold text-base md:text-xl text-[#454545] mb-5 text-center">
				A step closer to securing your seat.
			</h2>
			<ul className="font-normal text-[13px] text-[#454545] mb-8 list-disc space-y-2 pl-5">
				<li>Ensure you have a stable network.</li>
				<li>
					Do not minimize or close the browser immediately after a successful
					payment to get your ticket invoice.
				</li>
				<li>
					Download or screenshot your ticket invoice as this would be used for
					check in at the terminal.
				</li>
			</ul>

			<Button
				text={"Proceed to Payment"}
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

export default BookingWarningModal;

export const UnAvailableModal = ({ type }) => {
	const { handleReset } = React.useContext(BookingCTX);
	const { unMountPortalModal } = React.useContext(GlobalCTX);

	return (
		<div className="font-poppins mx-auto pt-8 p-5 md:p-10 w-full max-w-[450px] bg-white  flex flex-col rounded-lg relative">
			<IconButton
				variant="ghost"
				size="icon"
				className="absolute right-0 top-0"
				onClick={unMountPortalModal}
			>
				<CancelSquareIcon />
			</IconButton>
			<h2 className="font-semibold text-base md:text-lg text-[#454545] mb-5 text-center">
				Sorry, There are no longer available seats on this {type} trip.
			</h2>
			<Button
				text={"Search for more"}
				className="md:py-5 w-full"
				onClick={() => {
					unMountPortalModal();
					handleReset();
				}}
			/>
		</div>
	)
}
