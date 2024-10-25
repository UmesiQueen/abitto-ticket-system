import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { GlobalCTX } from "@/contexts/GlobalContext";
import Cookies from 'js-cookie';

const PageNotFound = () => {
	const { adminProfile } = React.useContext(GlobalCTX);
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const isAuth = Cookies.get('access_token');
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
	const returnPath =
		pathname.includes("/backend") && isAuth
			? navigateTo(adminProfile.account_type)
			: "/";

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
					type="button"
					onClick={() => navigate(returnPath)}
					className=" bg-green-500 py-3 px-6 font-semibold text-sm  hover:bg-green-700 transition-all duration-150 ease-in-out hover:scale-[1.05] text-white mt-5"
				>
					Go Home
				</button>
			</div>
		</>
	);
};

export default PageNotFound;
