import React from "react";
import { useForm } from "react-hook-form";
import InputField from "@/components/custom/InputField";
import SelectField from "@/components/custom/SelectField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/components/custom/Button";
import Rating from "@mui/material/Rating";
import baseurl from "@/api";
import { GlobalCTX } from "@/contexts/GlobalContext";
import SuccessModal from "@/components/modals/success";
import { TextareaAutosize } from '@mui/base';
import { toast } from "sonner";


const feedbackSchema = yup.object().shape({
	first_name: yup
		.string()
		.required("First name is required.")
		.min(2, "First name must have at least 2 characters.")
		.trim()
		.lowercase(),
	surname: yup
		.string()
		.required("Surname field is required.")
		.min(2, "Surname must have at least 2 characters.")
		.trim()
		.lowercase(),
	phone_number: yup
		.string()
		.required("Phone number is required.")
		.matches(/^\+?\d+$/, "Invalid phone number.")
		.min(11, "Phone number must have at least 11 characters.")
		.trim(),
	email: yup
		.string()
		.email("Invalid email.")
		.required("Email address is required.")
		.trim()
		.lowercase(),
	feedback_title: yup
		.string()
		.required("This field is required.")
	,
	service_type: yup
		.string()
		.required("This field is required.")
	,
	comment: yup
		.string().notRequired().trim(),
});

const Feedback = () => {
	const [starRating, setStarRating] = React.useState(0);
	const { setLoading, mountPortalModal } = React.useContext(GlobalCTX);

	const {
		register,
		formState: { errors, isSubmitted },
		handleSubmit,
		reset,
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(feedbackSchema),
	});

	const onSubmit = handleSubmit((formData) => {
		setLoading(true);
		const formValues = {
			...formData,
			feedback_title: getTitle(formData.feedback_title),
			star_rating: starRating,
		};

		baseurl
			.post("feedback/new", formValues)
			.then((res) => {
				if (res.status == 200) {
					mountPortalModal(
						<SuccessModal
							header="We have received your feedback"
							text="Thank you for your feedback. This will help use serve you better."
							onclick={handleReset}
						/>)
				}
			})
			.catch((error) => {
				if (
					!error.code === "ERR_NETWORK" ||
					!error.code === "ERR_INTERNET_DISCONNECTED" ||
					!error.code === "ECONNABORTED"
				) {
					toast.error("Bad Request.", {
						description: "Could not send feedback. Please try again."
					});
				}
			})
			.finally(() => setLoading(false));
	});

	const handleReset = () => {
		reset();
		setStarRating(0);
	}

	const getTitle = (feedback) => {
		const title = feedback.includes("compliment") ? "Compliment" :
			feedback.includes("suggestion") ? "Suggestion" :
				feedback.includes("complaint") ? "Complaint" :
					feedback.includes("information") ? "Information" :
						"Other";

		return title;
	}

	return (
		<div className="px-2 py-32">
			<div className="max-w-[1000px] w-full mx-auto min-h-12 bg-white p-5 md:p-10 rounded-lg">
				<hgroup className="mb-8">
					<h2 className="text-blue-500 text-lg font-semibold mb-1">
						Get in Touch
					</h2>
					<p className="font-medium text-sm md:text-base">
						Your feedback is important for us to better understand your needs
						and tailor our services accordingly.
					</p>
				</hgroup>
				<form onSubmit={onSubmit} className="flex flex-col gap-y-5 md:gap-y-7">
					<SelectField
						{...register("feedback_title")}
						label="Choose the option that best suits your request"
						placeholder="Select a title option"
						options={[
							"Are you making a compliment?",
							"Are you making a suggestion?",
							"Are you making a complaint?",
							"Are you requesting information?",
							"Other "
						]}
						errors={errors}
						formState={isSubmitted}
					/>
					<SelectField
						{...register("service_type")}
						label="This concerns which of our services?"
						placeholder="Select a service option"
						options={["Boat trip", "Boat rental", "Logistics", "General"]}
						errors={errors}
						formState={isSubmitted}
					/>

					<div className="space-y-3">
						<label className="text-xs md:text-sm">Comment</label>
						<TextareaAutosize
							{...register("comment")}
							aria-label="comment textarea"
							placeholder="Add a comment..."
							minRows={6}
							className="bg-blue-50 p-3 border border-blue-500 font-normal !text-base placeholder:text-xs w-full rounded-lg font-poppins resize-none focus:outline-none"
						/>
					</div>

					{/* name and email */}
					<div className="flex flex-col md:flex-row gap-5">
						<InputField
							{...register("first_name")}
							label="First name"
							placeholder="Enter first name"
							type="text"
							maxLength={35}
							errors={errors}
						/>
						<InputField
							{...register("surname")}
							label="Surname"
							placeholder="Enter surname"
							type="text"
							maxLength={35}
							errors={errors}
						/>
					</div>

					{/* phone and email */}
					<div className="flex flex-col md:flex-row gap-5">
						<InputField
							{...register("phone_number")}
							label="Phone number"
							placeholder="Enter phone number"
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
							onClick={handleReset}
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
