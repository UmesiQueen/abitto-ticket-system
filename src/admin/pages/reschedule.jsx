/* eslint-disable react/prop-types */
import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLoaderData } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { format } from "date-fns";
import { CalendarIcon, ClockIcon, CircleArrowLeftIcon, Boat2Icon, UsersIcon, InformationCircleIcon } from "@/assets/icons";
import { BookingCTX } from "@/contexts/BookingContext";
import CustomButton from "@/components/custom/Button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatValue } from "react-currency-input-field";
import { toast } from "sonner";
import { useSearchTrip } from "@/hooks/useSearchTrip";
import { capitalize } from "lodash"
import InputField from "@/components/custom/InputField";
import SelectField from "@/components/custom/SelectField";
import { useStepper } from "@/hooks/useStepper";
import { useUpdate } from "@/hooks/useUpdate";
import { Button } from "@/components/ui/button";

const ctx = React.createContext();

const Reschedule = () => {
	const navigate = useNavigate();
	const currentUser = useLoaderData();
	const { activeStep } = useStepper()
	const [bookingData, setBookingData] = React.useState({});

	return (
		<ctx.Provider value={{ currentUser, bookingData, setBookingData }} >
			<Helmet>
				<title>Reschedule Booking | Admin</title>
			</Helmet>
			<div>
				<div className="flex gap-1 items-center mb-10">
					<Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
						<CircleArrowLeftIcon />
					</Button>
					<h1 className="text-base font-semibold">Reschedule</h1>
				</div>
				{
					Object.keys(currentUser).length ?
						<>
							{activeStep === 0 || activeStep === 1 ?
								<RescheduleForm />
								: activeStep === 2
									? <Payment /> : ""}
						</>
						: <p className="ml-10">No Result</p>
				}
			</div>
		</ctx.Provider>
	);
};

export default Reschedule;

const RescheduleForm = () => {
	const { currentUser } = React.useContext(ctx);
	const { searchAvailableTrips } = useSearchTrip();
	const { activeStep } = useStepper();
	const { setActiveStep, setAvailableTrips } = React.useContext(BookingCTX);
	const [loading, setLoading] = React.useState(false);

	const rescheduleSchema = yup.object().shape({
		date: yup.string().required("New date is required."),
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(rescheduleSchema),
	});

	const onSubmit = handleSubmit(async (formData) => {
		const reqData = {
			departure: currentUser.travel_from,
			arrival: currentUser.travel_to,
			date: format(formData.date, "PP")
		}
		setLoading(true)
		const response = await searchAvailableTrips(reqData);
		setLoading(false);
		if (response) {
			setAvailableTrips(response);
			setActiveStep(1);
		}
	});

	return (
		<section className="px-5 pb-5">
			<div className="bg-stone-800/90 mx-auto mb-5 min-h-24 py-5 px-4 flex items-center rounded-lg ">
				<ul className="w-full [&_h4]:uppercase [&_h4]:font-semibold [&_h4]:text-blue-600 [&_h4]:text-xs [&_p]:text-white [&_p]:text-sm flex flex-wrap *:grow px-2 items-center gap-5 md:justify-around md:divide-x-2 h-full md:[&_li:not(:first-of-type)]:pl-5 *:space-y-1">
					<li>
						<h4>Customer name</h4>
						<p className="capitalize">{capitalize(`${currentUser?.passenger1_first_name} ${currentUser?.passenger1_last_name}`)}</p>
					</li>
					<li>
						<h4>Route</h4>
						<p>
							{currentUser?.travel_from.includes("Calabar") ? "Calabar ==> Uyo"
								: "Uyo ==> Calabar"}
						</p>
					</li>
					<li>
						<h4> Departure Date & Time</h4>
						<p>
							{format(currentUser?.departure_date, "PP")} -{" "}
							{currentUser?.departure_time}
						</p>
					</li>
					<li>
						<h4>Passengers</h4>
						<p>{currentUser?.adults_number}</p>
					</li>
				</ul>
			</div>

			<div>
				<form onSubmit={onSubmit} className="grid grid-cols-3 gap-5 mt-10">
					<div className="flex flex-col w-full col-span-2">
						<label htmlFor="date" className="text-xs md:text-sm !w-full flex flex-col">
							Select new date
							<Controller
								control={control}
								name="date"
								render={({ field }) => (
									<DatePicker
										minDate={new Date().toISOString().split("T")[0]}
										icon={<CalendarIcon />}
										showIcon
										toggleCalendarOnIconClick={true}
										closeOnScroll
										className=" h-10 md:h-12 border border-gray-500 font-normal text-base w-full !px-4 !rounded-lg font-poppins mt-2 md:mt-3 text-left"
										onChange={(date) => {
											field.onChange(date);
										}}
										selected={field.value}
										customInput={
											<button type="button">
												{field?.value ? (
													format(field?.value, "P")
												) : (
													<span className="text-xs text-[#9fa6b2]">
														dd/mm/yyyy
													</span>
												)}
											</button>
										}
									/>
								)}
							/>
						</label>
						{errors?.date && (
							<p className="text-xs pt-2 text-red-700">{errors?.date.message}</p>
						)}
					</div>
					<CustomButton
						className="w-full mt-8 mb-auto"
						type="submit"
						loading={loading}
					>Search Trip</CustomButton>
				</form>
				{activeStep === 1 && <RescheduleSelection />}
			</div>
		</section>
	);
};

