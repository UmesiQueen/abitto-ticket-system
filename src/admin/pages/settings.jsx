/* eslint-disable react/prop-types */
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Cloud2Icon, UserIcon, PasswordIcon } from "@/assets/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SelectField from "@/components/custom/SelectField";
import InputField from "@/components/custom/InputField";
import Button from "@/components/custom/Button";
import { toast } from "sonner";
import PasswordField from "@/components/custom/PasswordField";
import {
	editProfileSchema,
	passwordSchema,
} from "@/lib/validators/settingSchema";
import DefaultProfile from "@/assets/images/default_profile.png";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { BookingCTX } from "@/contexts/BookingContext";
import axios from "axios";
import baseurl from "@/api/instance";
import { isValidUrl } from "@/lib/utils";

const Settings = () => {
	return (
		<>
			<Helmet>
				<title>Settings | Admin</title>
			</Helmet>
			<h1 className="font-semibold text-lg ">Settings</h1>
			<div className="bg-white rounded-lg p-8 pl-0 mb-5 mt-8 [&_label]:font-medium">
				<Tabs
					defaultValue="edit profile"
					className="flex gap-10 divide-x-2 divide-gray-500"
				>
					<TabsList className="flex flex-col gap-2 [&_button]:min-w-56 pl-4 h-full bg-transparent rounded-none ">
						<StyledTabsTrigger
							value="edit profile"
							title="Edit Profile"
							icon={<UserIcon />}
						/>
						<StyledTabsTrigger
							value="change password"
							title="Change Password"
							icon={<PasswordIcon />}
						/>
					</TabsList>
					<StyledTabsContent value="edit profile" content={<EditProfile />} />
					<StyledTabsContent
						value="change password"
						content={<ChangePassword />}
					/>
				</Tabs>
			</div>
		</>
	);
};

const StyledTabsContent = ({ value, content }) => {
	return (
		<TabsContent
			value={value}
			className="data-[state=active]:flex-grow min-h-[420px] pl-10 mb-5  mt-0"
		>
			{content}
		</TabsContent>
	);
};

const StyledTabsTrigger = ({ value, title, icon }) => {
	return (
		<TabsTrigger
			value={value}
			className="data-[state=active]:bg-blue-500 data-[state=active]:text-white py-3 hover:bg-gray-200 rounded-lg justify-start gap-2"
		>
			<span>{icon}</span>
			{title}
		</TabsTrigger>
	);
};

export default Settings;

const EditProfile = () => {
	const { adminProfile, setAdminProfile } = React.useContext(GlobalCTX);
	const { loading, setLoading } = React.useContext(BookingCTX);

	const {
		handleSubmit,
		register,
		formState: { errors, defaultValues },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(editProfileSchema),
		defaultValues: {
			...adminProfile,
			location: "Nigeria",
		},
	});

	const onSubmit = handleSubmit((formData) => {
		EditProfileRequest(formData);
	});

	const EditProfileRequest = async (formData) => {
		setLoading(true);
		const file = formData.profile_picture[0];
		const cloudinaryData = new FormData();
		cloudinaryData.append("file", file);
		cloudinaryData.append("upload_preset", "mettsotz");

		const response = await axios
			.post(
				"https://api.cloudinary.com/v1_1/queen-dev/image/upload",
				cloudinaryData
			)
			.then((res) => {
				return res.data.url;
			})
			.catch((err) => {
				console.error(err, "Failed to upload profile picture to cloudinary");
				setLoading(false);
				return false;
			});

		if (response) {
			await base
				.post("/user/editprofile", {
					...formData,
					profile_picture: response,
				})
				.then((res) => {
					const user = res.data.user;
					setAdminProfile((prev) => ({
						...prev,
						email: user.email,
						first_name: user.first_name,
						last_name: user.last_name,
						profile_picture: user.profile_picture,
						gender: user.gender,
						city: user.city,
					}));
					toast.success("Profile successfully updated.");
				})
				.catch(() => {
					toast.error("Error occurred while updating profile.");
				})
				.finally(() => {
					setLoading(false);
				});
		}
	};

	return (
		<>
			<form
				onSubmit={onSubmit}
				className="[&_input]:bg-white [&_input]:border-gray-500 space-y-8"
			>
				<ProfilePicture
					{...register("profile_picture")}
					errors={errors}
					defaultValue={defaultValues.profile_picture}
				/>

				<div className="flex gap-6">
					<InputField
						{...register("first_name")}
						label="First Name"
						placeholder="Enter first name"
						type="text"
						maxLength={35}
						errors={errors}
					/>
					<InputField
						{...register("last_name")}
						label="Last Name"
						placeholder="Enter last name"
						type="text"
						maxLength={35}
						errors={errors}
					/>
				</div>
				<div className="flex gap-6">
					<InputField
						{...register("email")}
						label="Email"
						placeholder="Enter email address"
						type="email"
						maxLength={40}
						errors={errors}
					/>
					<SelectField
						{...register("gender")}
						label="Gender"
						placeholder="Select gender"
						options={["female", "male"]}
						className="bg-white !border-gray-500"
						errors={errors}
						defaultValue={defaultValues.gender}
					/>
				</div>
				<div className="flex gap-6">
					<InputField
						{...register("location")}
						label="Location"
						placeholder="Enter location"
						type="text"
						maxLength={35}
						errors={errors}
					/>
					<InputField
						{...register("city")}
						label="City"
						placeholder="Enter city"
						type="text"
						maxLength={35}
						errors={errors}
					/>
				</div>

				<Button
					type="submit"
					className="w-32 "
					loading={loading}
					text="Update"
				/>
			</form>
		</>
	);
};

