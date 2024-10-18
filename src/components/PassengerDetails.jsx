/* eslint-disable react/prop-types */
import React from "react";
import { passengerDetailsSchema } from "@/lib/validators/passengerSchema";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import Button from "@/components/custom/Button";
import InputField from "@/components/custom/InputField";
import { format } from "date-fns";
import { useNavigate, useLocation, Navigate } from "react-router-dom";

const PassengerDetails = () => {
	const { loading, setLoading, adminProfile } = React.useContext(GlobalCTX);
	const { setChecked, isChecked, formData, setFormData } =
		React.useContext(BookingCTX);
	const navigate = useNavigate()
	const { search, pathname } = useLocation();
	const adults_number = formData.bookingDetails?.adults_number;

	const searchParams = new URLSearchParams(search.split("?")[1]);
	const ticket_id = searchParams.get("cid");

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(passengerDetailsSchema),
		context: { adultPassengers: adults_number, isChecked },
		defaultValues: formData.passengerDetails
	});

	const onSubmit = handleSubmit((formData_) => {
		const formValues = {
			...(isChecked
				? {
					passenger1_first_name: formData_.passenger1_first_name,
					passenger1_last_name: formData_.passenger1_last_name,
					passenger1_phone_number: formData_.passenger1_phone_number,
					passenger1_email: formData_.passenger1_email,
				}
				: formData_),
		};

		setLoading(true);
		setTimeout(() => {
			setFormData((prev) => ({
				...prev,
				passengerDetails: formValues,
			}));
			setLoading(false);
			if (pathname.includes("/backend"))
				return navigate(`/backend/${adminProfile.account_type}/create/book-ticket/payment?cid=${formData.ticket_id}`)
			return navigate(`/booking/payment?cid=${formData.ticket_id}`)
		}, 650);
	});

	const handleChange = (e) => {
		const { value, name } = e.target;
		setFormData((prev) => {
			return {
				...prev,
				passengerDetails: {
					...prev.passengerDetails,
					[name]: value,
				},
			};
		});
	};

	const handlePrev = () => {
		if (pathname.includes("/backend"))
			return navigate(`/backend/${adminProfile.account_type}/create/book-ticket/available-trips?departure=${formData.bookingDetails.travel_from}&arrival=${formData.bookingDetails.travel_to}&passengers=${formData.bookingDetails.total_passengers}&date=${format(formData.bookingDetails.departure_date, "PP")}`)
		return navigate(`/booking/available-trips?departure=${formData.bookingDetails.travel_from}&arrival=${formData.bookingDetails.travel_to}&passengers=${formData.bookingDetails.total_passengers}&date=${format(formData.bookingDetails.departure_date, "PP")}`)
	}

	if (ticket_id !== formData?.ticket_id) return (<Navigate to="/booking" />)

	return (
		<>
			<div className="bg-blue-700 mx-auto mb-5 min-h-20 p-5 md:p-2 flex items-center ">
				<ul className="w-full [&_h4]:uppercase [&_h4]:text-gray-400 [&_h4]:text-xs [&_p]:text-white [&_p]:text-sm flex flex-wrap  *:grow px-2 items-center gap-5 md:justify-around md:divide-x-2 h-full md:[&_li:not(:first-of-type)]:pl-5 *:space-y-1">
					<li>
						<h4>Trip type</h4>
						<p>{formData.bookingDetails?.trip_type}</p>
					</li>
					<li>
						<h4>Route</h4>
						<p>
							{formData.bookingDetails?.travel_from.includes("Calabar")
								? "Calabar"
								: "Uyo"}{" "}
							==
							{">"}{" "}
							{formData.bookingDetails?.travel_to.includes("Calabar")
								? "Calabar"
								: "Uyo"}
						</p>
					</li>
					<li>
						<h4> Departure Date & Time</h4>
						<p>
							{format(new Date(formData.bookingDetails?.departure_date), "PP")}{" "}
							- {formData.bookingDetails?.departure_time}
						</p>
					</li>
					<li>
						<h4>Adult</h4>
						<p>{formData.bookingDetails?.adults_number}</p>
					</li>
					<li>
						<h4>Children</h4>
						<p>{formData.bookingDetails?.children_number ?? 0}</p>
					</li>
				</ul>
			</div>

			<section className="bg-white p-5 pb-10 md:p-10">
				<hgroup>
					<h2 className="text-blue-500 text-base font-semibold">
						Customer Details
					</h2>
					<p className="text-sm">Please fill in passenger details</p>
				</hgroup>
				<form onSubmit={onSubmit}>
					<div className="space-y-8 mt-8">
						<div className="space-y-5">
							<h4 className="font-medium text-sm">Passenger 01</h4>
							<div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
								<InputField
									{...register("passenger1_first_name")}
									label="First Name"
									placeholder="Enter first name"
									type="text"
									maxLength={35}
									errors={errors}
									handlechange={handleChange}
								/>
								<InputField
									{...register("passenger1_last_name")}
									label="Surname"
									placeholder="Enter surname"
									type="text"
									maxLength={35}
									errors={errors}
									handlechange={handleChange}
								/>
								<InputField
									{...register("passenger1_email")}
									label="Email Address"
									placeholder="Enter email address"
									type="email"
									maxLength={40}
									errors={errors}
									handlechange={handleChange}
								/>
								<InputField
									{...register("passenger1_phone_number")}
									label="Phone Number"
									placeholder="(+234) XXXX XXX XXX"
									type="tel"
									errors={errors}
									handlechange={handleChange}
								/>
							</div>
						</div>
						{adults_number > 1 && (
							<div className="space-y-8">
								<div className="rounded-lg flex gap-2 items-center p-3 bg-blue-700/90 border-2 border-black text-xs md:text-sm font-semibold">
									<Checkbox
										id="checkbox"
										className="border-white border-2 rounded-full w-6 h-6"
										checked={isChecked}
										onCheckedChange={(state) => {
											setChecked(state);
										}}
									/>
									<label htmlFor="checkbox">
										Use same Information as above for all adult passengers.
									</label>
								</div>
								{!isChecked && (
									<div className="gap-8 flex flex-wrap">
										{Array.from({ length: adults_number - 1 }).map((_, i) => {
											const currentPassenger = `passenger${i + 2}`;
											return (
												<div
													key={currentPassenger}
													className="space-y-5 flex-grow basis-[400px]"
												>
													<h4 className="font-medium text-sm">
														Passenger 0{i + 2} (Adult)
													</h4>
													<div className="grid gap-3 grid-cols-1 md:grid-cols-2">
														<InputField
															{...register(`${currentPassenger}_first_name`, {
																required: "This field is required.",
															})}
															label="First Name"
															placeholder="Enter first name"
															type="text"
															maxLength={35}
															errors={errors}
															handlechange={handleChange}
														/>
														<InputField
															{...register(`${currentPassenger}_last_name`)}
															label="Surname"
															placeholder="Enter surname"
															type="text"
															maxLength={35}
															errors={errors}
															handlechange={handleChange}
														/>
														<InputField
															{...register(`${currentPassenger}_email`)}
															label="Email Address"
															placeholder="Enter email address"
															type="email"
															maxLength={40}
															errors={errors}
															handlechange={handleChange}
														/>
														<InputField
															{...register(`${currentPassenger}_phone_number`)}
															label="Phone Number"
															placeholder="(+234) XXXX XXX XXX"
															type="tel"
															errors={errors}
															handlechange={handleChange}
														/>
													</div>
												</div>
											);
										})}
									</div>
								)}
							</div>
						)}
						<div className="flex gap-4">
							<Button
								text="Back"
								variant="outline"
								onClick={handlePrev}
								className="w-full md:w-40"
							/>
							<Button
								text="Continue"
								type="submit"
								loading={loading}
								className="col-start-1 w-full md:w-40 "
							/>
						</div>
					</div>
				</form>
			</section>
		</>
	);
};

export default PassengerDetails;
