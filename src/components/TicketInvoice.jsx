/* eslint-disable react/prop-types */
import React from "react";
import { format } from "date-fns";
import { formatValue } from "react-currency-input-field";
import {
	CalendarIcon,
	ClockIcon,
	Boat2Icon,
	UsersIcon,
} from "@/assets/icons";

const TicketInvoice = React.forwardRef(({ props: { currentUser } }, ref) => {
	return (
		<div
			ref={ref}
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
					Ticket ID: {currentUser.ticket_id}
				</p>
			</div>

			<div className="flex gap-5 justify-between items-center">
				<h1 className="uppercase font-bold mt-3 text-sm md:text-base text-blue-500">
					Ticket Invoice
				</h1>
				<div className="text-right">
					<p className="text-xs md:text-sm font-bold text-gray-500 mb-1">
						Ticket total(NGN)
					</p>
					<p className="nowrap font-semibold text-4xl md:text-5xl ">
						<span className="text-2xl">₦</span>
						{formatValue({
							value: String(currentUser?.total_ticket_cost),
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
							{currentUser.travel_from} - {currentUser.travel_to}
						</p>
					</hgroup>
					<ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
						<li>
							<Boat2Icon />
							<p>{currentUser.trip_type}</p>
						</li>
						<li>
							<UsersIcon />
							<p>{currentUser.total_passengers} Passenger(s)</p>
						</li>
					</ul>
				</div>

				{/* time and return */}
				<div>
					<h5 className="font-semibold mb-1">Departure Details</h5>
					<ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
						<li>
							<CalendarIcon />
							<p>
								{format(new Date(currentUser.departure_date), "PP")}
							</p>
						</li>
						<li>
							<ClockIcon />
							<p>{currentUser.departure_time}</p>
						</li>
					</ul>
				</div>

				{/* customer details */}
				<div className="space-y-1">
					<h5 className="font-semibold ">Passenger Details (Adults)</h5>
					<ul className="flex flex-wrap gap-x-4 gap-y-1 ">
						<li>
							<span className="text-xs text-gray-500 font-normal">
								Full name:
							</span>{" "}
							<span className="capitalize">{`${currentUser.passenger1_first_name} ${currentUser.passenger1_last_name}`}</span>
						</li>
						<li>
							<span className="text-xs text-gray-500 font-normal">
								Phone:{" "}
							</span>
							{currentUser.passenger1_phone_number}
						</li>
						<li>
							<span className="text-xs text-gray-500 font-normal">
								Email:{" "}
							</span>
							{currentUser.passenger1_email}
						</li>
					</ul>
					{currentUser?.adults_number > 1 &&
						currentUser?.passenger2_first_name ? (
						<>
							{Array.from({
								length: currentUser.adults_number - 1,
							}).map((_, index) => {
								const num = index + 2;
								return (
									<ul
										key={num}
										className="flex flex-wrap gap-x-4 gap-y-1"
									>
										<li>
											<span className="text-xs text-gray-500 font-normal">
												Full name:
											</span>{" "}
											<span className="capitalize">
												{`${currentUser[`passenger${num}_first_name`]} ${currentUser[`passenger${num}_last_name`]
													}`}
											</span>
										</li>
										<li>
											<span className="text-xs text-gray-500 font-normal">
												Phone:{" "}
											</span>
											{`${currentUser[`passenger${num}_phone_number`]}`}
										</li>
										<li>
											<span className="text-xs text-gray-500 font-normal">
												Email:{" "}
											</span>
											{`${currentUser[`passenger${num}_email`]}`}
										</li>
									</ul>
								);
							})}
						</>
					) : (
						""
					)}{" "}
				</div>

				{/* payment info */}
				<div>
					{/* <h5 className="font-semibold mb-1">Payment Details</h5> */}
					<ul className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
						<li>
							<p className="text-xs text-gray-500 font-normal">
								Booking Medium:
							</p>
							<p>{currentUser?.medium}</p>
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
							<p>{currentUser?.trxRef ?? "-"}</p>
						</li>
					</ul>
				</div>
			</div>

			<div className="border-y-2 border-dashed py-3 md:mt-5">
				<table className="w-full [&_td:last-of-type]:text-right [&_td]:py-[2px] ">
					<tbody>
						<tr>
							<td className="text-xs md:text-sm text-[#444444]">
								Ticket Price
							</td>
							<td className="text-xs md:text-sm text-[#444444]">
								{formatValue({
									value: String(currentUser?.departure_ticket_cost ?? 0),
									prefix: "₦",
								})}
							</td>
						</tr>
						<tr>
							<td className="font-medium text-base md:text-lg">Total</td>
							<td className="font-medium text-base md:text-lg">
								₦
								{formatValue({
									value: String(currentUser?.total_ticket_cost ?? 0),
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
					Abitto Ferry check-in counters open <strong>1 hour</strong>{" "}
					before departure.
				</p>
				<p>
					Ensure to arrive early to your Terminal as boarding starts{" "}
					<strong>30 minutes</strong> before your scheduled take off.
				</p>
				<p>
					Each passenger is entitled to a <strong>10kg</strong> baggage
					allowance.
				</p>
				<p>
					All baggage that exceeds the specified weight must be conveyed
					via abitto logistics.
				</p>
				<p>
					<strong>
						This ticket is Non-refundable and cannot be rescheduled if
						scheduled time is missed.
					</strong>
				</p>
			</div>
		</div>
	)
})
TicketInvoice.displayName = TicketInvoice;

export default TicketInvoice;

