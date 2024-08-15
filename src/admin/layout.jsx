import {
	DashboardSquareIcon,
	SettingsIcon,
	TicketIcon,
	InvoiceIcon,
	SearchIcon,
	LogoutIcon,
	UserIcon,
	BookIcon,
	ShipIcon,
	MenuBoardIcon,
} from "@/assets/icons";
import {
	Outlet,
	NavLink,
	Navigate,
	useNavigate,
	Link,
	useLocation,
	useParams,
	useLoaderData,
} from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import React from "react";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { BookingCTX } from "@/contexts/BookingContext";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import Loader from "@/components/animation/Loader";
import useMediaQuery from "@mui/material/useMediaQuery";
import baseurl from "@/api";

const ProtectedRoute = () => {
	const navigate = useNavigate();
	const matches = useMediaQuery("(min-width:1240px)");
	const { adminProfile } = React.useContext(GlobalCTX);
	const { setBookingQuery, filtering, setFiltering } =
		React.useContext(BookingCTX);
	const { pathname } = useLocation();
	const dataQuery = useLoaderData();
	const accountType = adminProfile.account_type;
	const searchBarVisibility = [
		`/backend/${accountType}/booking-details`,
		`/backend/${accountType}/rental-details`,
		`/backend/${accountType}/create/check-in`,
		`/backend/${accountType}/customers`,
	].includes(pathname);

	React.useEffect(() => {
		const terminals = adminProfile.terminal.map((location) =>
			location.split(",")[1].trim().toLowerCase()
		);
		// Filter records based on the terminal
		const sortedQuery = dataQuery.filter((booking) => {
			const city = booking.travel_from.split(",")[1].trim().toLowerCase();
			return terminals.includes(city);
		});
		setBookingQuery(sortedQuery);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataQuery]);

	React.useEffect(() => {
		setFiltering("");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	const menuItems = [
		[
			"Dashboard",
			`/backend/${accountType}/dashboard`,
			<DashboardSquareIcon key="1" />,
			["admin", "super-admin", "dev"],
		],
		[
			"Create",
			`/backend/${accountType}/create`,
			<TicketIcon key="1" />,
			["salesperson", "dev"],
		],
		[
			"Schedule Trip",
			`/backend/${accountType}/schedule-trip`,
			<div key="1" className="scale-[.85] -ml-1">
				<MenuBoardIcon />
			</div>,
			["super-admin", "dev"],
		],
		[
			"Journey List",
			`/backend/${accountType}/journey-list`,
			<InvoiceIcon key="1" />,
			["admin", "super-admin", "salesperson", "dev"],
		],
		[
			"Booking Details",
			`/backend/${accountType}/booking-details`,
			<BookIcon key="1" />,
			["admin", "super-admin", "salesperson", "dev"],
		],
		[
			"Rental Details",
			`/backend/${accountType}/rental-details`,
			<ShipIcon key="1" />,
			["admin", "super-admin", "salesperson", "dev"],
		],
		[
			"Customers",
			`/backend/${accountType}/customers`,
			<UserIcon key="1" />,
			["admin", "super-admin", "dev"],
		],
		[
			"Settings",
			`/backend/${accountType}/settings`,
			<SettingsIcon key="1" />,
			["admin", "super-admin", "salesperson", "dev"],
		],
	];

	const handleLogout = () => {
		localStorage.removeItem("access token");
		localStorage.removeItem("admin");
		navigate("login");
	};

	const handleChange = (event) => {
		setFiltering(event.target.value);
	};

	return (
		<>
			<Helmet>
				<title>Admin | Abitto Ferry</title>
			</Helmet>
			<div className="relative">
				{/* sidebar */}
				<aside className=" h-screen w-40 md:w-60 bg-black text-white flex flex-col gap-10 fixed">
					<img
						alt="logo"
						src="https://i.ibb.co/17zsqj1/logo2.png"
						width={176}
						height={60}
						className="px-5"
					/>
					<nav className="px-5 mx-auto">
						<ul>
							{menuItems.map(([title, url, icon, auth]) => {
								const isAuth = auth.includes(accountType);
								return (
									<>
										{isAuth && (
											<li key={title}>
												<NavLink
													to={url}
													className="[&.active]:bg-blue-500 px-5 py-3 rounded-xl hover:bg-gray-700/90 mb-2 transition-all  ease-in-out cursor-pointer flex items-center gap-2 [&>.title]:hidden  w-fit md:w-full md:[&>.title]:block"
												>
													<span className="text-[#f1f1f1]">{icon}</span>
													<span className="title font-medium text-sm ">
														{title}
													</span>
												</NavLink>
											</li>
										)}
									</>
								);
							})}
						</ul>
					</nav>
					<button
						className=" px-10 py-5 mt-auto flex items-center gap-2 hover:bg-gray-900/80 "
						onClick={handleLogout}
					>
						<LogoutIcon />
						<span>Logout</span>
					</button>
				</aside>
				<main className="ml-40 md:ml-60  bg-[#F7F7F7] ">
					<header className="h-16 w-full bg-white px-8 flex items-center gap-5">
						{searchBarVisibility && (
							<div className="h-10 w-80 bg-blue-50 p-3 border border-blue-500 rounded-lg font-normal text-xs font-poppins flex items-center gap-2">
								<SearchIcon />
								<input
									onChange={handleChange}
									value={filtering}
									type="text"
									className="bg-transparent w-full focus:outline-none py-1"
									placeholder="Search by booking Id or name"
								/>
							</div>
						)}
						<div className="ml-auto flex gap-3 text-right">
							<div className=" leading-none self-end">
								<p className="font-semibold">{adminProfile.first_name}</p>
								<p className="text-sm font-medium text-gray-500 lowercase">
									{adminProfile.account_type} - {adminProfile.city}
								</p>
							</div>
							<Link to={`/backend/${accountType}/settings`}>
								<Avatar
									alt={adminProfile.first_name.substring(0, 1)}
									src={adminProfile.profile_picture}
									className="bg-gray-300"
								/>
							</Link>
						</div>
					</header>
					<section className="relative min-h-[calc(100vh-64px)]">
						<div className="p-8">
							{matches ? (
								<Outlet />
							) : (
								<p>Switch to desktop or reduce screen zoom to 100% to view</p>
							)}
						</div>
						<Loader />
					</section>
				</main>
			</div>
		</>
	);
};

const AdminLayout = () => {
	const { adminProfile } = React.useContext(GlobalCTX);
	const { accountType } = useParams();
	const account_type = adminProfile.account_type;
	const accessToken = JSON.parse(localStorage.getItem("access token")) ?? "";
	const isAuth = accessToken && String(accountType).includes(account_type);

	return <>{isAuth ? <ProtectedRoute /> : <Navigate to="/login" />}</>;
};

export default AdminLayout;

export const DataQueryLoader = async () => {
	try {
		const response = await baseurl.get("/booking/queryall");
		return response.data.bookings.reverse();
	} catch (error) {
		if (
			!error.code === "ERR_NETWORK" ||
			!error.code === "ERR_INTERNET_DISCONNECTED" ||
			!error.code === "ECONNABORTED"
		) {
			toast.error("Could not retrieve booking details. Refresh page.");
		}
		return [];
	}
};
