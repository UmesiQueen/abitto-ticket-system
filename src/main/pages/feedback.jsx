import React from "react";
import { useForm, Controller } from "react-hook-form";
import InputField from "@/components/custom/InputField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import DatePicker from "react-datepicker";
import { CalendarIcon, ClockIcon } from "@/assets/icons";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import Button from "@/components/custom/Button";
import Rating from "@mui/material/Rating";

const feedbackSchema = yup.object().shape({
	full_name: yup
		.string()
		.required("This field is required.")
		.trim()
		.lowercase(),
	email: yup
		.string()
		.email("Invalid email.")
		.required("Email address is required.")
		.trim()
		.lowercase(),
	travel_date: yup.string().notRequired(),
	travel_time: yup.string().notRequired(),
	trip_remark: yup.string().notRequired(),
	comment: yup.string().notRequired(),
});

const Feedback = () => {
	const [suggestions, setSuggestions] = React.useState([]);
	const [starRating, setStarRating] = React.useState(0);

	const {
		register,
		formState: { errors },
		handleSubmit,
		control,
		reset,
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(feedbackSchema),
	});

	const onSubmit = handleSubmit((formData) => {
		const formValues = {
			...formData,
			suggestions,
			...(formData?.travel_time && {
				travel_time: format(new Date(formData.travel_time), "p"),
			}),
			star_rating: starRating,
		};
		console.log(formValues, "formData");
	});

	return (
		<div className="px-2 py-32">
			<div className="max-w-[1000px] w-full mx-auto min-h-12 bg-white p-5 md:p-10 rounded-lg">
				<hgroup className="mb-8">
					<h2 className="text-blue-500 text-lg font-semibold mb-1">
						Get in Touch
					</h2>
					<p className="font-medium md:w-4/6 text-sm md:text-base">
						Your feedback is important for us to better understand your needs
						and tailor our services accordingly.
					</p>
				</hgroup>
				<form onSubmit={onSubmit} className="flex flex-col gap-y-5 md:gap-y-7">
					{/* name and email */}
					<div className="flex flex-col md:flex-row gap-5">
						<InputField
							{...register("full_name")}
							label="Full name"
							placeholder="Enter full name"
							type="text"
							maxLength={35}
							errors={errors}
						/>
						<InputField
							{...register("email")}
							label="Email"
							placeholder="Enter email address"
							type="email"
							maxLength={35}
							errors={errors}
						/>
					</div>

					{/* date and time */}
					<div className="flex flex-col md:flex-row gap-5">
						<div className="flex w-full">
							<label className="text-xs md:text-sm w-full flex flex-col ">
								Travel date
								<Controller
									control={control}
									name="travel_date"
									render={({ field }) => (
										<DatePicker
											icon={<CalendarIcon />}
											showIcon
											toggleCalendarOnIconClick={true}
											closeOnScroll
											className="bg-blue-50 h-10 md:h-12 border border-blue-500 font-normal text-base w-full !px-4 !rounded-lg font-poppins mt-2 md:mt-3 text-left"
											onChange={(date) => field.onChange(date)}
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
						</div>

						<div className="flex w-full">
							<label className="text-xs md:text-sm w-full flex gap-2 md:gap-3 flex-col relative">
								Travel time
								<Controller
									control={control}
									name="travel_time"
									render={({ field }) => (
										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<TimeField
												{...field}
												sx={{
													"& .MuiOutlinedInput-notchedOutline": {
														display: "none",
													},
													"& .MuiInputBase-root": {
														height: { xs: "2.5rem", sm: "3rem" },
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
						</div>
					</div>

					{/* TEXT AREA */}
					<div className="flex flex-col w-full">
						<label
							className={
								"text-xs md:text-sm !w-full flex gap-2 md:gap-3 flex-col"
							}
						>
							How was your trip?
							<Textarea
								{...register("trip_remark")}
								placeholder="Tell us about your trip?"
								rows="6"
								className="bg-blue-50 p-3 border border-blue-500 font-normal !text-base placeholder:text-xs w-full rounded-lg font-poppins resize-none "
							/>
						</label>
					</div>

					<div className="space-y-4">
						<label className="text-xs md:text-sm">Suggest improvements?</label>
						<ul className="flex flex-wrap gap-2">
							{[
								"Overall Service",
								"Customer Support",
								"Speed and Efficiency",
								"Pickup and Delivery Service",
							].map((title, index) => {
								const isActive = suggestions.length
									? suggestions.includes(title)
										? true
										: false
									: false;
								return (
									<li key={index}>
										<button
											type="button"
											data-state={isActive ? "active" : ""}
											onClick={() => {
												if (isActive) {
													return setSuggestions((prev) =>
														prev.filter((item) => item != title)
													);
												}

												return setSuggestions((prev) => [...prev, title]);
											}}
											className="bg-blue-50 data-[state=active]:bg-blue-400 data-[state=active]:shadow-md data-[state=active]:text-white rounded-lg text-[10px] md:text-xs p-2 px-3 font-semibold transition-all hover:bg-blue-100 "
										>
											{title}
										</button>
									</li>
								);
							})}
						</ul>
						<Textarea
							{...register("comment")}
							placeholder="Add a comment..."
							rows={6}
							className="bg-blue-50 p-3 border border-blue-500 font-normal !text-base placeholder:text-xs w-full rounded-lg font-poppins resize-none "
						/>
					</div>

					<div className="flex flex-col md:flex-row items-center gap-3 mt-3">
						<h2 className="font-semibold text-sm md:text-lg text-center">
							How would you rate your experience?
						</h2>

						<Rating
							name="star_rating"
							value={starRating}
							onChange={(_, newValue) => {
								setStarRating(newValue);
							}}
							size="large"
							sx={{
								"& .MuiRating-iconFilled": {
									color: "#3366CC",
								},
								"& .MuiRating-iconHover": {
									color: "#0167ff",
								},
							}}
						/>
					</div>

					<div className="flex justify-between gap-5 items-center mt-10">
						<Button text="Submit" type="submit" className="w-40 md:w-44" />
						<button
							type="button"
							onClick={() => {
								reset();
								setSuggestions([]);
								setStarRating(0);
							}}
							className="text-sm md:text-base hover:text-blue-700 font-semibold"
						>
							Clear form
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Feedback;