const RescheduleSelection = () => {
	const { currentUser, setBookingData } = React.useContext(ctx);
	const { availableTrips, selectedTrip, setSelectedTrip, } = React.useContext(BookingCTX);
	const [isDisabled, setIsDisabled] = React.useState(false);
	const { onNextClick } = useStepper();

	React.useEffect(() => {
		if (Object.keys(selectedTrip).length)
			return setIsDisabled(true)
		return setIsDisabled(false)
	}, [selectedTrip])

	const handleCheck = (state, tripDetails, seatExceeded) => {
		if (!seatExceeded)
			setSelectedTrip(state ? tripDetails : {});
		else
			toast.error(
				"There are no available seats for the number of passengers you have selected."
			);
	}

	const handleReschedule = () => {
		const { date, time, trip_code, ticket_cost } = selectedTrip;
		// create new booking record with this
		const newFormData = {
			...currentUser,
			departure_date: date,
			departure_time: time,
			departure_trip_code: trip_code,
			departure_ticket_cost: ticket_cost,
		}
		setBookingData(newFormData);
		onNextClick()
	}

	return (
		<div className="mt-10 space-y-10">
			<hgroup>
				<h2 className="font-semibold md:text-lg">Select New Trip</h2>
				<p className="text-sm">Choose an option to reschedule</p>
			</hgroup>

			{/* Departure Time */}
			<div className="space-y-3">
				{availableTrips.length ? (
					availableTrips.map((item) => {
						const available_seats = Number(item.trip_capacity) - Number(item.current_booked_seats);
						const isAvailableSeatsExceeded =
							currentUser.total_passengers > available_seats
						const isActive =
							selectedTrip?.trip_code === item.trip_code;
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
								className="grid overflow-hidden grid-cols-4 md:grid-cols-7 rounded-lg border border-gray-400 md:border-none  min-h-32 *:bg-white [&>*]:data-[state=active]:bg-blue-50 data-[state=active]:shadow-lg *:py-2 transition-all duration-150 ease-in-out  [&>*]:data-[state=disabled]:bg-red-100 [&>*]:data-[state=disabled]:border-red-700 "
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
						<p>There are no available departure trips for this date.</p>
					</div>
				)}
			</div>
			<CustomButton
				className="w-full"
				onClick={handleReschedule}
				disabled={!isDisabled}
			>Reschedule</CustomButton>
		</div>
	)
}

const Payment = () => {
	const { bookingData, currentUser } = React.useContext(ctx);
	const { loading } = React.useContext(BookingCTX);
	const { onPrevClick } = useStepper();
	const { rescheduleBooking } = useUpdate();
	const total_ticket_cost = Number(bookingData.departure_ticket_cost) * Number(bookingData.total_passengers);
	const ticket_balance = (Number(total_ticket_cost) * 50) / 100;
	const paymentSchema = yup.object().shape({
		payment_method: yup.string().required("This field is required."),
		transaction_ref: yup
			.string()
			.required("This field is required")
			.min(4, "Trx ref must have at least 4 characters."),
		check_in: yup.boolean().notRequired(),
	});

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(paymentSchema),
		defaultValues: {
			check_in: false,
		},
	});

	const onSubmit = handleSubmit((formData) => {
		const reqData = {
			...bookingData,
			...formData,
			total_ticket_cost: ticket_balance
		}
		rescheduleBooking(currentUser, reqData);
	});

	return (
		<div className="flex gap-5">
			<form
				onSubmit={onSubmit}
				className="basis-8/12 bg-white p-10 rounded-lg flex flex-col gap-5"
			>
				<h2 className="text-blue-500 text-base font-semibold">
					Customer Details
				</h2>
				<div>
					<h4 className="font-semibold text-sm">Passenger 01</h4>
					<ul className="mt-2 border-2 rounded-lg py-3 px-5 flex flex-wrap gap-y-3 gap-x-16 [&_p:first-of-type]:text-xs  [&_p:first-of-type]:font-semibold  [&_p:last-of-type]:text-gray-500  ">
						<li>
							<p>First Name</p>
							<p>{bookingData.passenger1_first_name}</p>
						</li>
						<li>
							<p>Surname</p>
							<p>{bookingData.passenger1_last_name}</p>
						</li>
						<li>
							<p>Phone Number</p>
							<p>{bookingData.passenger1_phone_number}</p>
						</li>
						<li>
							<p>Email Address</p>
							<p>{bookingData.passenger1_email}</p>
						</li>
					</ul>
				</div>
				{bookingData?.adults_number > 1 &&
					bookingData?.passenger2_first_name ? (
					<>
						{Array.from({
							length: bookingData.total_passengers - 1,
						}).map((_, i) => {
							const num = i + 2;
							return (
								<div key={`Passenger0${num}`}>
									<h4 className="font-semibold text-sm">Passenger 0{num}</h4>
									<ul className="mt-2 border-2 rounded-lg py-3 px-5 flex flex-wrap gap-y-3 gap-x-16 [&_p:first-of-type]:text-xs  [&_p:first-of-type]:font-semibold  [&_p:last-of-type]:text-gray-500  ">
										<li>
											<p>First Name</p>
											<p>
												{
													bookingData[
													`passenger${num}_first_name`
													]
												}
											</p>
										</li>
										<li>
											<p>Surname</p>
											<p>
												{bookingData[`passenger${num}_last_name`]}
											</p>
										</li>
										<li>
											<p>Phone Number</p>
											<p>
												{
													bookingData[
													`passenger${num}_phone_number`
													]
												}
											</p>
										</li>
										<li>
											<p>Email Address</p>
											<p>
												{bookingData[`passenger${num}_email`]}
											</p>
										</li>
									</ul>
								</div>
							);
						})}
					</>
				) : (
					""
				)}
				<div className="mt-20 py-8 h-fit grid grid-cols-3 gap-5">
					<SelectField
						{...register("payment_method")}
						label="Payment Method"
						placeholder="Select payment method"
						options={["POS", "Bank Transfer", "Cash"]}
						errors={errors}
						className="bg-white"
					/>
					<InputField
						{...register("transaction_ref")}
						label="Transaction Reference"
						placeholder="Enter trx ref"
						type="text"
						maxLength={35}
						variant="white"
						className="!border-blue-500"
						autoComplete="off"
						errors={errors}
					/>
					<div>
						<p className="text-sm mb-3">Check-in passenger</p>
						<label
							htmlFor="check-in"
							className="text-sm flex items-center gap-2 w-full h-12 p-3 rounded-lg bg-blue-50 cursor-pointer hover:bg-blue-100 font-medium"
						>
							<Checkbox
								{...register("check_in")}
								id="check-in"
								onCheckedChange={(value) => setValue("check_in", value)}
							/>
							Check-In
						</label>
					</div>
				</div>

				<div className="flex gap-5">
					<CustomButton
						onClick={onPrevClick}
						variant="outline"
						className="w-40"
					>Back</CustomButton>
					<CustomButton
						type="submit"
						loading={loading}
						className="w-40"
					>Submit</CustomButton>
				</div>
			</form>
			<div className=" self-start basis-4/12  bg-white rounded-lg p-5 flex flex-col gap-6">
				<div>
					<h3 className="text-blue-500 font-semibold text-base ">
						Ticket Summary
					</h3>
					<p className="text-[#8E98A8] text-sm inline-flex items-center gap-1">
						Non-refundable <InformationCircleIcon />
					</p>
					<p className="font-medium text-xs text-right">
						Booking ID: #
						<span className="uppercase font-bold tracking-wide">
							{bookingData.ticket_id}
						</span>
					</p>
				</div>

				<div className="space-y-1">
					<h4 className="font-semibold mb-1">Terminals</h4>
					<p className="text-xs">
						{bookingData.travel_from} -{" "}
						{bookingData.travel_to}
					</p>

					<div className="flex flex-wrap gap-x-4 gap-y-1 text-[#1E1E1E] text-xs font-normal [&_p]:inline-flex [&_p]:items-center [&_p]:gap-1">
						<p>
							<Boat2Icon />
							{bookingData.trip_type}
						</p>
						<p>
							<UsersIcon /> {bookingData.total_passengers}{" "}
							passenger(s)
						</p>
					</div>
				</div>
				<div className="flex flex-wrap gap-x-5 gap-y-3">
					<div>
						<h5 className="font-semibold text-sm mb-1">Departure Details</h5>
						<div className="flex flex-wrap gap-x-4 gap-y-1 text-[#1E1E1E] text-xs font-normal [&_p]:inline-flex [&_p]:items-center [&_p]:gap-1">
							<p>
								<CalendarIcon />
								{format(bookingData.departure_date, "PP")}
							</p>
							<p>
								<ClockIcon />
								{bookingData.departure_time}
							</p>
						</div>
					</div>
				</div>

				<div className="border-y-2 *:flex *:w-full *:justify-between *:gap-10 *:items-end *:py-3 divide-y-2 divide-dashed">
					<div>
						<h3 className="text-xs md:text-sm text-[#444444]">
							Previous cost
						</h3>
						<div className="text-right">
							<p className="text-xs md:text-sm text-[#444444]">
								{formatValue({
									value: String(currentUser.departure_ticket_cost),
									prefix: "₦",
								})}
								{" "}	x {currentUser.total_passengers}
							</p>
							<p className="text-xs md:text-sm  font-medium text-[#444444]">
								{formatValue({
									value: String(currentUser.total_ticket_cost),
									prefix: "₦",
								})}
							</p>
						</div>
					</div>
					<div>
						<h3 className="text-xs md:text-sm text-[#444444]">
							Current cost
						</h3>
						<div className="text-right">
							<p className="text-xs md:text-sm text-[#444444]">
								{formatValue({
									value: String(
										bookingData.departure_ticket_cost ?? 0
									),
									prefix: "₦",
								})}
								{" "}	x {bookingData.total_passengers}
							</p>
							<p className="font-medium text-[#444444]">
								₦
								{formatValue({
									value: String(total_ticket_cost),
								})} {" "}<span className="font-normal text-sm"> / 50%</span>
							</p>
						</div>
					</div>
					<div className="">
						<h3 className="font-medium text-base md:text-lg">Balance</h3>
						<p className="font-semibold text-right">
							{formatValue({
								value: String(ticket_balance),
								prefix: "₦",
							})}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
