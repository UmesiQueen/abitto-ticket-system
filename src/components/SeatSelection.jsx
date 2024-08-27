/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import Button from "@/components/custom/Button";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { toast } from "sonner";

const SeatSelection = ({ props: { tab, setValue } }) => {
	const [selectionExceeded, setSelectionExceeded] = React.useState(false);
	const { setSeatSelected, seatSelected, formData, setFormData } =
		React.useContext(BookingCTX);
	const { unMountPortalModal } = React.useContext(GlobalCTX);
	const passengers = formData.bookingDetails.total_passengers;

	React.useEffect(() => {
		if (seatSelected[tab].length >= passengers) {
			setSelectionExceeded(true);
		} else {
			setSelectionExceeded(false);
		}
	}, [seatSelected, tab, passengers]);

	const handleSelection = (target, checked) => {
		if (!checked && !selectionExceeded)
			return setSeatSelected((prev) => ({
				...prev,
				[tab]: [...prev[tab], target],
			}));
		return setSeatSelected((prev) => ({
			...prev,
			[tab]: prev[tab].filter((seat) => seat !== target),
		}));
	};

	const handleSubmit = () => {
		const formValues = {
			departure_seats: seatSelected.departure,
			...(formData.bookingDetails.trip_type === "Round Trip" && {
				return_seats: seatSelected.return,
			}),
		};

		if (selectionExceeded) {
			unMountPortalModal();
			setValue(`${tab}_seats`, seatSelected[tab]);
			setFormData((prev) => ({ ...prev, seatDetails: formValues }));
		}
	};

	const seatID = [
		["1a", "1b", "1c", "1d"],
		["2a", "2b", "2c", "2d"],
		["3a", "3b", "3c", "3d"],
		["4a", "4b", "4c", "4d"],
		["5a", "5b", "5c", "5d"],
		["6a", "6b", "6c", "6d"],
		["7a", "7b", "7c", "7d"],
		// ["8a", "8b", "8c", "8d"],
	];

	return (
		<div className=" w-full max-w-[1000px] h-fit bg-white  rounded-lg py-5 px-3 md:pl-5 md:pr-8 md:py-8 grid gap-y-8 md:gap-0 md:grid-cols-2 md:grid-rows-2 mx-auto">
			<div className=" order-1 md:col-start-1 md:row-start-1 [&_p]:text-[#5B5B5B] [&_p]:text-sm md:[&_p]:text-base">
				<div className="space-y-8 px-3 md:pr-0">
					<hgroup>
						<h1 className="text-blue-500 font-semibold text-base md:text-xl ">
							Choose your Seats
						</h1>
						<p className="text-xs md:text-sm">
							Select a seat that will enhance your experience
						</p>
					</hgroup>
					<div className="space-y-3">
						<h4 className="font-semibold mb-1">Seat Options</h4>
						<ul className="grid grid-cols-2 gap-y-5 *:inline-flex *:gap-2 *:items-center [&_div]:w-6 [&_div]:h-6 [&_div]:rounded-sm [&_div]:inline-flex [&_div]:items-center [&_div]:justify-center [&_div]:cursor-pointer [&_div]:transition-all [&_div]:ease-in-out [&_div]:border-[2px] ">
							<li>
								<div className="bg-black border-black" />
								<p>Not a Seat</p>
							</li>
							<li>
								<div className="bg-blue-500 border-blue-400/50" />
								<p>Occupied</p>
							</li>
							<li>
								<div className="bg-[#E5E5E5] border-[#d0d0d0]" />
								<p>Available</p>
							</li>
							<li>
								<div className="bg-green-400 border-green-100 " />
								<p>Your Selection</p>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* input */}
			<div className="order-3 md:col-start-1 md:row-start-2 flex flex-col justify-between gap-y-8 px-3 md:pr-0 md:mt-8 pb-2 md:pb-0">
				<p className="first-letter:capitalize">
					All {passengers} {tab} seat(s) selected :
				</p>
				<input
					disabled
					value={seatSelected[tab]}
					className="w-full md:w-80 h-14 rounded-lg border-2 border-[#b6b6b6] px-5 placeholder:text-sm font-medium tracking-wider "
					type="text"
					placeholder="Selected seats will appear here"
				/>

				<div className="flex gap-3 mt-auto">
					<Button
						variant="outline"
						text="Cancel"
						className="w-full md:w-40"
						onClick={unMountPortalModal}
					/>
					<div
						onClick={() => {
							if (!selectionExceeded)
								toast.info(
									`Please select all ${passengers} seat(s) to proceed.`
								);
						}}
						className="w-full md:w-40 "
					>
						<Button
							disabled={!selectionExceeded}
							onClick={handleSubmit}
							text={"Done"}
							className="w-full"
						/>
					</div>
				</div>
			</div>

			<div className="px-3 md:px-0 order-2 md:col-start-2 md:row-start-1 md:row-span-2">
				<div className="bg-[#1C1C1C0A] w-full md:w-4/5 h-full min-h-[500px] ml-auto rounded-lg px-5 py-10 flex flex-col justify-between">
					<ul className="flex *:text-center font-semibold text-gray-500 *:flex-1">
						<li>A</li>
						<li>B</li>
						<li></li>
						<li>C</li>
						<li>D</li>
					</ul>
					{seatID.map((seats, index) => (
						<ul key={index} className="flex">
							{seats.map((seat, index) => (
								<li
									key={index}
									className={cn("flex justify-center flex-1 ", {
										"order-1": index === 0,
										"order-2": index === 1,
										"order-3": index === 2,
										"order-5": index === 3,
									})}
								>
									<SeatButton
										id={seat}
										currentTab={tab}
										seatSelected={seatSelected}
										onClick={handleSelection}
										disabled={
											selectionExceeded && !seatSelected[tab].includes(seat)
												? true
												: false
										}
									/>
								</li>
							))}
							<li className="text-center flex-1 order-2">{index + 1}</li>
						</ul>
					))}
				</div>
			</div>
		</div>
	);
};

export default SeatSelection;

const SeatButton = ({ id, onClick, disabled, seatSelected, currentTab }) => {
	const [checked, isChecked] = React.useState(false);
	const { selectedTrip } = React.useContext(BookingCTX);
	const isSeatAvailable = (
		currentTab == "departure"
			? selectedTrip.departure.available_seats
			: selectedTrip.return.available_seats
	).includes(id);

	const handleClick = () => {
		if (isSeatAvailable) {
			isChecked(!checked);
			onClick(id, checked);
		}
	};

	return (
		<button
			type="button"
			disabled={disabled}
			onClick={handleClick}
			className={cn(
				"w-6 h-6 rounded-sm inline-flex items-center justify-center cursor-pointer transition-all ease-in-out border-[2px] bg-[#E5E5E5] border-[#d0d0d0] hover:bg-[#afadad]",
				{
					"!bg-blue-500 !border-blue-400/50 !hover:bg-blue-500 pointer-events-none":
						!isSeatAvailable,
				},
				{
					"bg-green-400 border-green-100 hover:bg-green-300":
						seatSelected[currentTab].includes(id),
				},
				{ "!bg-black !border-black pointer-events-none": id == "1d" },
				{ hidden: id == "1c" }
			)}
		/>
	);
};

SeatButton.propTypes = {
	id: PropTypes.string,
	status: PropTypes.string,
	onClick: PropTypes.func,
	disabled: PropTypes.bool,
	seatSelected: PropTypes.object,
	currentTab: PropTypes.string,
};
