import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { format, addHours } from "date-fns";
import { formatValue } from "react-currency-input-field";
import { BookingCTX } from "@/contexts/BookingContext";
import {
	UsersIcon,
	CalendarIcon,
	Boat2Icon,
	ClockIcon,
	CircleArrowLeftIcon,
} from "@/assets/icons";
import Button from "@/components/custom/Button";
import { RentalSelection } from "@/main/pages/rental";
import { RentalForm } from "@/main/pages/rental";
import { useStepper } from "@/hooks/useStepper";
import { usePayment } from "@/hooks/usePayment";
import SelectField from "@/components/custom/SelectField";
import InputField from "@/components/custom/InputField";
import { Button as ButtonIcon } from "@/components/ui/button";

const RentalAdmin = () => {
	const { activeStep } = useStepper();
	const navigate = useNavigate();
	return (
		<>
			<Helmet>
				<title>Rental | Admin</title>
			</Helmet>
			<div className="bg-white min-h-[calc(100vh-150px)] p-10">
				{activeStep == 0 ? (
					<div className="flex items-start">
						<ButtonIcon
							size="icon"
							variant="ghost"
							onClick={() => navigate(-1)}
						>
							<CircleArrowLeftIcon />
						</ButtonIcon>
						<div className="w-full">
							<RentalSelection />
						</div>
					</div>
				) : activeStep == 1 ? (
					<RentalForm />
				) : activeStep == 2 ? (
					<RentalSummary />
				) : (
					""
				)}
			</div>
		</>
	);
};

export default RentalAdmin;