// eslint-disable-next-line react/display-name
const ProfilePicture = React.forwardRef((props, ref) => {
	const { onChange, errors, defaultValue } = props;
	const profile = isValidUrl(defaultValue) ? defaultValue : DefaultProfile;
	const [preview, setPreview] = React.useState(profile);

	const handleImageUpload = (event) => {
		const file = event?.target.files[0];
		onChange(event);
		setPreview(URL.createObjectURL(file));
	};

	return (
		<div>
			<div className="bg-gray-300 rounded-full overflow-hidden h-56 aspect-square mx-auto mb-8">
				<img
					alt="profile"
					src={preview}
					className=" w-full h-full object-cover"
				/>
			</div>
			<label className="text-base text-blue-500 font-medium flex gap-2 items-center w-fit mx-auto py-1 px-2 rounded-lg cursor-pointer hover:bg-blue-50">
				<Cloud2Icon /> Upload Profile Picture
				<input
					{...props}
					defaultValue={""}
					ref={ref}
					type="file"
					className="hidden"
					accept=".jpg, .jpeg, .png"
					onChange={handleImageUpload}
				/>
			</label>
			{errors?.profile_picture && (
				<p className="text-xs pt-2 text-red-700 font-medium text-center">
					{errors?.profile_picture.message}
				</p>
			)}
		</div>
	);
});

const ChangePassword = () => {
	const { loading, setLoading } = React.useContext(BookingCTX);
	const { adminProfile } = React.useContext(GlobalCTX);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(passwordSchema),
	});

	const onSubmit = handleSubmit((formData) => {
		setLoading(true);

		const formValues = {
			old_password: formData.currentPassword,
			new_password: formData.newPassword,
			email: adminProfile.email,
		};

		baseurl
			.post("/user/changepassword", formValues)
			.then((res) => {
				toast.success(res.data.message);
				reset();
			})
			.catch((err) => {
				console.error(err, "Error occurred while changing password.");
				if (err.code == "ERR_NETWORK")
					return toast.error("Please check your internet connection.");
				if (err.code == "ERR_BAD_REQUEST")
					return toast.error("Old password is incorrect.");
				return toast.error("Error occurred while changing password.Try again.");
			})
			.finally(() => {
				setLoading(false);
			});
	});

	return (
		<>
			<h2 className="font-semibold mb-10">Reset Password</h2>
			<form
				onSubmit={onSubmit}
				className="space-y-8 [&_input]:bg-white [&_input]:border-gray-500 w-[30rem]"
			>
				<PasswordField
					{...register("currentPassword")}
					label="Current Password"
					placeholder="Enter current password"
					errors={errors}
				/>
				<PasswordField
					{...register("newPassword")}
					label="New Password"
					placeholder="Enter new password"
					errors={errors}
				/>
				<PasswordField
					{...register("confirmPassword")}
					label="Re-Enter New Password"
					placeholder="Re-enter new password"
					errors={errors}
				/>
				<Button
					className="w-32"
					type="submit"
					text="Update"
					loading={loading}
				/>
			</form>
		</>
	);
};
