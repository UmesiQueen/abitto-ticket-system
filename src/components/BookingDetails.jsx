/* eslint-disable react/prop-types */
import React from "react";
import { useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { bookingDetailsSchema } from "@/lib/validators/bookingSchema";
import { CalendarIcon } from "@/assets/icons";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import Button from "@/components/custom/Button";
import SelectField from "./custom/SelectField";
import { useSearchTrip } from "@/hooks/useSearchTrip";
import { v4 as uuid } from "uuid";

const BookingDetails = () => {
	return (
		<div className="bg-white p-5 pb-10 md:p-10 rounded-lg">
			<hgroup>
				<h3 className="text-blue-500 font-semibold text-base md:text-xl font-poppins ">
					Trip Details
				</h3>
				<p className="text-sm">Please fill in trip details</p>
			</hgroup>
			<BookingForm tab="One-Way Trip" />
		</div>
	);
};

export const BookingForm = ({ tab }) => {
	const { formData, setFormData } = React.useContext(BookingCTX);
	const { adminProfile } = React.useContext(GlobalCTX);
	const { pathname } = useLocation();
	const isSalesperson =
		["salesperson"].includes(adminProfile.account_type) &&
			pathname.includes("/backend")
			? true
			: false;
	const [availableDate, setAvailableDate] = React.useState(
		new Date().toISOString().split("T")[0]
	);
	const { searchAvailableTrips } = useSearchTrip();

	const destinations = {
		Calabar: {
			travel_from: "Marina, Calabar",
			travel_to: "Nwaniba Timber Beach, Uyo",
		},
		Uyo: {
			travel_from: "Nwaniba Timber Beach, Uyo",
			travel_to: "Marina, Calabar",
		},
	};

	const {
		register,
		handleSubmit,
		formState: { errors, defaultValues },
		control,
		resetField,
		watch,
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(bookingDetailsSchema),
		context: { roundTrip: tab === "Round Trip" ? true : false },
		defaultValues: {
			...formData.bookingDetails,
			...(isSalesperson && {
				...destinations[adminProfile.city],
			}),
		},
	});

	const departure_date = watch("departure_date");
	const return_date = watch("return_date");

	React.useEffect(() => {
		if (departure_date) {
			const departureDate = new Date(departure_date);
			const availableDate = new Date(departureDate).setDate(
				departureDate.getDate() + 1
			);
			setAvailableDate(new Date(availableDate).toISOString().split("T")[0]);
			if (return_date < departure_date) resetField("return_date");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [departure_date]);

	const onSubmit = (formData_) => {
		setFormData((prev) => ({
			...prev,
			bookingDetails: {
				...formData_,
				trip_type: tab,
			},
			...(!prev?.ticket_id ? { ticket_id: uuid().slice(0, 6) } : ""),
		}));

		const reqData = {
			departure: formData_.travel_from,
			arrival: formData_.travel_to,
			date: format(formData_.departure_date, "PP"),
			...(tab === "Round Trip" && {
				return_date: format(formData_.return_date, "PP"),
			}),
		};

		searchAvailableTrips(reqData);
	};

	const handleChange = (e) => {
		const { value, name } = e.target;
		setFormData((prev) => {
			return {
				...prev,
				bookingDetails: {
					...prev.bookingDetails,
					[name]: value,
				},
			};
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="space-y-5 pt-8 pb-10 ">
				<SelectField
					{...register("travel_from")}
					defaultValue={defaultValues["travel_from"]}
					label="Traveling From"
					placeholder="Select Departure Terminal"
					options={["Marina, Calabar", "Nwaniba Timber Beach, Uyo"]}
					errors={errors}
					handlechange={handleChange}
					disabled={isSalesperson ? true : false}
				/>

				<SelectField
					{...register("travel_to")}
					defaultValue={defaultValues["travel_to"]}
					label="Traveling To"
					placeholder="Select Arrival Terminal"
					options={["Marina, Calabar", "Nwaniba Timber Beach, Uyo"]}
					errors={errors}
					handlechange={handleChange}
					disabled={isSalesperson ? true : false}
				/>

				{/* Departure Date */}
				<div
					className={cn(
						"flex gap-5 w-full ",
						tab === "One-Way Trip" ? "flex-wrap md:flex-nowrap" : ""
					)}
				>
					<div className="flex flex-col w-full">
						<label className="text-xs md:text-sm !w-full flex flex-col ">
							Date of Departure
							<Controller
								control={control}
								name="departure_date"
								render={({ field }) => (
									<DatePicker
										minDate={new Date().toISOString().split("T")[0]}
										icon={<CalendarIcon />}
										showIcon
										toggleCalendarOnIconClick={true}
										closeOnScroll
										className="bg-blue-50 h-10 md:h-12 border border-blue-500 font-normal text-base w-full !px-4 !rounded-lg font-poppins mt-2 md:mt-3 text-left"
										onChange={(date) => {
											field.onChange(date);
											handleChange({
												target: { name: "departure_date", value: date },
											});
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
						{errors?.departure_date && (
							<p className="text-xs pt-2 text-red-700">
								{errors?.departure_date.message}
							</p>
						)}
					</div>
					{/* Round Trip */}
					{tab === "Round Trip" && (
						<div className="flex flex-col w-full">
							<label className="text-xs md:text-sm !w-full flex flex-col ">
								Date of Return
								<Controller
									control={control}
									name="return_date"
									render={({ field }) => (
										<DatePicker
											minDate={availableDate}
											icon={<CalendarIcon />}
											showIcon
											toggleCalendarOnIconClick={true}
											closeOnScroll
											className="bg-blue-50 h-10 md:h-12 border border-blue-500 font-normal text-base w-full !px-4 !rounded-lg font-poppins mt-2 md:mt-3 text-left"
											onChange={(date) => {
												field.onChange(date);
												handleChange({
													target: { name: "return_date", value: date },
												});
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
							{errors?.return_date && (
								<p className="text-xs pt-2 text-red-700">
									{errors?.return_date.message}
								</p>
							)}
						</div>
					)}
				</div>

				<div className="flex gap-5">
					<SelectField
						{...register("adults_number")}
						defaultValue={defaultValues["adults_number"]}
						label="No. of Adults"
						placeholder="0"
						options={[1, 2, 3, 4, 5]}
						errors={errors}
						handlechange={handleChange}
					/>
					<SelectField
						{...register("children_number")}
						defaultValue={defaultValues["children_number"]}
						label="No. of Children"
						placeholder="0"
						options={["", 1, 2, 3, 4, 5]}
						errors={errors}
						handlechange={handleChange}
					/>
				</div>
			</div>
			<Button text="Search available trip" type="submit" className="w-full !h-12" />
		</form>
	);
};

export default BookingDetails;
