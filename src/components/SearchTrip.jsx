/* eslint-disable react/prop-types */
import React from "react";
import { formatValue } from "react-currency-input-field";
import CustomButton from "./custom/Button";
import { BookingCTX } from "@/contexts/BookingContext";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { useSearchTrip } from "@/hooks/useSearchTrip";
import { useSearchParam } from "@/hooks/useSearchParam";
import { Loader2 } from "lucide-react";

const SearchTrip = () => {
	const {
		formData,
		setAvailableTrips,
		availableTrips,
		selectedTrip,
		setSelectedTrip,
		setFormData,
	} = React.useContext(BookingCTX);
	const [totalCost, setTotalCost] = React.useState(0);
	const [isDisabled, setIsDisabled] = React.useState(true);
	const navigate = useNavigate()
	const { searchAvailableTrips } = useSearchTrip()
	const { pathname } = useLocation();
	const isAdmin = pathname.includes("/backend");
	const { accountType } = useParams();
	const { getSearchParams } = useSearchParam();
	const searchParamValues = getSearchParams();
	const { passengers: total_passengers, ...reqData } = searchParamValues;

	const {
		data,
		isLoading,
	} = useQuery({
		queryKey: ["availableTrips", reqData],
		queryFn: () => {
			if (formData?.ticket_id)
				return searchAvailableTrips(reqData);

			// Handle navigation case
			if (isAdmin) {
				navigate(`/backend/${accountType}/create/book-ticket`);
			} else {
				navigate("/booking");
			}
			return null;
		},
		enabled: true, // This makes the query run immediately
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (data) setAvailableTrips(data);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (Object.keys(selectedTrip).length) {
			const departureCost =
				Number(selectedTrip?.ticket_cost ?? 0) * total_passengers;
			setTotalCost(departureCost);
			return setIsDisabled(false);
		}
		setTotalCost(0);
		return setIsDisabled(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedTrip]);

	const handleCheck = (state, tripDetails, seatExceeded) => {
		if (!seatExceeded)
			setSelectedTrip(state ? tripDetails : {});
		else
			toast.error(
				"There are no available seats for the number of passengers you have selected."
			);
	};

	const handleSubmit = () => {
		setFormData((prev) => ({
			...prev,
			bookingDetails: {
				...prev.bookingDetails,
				departure_ticket_cost: selectedTrip?.ticket_cost,
				departure_time: selectedTrip?.time,
				departure_trip_code: selectedTrip?.trip_code,
			},
		}));
		if (isAdmin)
			return navigate(`/backend/${accountType}/create/book-ticket/passenger-details?cid=${formData.ticket_id}`)
		return navigate(`/booking/passenger-details?cid=${formData.ticket_id}`)
	};

	const handleReturn = () => {
		setSelectedTrip({});
		setAvailableTrips([]);
		if (isAdmin)
			return navigate(`/backend/${accountType}/create/book-ticket`)
		return navigate("/booking")
	};

	return (
		<section className="space-y-10 px-3 md:px-8">
			<hgroup>
				<h2 className="font-semibold md:text-lg">Select Departure Time</h2>
				<p className="text-sm">Choose an option to continue</p>
			</hgroup>

			{/* Departure Time */}
			<div className="min-h-20">
				{!isLoading ?
					<div className="space-y-3">
						{availableTrips.length ? (
							availableTrips.map((item) => {
								const available_seats = Number(item.trip_capacity) - Number(item.current_booked_seats);
								const isAvailableSeatsExceeded = total_passengers > available_seats;
								const isActive = selectedTrip?.trip_code === item.trip_code;
								return (
									<div
										tabIndex={isAvailableSeatsExceeded ? "-1" : "0"}
										key={item.trip_code}
										data-state={
											isActive
												? "active"
												: isAvailableSeatsExceeded
													? "disabled"
													: ""
										}
										aria-disabled={isAvailableSeatsExceeded}
										onClick={() => {
											handleCheck(
												!isActive,
												item,
												isAvailableSeatsExceeded
											);
										}}
										onKeyDown={(event) => {
											event.preventDefault();
											if (event.key === "Enter" || event.key === " ") {
												handleCheck(
													!isActive,
													item,
													isAvailableSeatsExceeded
												);
											}
										}}
										className="grid overflow-hidden grid-cols-4 md:grid-cols-7 rounded-lg border border-gray-400 md:border-none  min-h-32 *:bg-white [&>*]:data-[state=active]:bg-blue-50 data-[state=active]:shadow-lg *:py-2 transition-all duration-150 ease-in-out  [&>*]:data-[state=disabled]:bg-red-100 [&>*]:data-[state=disabled]:border-red-700 cursor-pointer"
									>
										<div className="px-5 md:px-8 col-span-2 md:col-span-2 flex-grow flex flex-col justify-center items-center rounded-tl-lg md:rounded-lg text-center">
											<p className="font-bold">{item.time}</p>
											<p className="text-gray-500 text-sm md:text-base ">
												{item.departure.includes("Uyo")
													? "Nwaniba, Uyo"
													: item.departure}
											</p>
											<p className="text-gray-500 text-sm md:text-base ">
												{item.date}
											</p>
										</div>
										<div className="px-6 col-span-2 md:col-span-2 flex flex-col justify-center items-center md:rounded-lg border-l md:border-l-2  border-gray-400">
											<p className="text-sm">Price(NGN)</p>
											<p className="md:text-lg font-semibold">
												{formatValue({
													value: String(item.ticket_cost),
													prefix: "₦",
												})}
											</p>
										</div>
										<div className="px-6 row-start-2 md:row-span-1 col-span-3 md:col-span-2 col-start-1 flex flex-col justify-center rounded-bl-lg  md:rounded-lg items-center border-t md:border-t-0 md:border-l-2 border-gray-400">
											<p className="text-sm">Status</p>
											<div className="text-center">
												{isAvailableSeatsExceeded ? (
													<>
														<p className="font-semibold uppercase text-red-700">
															FULL
														</p>
														<p className="text-sm">
															{available_seats} available seat(s)
														</p>
													</>
												) : (
													<p className="font-semibold uppercase">AVAILABLE</p>
												)}
											</div>
										</div>
										<div className="px-6 row-start-2 md:row-start-1 md:row-span-1 col-start-4 md:col-start-7 rounded-br-lg md:rounded-lg flex items-center justify-center border-l border-t md:border-t-0 md:border-l-2  border-gray-400">
											<Checkbox
												tabIndex={-1}
												className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
												checked={isActive}
											/>
										</div>
									</div>
								);
							})
						) : (
							<div className="flex flex-col justify-center items-center min-h-40 text-center text-lg">
								<p>There are no available trips for this date.</p>
							</div>
						)}
					</div>
					:
					<div className="inline-flex gap-2 items-center w-full justify-center"><p>Searching trips </p> <Loader2 className="animate-spin" /></div>
				}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-7 gap-y-5 min-h-32">
				<div className="md:col-span-4 flex-grow flex justify-between items-end rounded-t-lg rounded-lg  bg-white p-8 min-h-16">
					<p className="font-semibold text-sm md:text-lg uppercase text-nowrap">
						Total Cost
					</p>
					<p className="text-right md:text-xl">
						<strong>
							{formatValue({
								value: String(totalCost),
								prefix: "₦",
							})}
						</strong>
						<span className="block text-sm">
							{formatValue({
								value: String(selectedTrip?.ticket_cost ?? 0),
								prefix: "₦",
							})}
							{" "}
							x {total_passengers} Passenger(s)
						</span>
					</p>
				</div>
				<div className="md:col-span-3 flex items-center justify-center gap-5 md:border-l-2 border-gray-400 rounded-t-lg md:rounded-lg  md:bg-white md:px-8">
					<CustomButton
						variant="outline"
						className="w-full basis-1/2"
						onClick={handleReturn}
					>
						Back
					</CustomButton>
					<div
						onClick={() => {
							if (isDisabled)
								toast.info("Please select preferred trip(s) to proceed.");
						}}
						onKeyDown={() => {
							if (isDisabled)
								toast.info("Please select preferred trip(s) to proceed.");
						}}
						className="w-full basis-1/2"
					>
						<CustomButton
							className="w-full"
							disabled={isDisabled}
							onClick={handleSubmit}
						>
							Continue
						</CustomButton>
					</div>
				</div>
			</div>
		</section>
	);
};

export default SearchTrip;
