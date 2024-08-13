import React from "react";
import Button from "@/components/custom/Button";
import { Eye, EyeSlash } from "iconsax-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import baseurl from "@/api";

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
		baseurl
			.post("/user/login", formData)
			.then((res) => {
				if (res.status == 200) {
					const { user, token } = res.data;
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
					localStorage.setItem("access token", JSON.stringify(token));
					return navigate(navigateTo(user.account_type));
				}
			})
			.catch((error) => {
				if (
					!error.code === "ERR_NETWORK" ||
					!error.code === "ERR_INTERNET_DISCONNECTED" ||
					!error.code === "ECONNABORTED"
				)
					toast.error(`${error.message}`);
			})
			.finally(() => setLoading(false));
	});

	const navigateTo = (account_type) => {
		switch (account_type) {
			case "super-admin":
				return "/backend/super-admin/dashboard";
			case "admin":
				return "/backend/admin/dashboard";
			case "salesperson":
				return "/backend/salesperson/create";
			case "dev":
				return "/backend/dev/dashboard";
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

					{/* <div className="flex justify-between items-center"> */}
					{/* <label className="flex items-center gap-1 w-fit">
            <input type="checkbox" />
            <span className="text-xs">Remember me</span>
          </label> */}
					{/* <p className="font-semibold text-sm hover:underline cursor-pointer">
              Forgot password
            </p>
          </div> */}

					<Button
						className="rounded-lg mt-2"
						text="Sign in"
						type="submit"
						loading={loading}
					/>
				</form>
			</div>
		</div>
	);
};

export default Login;
