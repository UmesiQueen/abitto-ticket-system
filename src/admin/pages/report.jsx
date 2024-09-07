/* eslint-disable react/prop-types */
import React from "react";
import { Helmet } from "react-helmet-async";
import { FerryBoatIcon, UserGroupIcon, WalletIcon } from "@/assets/icons";
import { formatValue } from "react-currency-input-field";
import { BarChart } from "@tremor/react";
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
import { format, sub, eachDayOfInterval, startOfMonth, startOfYear } from "date-fns";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { capitalize } from "lodash";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/custom/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const defaultValue = {
	bookingRevenueAll: [],
	bookingRevenueCalabar: [],
	bookingRevenueUyo: [],
	tripsAll: [],
	tripsUyo: [],
	tripsCalabar: [],
	passengersAll: [],
	passengersUyo: [],
	passengersCalabar: [],
	offlineBookingAll: [],
	onlineBookingAll: [],
	offlineBookingCalabar: [],
	onlineBookingCalabar: [],
	onlineBookingUyo: [],
	offlineBookingUyo: [],
	successBookingPaymentStatusAll: [],
	pendingBookingPaymentStatusAll: [],
	canceledBookingPaymentStatusAll: [],
	successBookingPaymentStatusCalabar: [],
	pendingBookingPaymentStatusCalabar: [],
	canceledBookingPaymentStatusCalabar: [],
	successBookingPaymentStatusUyo: [],
	pendingBookingPaymentStatusUyo: [],
	canceledBookingPaymentStatusUyo: [],
	paystackBookingPaymentMethodAll: [],
	posBookingPaymentMethodAll: [],
	bankTransferBookingPaymentMethodAll: [],
	cashBookingPaymentMethodAll: [],
	paystackBookingPaymentMethodCalabar: [],
	posBookingPaymentMethodCalabar: [],
	bankTransferBookingPaymentMethodCalabar: [],
	cashBookingPaymentMethodCalabar: [],
	paystackBookingPaymentMethodUyo: [],
	posBookingPaymentMethodUyo: [],
	bankTransferBookingPaymentMethodUyo: [],
	cashBookingPaymentMethodUyo: [],

	rescheduledTripStatusAll: [],
	missedTripStatusAll: [],
	completedTripStatusAll: [],
	upcomingTripStatusAll: [],
	canceledTripStatusAll: [],
	rescheduledTripStatusCalabar: [],
	missedTripStatusCalabar: [],
	completedTripStatusCalabar: [],
	upcomingTripStatusCalabar: [],
	canceledTripStatusCalabar: [],
	rescheduledTripStatusUyo: [],
	missedTripStatusUyo: [],
	completedTripStatusUyo: [],
	upcomingTripStatusUyo: [],
	canceledTripStatusUyo: [],

	rentRevenueAll: [],
	rentRevenueCalabar: [],
	rentRevenueUyo: [],
	offlineRentalAll: [],
	onlineRentalAll: [],
	offlineRentalCalabar: [],
	onlineRentalCalabar: [],
	onlineRentalUyo: [],
	offlineRentalUyo: [],
	successRentalPaymentStatusAll: [],
	pendingRentalPaymentStatusAll: [],
	canceledRentalPaymentStatusAll: [],
	successRentalPaymentStatusCalabar: [],
	pendingRentalPaymentStatusCalabar: [],
	canceledRentalPaymentStatusCalabar: [],
	successRentalPaymentStatusUyo: [],
	pendingRentalPaymentStatusUyo: [],
	canceledRentalPaymentStatusUyo: [],

	paystackRentalPaymentMethodAll: [],
	posRentalPaymentMethodAll: [],
	bankTransferRentalPaymentMethodAll: [],
	cashRentalPaymentMethodAll: [],
	paystackRentalPaymentMethodCalabar: [],
	posRentalPaymentMethodCalabar: [],
	bankTransferRentalPaymentMethodCalabar: [],
	cashRentalPaymentMethodCalabar: [],
	paystackRentalPaymentMethodUyo: [],
	posRentalPaymentMethodUyo: [],
	bankTransferRentalPaymentMethodUyo: [],
	cashRentalPaymentMethodUyo: [],
	rentalCountAll: [],
	rentalCountCalabar: [],
	rentalCountUyo: [],
	rentalCountWithinMarina: [],

	logisticsRevenueAll: [],
	logisticsRevenueCalabar: [],
	logisticsRevenueUyo: [],
	logisticsCountAll: [],
	logisticsCountCalabar: [],
	logisticsCountUyo: [],
	logisticsPendingCountAll: [],
	logisticsPendingCountCalabar: [],
	logisticsPendingCountUyo: [],

	paystackLogisticsPaymentMethodAll: [],
	posLogisticsPaymentMethodAll: [],
	bankTransferLogisticsPaymentMethodAll: [],
	cashLogisticsPaymentMethodAll: [],
	paystackLogisticsPaymentMethodCalabar: [],
	posLogisticsPaymentMethodCalabar: [],
	bankTransferLogisticsPaymentMethodCalabar: [],
	cashLogisticsPaymentMethodCalabar: [],
	paystackLogisticsPaymentMethodUyo: [],
	posLogisticsPaymentMethodUyo: [],
	bankTransferLogisticsPaymentMethodUyo: [],
	cashLogisticsPaymentMethodUyo: [],

	othersCategoryAll: [],
	foodCategoryAll: [],
	electronicsCategoryAll: [],
	clothesCategoryAll: [],
	documentsCategoryAll: [],
	healthCategoryAll: [],
	jewelriesCategoryAll: [],
	othersCategoryCalabar: [],
	foodCategoryCalabar: [],
	electronicsCategoryCalabar: [],
	clothesCategoryCalabar: [],
	documentsCategoryCalabar: [],
	healthCategoryCalabar: [],
	jewelriesCategoryCalabar: [],
	othersCategoryUyo: [],
	foodCategoryUyo: [],
	electronicsCategoryUyo: [],
	clothesCategoryUyo: [],
	documentsCategoryUyo: [],
	healthCategoryUyo: [],
	jewelriesCategoryUyo: [],
}

