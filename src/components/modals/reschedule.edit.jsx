/* eslint-disable react/prop-types */
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import DatePicker from "react-datepicker";
import { format, addHours } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { GlobalCTX } from "@/contexts/GlobalContext";
import CustomButton from "@/components/custom/Button";
import { CalendarIcon, ClockIcon, CancelSquareIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { useScheduleTrip } from "@/hooks/useScheduleTrip";
import ConfirmationModal from "@/components/modals/confirmation";
import { NumericFormat } from "react-number-format";
import { formatValue } from "react-currency-input-field";
import InputField from "@/components/custom/InputField";

const rescheduleSchema = yup.object().shape({
	date: yup.string().required("Date field is required."),
	time: yup.string().required("Time field is required."),
	cost: yup.string().required("Ticket cost is required."),
	trip_capacity: yup.string().required("Capacity is required."),
});

const RescheduleEditModal = ({ tripDetails }) => {
	const { unMountPortalModal, setModalContent } = React.useContext(GlobalCTX);
	const { rescheduleRequest } = useScheduleTrip();
	const { date, time, ticket_cost, ...otherDetails } = tripDetails;
	const {
		control,
		register,
		formState: { errors, isDirty },
		handleSubmit,
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(rescheduleSchema),
		defaultValues: {
			date,
			time: dayjs(`${date} ${time}`),
			cost: formatValue({ value: String(ticket_cost), prefix: "₦" }),
			trip_capacity: otherDetails?.trip_capacity ?? 29
		},
	});

	const onSubmit = handleSubmit((formData) => {
		const { time, cost, trip_capacity, ...otherFormData } = formData;
		const formValues = {
			time: format(addHours(time, 0), "p"),
			ticket_cost: formatCost(cost),
			...otherDetails,
			...otherFormData,
			trip_capacity: Number(trip_capacity),
		};

		setModalContent(
			<ConfirmationModal
				props={{
					header: "Reschedule trip",
					handleRequest: () => {
						rescheduleRequest(formValues);
					},
					severity: "warning",
				}}
			/>
		);
	});

	const formatCost = (cost) => {
		if (cost.includes("₦"))
			return cost
				.substring(1)
				.split("")
				.filter((cost) => cost !== ",")
				.join("");

		return cost;
	};

	return (
		<div className="bg-white rounded-lg p-10 pt-5 min-w-[700px] flex flex-col gap-5 relative">
			<Button
				size="icon"
				variant="ghost"
				className="absolute top-0 right-0"
				onClick={unMountPortalModal}
			>
				<CancelSquareIcon />
			</Button>
			<h3 className="font-bold text-center text-lg">Edit Journey Details</h3>
			<form onSubmit={onSubmit}>
				<div className="grid grid-cols-2 gap-5">
					{/* time */}
					<div className="flex flex-col w-full">
						<label htmlFor="time" className="font-semibold text-xs md:text-sm w-full flex gap-2 md:gap-3 flex-col relative">
							Select new time
							<Controller
								control={control}
								name="time"
								render={({ field }) => {
									const { onChange, name, ...otherFields } = field;
									return (
										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<TimeField
												{...otherFields}
												onChange={(e) => {
													onChange({ target: { name, value: e } });
												}}
												sx={{
													"& .MuiOutlinedInput-notchedOutline": {
														display: "none",
													},
													"& .MuiInputBase-root": {
														height: "3rem",
														borderRadius: "0.5rem",
														borderColor: "#6b7280",
														borderWidth: "1px",
														paddingX: "14px",
													},
													"& .MuiInputBase-input": { padding: 0 },
												}}
											/>
										</LocalizationProvider>
									);
								}}
							/>
							<div className="absolute right-4 bottom-4">
								<ClockIcon />
							</div>
						</label>
						{errors?.time && (
							<p className="text-xs pt-2 text-red-700">
								{errors?.time.message}
							</p>
						)}
					</div>

					{/* date */}
					<div className="flex flex-col w-full">
						<label htmlFor="date" className="font-semibold text-xs md:text-sm !w-full flex flex-col ">
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
							<p className="text-xs pt-2 text-red-700">
								{errors?.date.message}
							</p>
						)}
					</div>

					{/* NumericFormat Input Field */}
					<div className="flex flex-col w-full">
						<label htmlFor="cost" className="font-semibold text-xs md:text-sm w-full flex flex-col">
							Enter new ticket cost
							<Controller
								control={control}
								name="cost"
								render={({ field: { name, onChange, onBlur, value, ref } }) => {
									return (
										<NumericFormat
											prefix="₦"
											getInputRef={ref}
											onBlur={onBlur}
											name={name}
											value={value}
											placeholder="Enter new ticket cost"
											thousandSeparator=","
											allowNegative={false}
											onValueChange={(_, sourceInfo) => {
												onChange(sourceInfo.event);
											}}
											className="h-10 md:h-12 border border-gray-500 font-normal text-base w-full !px-4 !rounded-lg font-poppins mt-2 md:mt-3 text-left"
										/>
									);
								}}
							/>
						</label>
						{errors?.cost && (
							<p className="text-xs pt-2 text-red-700">
								{errors?.cost.message}
							</p>
						)}
					</div>

					<div className="[&_label]:font-semibold">
						<InputField
							{...register("trip_capacity")}
							label="Capacity"
							placeholder="Enter boat capacity"
							type="number"
							variant="white"
							maxLength={50}
							errors={errors}
						/>
					</div>
				</div>
				<CustomButton
					disabled={!isDirty}
					type="submit"
					className="w-full mt-8 !h-12"
				>
					Continue
				</CustomButton>
			</form>
		</div>
	);
};

export default RescheduleEditModal;