const RentalSummary = () => {
	const { rentalData } = React.useContext(BookingCTX);
	const { onPrevClick } = useStepper();
	const { offlineRentalPayment } = usePayment();

	const paymentSchema = yup.object().shape({
		payment_status: yup.string().required("This field is required."),
		payment_method: yup.string().required("This field is required."),
		transaction_ref: yup
			.string()
			.required("This field is required")
			.min(4, "Trx ref must have at least 4 characters."),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(paymentSchema),
	});

	const onSubmit = handleSubmit((formData) => {
		offlineRentalPayment(formData);
	});

	const getArrivalDateTime = () => {
		const dateTime = new Date(
			`${format(rentalData.rental_date, "PP")} ${rentalData.rental_time}`
		);
		const duration = rentalData.rental_duration.split(" ")[0];
		const arrivalTime = addHours(dateTime, duration);
		return format(arrivalTime, "p");
	};

	return (
		<section className="flex flex-col md:flex-row-reverse md:divide-x-2 md:divide-x-reverse">
			<div className="md:basis-5/12 md:pl-10 flex flex-col gap-6">
				<h3 className="text-blue-500 font-semibold text-base ">
					Rental Summary
				</h3>

				<div className="space-y-1 text-sm -mt-2">
					<h4 className="font-semibold mb-1">Rentage Route</h4>
					<p>
						<span className="font-semibold text-sm md:text-base text-gray-500">
							From:
						</span>{" "}
						{rentalData?.departure}
					</p>
					<p>
						<span className="font-semibold text-sm md:text-base text-gray-500">
							Arrival:
						</span>{" "}
						{rentalData?.arrival}
					</p>
				</div>

				<div className="flex flex-wrap gap-x-5 gap-y-3">
					<div className="space-y-1">
						<h5 className="font-semibold text-sm">Departure Details</h5>
						<div className="flex flex-wrap gap-x-4 gap-y-1 text-[#1E1E1E] text-xs md:text-sm font-normal [&_p]:inline-flex [&_p]:items-center [&_p]:gap-1">
							<p>
								<CalendarIcon />
								{format(rentalData.rental_date, "PP")}
							</p>
							<p>
								<ClockIcon />
								{rentalData?.rental_time}
								{rentalData?.rental_duration
									? ` - ${getArrivalDateTime()}`
									: ""}
							</p>
						</div>
						<div className="flex flex-wrap gap-x-4 gap-y-1 text-[#1E1E1E] text-xs md:text-sm font-normal [&_p]:inline-flex [&_p]:items-center [&_p]:gap-1">
							<p>
								<UsersIcon />
								{rentalData.passengers} passenger(s)
							</p>
							{rentalData?.rental_duration && (
								<p>
									<Boat2Icon />
									{rentalData.rental_duration}
								</p>
							)}
						</div>
					</div>
				</div>

				<div className="border-y-2 border-dashed py-2 mt-5 md:mt-0">
					<table className="w-full [&_td:last-of-type]:text-right [&_td]:py-[2px] ">
						<tbody>
							{/* <tr>
                <td className="text-xs text-[#444444]">Ride Insurance</td>
                <td className="text-xs text-[#444444]">₦0</td>
              </tr> */}
							<tr>
								<td className="text-xs text-[#444444]">Rental Price</td>
								<td className="text-xs text-[#444444]">
									{formatValue({
										value: String(rentalData.rental_cost),
										prefix: "₦",
									})}
									{rentalData.rental_duration &&
										` x ${rentalData.rental_duration}`}
								</td>
							</tr>
							<tr>
								<td className="font-medium text-base">Total</td>
								<td className="font-medium text-base">
									{formatValue({
										value: String(rentalData.total_cost),
										prefix: "₦",
									})}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div className="md:basis-7/12 flex flex-col gap-5 md:pr-10">
				<div className="hidden md:block">
					<h2 className="text-base font-semibold text-blue-500">
						All Rental Details
					</h2>
					<ul className="mt-2 border-2 rounded-lg py-3 px-5 flex flex-wrap gap-y-3 gap-x-5 [&_p:first-of-type]:text-xs  [&_p:first-of-type]:font-semibold  [&_p:last-of-type]:text-gray-500  ">
						<li>
							<p>First Name</p>
							<p>{rentalData.first_name}</p>
						</li>
						<li>
							<p>Surname</p>
							<p>{rentalData.surname}</p>
						</li>
						<li>
							<p>Phone Number</p>
							<p>{rentalData.phone_number}</p>
						</li>
						<li>
							<p>Email Address</p>
							<p>{rentalData?.email}</p>
						</li>
						<li>
							<p>Passengers</p>
							<p>{rentalData?.passengers}</p>
						</li>
						<li>
							<p>Rental Date</p>
							<p>{format(rentalData?.rental_date, "PP")}</p>
						</li>
						<li>
							<p>Rental Time</p>
							<p>{rentalData?.rental_time}</p>
						</li>
						{rentalData?.rental_duration && (
							<li>
								<p>Rental duration</p>
								<p>{rentalData?.rental_duration}</p>
							</li>
						)}
					</ul>
				</div>

				{/* form */}
				<form onSubmit={onSubmit}>
					<div className="mt-20 py-8 h-36 grid grid-cols-3 gap-5">
						<SelectField
							{...register("payment_method")}
							label="Payment Method"
							placeholder="Select payment method"
							options={["POS", "Bank Transfer", "Cash"]}
							errors={errors}
							className="bg-white"
						/>
						<SelectField
							{...register("payment_status")}
							label="Payment Status"
							placeholder="Select payment status"
							options={["Success", "Canceled", "Pending"]}
							errors={errors}
							className="bg-white"
						/>
						<InputField
							{...register("transaction_ref")}
							label="Transaction Reference"
							placeholder="Enter trx ref"
							type="text"
							maxLength={35}
							className="bg-white"
							autoComplete="off"
							errors={errors}
						/>
					</div>

					<div className="flex flex-col-reverse md:flex-row gap-5 mt-10">
						<Button
							text="Back"
							variant="outline"
							className="w-full md:w-40"
							onClick={onPrevClick}
						/>
						<Button
							type="submit"
							text="Pay with Paystack"
							className=" w-full md:w-48"
						/>
					</div>
				</form>
			</div>
		</section>
	);
};
