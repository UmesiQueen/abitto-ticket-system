/* eslint-disable react/prop-types */
import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLoaderData, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BoatURL from "@/assets/images/boat1.jpg";
import Button from "@/components/custom/Button";
import { UsersIcon, CalendarIcon, ClockIcon } from "@/assets/icons";
import { BookingCTX } from "@/contexts/BookingContext";
import InputField from "@/components/custom/InputField";
import SelectField from "@/components/custom/SelectField";
import DatePicker from "react-datepicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs from "dayjs";
import { format, addHours } from "date-fns";
import { formatValue } from "react-currency-input-field";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { rentalSchema } from "@/lib/validators/rentalSchema";
import { useStepper } from "@/hooks/useStepper";
import { GlobalCTX } from "@/contexts/GlobalContext";

const Rental = () => {
	const rentalCosts = useLoaderData();

	return (
		<>
			<Helmet>
				<title>Rental Services | Abitto Ferry</title>
			</Helmet>
			<div className="py-32 px-5 ">
				<section className="w-full max-w-[1000px] mx-auto ">
					<RentalSelection rentalCosts={rentalCosts} />
				</section>
			</div>
		</>
	);
};
export default Rental;

export const RentalSelection = ({ rentalCosts }) => {
	const { setRentalData } = React.useContext(BookingCTX);
	const { scrollToSection, terminals } = React.useContext(GlobalCTX);
	const { onNextClick } = useStepper();
	const { pathname } = useLocation();
	const navigate = useNavigate();

	const handleClick = ({ rental_cost, departure, arrival, rent_type }) => {
		setRentalData((prev) => ({
			...prev,
			rental_cost,
			departure,
			arrival,
			rent_type,
		}));
		onNextClick();
	};

	const rentalPackages = [
		{
			type: "within marina",
			title: "Rent Within Marina",
			src: BoatURL,
			capacity: "10-15",
			duration: "hour",
			rental_cost: rentalCosts.within_marina,
			departure: "Marina, Calabar",
			arrival: "Marina, Calabar",
		},
		{
			type: "uyo to calabar",
			title: "Uyo to Calabar",
			src: BoatURL,
			capacity: "10-15",
			duration: "trip",
			rental_cost: rentalCosts.uyo_to_calabar,
			departure: "Nwaniba Timber Beach, Uyo",
			arrival: "Marina, Calabar",
		},
		{
			type: "calabar to uyo",
			title: "Calabar to Uyo",
			src: BoatURL,
			capacity: "10-15",
			duration: "trip",
			rental_cost: rentalCosts.calabar_to_uyo,
			departure: "Marina, Calabar",
			arrival: "Nwaniba Timber Beach, Uyo",
		},
	];

	return (
		<>
			<hgroup className="text-center">
				<h1 className="font-semibold text-2xl">Boat Rental Package</h1>
				<p className="text-sm">
					Choose from our range of boat rental packages.
				</p>
			</hgroup>
			<div className=" bg-white rounded-lg py-5 md:px-5 max-w-[1000px] mx-auto mt-10">
				<Tabs defaultValue="within marina">
					<div className="mx-auto w-fit">
						<TabsList className="h-full md:gap-2 rounded-3xl p-1 bg-blue-50">
							<StyledTabsTrigger value="within marina" title="Within Marina" />
							<StyledTabsTrigger
								value="uyo to calabar"
								title="Uyo to Calabar"
							/>
							<StyledTabsTrigger
								value="calabar to uyo"
								title="Calabar to Uyo"
							/>
						</TabsList>
					</div>
					{rentalPackages.map((item) => (
						<TabsContent key={item.type} value={item.type}>
							<div className="flex flex-col md:flex-row gap-10 *:flex-grow md:*:w-1/2 min-h-56 p-5 mt-5 rounded-lg">
								<div className="relative rounded-lg overflow-hidden h-56">
									<img
										src={item.src}
										alt="boat_image"
										className="object-cover h-56 w-full"
									/>
									<div className=" bg-gradient-to-b from-white/0 from-30% to-black/60 absolute top-0 right-0 w-full h-full" />
								</div>
								<div className="flex flex-col gap-5 leading-none">
									<h2 className="text-lg font-semibold">{item.title}</h2>
									<div className="inline-flex gap-5 font-medium ">
										<p>
											{formatValue({
												value: String(item.rental_cost),
												prefix: "₦",
												decimalScale: 2,
											})}
											/<span className="font-normal">{item.duration}</span>
										</p>
										<p className="inline-flex gap-1">
											<UsersIcon />
											<span>{item.capacity} persons</span>
										</p>
									</div>

									{String(pathname).includes("/backend") ?
										<Button
											id="select_btn"
											text="Select package"
											className="mt-8 md:mt-auto w-full md:w-48"
											onClick={() => {
												handleClick({
													rental_cost: item.rental_cost,
													departure: item.departure,
													arrival: item.arrival,
													rent_type: item.type,
												});
											}}
										/> :
										<p className="mt-8">For rentals or enquiries, please
											<button type="button"
												className="text-blue-500 hover:text-blue-700 transition ease-in-out cursor-pointer pl-1"
												onClick={() => {
													navigate("/");
													setTimeout(() => scrollToSection(terminals))
												}}
											>
												contact us
											</button>
										</p>
									}
								</div>
							</div>
						</TabsContent>
					))}
				</Tabs>
			</div>
		</>
	);
};

