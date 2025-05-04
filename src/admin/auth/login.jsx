import React from "react";
import CustomButton from "@/components/custom/Button";
import { Eye, EyeSlash } from "iconsax-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "@/api";
import Cookies from 'js-cookie';

const schema = yup.object().shape({
	email: yup
		.string()
		.required("Email address is required.")
		.email("Invalid email."),
	password: yup.string().required("Password is required."),
});

const Login = () => {
	const [showPassword, setShowPassword] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const { setAdminProfile } = React.useContext(GlobalCTX);
	const navigate = useNavigate();

	const {
		formState: { errors },
		register,
		handleSubmit,
	} = useForm({ mode: "onChange", resolver: yupResolver(schema) });

	const onSubmit = handleSubmit((formData) => {
		setLoading(true);
		axiosInstance
			.post("/user/login", formData)
			.then((res) => {
				if (res.status === 200) {
					const { user, token } = res.data;
					toast.success(`Welcome back ${user.first_name}`);
					setAdminProfile({
						account_type: user.account_type,
						email: user.email,
						first_name: user.first_name,
						last_name: user.last_name,
						profile_picture: user.profile_picture,
						gender: user.gender,
						city: user.city,
						terminal: user.terminal,
					});
					Cookies.set('access_token', token, {
						expires: 1, secure: true, sameSite: 'strict'
					});
					setTimeout(() => navigate(navigateTo(user.account_type)), 100);
				}
			})
			.catch((error) => {
				if (error.code === "ERR_BAD_REQUEST")
					toast.error("Email or password is incorrect.");
				else
					toast.error("An error occurred. Try again.");
			})
			.finally(() => setLoading(false));
	});

	const navigateTo = (account_type) => {
		switch (account_type) {
			case "super-admin":
			case "dev":
			case "admin":
				return `/backend/${account_type}/dashboard`;
			case "salesperson":
				return "/backend/salesperson/create";
			default:
				return "/login";
		}
	};

	return (
		<div className="bg-[#F7F7F7] min-h-screen flex justify-center items-center font-poppins p-5">
			<div className="bg-white rounded-lg flex flex-col gap-5 p-5 md:p-14 w-full max-w-[500px]">
				<figure className="mx-auto">
					<img
						alt="logo"
						src="https://i.ibb.co/Zh8H4Wz/logo3.png"
						width={176}
						height={60}
					/>
				</figure>

				<hgroup className="text-center mt-2">
					<h1 className="font-semibold text-2xl">Welcome Back</h1>
					<p className="text-xs">Please sign in to your account</p>
				</hgroup>

				<form className="flex flex-col gap-5" onSubmit={onSubmit}>
					<div className="flex flex-col w-full">
						<label className="text-sm !w-full flex gap-3 flex-col ">
							Email
							<input
								{...register("email")}
								type="email"
								placeholder="Enter email address"
								autoComplete="email"
								maxLength={50}
								className="h-10 bg-blue-50 p-3 border border-blue-500 font-normal text-xs w-full rounded-lg font-poppins "
							/>
						</label>
						{errors?.email && (
							<p className="text-xs pt-2 text-red-700">
								{errors?.email.message}
							</p>
						)}
					</div>

					<div className="flex flex-col w-full">
						<label className="text-sm !w-full flex gap-3 flex-col ">
							Password
							<div className="relative">
								<input
									{...register("password")}
									type={showPassword ? "text" : "password"}
									placeholder="Enter password"
									autoComplete="current-password"
									maxLength={35}
									className="h-10 bg-blue-50 p-3 border border-blue-500 font-normal text-xs w-full rounded-lg font-poppins "
								/>
								<button
									type="button"
									className=" hover:bg-blue-500/30 absolute top-0 right-0 h-10 px-3 rounded-e-lg transition"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? <EyeSlash /> : <Eye />}
								</button>
							</div>
						</label>
						{errors?.password && (
							<p className="text-xs pt-2 text-red-700">
								{errors?.password.message}
							</p>
						)}
					</div>
					<CustomButton
						className="rounded-lg mt-2"
						type="submit"
						loading={loading}
					>
						Sign in
					</CustomButton>
				</form>
			</div>
		</div>
	);
};

export default Login;
