/* eslint-disable react/prop-types */
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { formatValue } from "react-currency-input-field";
import {
	CalendarIcon,
	CircleArrowLeftIcon,
	InformationCircleIcon,
	ClockIcon,
	UsersIcon,
	Boat2Icon,
} from "@/assets/icons";
import { BookingCTX } from "@/contexts/BookingContext";
import CustomButton from "@/components/custom/Button";
import SelectField from "@/components/custom/SelectField";
import InputField from "@/components/custom/InputField";
import { usePayment } from "@/hooks/usePayment";
import { Button } from "@/components/ui/button";
import { useNavigate, Outlet, Navigate, useSearchParams, useParams } from "react-router-dom";
import { BookingForm } from "@/components/BookingDetails";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { BookingSuccessModal } from "@/components/modals/booking";

const BookTicket = () => {
	const navigate = useNavigate();

	return (
		<>
			<Helmet>
				<title>Book Ticket | Admin </title>
			</Helmet>
			<div>
				<div className="flex gap-1 items-center mb-10 ">
					<Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
						<CircleArrowLeftIcon />
					</Button>
					<h1 className="font-semibold text-lg">Salespoint Terminal</h1>
				</div>
				<Outlet />
			</div>
		</>
	);
};

export default BookTicket;

export const AdminTripDetails = () => {
	return (
		<section className="bg-white p-10 my-8 rounded-lg">
			<hgroup>
				<h2 className="text-blue-500 text-base font-semibold">
					Trip Details
				</h2>
				<p className="text-sm">Please fill in customers trip details</p>
			</hgroup>
			<BookingForm />
		</section>
	);
};

export const AdminPayment = () => {
	const { formData, loading } = React.useContext(BookingCTX);
	const { mountPortalModal, setLoading } = React.useContext(GlobalCTX);
	const { accountType } = useParams();
	const { offlinePayment } = usePayment();
	const queryClient = useQueryClient()
	const navigate = useNavigate();
	const searchParams = useSearchParams()[0];
	const ticket_id = searchParams.get("cid");
	const total_ticket_cost =
		Number(formData.bookingDetails.departure_ticket_cost) *
		Number(formData.bookingDetails.total_passengers);

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

	const { isPending, ...mutation } = useMutation({
		mutationKey: ["createOfflineBooking"],
		mutationFn: (data) => {
			return offlinePayment(data)
		},
		onSuccess: (currentUser) => {
			queryClient.invalidateQueries('bookings');
			mountPortalModal(
				<BookingSuccessModal currentUser={currentUser} onclick={() => navigate(`/backend/${accountType}/create/book-ticket`)} />);
		},
	})

	React.useEffect(() => {
		setLoading(isPending)
	}, [isPending, setLoading])

	const onSubmit = handleSubmit((formData) => {
		mutation.mutateAsync(formData)
	});

	const handlePrev = () => {
		navigate(`/backend/${accountType}/create/book-ticket/passenger-details?cid=${formData.ticket_id}`)
	}

	if (ticket_id !== formData?.ticket_id) return (<Navigate to={`/backend/${accountType}/create/book-ticket`} />)

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
							<p>{formData.passengerDetails.passenger1_first_name}</p>
						</li>
						<li>
							<p>Surname</p>
							<p>{formData.passengerDetails.passenger1_last_name}</p>
						</li>
						<li>
							<p>Phone Number</p>
							<p>{formData.passengerDetails.passenger1_phone_number}</p>
						</li>
						<li>
							<p>Email Address</p>
							<p>{formData.passengerDetails.passenger1_email}</p>
						</li>
					</ul>
				</div>
				{formData.bookingDetails?.adults_number > 1 &&
					formData.passengerDetails?.passenger2_first_name ? (
					<>
						{Array.from({
							length: formData.bookingDetails.total_passengers - 1,
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
													formData.passengerDetails[
													`passenger${num}_first_name`
													]
												}
											</p>
										</li>
										<li>
											<p>Surname</p>
											<p>
												{formData.passengerDetails[`passenger${num}_last_name`]}
											</p>
										</li>
										<li>
											<p>Phone Number</p>
											<p>
												{
													formData.passengerDetails[
													`passenger${num}_phone_number`
													]
												}
											</p>
										</li>
										<li>
											<p>Email Address</p>
											<p>
												{formData.passengerDetails[`passenger${num}_email`]}
											</p>
										</li>
									</ul>
								</div>
							);
						})}
					</>
				) : null}
				<div className="mt-20 py-8 h-36 grid grid-cols-3 gap-5">
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
						className="bg-white"
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
						onClick={handlePrev}
						variant="outline"
						className="w-40"
					>
						Back
					</CustomButton>
					<CustomButton
						type="submit"
						loading={loading}
						className="w-40"
					>
						Submit
					</CustomButton>
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
							{formData.ticket_id}
						</span>
					</p>
				</div>

				<div className="space-y-1">
					<h4 className="font-semibold mb-1">Terminals</h4>
					<p className="text-xs">
						{formData.bookingDetails.travel_from} -{" "}
						{formData.bookingDetails.travel_to}
					</p>

					<div className="flex flex-wrap gap-x-4 gap-y-1 text-[#1E1E1E] text-xs font-normal [&_p]:inline-flex [&_p]:items-center [&_p]:gap-1">
						<p>
							<Boat2Icon />
							{formData.bookingDetails.trip_type}
						</p>
						<p>
							<UsersIcon /> {formData.bookingDetails.total_passengers}{" "}
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
								{format(formData.bookingDetails.departure_date, "PP")}
							</p>
							<p>
								<ClockIcon />
								{formData.bookingDetails.departure_time}
							</p>
						</div>
					</div>
				</div>

				<div className="border-y-2 border-dashed py-2">
					<table className="w-full [&_td:last-of-type]:text-right [&_td]:py-[2px] ">
						<tbody>
							<tr>
								<td className="text-xs md:text-sm text-[#444444]">
									Ticket Price
								</td>
								<td className="text-xs md:text-sm text-[#444444]">
									{formatValue({
										value: String(
											formData.bookingDetails.departure_ticket_cost ?? 0
										),
										prefix: "₦",
									})}
									{" "}
									x {formData.bookingDetails.total_passengers}
								</td>
							</tr>
							<tr>
								<td className="font-medium text-base md:text-lg">Total</td>
								<td className="font-medium text-base md:text-lg">
									₦
									{formatValue({
										value: String(total_ticket_cost),
									})}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
