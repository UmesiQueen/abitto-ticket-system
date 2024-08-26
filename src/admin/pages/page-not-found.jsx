import React from "react";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const PageNotFoundAdmin = () => {
	const navigate = useNavigate();
	const { adminProfile } = React.useContext(GlobalCTX);
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
		<>
			<Helmet>
				<title>Page Not Found</title>
			</Helmet>
			<div className="h-[70vh] flex flex-col justify-center items-center ">
				<h1 className="font-bold text-4xl my-10 text-slate-900 ">
					Page Not Found.
				</h1>
				<button
					onClick={() => navigate(navigateTo(adminProfile.account_type))}
					className=" bg-green-500 py-3 px-6 font-semibold text-sm  hover:bg-green-700 transition-all duration-100  ease-in-out hover:scale-[1.1] text-white mt-5"
				>
					Go Home
				</button>
			</div>
		</>
	);
};

export default PageNotFoundAdmin;