const Report = () => {
	const { adminProfile, setLoading } = React.useContext(GlobalCTX);
	const isSuperAdmin = ["super-admin", "dev"].includes(
		adminProfile.account_type
	)
		? true
		: false;
	const [total, setTotal] = React.useState(defaultValue);
	const [filteredTotal, setFilteredTotal] = React.useState(total);
	const [city, setCity] = React.useState("All");
	const [filter, setFilter] = React.useState("all");

	React.useEffect(() => {
		// setLoading(true);
		if (!isSuperAdmin) setCity(capitalize(adminProfile.city));
		baseurl
			.get("/booking/getnewmonthly")
			.then((res) => {
				const totals = res.data;
				setTotal({
					bookingRevenueAll: formatDate(totals.Revenue),
					bookingRevenueCalabar: formatDate(totals.Calabar_revenue),
					bookingRevenueUyo: formatDate(totals.Uyo_revenue),
					tripsAll: formatDate(totals.trips),
					tripsUyo: formatDate(totals.uyo_trips),
					tripsCalabar: formatDate(totals.calabar_trips),
					passengersAll: formatDate(totals.total_passengers),
					passengersUyo: formatDate(totals.total_passengers_uyo),
					passengersCalabar: formatDate(totals.total_passengers_calabar),
					offlineBookingAll: formatDate(totals.total_booking_medium_offline),
					onlineBookingAll: formatDate(totals.total_booking_medium_online),
					offlineBookingCalabar: formatDate(totals.calabar_booking_medium_offline),
					onlineBookingCalabar: formatDate(totals.calabar_booking_medium_online),
					onlineBookingUyo: formatDate(totals.uyo_booking_medium_online),
					offlineBookingUyo: formatDate(totals.uyo_booking_medium_offline),
					successBookingPaymentStatusAll: formatDate(totals.total_payment_status_success),
					pendingBookingPaymentStatusAll: formatDate(totals.total_payment_status_pending),
					canceledBookingPaymentStatusAll: formatDate(totals.total_payment_status_cancelled),
					successBookingPaymentStatusCalabar: formatDate(totals.calabar_payment_status_success),
					pendingBookingPaymentStatusCalabar: formatDate(totals.calabar_payment_status_pending),
					canceledBookingPaymentStatusCalabar: formatDate(totals.calabar_payment_status_cancelled),
					successBookingPaymentStatusUyo: formatDate(totals.uyo_payment_status_success),
					pendingBookingPaymentStatusUyo: formatDate(totals.uyo_payment_status_pending),
					canceledBookingPaymentStatusUyo: formatDate(totals.uyo_payment_status_cancelled),
					paystackBookingPaymentMethodAll: formatDate(totals.total_payment_method_paystack),
					posBookingPaymentMethodAll: formatDate(totals.total_payment_method_pos),
					bankTransferBookingPaymentMethodAll: formatDate(totals.total_payment_method_bank_transfer),
					cashBookingPaymentMethodAll: formatDate(totals.total_payment_method_cash),
					paystackBookingPaymentMethodCalabar: formatDate(totals.calabar_payment_method_paystack),
					posBookingPaymentMethodCalabar: formatDate(totals.calabar_payment_method_pos),
					bankTransferBookingPaymentMethodCalabar: formatDate(totals.calabar_payment_method_bank_transfer),
					cashBookingPaymentMethodCalabar: formatDate(totals.calabar_payment_method_paystack),
					paystackBookingPaymentMethodUyo: formatDate(totals.uyo_payment_method_paystack),
					posBookingPaymentMethodUyo: formatDate(totals.uyo_payment_method_pos),
					bankTransferBookingPaymentMethodUyo: formatDate(totals.uyo_payment_method_bank_transfer),
					cashBookingPaymentMethodUyo: formatDate(totals.uyo_payment_method_paystack),
					rescheduledTripStatusAll: formatDate(totals.Total_Trip_Status_Rescheduled),
					missedTripStatusAll: formatDate(totals.Total_Trip_Status_Missed),
					completedTripStatusAll: formatDate(totals.Total_Trip_Status_Completed),
					upcomingTripStatusAll: formatDate(totals.Total_Trip_Status_Upcoming),
					canceledTripStatusAll: formatDate(totals.Total_Trip_Status_Cancelled),
					rescheduledTripStatusCalabar: formatDate(totals.Calabar_Trip_Status_Rescheduled),
					missedTripStatusCalabar: formatDate(totals.Calabar_Trip_Status_Missed),
					completedTripStatusCalabar: formatDate(totals.Calabar_Trip_Status_Completed),
					upcomingTripStatusCalabar: formatDate(totals.Calabar_Trip_Status_Upcoming),
					canceledTripStatusCalabar: formatDate(totals.Calabar_Trip_Status_Cancelled),
					rescheduledTripStatusUyo: formatDate(totals.Uyo_Trip_Status_Rescheduled),
					missedTripStatusUyo: formatDate(totals.Uyo_Trip_Status_Missed),
					completedTripStatusUyo: formatDate(totals.Uyo_Trip_Status_Completed),
					upcomingTripStatusUyo: formatDate(totals.Uyo_Trip_Status_Upcoming),
					canceledTripStatusUyo: formatDate(totals.Uyo_Trip_Status_Cancelled),

					rentRevenueAll: formatDate(totals.total_rent_revenue),
					rentRevenueCalabar: formatDate([...totals.calabar_rent_revenue, ...totals.within_rent_revenue]),
					rentRevenueUyo: formatDate(totals.uyo_rent_revenue),
					offlineRentalAll: formatDate(totals.Total_Rent_Medium_Offline),
					onlineRentalAll: formatDate(totals.Total_Rent_Medium_Online),
					offlineRentalCalabar: formatDate([...totals.Calabar_Rent_Medium_Offline, ...totals.Within_Rent_Medium_Offline]),
					onlineRentalCalabar: formatDate([...totals.Calabar_Rent_Medium_Online, ...totals.Within_Rent_Medium_Online]),
					onlineRentalUyo: formatDate(totals.Uyo_Rent_Medium_Online),
					offlineRentalUyo: formatDate(totals.Uyo_Rent_Medium_Offline),
					successRentalPaymentStatusAll: formatDate(totals.Total_Rent_Payment_Status_Success),
					pendingRentalPaymentStatusAll: formatDate(totals.Total_Rent_Payment_Status_Pending),
					canceledRentalPaymentStatusAll: formatDate(totals.Total_Rent_Payment_Status_Canceled),
					successRentalPaymentStatusCalabar: formatDate(totals.Calabar_Rent_Payment_Status_Success),
					pendingRentalPaymentStatusCalabar: formatDate(totals.Calabar_Rent_Payment_Status_Pending),
					canceledRentalPaymentStatusCalabar: formatDate(totals.Calabar_Rent_Payment_Status_Canceled),
					// successRentalPaymentStatusCalabar: formatDate([...totals.Calabar_Rent_Payment_Status_Success, ...totals.Within_Rent_Payment_Status_Success]),
					// pendingRentalPaymentStatusCalabar: formatDate([...totals.Calabar_Rent_Payment_Status_Pending, ...totals.Within_Rent_Payment_Status_Pending]),
					// canceledRentalPaymentStatusCalabar: formatDate([...totals.Calabar_Rent_Payment_Status_Canceled, ...totals.Within_Rent_Payment_Status_Canceled]),
					successRentalPaymentStatusUyo: formatDate(totals.Uyo_Rent_Payment_Status_Success),
					pendingRentalPaymentStatusUyo: formatDate(totals.Uyo_Rent_Payment_Status_Pending),
					canceledRentalPaymentStatusUyo: formatDate(totals.Uyo_Rent_Payment_Status_Canceled),
					rentalCountAll: formatDate([...totals.Total_Rent_Medium_Offline, ...totals.Total_Rent_Medium_Online]),
					rentalCountCalabar: formatDate([...totals.Calabar_Rent_Medium_Offline, ...totals.Calabar_Rent_Medium_Online]),
					rentalCountUyo: formatDate([...totals.Uyo_Rent_Medium_Offline, ...totals.Uyo_Rent_Medium_Online]),
					rentalCountWithinMarina: formatDate([...totals.Within_Rent_Medium_Offline, ...totals.Within_Rent_Medium_Online]),

					paystackRentalPaymentMethodAll: formatDate(totals.Total_Rent_Payment_Method_Paystack),
					posRentalPaymentMethodAll: formatDate(totals.Total_Rent_Payment_Method_POS),
					bankTransferRentalPaymentMethodAll: formatDate(totals.Total_Rent_Payment_Method_Bank_Transfer),
					cashRentalPaymentMethodAll: formatDate(totals.Total_Rent_Payment_Method_Cash),
					paystackRentalPaymentMethodCalabar: formatDate([...totals.Calabar_Rent_Payment_Method_Paystack, ...totals.Within_Rent_Payment_Method_Paystack]),
					posRentalPaymentMethodCalabar: formatDate([...totals.Calabar_Rent_Payment_Method_POS, ...totals.Within_Rent_Payment_Method_POS]),
					bankTransferRentalPaymentMethodCalabar: formatDate([...totals.Calabar_Rent_Payment_Method_Bank_Transfer, ...totals.Within_Rent_Payment_Method_Bank_Transfer]),
					cashRentalPaymentMethodCalabar: formatDate([...totals.Calabar_Rent_Payment_Method_Cash, ...totals.Within_Rent_Payment_Method_Cash]),
					paystackRentalPaymentMethodUyo: formatDate(totals.Uyo_Rent_Payment_Method_Paystack),
					posRentalPaymentMethodUyo: formatDate(totals.Uyo_Rent_Payment_Method_POS),
					bankTransferRentalPaymentMethodUyo: formatDate(totals.Uyo_Rent_Payment_Method_Bank_Transfer),
					cashRentalPaymentMethodUyo: formatDate(totals.Uyo_Rent_Payment_Method_Cash),

					logisticsRevenueAll: formatDate(totals.Total_Logistics_Revenue),
					logisticsRevenueCalabar: formatDate(totals.Calabar_Logistics_Revenue),
					logisticsRevenueUyo: formatDate(totals.Uyo_Logistics_Revenue),
					logisticsCountAll: formatDate(totals.Total_Logistics_Count),
					logisticsCountCalabar: formatDate(totals.Calabar_Logistics_Count),
					logisticsCountUyo: formatDate(totals.Uyo_Logistics_Count),
					logisticsPendingCountAll: formatDate(totals.Total_Pending_Logistics_Count),
					logisticsPendingCountCalabar: formatDate(totals.Calabar_Pending_Logistics_Count),
					logisticsPendingCountUyo: formatDate(totals.Uyo_Pending_Logistics_Count),

					posLogisticsPaymentMethodAll: formatDate(totals.Total_Logistics_Payment_Method_POS),
					bankTransferLogisticsPaymentMethodAll: formatDate(totals.Total_Logistics_Payment_Method_Bank_Transfer),
					cashLogisticsPaymentMethodAll: formatDate(totals.Total_Logistics_Payment_Method_Cash),
					posLogisticsPaymentMethodCalabar: formatDate(totals.Calabar_Logistics_Payment_Method_POS),
					bankTransferLogisticsPaymentMethodCalabar: formatDate(totals.Calabar_Logistics_Payment_Method_Bank_Transfer),
					cashLogisticsPaymentMethodCalabar: formatDate(totals.Calabar_Logistics_Payment_Method_Cash),
					posLogisticsPaymentMethodUyo: formatDate(totals.Uyo_Logistics_Payment_Method_POS),
					bankTransferLogisticsPaymentMethodUyo: formatDate(totals.Uyo_Logistics_Payment_Method_Bank_Transfer),
					cashLogisticsPaymentMethodUyo: formatDate(totals.Uyo_Logistics_Payment_Method_Cash),

					othersCategoryAll: formatDate(totals.Total_Categories_Others_Count),
					foodCategoryAll: formatDate(totals.Total_Categories_Food_Count),
					electronicsCategoryAll: formatDate(totals.Total_Categories_Electronics_Count),
					clothesCategoryAll: formatDate(totals.Total_Categories_Clothes_Count),
					documentsCategoryAll: formatDate(totals.Total_Categories_Documents_Count),
					healthCategoryAll: formatDate(totals.Total_Categories_Health_Count),
					jewelriesCategoryAll: formatDate(totals.Total_Categories_Jeweries_Count),
					othersCategoryCalabar: formatDate(totals.Calabar_Categories_Others_Count),
					foodCategoryCalabar: formatDate(totals.Calabar_Categories_Food_Count),
					electronicsCategoryCalabar: formatDate(totals.Calabar_Categories_Electronics_Count),
					clothesCategoryCalabar: formatDate(totals.Calabar_Categories_Clothes_Count),
					documentsCategoryCalabar: formatDate(totals.Calabar_Categories_Documents_Count),
					healthCategoryCalabar: formatDate(totals.Calabar_Categories_Health_Count),
					jewelriesCategoryCalabar: formatDate(totals.Calabar_Categories_Jeweries_Count),
					othersCategoryUyo: formatDate(totals.Uyo_Categories_Others_Count),
					foodCategoryUyo: formatDate(totals.Uyo_Categories_Food_Count),
					electronicsCategoryUyo: formatDate(totals.Uyo_Categories_Electronics_Count),
					clothesCategoryUyo: formatDate(totals.Uyo_Categories_Clothes_Count),
					documentsCategoryUyo: formatDate(totals.Uyo_Categories_Documents_Count),
					healthCategoryUyo: formatDate(totals.Uyo_Categories_Health_Count),
					jewelriesCategoryUyo: formatDate(totals.Uyo_Categories_Jeweries_Count),
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
		// .finally(() => setLoading(false));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	React.useEffect(() => {
		if (filter == "all") {
			return setFilteredTotal(total)
		}
		if (filter == "custom") {
			return;
		}
		const result = filterBy();
		return filterData(result)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filter, total])

	const formatDate = (data) => {
		return data.map((record) => ({
			...record,
			date: format(new Date(record.date), "PP"),
		}));
	};

	const filterData = (result) => {
		setTimeout(() => {
			const filteredTotal = {};
			const datesArray = result.map((date) => format(date, "PP"));
			[total].map((data) => {
				const keys = Object.keys(data);
				return keys.map((key) => {
					const newArr = (Array(data[key]).map((item) => {
						return item.filter((final) => datesArray.includes(final.date))
					}))[0]
					filteredTotal[key] = newArr;
					return setFilteredTotal(filteredTotal);
				})

			})

		}, 500);
	}

	const filterBy = () => {
		const currentDate = new Date();
		switch (filter) {
			case "today":
				return [currentDate];
			case "7days":
				{
					const endDate = sub(new Date(currentDate), { days: 7 });
					const result = (eachDayOfInterval({
						start: currentDate,
						end: new Date(endDate)
					}))
					return result;
				}
			case "1month":
				return eachDayOfInterval({
					start: startOfMonth(currentDate),
					end: currentDate
				});
			case "1year":
				return eachDayOfInterval({
					start: startOfYear(currentDate),
					end: currentDate
				});
			default:
				return [];
		}
	};

	const schema = yup.object().shape({
		from: yup.string().required(),
		to: yup.string().required(),
	});

	const {
		control,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm({
		mode: "onSubmit",
		resolver: yupResolver(schema),
	});

	const onSubmit = handleSubmit((formData) => {
		const result = eachDayOfInterval({
			start: formData.from,
			end: formData.to
		});
		filterData(result);
	});

	const getTotal = (arr, type) => {
		return arr.map((data) => data[type])
			.reduce((a, c) => a + c, 0)
	}

	return (
		<>
			<Helmet>
				<title>Report | Admin</title>
			</Helmet>
			<div className="flex items-center justify-between my-5">
				<h1 className="text-lg font-semibold">Dashboard Overview</h1>
				{isSuperAdmin && (
					<div>
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
			</div>

			<div className="bg-white rounded-lg p-5">
				<div className="flex items-center justify-between gap-10">
					<div className="flex items-center w-fit border border-gray-200 font-medium rounded-lg bg-white">
						<span className="px-4 text-nowrap text-sm font-semibold bg-white h-full inline-flex items-center rounded-l-lg">
							Filter
						</span>
						<Select
							defaultValue="all"
							select
							value={filter}
							onValueChange={(value) => {
								setFilter(value);
							}}
						>
							<SelectTrigger className="w-40 grow rounded-none rounded-r-lg border-0 border-l px-5 focus:ring-0 focus:ring-offset-0 bg-white">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="today">Today</SelectItem>
									<SelectItem value="7days">Last 7 Days</SelectItem>
									<SelectItem value="1month">This Month</SelectItem>
									<SelectItem value="1year">Last 1 Year</SelectItem>
									<SelectItem value="all">All Time</SelectItem>
									<SelectItem value="custom">Custom</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center gap-2">
						<h3>Grand Total Earnings</h3>
						<p className="text-lg font-bold">
							{formatValue({
								value: String(Number(getTotal(filteredTotal[`bookingRevenue${city}`], "totalRevenue")) + Number(getTotal(filteredTotal[`rentRevenue${city}`], "totalRevenue")) + Number(getTotal(filteredTotal[`logisticsCount${city}`], "count"))),
								prefix: "₦",
								decimalScale: 2,
							})}
						</p>
					</div>
				</div>
				{filter == "custom" && (
					<form onSubmit={onSubmit} className="flex items-center mt-5">
						<div className="relative">
							<div className="flex items-center">
								<Controller
									control={control}
									name="from"
									render={({ field }) => (
										<DatePicker
											showIcon={false}
											toggleCalendarOnIconClick={true}
											closeOnScroll
											className=" bg-white h-10 min-w-40 border font-normal text-base w-full !px-4 !rounded-lg font-poppins text-left"
											onChange={(date) => field.onChange(date)}
											selected={field.value}
											customInput={
												<button type="button">
													{field?.value ? (
														format(field?.value, "P")
													) : (
														<span className="text-xs text-[#9fa6b2]">From</span>
													)}
												</button>
											}
										/>
									)}
								/>
								<p className="mx-4 text-sm">To</p>
								<Controller
									control={control}
									name="to"
									render={({ field }) => (
										<DatePicker
											minDate={watch("from")}
											showIcon={false}
											toggleCalendarOnIconClick={true}
											closeOnScroll
											className=" bg-white h-10 min-w-40 border font-normal text-base w-full !px-4 !rounded-lg font-poppins text-left"
											onChange={(date) => field.onChange(date)}
											selected={field.value}
											customInput={
												<button type="button">
													{field?.value ? (
														format(field?.value, "P")
													) : (
														<span className="text-xs text-[#9fa6b2]">To</span>
													)}
												</button>
											}
										/>
									)}
								/>
							</div>
							{Object.keys(errors).length ? (
								<p className="absolute -bottom-5 px-1 text-xs text-red-700">
									Both dates are required.
								</p>
							) : (
								""
							)}
						</div>
						<div className="flex items-center gap-2 ml-4">
							<Button text="Apply" type="submit" className="px-4 h-8 !text-xs" />
							<Button
								text="Reset"
								onClick={reset}
								className="px-4 h-8 !text-xs !border-[#bfbfbf] !bg-[#bfbfbf] hover:!bg-gray-400 hover:!border-gray-400 disabled:!bg-[#C2C2C2] disabled:!border-[#C2C2C2]"
							/>
						</div>
					</form>
				)}
			</div>

			<div className="mt-10">
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
										Total Earnings
									</p>
									<p className="text-base">
										<strong>
											{formatValue({
												value: String(getTotal(filteredTotal[`bookingRevenue${city}`], "totalRevenue")),
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
												value: String(getTotal(filteredTotal[`passengers${city}`], "totalPassengers")),
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
											{formatValue({ value: String(getTotal(filteredTotal[`trips${city}`], "totalTrips")) })}
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
									data: filteredTotal[`bookingRevenue${city}`],
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
														value: getTotal(filteredTotal[`offlineBooking${city}`], "count"),
														color: "#3366CC",
													},
													{
														label: "Online Booking",
														value: getTotal(filteredTotal[`onlineBooking${city}`], "count"),
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
											{Number(getTotal(filteredTotal[`offlineBooking${city}`], "count")) + Number(getTotal(filteredTotal[`onlineBooking${city}`], "count"))}
										</strong>
										<span className="text-[#7F7F7F] text-base">
											Total Bookings
										</span>
									</p>
								</div>
								<div className="flex flex-col gap-5 items-center ">
									<p className="text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-blue-500 before:mr-3 text-nowrap">
										{getTotal(filteredTotal[`offlineBooking${city}`], "count")} Offline Booking
									</p>
									<p className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-green-500 before:mr-3 text-nowrap">
										{getTotal(filteredTotal[`onlineBooking${city}`], "count")} Online Booking
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className="row-span-2 row-start-4 col-start-9 col-span-4 bg-white rounded-lg p-5 h-full w-full">
						<PaymentStatusPieChart
							props={{
								title: "Booking Payment Status",
								success: getTotal(filteredTotal[`successBookingPaymentStatus${city}`], "count"),
								pending: getTotal(filteredTotal[`pendingBookingPaymentStatus${city}`], "count"),
								canceled: getTotal(filteredTotal[`canceledBookingPaymentStatus${city}`], "count"),
							}}
						/>
					</div>
					<div className="col-span-6 row-start-6 row-span-2 bg-white rounded-lg p-5">
						<PaymentMethodPieChart
							props={{
								title: "Booking Payment Methods",
								paystack: getTotal(filteredTotal[`paystackBookingPaymentMethod${city}`], "count"),
								pos: getTotal(filteredTotal[`posBookingPaymentMethod${city}`], "count"),
								transfer: getTotal(filteredTotal[`bankTransferBookingPaymentMethod${city}`], "count"),
								cash: getTotal(filteredTotal[`cashBookingPaymentMethod${city}`], "count"),
							}}
						/>
					</div>
					<div className="col-start-7 col-span-6 row-start-6 row-span-2 bg-white rounded-lg p-5 ">
						<TripStatusPieChart
							props={{
								completed: getTotal(filteredTotal[`completedTripStatus${city}`], "count"),
								canceled: getTotal(filteredTotal[`canceledTripStatus${city}`], "count"),
								upcoming: getTotal(filteredTotal[`upcomingTripStatus${city}`], "count"),
								missed: getTotal(filteredTotal[`missedTripStatus${city}`], "count"),
								rescheduled: getTotal(filteredTotal[`rescheduledTripStatus${city}`], "count"),
							}}
						/>
					</div>
				</div>
			</div>
			<div className="mt-20">
				<h2 className="mb-3 font-semibold">Rental Report</h2>
				<div className="mb-8 grid grid-cols-12 gap-5 w-full">
					<div className="col-start-1 col-span-8 row-span-1 bg-white rounded-lg p-5 ">
						<ul className="border rounded-lg p-5 flex flex-wrap *:grow  gap-5 justify-between items-center min-h-[100px] [&_li]:min-w-[25%]  [&_li:not(:first-of-type)]:pl-7 divide-x ">
							<li className="item flex items-center gap-3">
								<div className="rounded-lg bg-blue-50 p-2">
									<WalletIcon />
								</div>
								<div>
									<p className="text-xs text-[#7F7F7F] ">
										Total Earnings
									</p>
									<p className="text-base">
										<strong>
											{formatValue({
												value: String(getTotal(filteredTotal[`rentRevenue${city}`], "totalRevenue")),
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
									<p className="text-xs text-[#7F7F7F] ">Total Rentals</p>
									<p className="text-base">
										<strong>
											{formatValue({
												value: String(getTotal(filteredTotal[`rentalCount${city}`], "count")),
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
									<p className="text-xs text-[#7F7F7F] ">Upcoming Rentals</p>
									<p className="text-base">
										<strong>
											{formatValue({
												value: String(0),
											})}
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
									title: "Rental Sales Revenue",
									data: filteredTotal[`rentRevenue${city}`],
								}}
							/>
						</div>
					</div>
					<div className="row-span-3 row-start-1 col-start-9 col-span-4 bg-white rounded-lg p-5">
						<div className="rounded-lg border p-5 space-y-5 mx-auto">
							<h3 className="font-semibold mb-1">Rental Mediums</h3>
							<div className="max-w-[450px] mx-auto relative flex flex-col justify-center">
								<div className="w-fit mx-auto">
									<PieChart
										series={[
											{
												data: [
													{
														label: "Offline Booking",
														value: getTotal(filteredTotal[`offlineRental${city}`], "count"),
														color: "#3366CC",
													},
													{
														label: "Online Booking",
														value: getTotal(filteredTotal[`onlineRental${city}`], "count"),
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
											{Number(getTotal(filteredTotal[`offlineRental${city}`], "count")) + Number(getTotal(filteredTotal[`onlineRental${city}`], "count"))}
										</strong>
										<span className="text-[#7F7F7F] text-base">
											Total Rentals
										</span>
									</p>
								</div>
								<div className="flex flex-col gap-5 items-center ">
									<p className="text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-blue-500 before:mr-3 text-nowrap">
										{getTotal(filteredTotal[`offlineRental${city}`], "count")} Offline Rental
									</p>
									<p className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-green-500 before:mr-3 text-nowrap">
										{getTotal(filteredTotal[`onlineRental${city}`], "count")} Online Rental
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className="row-span-2 row-start-4 col-start-9 col-span-4 bg-white rounded-lg p-5 h-full w-full">
						<PaymentStatusPieChart
							props={{
								title: "Rental Payment Status",
								success: getTotal(filteredTotal[`successRentalPaymentStatus${city}`], "count"),
								pending: getTotal(filteredTotal[`pendingRentalPaymentStatus${city}`], "count"),
								canceled: getTotal(filteredTotal[`canceledRentalPaymentStatus${city}`], "count"),
							}}
						/>
					</div>
					<div className="col-span-6 row-start-6 row-span-2 bg-white rounded-lg p-5">
						<PaymentMethodPieChart
							props={{
								title: "Rental Payment Methods",
								paystack: getTotal(filteredTotal[`paystackRentalPaymentMethod${city}`], "count"),
								pos: getTotal(filteredTotal[`posRentalPaymentMethod${city}`], "count"),
								transfer: getTotal(filteredTotal[`bankTransferRentalPaymentMethod${city}`], "count"),
								cash: getTotal(filteredTotal[`cashRentalPaymentMethod${city}`], "count"),
							}}
						/>
					</div>
					<div className="col-start-7 col-span-6 row-start-6 row-span-2 bg-white rounded-lg p-5 ">
						<div className="border rounded-lg p-5 pb-0 h-full">
							<h3 className="font-semibold">Rental Packages</h3>
							<div className="flex items-center max-w-[450px] font-poppins mx-auto">
								<PieChart
									series={[
										{
											data: [
												{
													label: "Within Marina",
													value: getTotal(filteredTotal.rentalCountWithinMarina, "count"),
													color: "#3366CC",
												},
												{
													label: "Uyo to Calabar",
													value: getTotal(filteredTotal.rentalCountUyo, "count"),
													color: "#85AD33",
												},
												{
													label: "Calabar to Uyo",
													value: getTotal(filteredTotal.rentalCountCalabar, "count"),
													color: "#152b56",
												},
											],
											innerRadius: 30,
											outerRadius: 105,
											paddingAngle: 0,
											cornerRadius: 5,
											startAngle: -230,
											endAngle: 40,
											cx: 150,
											cy: 100,
										},
									]}
									width={300}
									height={210}
									slotProps={{
										legend: { hidden: true },
									}}
								/>
								<ul className="w-1/2 space-y-2 pl-2 ">
									<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#3366CC] before:mr-3 text-nowrap">
										Within Marina
									</li>
									<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#85AD33] before:mr-3 text-nowrap">
										Uyo to Calabar
									</li>
									<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#152b56] before:mr-3 text-nowrap">
										Calabar to Uyo
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-20">
				<h2 className="mb-3 font-semibold">Logistics Report</h2>
				<div className="mb-8 grid grid-cols-12 gap-5 w-full">
					<div className="col-start-1 col-span-8 row-span-1 bg-white rounded-lg p-5 ">
						<ul className="border rounded-lg p-5 flex flex-wrap *:grow  gap-5 justify-between items-center min-h-[100px] [&_li]:min-w-[25%]  [&_li:not(:first-of-type)]:pl-7 divide-x ">
							<li className="item flex items-center gap-3">
								<div className="rounded-lg bg-blue-50 p-2">
									<WalletIcon />
								</div>
								<div>
									<p className="text-xs text-[#7F7F7F] ">
										Total Earnings
									</p>
									<p className="text-base">
										<strong>
											{formatValue({
												value: String(getTotal(filteredTotal[`logisticsRevenue${city}`], "totalRevenue")),
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
									<p className="text-xs text-[#7F7F7F] ">Total Shipments</p>
									<p className="text-base">
										<strong>
											{formatValue({
												value: String(getTotal(filteredTotal[`logisticsCount${city}`], "count")),
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
									<p className="text-xs text-[#7F7F7F]">Pending Pickups</p>
									<p className="text-base">
										<strong>
											{formatValue({
												value: String(getTotal(filteredTotal[`logisticsPendingCount${city}`], "count")),
											})}
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
									title: "Logistics Sales Revenue",
									data: filteredTotal[`logisticsRevenue${city}`],
								}}
							/>
						</div>
					</div>
					<div className="row-span-3 row-start-1 col-start-9 col-span-4 bg-white rounded-lg p-5">
						<CategoryPieChart
							props={{
								food: getTotal(filteredTotal[`foodCategory${city}`], "count"),
								electronics: getTotal(filteredTotal[`electronicsCategory${city}`], "count"),
								documents: getTotal(filteredTotal[`documentsCategory${city}`], "count"),
								clothes: getTotal(filteredTotal[`clothesCategory${city}`], "count"),
								jewelries: getTotal(filteredTotal[`jewelriesCategory${city}`], "count"),
								health: getTotal(filteredTotal[`healthCategory${city}`], "count"),
								others: getTotal(filteredTotal[`othersCategory${city}`], "count"),
							}}

						/>

					</div>
					<div className="row-span-2 row-start-4 col-start-9 col-span-4 bg-white rounded-lg p-5 h-full w-full">
						<LogisticsPaymentMethodPieChart
							props={{
								title: "Logistics Payment Methods",
								pos: getTotal(filteredTotal[`posLogisticsPaymentMethod${city}`], "count"),
								transfer: getTotal(filteredTotal[`bankTransferLogisticsPaymentMethod${city}`], "count"),
								cash: getTotal(filteredTotal[`cashLogisticsPaymentMethod${city}`], "count"),
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
	const TOTAL = data.map((item) => item.value)
		.reduce((a, c) => a + c, 0);

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
		{ label: "Bank Transfer", value: transfer, color: "#5B99C2" },
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
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#5B99C2] before:mr-3 text-nowrap">
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

const LogisticsPaymentMethodPieChart = ({
	props: { title, pos, transfer, cash },
}) => {
	const data = [
		{ label: "POS", value: pos, color: "#134B70" },
		{ label: "Bank Transfer", value: transfer, color: "#5B99C2" },
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
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#134B70] before:mr-3 text-nowrap">
						POS
					</li>
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#5B99C2] before:mr-3 text-nowrap">
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
		{ label: "Canceled", value: canceled, color: "#AA0000" },
		{ label: "Completed", value: completed, color: "#134B70" },
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
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#AA0000] before:mr-3 text-nowrap">
						Canceled
					</li>
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#134B70] before:mr-3 text-nowrap">
						Completed
					</li>
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#E8D2A6] before:mr-3 text-nowrap">
						Rescheduled
					</li>
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#3366CC] before:mr-3 text-nowrap">
						Missed
					</li>
				</ul>
			</div>
		</div>
	);
};

const CategoryPieChart = ({
	props: { food, electronics, documents, clothes, jewelries, health, others },
}) => {
	const data = [
		{ label: "Food", value: food, color: "#708871" },
		{ label: "Clothes", value: clothes, color: "#3366CC" },
		{ label: "Documents", value: documents, color: "#603F26" },
		{ label: "Health", value: health, color: "#071952" },
		{ label: "others", value: others, color: "#E8D2A6" },
		{ label: "Electronics", value: electronics, color: "#AA0000" },
		{ label: "Jewelries", value: jewelries, color: "#7FA1C3" },

	];

	const sizing = {
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
		<div className="border rounded-lg p-5 ">
			<h3 className="font-semibold">Categories</h3>
			<div className="max-w-[450px] font-poppins mx-auto">
				<PieChart
					series={[
						{
							innerRadius: 30,
							outerRadius: 105,
							paddingAngle: 0,
							cornerRadius: 5,
							startAngle: -180,
							endAngle: 180,
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
				<ul className="flex flex-wrap gap-2 mt-5">
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#708871] before:mr-3 ">
						Food
					</li>
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#3366CC] before:mr-3">
						Clothes
					</li>
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#603F26] before:mr-3">
						Documents
					</li>
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#071952] before:mr-3 ">
						Health Products
					</li>
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#E8D2A6] before:mr-3 text-nowrap">
						Others
					</li>
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#AA0000] before:mr-3 text-nowrap">
						Electronics/Gadgets
					</li>
					<li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#7FA1C3] before:mr-3 ">
						Jewelries/Accessories
					</li>
				</ul>
			</div>
		</div>
	);
};

const CustomizedBarChart = ({ props: { title, data } }) => {
	const [salesRevenue, setSalesRevenue] = React.useState(0);

	React.useEffect(() => {
		const totalSales = data
			.map((item) => item.totalRevenue)
			.reduce((a, c) => a + c, 0);

		setSalesRevenue(totalSales);
	}, [data]);

	const dataFormatter = (number) =>
		Intl.NumberFormat("us").format(number).toString();

	return (
		<div className="flex flex-col h-full ">
			<div className=" basis-1/6">
				<hgroup className="flex gap-1 items-center ">
					<h3 className="font-semibold">{title}</h3>
					<span>
						({formatValue({ value: String(salesRevenue), prefix: "₦" })})
					</span>
				</hgroup>
			</div>

			<div className="[&>div]:!h-full basis-5/6 ">
				<BarChart
					data={data}
					index="date"
					categories={["totalRevenue"]}
					colors={["blue"]}
					valueFormatter={dataFormatter}
					yAxisWidth={70}
					showLegend={false}
				/>
			</div>
		</div>
	);
};
