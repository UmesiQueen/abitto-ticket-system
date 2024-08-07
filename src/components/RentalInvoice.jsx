// import React from 'react'
import React from "react";
import baseurl from "@/api";
import { format } from "date-fns";
import { formatValue } from "react-currency-input-field";
import { Button } from "@/components/ui/button";
import { Navigate, useNavigate, useLoaderData } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Helmet } from "react-helmet-async";
import {
	CaretIcon,
	CalendarIcon,
	ClockIcon,
	Boat2Icon,
	UsersIcon,
} from "@/assets/icons";
import { Timelapse } from "@mui/icons-material";
import { toast } from "sonner";

const RentalInvoice = () => {
	const navigate = useNavigate();
	const currentUser = useLoaderData();
	const isAuth = JSON.parse(localStorage.getItem("access token"));
	const componentRef = React.useRef();

	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
		documentTitle: `Abitto Ticket - ${currentUser?.ticket_id}`,
	});

	if (!currentUser?.ticket_id) return <Navigate to="/pageNotFound" />;

	return (
		<>
			<Helmet>
				<title>Rental Invoice | Abitto Ticket</title>
			</Helmet>
			<div className="p-5  ">
				<div className=" w-full max-w-[1000px] flex flex-col mx-auto ">
					<div className="flex gap-2 mb-5 justify-end ">
						{isAuth ? (
							<Button
								className=" bg-green-500 hover:bg-green-700 "
								onClick={() => {
									navigate(-1);
								}}
							>
								<span className="rotate-180 mr-2">
									<CaretIcon />
								</span>
								Return
							</Button>
						) : (
							<Button
								className=" bg-blue-500 hover:bg-blue-700 "
								onClick={() => {
									navigate("/booking");
								}}
							>
								Book New Ticket
							</Button>
						)}
						<Button onClick={handlePrint}>Download</Button>
					</div>
					<div
						ref={componentRef}
						className="bg-white p-5 md:p-10 md:pb-20 space-y-5"
					>
						<div className="flex gap-5 justify-between items-center">
							<img
								alt="logo"
								src="https://i.ibb.co/Zh8H4Wz/logo3.png"
								width={176}
								height={60}
								className="w-32 md:w-40"
							/>
							<p className="text-xs md:text-base">
								Rental ID: {currentUser.ticket_id}
							</p>
						</div>

						<div className="flex gap-5 justify-between items-center">
							<h1 className="uppercase font-bold mt-3 text-sm md:text-base text-blue-500">
								Rental Invoice
							</h1>
							<div className="text-right">
								<p className="text-xs md:text-sm font-bold text-gray-500 mb-1">
									Rental total(NGN)
								</p>
								<p className="nowrap font-semibold text-4xl md:text-5xl ">
									<span className="text-2xl">₦</span>
									{formatValue({
										value: String(currentUser?.total_cost),
									})}
								</p>
							</div>
						</div>

						<div className="text-xs md:text-sm space-y-3 [&_li]:inline-flex [&_li]:items-center [&_li]:gap-1 *:pb-3 [&>*:not(:last-of-type)]:border-b">
							{/* Trip Details */}
							<div className="space-y-3">
								<hgroup>
									<h4 className="font-semibold mb-1">Terminals</h4>
									<p>
										{currentUser.departure} - {currentUser.arrival}
									</p>
								</hgroup>
								<ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1 capitalize">
									<li>
										<Boat2Icon />
										<p>{currentUser.rent_type}</p>
									</li>
									<li>
										<UsersIcon />
										<p>{currentUser.passengers} Passenger(s)</p>
									</li>
									<li>
										<CalendarIcon />
										<p>{format(new Date(currentUser.rental_date), "PP")}</p>
									</li>
									<li>
										<ClockIcon />
										<p>{currentUser.rental_time}</p>
									</li>
									{currentUser.rental_duration && (
										<li>
											<span className="text-[#ACACAC] scale-[.8]">
												<Timelapse />
											</span>
											<p>{`${currentUser.rental_duration}`}</p>
										</li>
									)}
								</ul>
							</div>

							{/* customer details */}
							<div className="space-y-1">
								{/* <h5 className="font-semibold ">Customer Details</h5> */}
								<ul className="flex flex-wrap gap-x-4 gap-y-1 ">
									<li>
										<span className="text-xs text-gray-500 font-normal">
											Full name:
										</span>{" "}
										<span className="capitalize">{`${currentUser.first_name} ${currentUser.surname}`}</span>
									</li>
									<li>
										<span className="text-xs text-gray-500 font-normal">
											Phone:{" "}
										</span>
										{currentUser.phone_number}
									</li>
									<li>
										<span className="text-xs text-gray-500 font-normal">
											Email:{" "}
										</span>
										{currentUser.email}
									</li>
								</ul>
							</div>

							{/* payment info */}
							<div>
								{/* <h5 className="font-semibold mb-1">Payment Details</h5> */}
								<ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
									<li>
										<p className="text-xs text-gray-500 font-normal">
											Booking Medium:
										</p>
										<p>{currentUser?.payment_medium}</p>
									</li>
									<li>
										<p className="text-xs text-gray-500 font-normal">
											Payment Method:
										</p>
										<p>{currentUser?.payment_method}</p>
									</li>
									<li>
										<p className="text-xs text-gray-500 font-normal">
											Trx Ref:
										</p>
										<p>{currentUser?.trxRef}</p>
									</li>
								</ul>
							</div>
						</div>

						<div className="border-y-2 border-dashed py-3 md:mt-5">
							<table className="w-full [&_td:last-of-type]:text-right [&_td]:py-[2px] ">
								<tbody>
									{/* <tr>
                    <td className="text-xs md:text-sm text-[#444444]">
                      Ride Insurance
                    </td>
                    <td className="text-xs md:text-sm text-[#444444]">₦0</td>
                  </tr> */}
									<tr>
										<td className="text-xs md:text-sm text-[#444444]">
											Ticket Price
										</td>
										<td className="text-xs md:text-sm text-[#444444]">
											{formatValue({
												value: String(currentUser.rental_cost),
												prefix: "₦",
											})}
											{currentUser.rental_duration &&
												` x ${currentUser.rental_duration}`}
										</td>
									</tr>
									<tr>
										<td className="font-medium text-base md:text-lg">Total</td>
										<td className="font-medium text-base md:text-lg">
											{formatValue({
												value: String(currentUser?.total_cost),
												prefix: "₦",
											})}
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						{/* Notice */}
						<div className="my-10 space-y-1 text-[10px] md:text-xs ">
							<p>
								<span className="uppercase">Notice: </span>
								You may need to show this invoice to prove return or onward
								travel to ferry officials.
							</p>
							<p>
								Abitto Ferry check-in counters open <strong>1 hours</strong>{" "}
								before departure.
							</p>
							<p>
								Ensure to arrive early to your Terminal as boarding starts{" "}
								<strong>30 minutes</strong> before your scheduled take off.
							</p>
							<p>
								<strong>
									This ticket is Non-refundable and cannot be rescheduled if
									scheduled time is missed.
								</strong>
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default RentalInvoice;

export const RentalInvoiceLoader = async ({ params }) => {
	try {
		const response = await baseurl.post("/rent/ticketId", {
			ticket_id: params.rentalID,
		});
		return response.data.rent;
	} catch (error) {
		if (
			!error.code === "ERR_NETWORK" ||
			!error.code === "ERR_INTERNET_DISCONNECTED" ||
			!error.code === "ECONNABORTED"
		)
			toast.error("Error occurred while retrieving this rental invoice.");
		return null;
	}
};
