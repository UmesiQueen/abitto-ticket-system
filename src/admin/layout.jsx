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
	PackageIcon,
} from "@/assets/icons";
import {
	Outlet,
	NavLink,
	Navigate,
	useNavigate,
	Link,
	useLocation,
	useParams,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Avatar from "@mui/material/Avatar";
import React from "react";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { BookingCTX } from "@/contexts/BookingContext";
import { Helmet } from "react-helmet-async";
import Loader from "@/components/animation/Loader";
import useMediaQuery from "@mui/material/useMediaQuery";
import axiosInstance from "@/api";
import { Feedback, PriceChange } from "@mui/icons-material";
import Logo from "@/assets/logo2.svg";
import { Mailbox } from "lucide-react";
import { customError } from "@/lib/utils";
import Cookies from 'js-cookie';
import NoMobileView from "@/assets/images/no_mobile_view.jpg"

const ProtectedRoute = () => {
	const navigate = useNavigate();
	const matches = useMediaQuery("(min-width:1024px)");
	const { adminProfile } = React.useContext(GlobalCTX);
	const { setBookingQuery, setFiltering } =
		React.useContext(BookingCTX);
	const { pathname } = useLocation();
	const accountType = adminProfile.account_type;
	const searchBarVisibility = [
		`/backend/${accountType}/booking-details`,
		`/backend/${accountType}/booking-details/`,
		`/backend/${accountType}/rental-details`,
		`/backend/${accountType}/rental-details/`,
		`/backend/${accountType}/create/check-in`,
		`/backend/${accountType}/create/check-in/`,
		`/backend/${accountType}/customers`,
		`/backend/${accountType}/customers/`,
		`/backend/${accountType}/logistics`,
		`/backend/${accountType}/logistics/`,
	].includes(pathname);
	const [filterValue, setFilterValue] = React.useState("");

	React.useEffect(() => {
		setTimeout(() => { setFiltering(filterValue) }, 500)
	}, [filterValue, setFiltering])

	const { data, isSuccess } = useQuery({
		queryKey: ["bookings"],
		queryFn: async () => {
			try {
				const response = await axiosInstance.get("/booking/queryall");
				const dataQuery = response.data.bookings.reverse();
				const terminals = adminProfile.terminal.map((location) =>
					location.split(",")[1].trim().toLowerCase()
				);
				// Filter records based on the terminal
				const sortedQuery = dataQuery.filter((booking) => {
					const city = booking.travel_from.split(",")[1].trim().toLowerCase();
					return terminals.includes(city);
				});

				return sortedQuery;
			}
			catch (error) {
				customError(error, "Error while retrieving all bookings.")
				return [];
			}
		},
	})

	React.useEffect(() => {
		if (isSuccess) setBookingQuery(data)
	}, [isSuccess, data, setBookingQuery])

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		setFiltering("");
		setFilterValue("")
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
			"Manage Prices",
			`/backend/${accountType}/pricing`,
			<div key="1" className="scale-[.85] -ml-1">
				<PriceChange />
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
			"Logistics",
			`/backend/${accountType}/logistics`,
			<div className="scale-[1.2]" key="1">
				<PackageIcon />
			</div>,
			["admin", "super-admin", "salesperson", "dev"],
		],
		[
			"Customers",
			`/backend/${accountType}/customers`,
			<UserIcon key="1" />,
			["admin", "super-admin", "dev"],
		],
		[
			"User Feedback",
			`/backend/${accountType}/feedback`,
			<div key="1" className="scale-[.85] -ml-1">
				<Feedback />
			</div>,
			["super-admin", "dev"],
		],
		[
			"Information Box",
			`/backend/${accountType}/information`,
			<div key="1" className="scale-[.85] -ml-1">
				<Mailbox />
			</div>,
			["super-admin", "dev"],
		],
		[
			"Settings",
			`/backend/${accountType}/settings`,
			<SettingsIcon key="1" />,
			["admin", "super-admin", "salesperson", "dev"],
		],
	];

	const handleLogout = () => {
		Cookies.remove('access_token');
		localStorage.removeItem("admin");
		navigate("login");
	};

	const handleChange = (event) => {
		setFilterValue(event.target.value);
	};

	return (
		<>
			<Helmet>
				<title>Admin | Abitto Ferry</title>
			</Helmet>
			{matches ?
				<div className="relative">
					{/* sidebar */}
					<aside className="h-screen w-40 md:w-60 bg-black text-white flex flex-col fixed">
						<div>
							<img
								alt="logo"
								src={Logo}
								width={150}
								height={50}
								className="pl-5 pt-3"
							/>
						</div>
						<nav className="pt-6 pb-2 px-5 mx-auto overflow-scroll no-scrollbar">
							<ul>
								{menuItems.filter((item) => item[3].includes(accountType))
									.map(([title, url, icon]) => {
										return (
											<li key={title}>
												<NavLink
													to={url}
													className="[&.active]:bg-blue-500 px-5 md:min-w-44 py-3 rounded-xl hover:bg-gray-700/90 mb-2 transition-all ease-in-out cursor-pointer flex items-center gap-2 [&>.title]:hidden  w-fit md:w-full md:[&>.title]:block"
												>
													<span className="text-[#f1f1f1]">{icon}</span>
													<span className="font-medium text-sm hidden md:block">
														{title}
													</span>
												</NavLink>
											</li>
										);
									})}
							</ul>
						</nav>
						<div className="pt-2 mt-auto">
							<button
								type="button"
								className="px-10 w-full text-sm py-3 border-t mt-auto flex items-center gap-2 hover:bg-gray-900/80 "
								onClick={handleLogout}
							>
								<LogoutIcon />
								<span>Logout</span>
							</button>
						</div>
					</aside>
					<main className="ml-40 md:ml-60 bg-[#F7F7F7] ">
						<header className="h-16 w-full bg-white px-8 flex items-center gap-5">
							{searchBarVisibility && (
								<div className="h-10 w-80 bg-blue-50 p-3 border border-blue-500 rounded-lg font-normal text-xs font-poppins flex items-center gap-2">
									<SearchIcon />
									<input
										onChange={handleChange}
										value={filterValue}
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
								<Outlet />
							</div>
							<Loader />
						</section>
					</main>
				</div>
				:
				<div className="px-5 pt-14 flex flex-col gap-5 items-center max-w-[500px] mx-auto">
					<img src={NoMobileView} alt="NoMobileView" className="mix-blend-multiply w-40 aspect-square" />
					<p className="text-center font-medium">
						We&apos;re sorry, but it seems the current page cannot be viewed on your
						device due to the screen size limitation. To ensure the best user experience
						and readability, the page you&apos;re trying to access requires a larger screen size(min-width 1024px).
					</p>
				</div>
			}
		</>
	);
};

const AdminLayout = () => {
	const { adminProfile } = React.useContext(GlobalCTX);
	const { accountType } = useParams();
	const account_type = adminProfile.account_type;
	const accessToken = Cookies.get('access_token');
	const isAuth = accessToken && String(accountType).includes(account_type);

	return <>{isAuth ? <ProtectedRoute /> : <Navigate to="/login" />}</>;
};

export default AdminLayout;
