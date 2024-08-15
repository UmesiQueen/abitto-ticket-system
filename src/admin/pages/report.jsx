/* eslint-disable react/prop-types */
import React from "react";
import { Helmet } from "react-helmet-async";
import { FerryBoatIcon, UserGroupIcon, WalletIcon } from "@/assets/icons";
import { formatValue } from "react-currency-input-field";
import { BarChart } from "@tremor/react";
import { BookingCTX } from "@/contexts/BookingContext";
import baseurl from "@/api";
import { toast } from "sonner";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectGroup,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { capitalize } from "lodash";

const Report = () => {
	const { bookingQuery } = React.useContext(BookingCTX);
	const { adminProfile } = React.useContext(GlobalCTX);
	const isSuperAdmin = ["super-admin", "dev"].includes(
		adminProfile.account_type
	)
		? true
		: false;
	const [total, setTotal] = React.useState({
		bookingRevenueAll: [],
		bookingRevenueCalabar: [],
		bookingRevenueUyo: [],
		tripsAll: 0,
		tripsUyo: 0,
		tripsCalabar: 0,
	});
	const [bookingTotals, setBookingTotals] = React.useState({
		totalPending: 0,
		totalSuccess: 0,
		totalCanceled: 0,
		totalPassengers: 0,
		totalEarnings: 0,
		totalOffline: 0,
		totalOnline: 0,
		totalBooking: 0,
		totalPaystack: 0,
		totalPos: 0,
		totalCash: 0,
		totalTransfer: 0,
		totalCompletedTrips: 0,
		totalUpcomingTrips: 0,
		totalMissedTrips: 0,
		totalRescheduledTrips: 0,
		totalCanceledTrips: 0,
	});
	const [city, setCity] = React.useState("All");

	React.useEffect(() => {
		if (!isSuperAdmin) setCity(capitalize(adminProfile.city));
		baseurl
			.get("/booking/getnewmonthly")
			.then((res) => {
				const totals = res.data;
				setTotal({
					bookingRevenueAll: totals.Revenue,
					bookingRevenueCalabar: totals.Calabar_revenue,
					bookingRevenueUyo: totals.Uyo_revenue,
					tripsAll: totals.trips,
					tripsUyo: totals.uyo_Trips,
					tripsCalabar: totals.calabar_Trips,
				});
			})
			.catch((error) => {
				if (
					!error.code === "ERR_NETWORK" ||
					!error.code === "ERR_INTERNET_DISCONNECTED" ||
					!error.code === "ECONNABORTED"
				)
					toast.error(
						"Error occurred while fetching dashboard data. Refresh page."
					);
			});
	}, []);

	React.useEffect(() => {
		const filteredBooking =
			city == "All"
				? bookingQuery
				: bookingQuery.filter((booking) => booking.travel_from.includes(city));

		const totalEarnings = filteredBooking
			.filter((booking) => booking.payment_status === "Success")
			.map((booking) => Number(booking?.total_ticket_cost ?? 0))
			.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

		const totalOffline = filteredBooking.filter(
			(booking) => booking.medium === "Offline"
		).length;

		const totalOnline = filteredBooking.filter(
			(booking) => booking.medium === "Online"
		).length;

		const totalPassengers = filteredBooking
			.filter((booking) => booking.payment_status == "Success")
			.map((booking) => booking.total_passengers)
			.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

		const totalSuccess = filteredBooking.filter(
			(booking) => booking.payment_status == "Success"
		).length;

		const totalPending = filteredBooking.filter(
			(booking) => booking.payment_status == "Pending"
		).length;

		const totalCanceled = filteredBooking.filter(
			(booking) => booking.payment_status == "Canceled"
		).length;

		const totalPaystack = filteredBooking.filter(
			(booking) => booking.payment_method == "Paystack"
		).length;

		const totalPos = filteredBooking.filter(
			(booking) => booking.payment_method == "POS"
		).length;

		const totalCash = filteredBooking.filter(
			(booking) => booking.payment_method == "Cash"
		).length;

		const totalTransfer = filteredBooking.filter(
			(booking) => booking.payment_method == "Bank Transfer"
		).length;

		const totalCompletedTrips = filteredBooking.filter(
			(booking) => booking.trip_status == "Completed"
		).length;

		const totalUpcomingTrips = filteredBooking.filter(
			(booking) => booking.trip_status == "Upcoming"
		).length;

		const totalMissedTrips = filteredBooking.filter(
			(booking) => booking.trip_status == "Missed"
		).length;

		const totalRescheduledTrips = filteredBooking.filter(
			(booking) => booking.trip_status == "Rescheduled"
		).length;

		const totalCanceledTrips = filteredBooking.filter(
			(booking) => booking.trip_status == "Canceled"
		).length;

		if (total.tripsAll > 0)
			setBookingTotals({
				totalPending,
				totalSuccess,
				totalCanceled,
				totalPassengers,
				totalEarnings,
				totalOffline,
				totalOnline,
				totalBooking: filteredBooking.length,
				totalPaystack,
				totalPos,
				totalCash,
				totalTransfer,
				totalCompletedTrips,
				totalUpcomingTrips,
				totalRescheduledTrips,
				totalCanceledTrips,
				totalMissedTrips,
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bookingQuery, city, total]);

	return (
		<>
			<Helmet>
				<title>Report | Admin</title>
			</Helmet>
			<h1 className="text-lg font-semibold my-5 ">Dashboard Overview</h1>

			{isSuperAdmin && (
				<div className="flex justify-end">
					<ToggleGroup
						type="single"
						defaultValue="All"
						value={city}
						onValueChange={(value) => {
							if (value == "") {
								setCity("All");
								return;
							}
							setCity(value);
						}}
						className="text-gray-500 bg-white rounded-lg p-1"
					>
						<ToggleGroupItem
							value="All"
							aria-label="Toggle Both Terminals"
							className="data-[state=on]:bg-blue-50 data-[state=on]:border-blue-500 border-2 border-white data-[state=on]:text-blue-500"
						>
							<p>Both Terminals</p>
						</ToggleGroupItem>
						<ToggleGroupItem
							value="Calabar"
							aria-label="Toggle Calabar Terminal"
							className="data-[state=on]:bg-blue-50 data-[state=on]:border-blue-500 border-2 border-white data-[state=on]:text-blue-500"
						>
							<p>Calabar Terminal</p>
						</ToggleGroupItem>
						<ToggleGroupItem
							value="Uyo"
							aria-label="Toggle Uyo Terminal"
							className="data-[state=on]:bg-blue-50 data-[state=on]:border-blue-500 border-2 border-white data-[state=on]:text-blue-500"
						>
							<p>Uyo Terminal</p>
						</ToggleGroupItem>
					</ToggleGroup>
				</div>
			)}
			<div>
				<h2 className="mb-3 font-semibold">Booking Report</h2>
				<div className="mb-8 grid grid-cols-12 gap-5 w-full">
					<div className="col-start-1 col-span-8 row-span-1 bg-white rounded-lg p-5 ">
						<ul className="border rounded-lg p-5 flex flex-wrap *:grow  gap-5 justify-between items-center min-h-[100px] [&_li]:min-w-[25%]  [&_li:not(:first-of-type)]:pl-7 divide-x ">
							<li className="item flex items-center gap-3">
								<div className="rounded-lg bg-blue-50 p-2">
									<WalletIcon />
								</div>
								<div>
									<p className="text-xs text-[#7F7F7F] ">
										Total Earnings (MRR)
									</p>
									<p className="text-base">
										<strong>
											{formatValue({
												value: String(bookingTotals.totalEarnings ?? 0),
												prefix: "₦",
												decimalScale: 2,
											})}
										</strong>
									</p>
								</div>
							</li>
							<li className="item flex items-center gap-3 ">
								<div className="rounded-lg bg-blue-50 p-2">
									<UserGroupIcon />
								</div>
								<div>
									<p className="text-xs text-[#7F7F7F] ">Total Passengers</p>
									<p className="text-base">
										<strong>
											{formatValue({
												value: String(bookingTotals.totalPassengers),
											})}
										</strong>
									</p>
								</div>
							</li>
							<li className="item flex items-center gap-3 ">
								<div className="rounded-lg bg-blue-50 p-2">
									<FerryBoatIcon />
								</div>
								<div>
									<p className="text-xs text-[#7F7F7F] ">Completed Trips</p>
									<p className="text-base">
										<strong>
											{formatValue({ value: String(total[`trips${city}`]) })}
										</strong>
									</p>
								</div>
							</li>
						</ul>
					</div>
					<div className="row-start-2 row-span-4  col-start-1 col-span-8 bg-white rounded-lg p-5 ">
						<div className="border rounded-lg p-5 flex flex-col justify-between h-full">
							<CustomizedBarChart
								props={{
									title: "Booking Sales Revenue",
									data: total[`bookingRevenue${city}`],
								}}
							/>
						</div>
					</div>
					<div className="row-span-3 row-start-1 col-start-9 col-span-4 bg-white rounded-lg p-5">
						<div className="rounded-lg border p-5 space-y-5 mx-auto">
							<h3 className="font-semibold mb-1">Booking Mediums</h3>
							<div className="max-w-[450px] mx-auto relative flex flex-col justify-center">
								<div className="w-fit mx-auto">
									<PieChart
										series={[
											{
												data: [
													{
														label: "Offline Booking",
														value: bookingTotals.totalOffline,
														color: "#3366CC",
													},
													{
														label: "Online Booking",
														value: bookingTotals.totalOnline,
														color: "#85AD33",
													},
												],
												innerRadius: 75,
												outerRadius: 105,
												paddingAngle: 0,
												cornerRadius: 0,
												startAngle: -90,
												endAngle: 90,
												cx: 104,
												cy: 100,
											},
										]}
										width={216}
										height={200}
										slotProps={{
											legend: { hidden: true },
										}}
									/>
								</div>
								<div className="w-full absolute top-28 space-y-3">
									<p className="text-center flex flex-col">
										<strong className=" text-3xl font-semibold">
											{bookingTotals.totalBooking}
										</strong>
										<span className="text-[#7F7F7F] text-base">
											Total Bookings
										</span>
									</p>
								</div>
								<div className="flex flex-col gap-5 items-center ">
									<p className="text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-blue-500 before:mr-3 text-nowrap">
										{bookingTotals.totalOffline} Offline Booking
									</p>
									<p className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-green-500 before:mr-3 text-nowrap">
										{bookingTotals.totalOnline} Online Booking
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className="row-span-2 row-start-4 col-start-9 col-span-4 bg-white rounded-lg p-5 h-full w-full">
						<PaymentStatusPieChart
							props={{
								title: "Booking Payment Status",
								success: bookingTotals.totalSuccess,
								pending: bookingTotals.totalPending,
								canceled: bookingTotals.totalCanceled,
							}}
						/>
					</div>
					<div className="col-span-6 row-start-6 row-span-2 bg-white rounded-lg p-5">
						<PaymentMethodPieChart
							props={{
								title: "Booking Payment Methods",
								paystack: bookingTotals.totalPaystack,
								pos: bookingTotals.totalPos,
								transfer: bookingTotals.totalTransfer,
								cash: bookingTotals.totalCash,
							}}
						/>
					</div>
					<div className="col-start-7 col-span-6 row-start-6 row-span-2 bg-white rounded-lg p-5 ">
						<TripStatusPieChart
							props={{
								completed: bookingTotals.totalCompletedTrips,
								canceled: bookingTotals.totalCanceledTrips,
								upcoming: bookingTotals.totalUpcomingTrips,
								missed: bookingTotals.totalMissedTrips,
								rescheduled: bookingTotals.totalRescheduledTrips,
							}}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default Report;

const PaymentStatusPieChart = ({
	props: { title, success, pending, canceled },
}) => {
	const data = [
		{ label: "Success", value: success, color: "#00563B" },
		{ label: "Pending", value: pending, color: "#E78913" },
		{ label: "Canceled", value: canceled, color: "#AA0000" },
	];

	const sizing = {
		margin: { right: 5 },
		width: 200,
		height: 200,
		legend: { hidden: true },
	};
	const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

	const getArcLabel = (params) => {
		const percent = params.value / TOTAL;
		return `${(percent * 100).toFixed(0)}%`;
	};

	return (
		<div className="border rounded-lg p-5">
			<h3 className="font-semibold">{title}</h3>
			<div className="flex items-center max-w-[450px] font-poppins mx-auto">
				<PieChart
					series={[
						{
							outerRadius: 80,
							data,
							arcLabel: getArcLabel,
						},
					]}
					sx={{
						[`& .${pieArcLabelClasses.root}`]: {
							fill: "white",
							fontSize: 14,
						},
						"& .MuiChartsLegend-series text": {
							fontFamily:
								"Poppins, Roboto, Helvetica, Arial, sans-serif !important",
						},
					}}
					{...sizing}
				/>
				<ul className="w-1/2 space-y-2 pl-2 ">
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#E78913] before:mr-3 text-nowrap">
						Pending
					</li>
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#AA0000] before:mr-3 text-nowrap">
						Cancelled
					</li>
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#00563B] before:mr-3 text-nowrap">
						Success
					</li>
				</ul>
			</div>
		</div>
	);
};

const PaymentMethodPieChart = ({
	props: { title, paystack, pos, transfer, cash },
}) => {
	const data = [
		{ label: "Paystack", value: paystack, color: "#071952" },
		{ label: "POS", value: pos, color: "#134B70" },
		{ label: "Bank Transfer", value: transfer, color: "#EBF4F6" },
		{ label: "Cash", value: cash, color: "#508C9B" },
	];

	const sizing = {
		margin: { right: 5 },
		width: 200,
		height: 200,
		legend: { hidden: true },
	};
	const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

	const getArcLabel = (params) => {
		const percent = params.value / TOTAL;
		return `${(percent * 100).toFixed(0)}%`;
	};

	return (
		<div className="border rounded-lg p-5 h-full">
			<h3 className="font-semibold">{title}</h3>
			<div className="flex items-center max-w-[450px] font-poppins mx-auto">
				<PieChart
					series={[
						{
							outerRadius: 80,
							data,
							arcLabel: getArcLabel,
						},
					]}
					sx={{
						[`& .${pieArcLabelClasses.root}`]: {
							fill: "white",
							fontSize: 14,
						},
						"& .MuiChartsLegend-series text": {
							fontFamily:
								"Poppins, Roboto, Helvetica, Arial, sans-serif !important",
						},
					}}
					{...sizing}
				/>
				<ul className="w-1/2 space-y-2 pl-2 ">
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#071952] before:mr-3 text-nowrap">
						Paystack
					</li>
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#134B70] before:mr-3 text-nowrap">
						POS
					</li>
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#EBF4F6] before:mr-3 text-nowrap">
						Bank Transfer
					</li>
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#508C9B] before:mr-3 text-nowrap">
						Cash
					</li>
				</ul>
			</div>
		</div>
	);
};

const TripStatusPieChart = ({
	props: { completed, canceled, upcoming, missed, rescheduled },
}) => {
	const data = [
		{ label: "Upcoming", value: upcoming, color: "#071952" },
		{ label: "Completed", value: completed, color: "#134B70" },
		{ label: "Canceled", value: canceled, color: "#AA0000" },
		{ label: "Missed", value: missed, color: "#3366CC" },
		{ label: "Rescheduled", value: rescheduled, color: "#E8D2A6" },
	];

	const sizing = {
		margin: { right: 5 },
		width: 300,
		height: 210,
		legend: { hidden: true },
	};
	const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

	const getArcLabel = (params) => {
		const percent = params.value / TOTAL;
		return `${(percent * 100).toFixed(0)}%`;
	};

	return (
		<div className="border rounded-lg p-5">
			<h3 className="font-semibold">Passengers Trip Status</h3>
			<div className="flex items-center max-w-[450px] font-poppins mx-auto">
				<PieChart
					series={[
						{
							innerRadius: 30,
							outerRadius: 105,
							paddingAngle: 0,
							cornerRadius: 5,
							startAngle: -190,
							endAngle: 90,
							cx: 150,
							cy: 100,
							data,
							arcLabel: getArcLabel,
						},
					]}
					sx={{
						[`& .${pieArcLabelClasses.root}`]: {
							fill: "white",
							fontSize: 14,
							fontWeight: 500,
						},
						"& .MuiChartsLegend-series text": {
							fontFamily:
								"Poppins, Roboto, Helvetica, Arial, sans-serif !important",
						},
					}}
					{...sizing}
				/>
				<ul className="w-1/2 space-y-2 pl-2 ">
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#071952] before:mr-3 text-nowrap">
						Upcoming
					</li>
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#134B70] before:mr-3 text-nowrap">
						Completed
					</li>
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#AA0000] before:mr-3 text-nowrap">
						Canceled
					</li>
				</ul>
			</div>
		</div>
	);
};

const processData = (data, filter) => {
	const result = {};
	const now = new Date();

	const isDateInRange = (date) => {
		const [year, month, day] = date.split("-");
		const itemDate = new Date(year, month - 1, day);

		switch (filter) {
			case "7days": {
				const diffDays = (now - itemDate) / (1000 * 60 * 60 * 24);
				return diffDays <= 7;
			}
			case "1month": {
				const lastMonth = new Date(
					now.getFullYear(),
					now.getMonth() - 1,
					now.getDate()
				);
				return itemDate >= lastMonth;
			}
			case "1year": {
				const lastYear = new Date(
					now.getFullYear() - 1,
					now.getMonth(),
					now.getDate()
				);
				return itemDate >= lastYear;
			}
			case "all":
			default:
				return true;
		}
	};

	data.forEach(({ date, totalRevenue }) => {
		if (isDateInRange(date)) {
			const [month, year] = date.split("-");
			const key = `${month} ${year}`;

			if (!result[key]) {
				result[key] = 0;
			}

			result[key] += totalRevenue;
		}
	});

	return Object.keys(result)
		.sort((a, b) => {
			const [monthA, yearA] = a.split(" ");
			const [monthB, yearB] = b.split(" ");
			return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
		})
		.map((key) => {
			const [year, month] = key.split(" ");
			return {
				date: `${format(month, "MMM")} ${year}`,
				totalRevenue: result[key],
			};
		});
};

const CustomizedBarChart = ({ props: { title, data } }) => {
	const [summary, setSummary] = React.useState([]);
	const [filter, setFilter] = React.useState("all");
	const [salesRevenue, setSalesRevenue] = React.useState(0);

	// const formatData = data.map((record) => ({
	// 	...record,
	// 	date: format(new Date(record.date), "PP"),
	// }));

	React.useEffect(() => {
		const summaryData = processData(data, filter);
		setSummary(summaryData);
	}, [filter, data]);

	React.useEffect(() => {
		const totalSales = summary
			.map((item) => item.totalRevenue)
			.reduce((a, c) => a + c, 0);

		setSalesRevenue(totalSales);
	}, [summary]);

	const dataFormatter = (number) =>
		Intl.NumberFormat("us").format(number).toString();

	return (
		<>
			<div className="flex justify-between mb-5">
				<hgroup className="flex gap-1 items-center">
					<h3 className="font-semibold">{title}</h3>
					<span>
						({formatValue({ value: String(salesRevenue), prefix: "₦" })})
					</span>
				</hgroup>
				<Select
					defaultValue="all"
					select
					value={filter}
					onValueChange={(value) => {
						setFilter(value);
					}}
				>
					<SelectTrigger className="w-fit px-5 rounded-lg border bg-gray_iron-100  focus:ring-0 focus:ring-offset-0">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="all">All Time</SelectItem>
							<SelectItem value="7days">Last 7 Days</SelectItem>
							<SelectItem value="1month">Last 1 Month</SelectItem>
							<SelectItem value="1year">Last 1 Year</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<BarChart
				data={summary}
				index="date"
				categories={["totalRevenue"]}
				colors={["blue"]}
				valueFormatter={dataFormatter}
				yAxisWidth={70}
				showLegend={false}
			/>
		</>
	);
};