const StyledTabsTrigger = ({ value, title }) => {
	return (
		<TabsTrigger
			value={value}
			className="text-xs md:text-base px-1 md:px-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white py-3 hover:bg-blue-50 rounded-3xl transition-all !duration-150 !ease-in-out"
		>
			{title}
		</TabsTrigger>
	);
};

StyledTabsTrigger.propTypes = {
	value: PropTypes.string,
	title: PropTypes.string,
};

export const RentalForm = () => {
	const { rentalData, setRentalData } = React.useContext(BookingCTX);
	const { onPrevClick, onNextClick } = useStepper();
	const { rental_time, ...otherRentalData } = rentalData;
	const {
		register,
		control,
		handleSubmit,
		formState: { errors, defaultValues },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(rentalSchema),
		defaultValues: {
			...otherRentalData,
			...(rentalData?.rental_time && {
				[rental_time]: dayjs(
					new Date(
						`${format(rentalData.rental_date, "PPP")} ${rentalData.rental_time}`
					)
				),
			}),
		},
		context: { rentalType: rentalData.rent_type },
	});

	const onSubmit = handleSubmit((formData) => {
		const total_cost = formData?.rental_duration
			? Number(rentalData.rental_cost) *
			Number(formData.rental_duration.split(" ")[0])
			: Number(rentalData.rental_cost);

		const rental_time = format(
			addHours(new Date(formData.rental_time), 0),
			"p"
		);
		setRentalData((prev) => ({
			...prev,
			...formData,
			total_cost,
			rental_time,
		}));
		onNextClick();
	});

	const handleChange = (event) => {
		const { name, value } = event.target;
		setRentalData((prev) => ({ ...prev, [name]: String(value) }));
	};

	const handleCancel = () => {
		onPrevClick();
		setRentalData({});
	};

	return (
		<>
			<hgroup className=" mb-10">
				<h2 className="text-base font-semibold">Rental Details</h2>
				<p className="text-sm">Please fill in your rental details</p>
			</hgroup>

			<form onSubmit={onSubmit}>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-3 gap-3">
					<InputField
						{...register("first_name")}
						label="First Name"
						placeholder="Enter first name"
						type="text"
						maxLength={35}
						errors={errors}
						handlechange={handleChange}
						autoComplete="off"
					/>
					<InputField
						{...register("surname")}
						label="Surname"
						placeholder="Enter surname"
						type="text"
						maxLength={35}
						errors={errors}
						handlechange={handleChange}
						autoComplete="off"
					/>
					<InputField
						{...register("email")}
						label="Email Address"
						placeholder="Enter email address"
						type="email"
						maxLength={40}
						errors={errors}
						handlechange={handleChange}
						autoComplete="off"
					/>
					<InputField
						{...register("phone_number")}
						label="Phone Number"
						placeholder="(+234) XXXX XXX XXX"
						type="tel"
						errors={errors}
						handlechange={handleChange}
						autoComplete="off"
					/>
					<SelectField
						{...register("passengers")}
						label="Passengers"
						placeholder="0"
						options={["10", "11", "12", "13", "14", "15"]}
						errors={errors}
						handlechange={handleChange}
						defaultValue={defaultValues?.passengers}
					/>
					<div className="flex flex-col w-full">
						<label htmlFor="rental_date" className="text-xs md:text-sm !w-full flex flex-col ">
							Rental Date
							<Controller
								control={control}
								name="rental_date"
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
												target: { name: "rental_date", value: date },
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
						{errors?.rental_date && (
							<p className="text-xs pt-2 text-red-700">
								{errors?.rental_date.message}
							</p>
						)}
					</div>

					<div className="flex flex-col w-full">
						<label htmlFor="rental_time" className="text-xs md:text-sm w-full flex gap-2 md:gap-3 flex-col relative">
							Rental Time
							<Controller
								control={control}
								name="rental_time"
								render={({ field }) => (
									<LocalizationProvider dateAdapter={AdapterDayjs}>
										<TimeField
											{...field}
											sx={{
												"& .MuiOutlinedInput-notchedOutline": {
													display: "none",
												},
												"& .MuiInputBase-root": {
													height: { xs: "2.5rem", md: "3rem" },
													borderRadius: "0.5rem",
													borderColor: "#3366CC",
													bgcolor: "#EBF0FA",
													borderWidth: "1px",
													paddingX: "14px",
												},
												"& .MuiInputBase-input": { padding: 0 },
											}}
										/>
									</LocalizationProvider>
								)}
							/>
							<div className="absolute right-4 bottom-3 md:bottom-4">
								<ClockIcon />
							</div>
						</label>
						{errors?.rental_time && (
							<p className="text-xs pt-2 text-red-700">
								{errors?.rental_time.message}
							</p>
						)}
					</div>

					{rentalData.rent_type === "within marina" && (
						<SelectField
							{...register("rental_duration")}
							label="Rental Duration"
							placeholder="1 Hour"
							options={["1 Hour", "2 Hours", "3 Hours", "4 Hours", "5 Hours"]}
							errors={errors}
							handlechange={handleChange}
							defaultValue={defaultValues.rental_duration}
						/>
					)}
				</div>

				<div className="flex flex-col-reverse md:flex-row gap-5 mt-10">
					<Button
						text="Cancel"
						variant="outline"
						className="w-full md:w-40"
						onClick={handleCancel}
					/>
					<Button
						text="Proceed to checkout"
						type="submit"
						className="w-full md:w-48"
						onClick={onSubmit}
					/>
				</div>
			</form>
		</>
	);
};
