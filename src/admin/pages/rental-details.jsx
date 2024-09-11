import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLoaderData } from "react-router-dom";
import { addDays, format } from "date-fns";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import ReactPaginate from "react-paginate";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "react-datepicker";
import { PaginationEllipsis } from "@/components/ui/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button as ButtonUI } from "@/components/ui/button";
import Button from "@/components/custom/Button";
import {
	CaretIcon,
	CalendarIcon,
	CircleArrowLeftIcon,
	TickIcon,
	InformationCircleIcon,
	PrinterIcon,
	Boat2Icon,
	UsersIcon,
	ClockIcon,
} from "@/assets/icons";
import SelectField from "@/components/custom/SelectField";
import { BookingCTX } from "@/contexts/BookingContext";
import { Refresh } from "iconsax-react";
import axiosInstance from "@/api";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { toast } from "sonner";
import { capitalize, truncate } from "lodash";
import { formatValue } from "react-currency-input-field";

const RentalDetails = () => {
	return (
		<>
			<Helmet>
				<title>Rental Details | Admin</title>
			</Helmet>
			<h1 className=" text-lg font-semibold">Rental Details</h1>
			<SearchForm />
			<RentalTable />
		</>
	);
};

export default RentalDetails;

const searchSchema = yup
	.object()
	.shape({
		date: yup.string(),
		rent_type: yup.string(),
	})
	.test("require at least one field", function ({ date, rent_type }) {
		const a = !!(date || rent_type); // At least one must be non-empty
		if (!a) {
			return new yup.ValidationError(
				"At least one of the two fields must be filled.", //Message
				"null",
				"rent_type", //error name
				"required" //type
			);
		}
		return true;
	});

const SearchForm = () => {
	const { loading, setLoading, setSearchParams, searchParams } =
		React.useContext(BookingCTX);
	const { adminProfile } = React.useContext(GlobalCTX);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitted },
		control,
		reset,
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(searchSchema),
	});

	React.useEffect(() => {
		if (!Object.keys(searchParams).length) {
			reset({});
		}
	}, [searchParams, reset]);

	const onSubmit = handleSubmit((formData) => {
		setLoading(true);
		setTimeout(() => {
			setSearchParams({
				...formData,
				...(formData?.date && {
					date: new Date(addDays(formData.date, 1)).toISOString().split("T")[0],
				}),
			});
			setLoading(false);
		}, 650);
	});

	return (
		<form
			onSubmit={onSubmit}
			className="flex gap-5 justify-between bg-white rounded-lg my-8 p-6"
		>
			<div className="flex gap-5 w-full ">
				{["super-admin", "dev"].includes(adminProfile.account_type) && (
					<>
						<SelectField
							{...register("rent_type")}
							label="Select Package"
							placeholder="Select Rental Package"
							options={["Within Marina", "Calabar to Uyo", "Uyo to Calabar"]}
							errors={errors}
							formState={isSubmitted}
						/>
					</>
				)}

				{/* date field */}
				<div className="flex flex-col w-full">
					<label className="text-xs md:text-sm !w-full flex flex-col ">
						Choose Date
						<Controller
							control={control}
							name="date"
							render={({ field }) => (
								<DatePicker
									icon={<CalendarIcon />}
									showIcon
									toggleCalendarOnIconClick={true}
									closeOnScroll
									className="bg-blue-50 h-10 md:h-12 border border-blue-500 font-normal text-base w-full !px-4 !rounded-lg font-poppins mt-2 md:mt-3 text-left"
									onChange={(date) => field.onChange(date)}
									selected={field.value}
									customInput={
										<button type="button">
											{field?.value ? (
												format(field?.value, "P")
											) : (
												<span className="text-xs text-[#9fa6b2]">
													dd/mm/yyyy
												</span>
											)}
										</button>
									}
								/>
							)}
						/>
					</label>
					{errors?.date && (
						<p className="text-xs pt-2 text-red-700">{errors?.date.message}</p>
					)}
				</div>
			</div>
			<Button
				text="Search"
				type="submit"
				loading={loading}
				className="w-40 py-6  md:mt-7 "
			/>
		</form>
	);
};

const RentalTable = () => {
	const { adminProfile, setLoading } = React.useContext(GlobalCTX);
	const { searchParams, setSearchParams, currentPageIndex } =
		React.useContext(BookingCTX);
	const [rowSelection, setRowSelection] = React.useState({});
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 7,
	});
	const [rentalData, setRentalData] = React.useState([]);
	const navigate = useNavigate();

	React.useEffect(() => {
		setLoading(true);
		axiosInstance
			.get("/rent/getAllRents")
			.then((res) => {
				if (res.status == 200) {
					const terminals = adminProfile.terminal.map((location) =>
						location.split(",")[1].trim().toLowerCase()
					);
					// Filter records based on the terminal
					const sortedRentals = res.data.rents
						.filter((rental) => {
							const city = rental.departure.split(",")[1].trim().toLowerCase();
							return terminals.includes(city);
						})
						.filter((rentals) => rentals.email !== "preciousdmicah@gmail.com");
					// FIXME::DELETE THIS CONDITION
					setRentalData(sortedRentals);
				}
			})
			.catch((error) => {
				if (
					!error.code === "ERR_NETWORK" ||
					!error.code === "ERR_INTERNET_DISCONNECTED" ||
					!error.code === "ECONNABORTED"
				)
					toast.error(
						"Error occurred while fetching rental data. Refresh page."
					);
			})
			.finally(() => setLoading(false));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	React.useEffect(() => {
		table.setPageIndex(currentPageIndex.rentals);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	React.useEffect(() => {
		if (searchParams) {
			table.getColumn("rent_type").setFilterValue(searchParams?.rent_type);

			if (searchParams?.date) {
				const formatDate = format(new Date(searchParams.date), "P");
				table.getColumn("rental_date").setFilterValue(formatDate);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	const columns = [
		{
			accessorKey: "ticket_id",
			header: "Ticket ID",
			cell: ({ row }) => (
				<p className="uppercase">#{row.getValue("ticket_id")}</p>
			),
		},
		{
			accessorKey: "customer",
			header: "Customer",
			cell: ({ row }) => (
				<div>
					<p className="text-[15px] font-semibold capitalize">
						{capitalize(`${row.original.first_name} ${row.original.surname}`)}
					</p>
					<p className="italic  lowercase">
						{truncate(row.original.email, { length: 25 })}
					</p>
				</div>
			),
		},
		{
			accessorKey: "phone_number",
			header: "Phone number",
			cell: ({ row }) => row.getValue("phone_number"),
		},
		{
			accessorKey: "rent_type",
			id: "rent_type",
			header: "Package",
			cell: ({ row }) => (
				<p className="capitalize">{row.getValue("rent_type")}</p>
			),
		},
		{
			accessorKey: "date_time",
			header: "Date & Time",
			cell: ({ row }) => (
				<div className="space-y-1">
					<p>{format(row.original.rental_date, "PP")}</p>
					<p>{row.original.rental_time}</p>
				</div>
			),
		},
		{
			accessorKey: "rental_date",
			header: "Date",
			id: "rental_date",
			accessorFn: (row) =>
				new Date(row.rental_date) == "Invalid Date"
					? format(new Date("09-08-2024"), "P")
					: format(new Date(row.rental_date), "P"),
		},
		{
			accessorKey: "duration",
			header: "Duration",
			cell: ({ row }) => (
				<p>{row.original?.rental_duration ?? "Single trip"}</p>
			),
		},
		{
			accessorKey: "payment_status",
			header: <div className="text-center">Status</div>,
			cell: ({ row }) => {
				let status = row.getValue("payment_status");
				return (
					<div
						className={cn(
							"rounded-lg w-20 mx-auto py-1 text-[10px] text-center",
							{
								"text-green-500 bg-green-100": status === "Success",
								"text-[#E78913] bg-[#F8DAB6]": status === "Pending",
								"text-[#F00000] bg-[#FAB0B0]": status === "Canceled",
							}
						)}
					>
						{status}
					</div>
				);
			},
		},
		{
			accessorKey: "amount",
			header: <div className="text-center">Amount</div>,
			cell: ({ row }) => (
				<div className="text-center">
					{formatValue({
						value: String(row.original.rental_cost),
						prefix: "₦",
					})}
				</div>
			),
		},
	];

	const table = useReactTable({
		data: rentalData.reverse(),
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,
		pageCount: Math.ceil(rentalData.length / pagination.pageSize),
		state: {
			rowSelection,
			pagination,
			columnVisibility: {
				rental_date: false,
			},
		},
	});

	React.useEffect(() => {
		table.setPageIndex(currentPageIndex.rentals);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			{Object.keys(searchParams).length ? (
				<div className="flex justify-between items-center mt-14 mb-5">
					<div className="inline-flex gap-1">
						<h2 className="font-semibold">Rental search results </h2>
						<p className="divide-x divide-black flex gap-2 [&>*:not(:first-of-type)]:pl-2">
							(
							{searchParams?.rent_type && (
								<span>{searchParams.rent_type} </span>
							)}
							{searchParams?.date && <span>{searchParams.date}</span>})
						</p>
					</div>

					<ButtonUI
						className="inline-flex gap-1 ml-5"
						onClick={() => {
							table.resetColumnFilters(true);
							setSearchParams({});
						}}
					>
						<Refresh /> Reset
					</ButtonUI>
				</div>
			) : (
				<h2 className="font-semibold mt-14 mb-5">All Rentals</h2>
			)}
			<div className="bg-white rounded-lg p-5">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.original.ticket_id}
									className="h-[65px]"
									onDoubleClick={() => {
										navigate(row.original.ticket_id);
									}}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				<div className="flex items-center gap-8  p-4">
					<p className="font-medium text-sm">
						{table.getFilteredRowModel().rows.length} Trip results.
					</p>
					<ReactPaginate
						breakLabel={<PaginationEllipsis />}
						nextLabel={
							<ButtonUI
								variant="ghost"
								size="sm"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								<CaretIcon />
							</ButtonUI>
						}
						onPageChange={(val) => {
							table.setPageIndex(val.selected);
							(prev) => ({
								...prev,
								rentals: val.selected,
							});
						}}
						initialPage={currentPageIndex.rentals}
						pageRangeDisplayed={3}
						pageCount={table.getPageCount()}
						previousLabel={
							<ButtonUI
								variant="ghost"
								size="sm"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								<span className="rotate-180">
									<CaretIcon />
								</span>
							</ButtonUI>
						}
						renderOnZeroPageCount={null}
						className="flex gap-2 items-center text-xs font-normal [&_a]:inline-flex [&_a]:items-center [&_a]:justify-center [&_a]:min-w-7 [&_a]:h-8 [&_a]:rounded-lg *:text-center *:[&_.selected]:bg-blue-500  *:[&_.selected]:text-white [&_.disabled]:pointer-events-none"
					/>
				</div>
			</div>
		</div>
	);
};

export const RentDetail = () => {
	const navigate = useNavigate();
	const currentRental = useLoaderData();

	return (
		<div>
			<div className="flex gap-1 items-center mb-5 py-2">
				<button onClick={() => navigate(-1)}>
					<CircleArrowLeftIcon />
				</button>
				<h1 className="text-base font-semibold">Rental Details</h1>
			</div>
			{currentRental ? (
				<div className="flex gap-5 items-start">
					<div className="bg-white rounded-lg overflow-hidden basis-8/12">
						<div className="bg-blue-50 flex gap-3 p-5 ">
							<div className="bg-white rounded-lg p-2 ">
								<TickIcon />
							</div>
							<div>
								<h2 className="text-blue-500 text-sm font-semibold">
									Rental Confirmed!
								</h2>
								<p className="text-[10px]">
									Great news! The rental has been successfully confirmed from
									our sales point.
								</p>
							</div>
						</div>

						<div className="p-5 pb-20 space-y-6">
							<ul className="*:flex *:flex-col *:gap-1 flex gap-10">
								<li>
									<p className="text-xs text-[#7F7F7F]">Rental ID</p>
									<p className="text-base font-semibold uppercase">
										#{currentRental?.ticket_id}
									</p>
								</li>
								<li>
									<p className="text-xs text-[#7F7F7F]">Customer Name</p>
									<p className="text-base font-semibold capitalize">{`${currentRental?.first_name} ${currentRental?.surname}`}</p>
								</li>
								<li>
									<p className="text-xs text-[#7F7F7F]">Phone</p>
									<p className="text-base font-semibold">
										{currentRental?.phone_number}
									</p>
								</li>
								<li>
									<p className="text-xs text-[#7F7F7F]">Email</p>
									<p className="text-base font-semibold">
										{currentRental?.email}
									</p>
								</li>
							</ul>
							<ul className="*:flex *:flex-col *:gap-1 flex gap-10">
								<li>
									<p className="text-xs text-[#7F7F7F] ">Rental Type</p>
									<p className="text-base font-semibold capitalize">
										{currentRental?.rent_type}
									</p>
								</li>
								<li>
									<p className="text-xs text-[#7F7F7F]">No. of Passengers</p>
									<p className="text-base font-semibold">
										{currentRental?.passengers}
									</p>
								</li>
							</ul>
							{/* FIXME:  */}
							<div className=" space-y-6">
								<ul className="*:flex *:flex-col *:gap-1 flex gap-10">
									<li>
										<p className="text-xs text-[#7F7F7F]">Departure</p>
										<p className="text-base font-semibold">
											{currentRental?.departure}
										</p>
									</li>
									<li>
										<p className="text-xs text-[#7F7F7F]">Arrival</p>
										<p className="text-base font-semibold">
											{currentRental?.arrival}
										</p>
									</li>
								</ul>
								<ul className="*:flex *:flex-col *:gap-1 flex gap-10 ">
									<li>
										<p className="text-xs text-[#7F7F7F]">Rental Date</p>
										<p className="text-base font-semibold">
											{format(currentRental?.rental_date, "PPPP")}
										</p>
									</li>
									<li>
										<p className="text-xs text-[#7F7F7F]">Rental Time</p>
										<p className="text-base font-semibold">
											{currentRental?.rental_time}
										</p>
									</li>
								</ul>
							</div>
							<ul className="*:flex *:flex-col *:gap-1 flex gap-10">
								<li>
									<p className="text-xs text-[#7F7F7F] ">Booking Medium</p>
									<p className="text-base font-semibold">
										{currentRental?.payment_medium}
									</p>
								</li>
								<li>
									<p className="text-xs text-[#7F7F7F]">Payment Method</p>
									<p className="text-base font-semibold">
										{currentRental?.payment_method}
									</p>
								</li>
								<li>
									<p className="text-xs text-[#7F7F7F]">Payment Status</p>
									<p
										className={cn(
											"text-center font-semibold rounded-lg py-1 px-2 text-xs",
											{
												"text-green-500 bg-green-100":
													currentRental?.payment_status === "Success",
												"text-[#E78913] bg-[#F8DAB6]":
													currentRental?.payment_status === "Pending",
												"text-[#F00000] bg-[#FAB0B0]":
													currentRental?.payment_status === "Canceled",
											}
										)}
									>
										{currentRental?.payment_status}
									</p>
								</li>
								<li>
									<p className="text-xs text-[#7F7F7F]">
										Transaction Reference
									</p>
									<p className="text-base font-semibold">
										{currentRental?.trxRef}
									</p>
								</li>
							</ul>
							<ul className="*:flex *:flex-col *:gap-1 flex gap-10">
								<li>
									<p className="text-xs text-[#7F7F7F]">Booked on</p>
									<p className="text-base font-semibold">
										{format(currentRental.created_at, "PPPPpppp").split(
											"GMT",
											1
										)}
									</p>
								</li>
								<li>
									<p className="text-xs text-[#7F7F7F]">Booked By</p>
									<p className="text-base font-semibold">
										{currentRental?.paid_by}
									</p>
								</li>
								<li>
									<p className="text-xs text-[#7F7F7F]">Trip Status</p>
									<p
										className={cn(
											"rounded-lg w-20 mx-auto py-1 text-xs px-2 text-center font-semibold",
											{
												"text-green-500 bg-green-100":
													currentRental?.rental_status === "Completed",
												"text-[#E78913] bg-[#F8DAB6]":
													currentRental?.rental_status === "Upcoming",
												"text-[#F00000] bg-[#FAB0B0]":
													currentRental?.rental_status === "Canceled",
												"text-black bg-slate-500/50 ":
													currentRental?.rental_status === "Rescheduled",
												"text-purple-900 bg-purple-300/30 ":
													currentRental?.rental_status === "Missed",
											}
										)}
									>
										{currentRental?.rental_status}
									</p>
								</li>
							</ul>
						</div>
					</div>

					<div className="bg-white rounded-lg basis-4/12 p-5 flex flex-col gap-6">
						<div>
							<h3 className="text-blue-500 font-semibold  text-base md:text-xl ">
								Abitto Ferry Terminal
							</h3>
							<p className="text-[#8E98A8] text-sm inline-flex items-center gap-1">
								Non-refundable <InformationCircleIcon />
							</p>
							<p className="font-medium text-xs text-right">
								Rental ID: #
								<span className="uppercase">{currentRental?.ticket_id}</span>
							</p>
						</div>
						<div>
							<h4 className="font-semibold text-sm mb-1">Rental Package</h4>
							<div className="my-2 flex flex-wrap gap-x-4 gap-y-1 text-[#1E1E1E] text-xs font-normal [&_p]:inline-flex [&_p]:items-center [&_p]:gap-1">
								<p className="capitalize">
									<Boat2Icon />
									{currentRental?.rent_type}
								</p>
								<p>
									<UsersIcon /> {currentRental?.passengers} passenger(s)
								</p>
							</div>
							<div className="flex flex-wrap gap-x-4 gap-y-1 text-[#1E1E1E] text-xs font-normal [&_p]:inline-flex [&_p]:items-center [&_p]:gap-1">
								<p>
									<CalendarIcon />
									{format(currentRental?.rental_date, "PP")}
								</p>
								<p>
									<ClockIcon />
									{currentRental?.rental_time}
								</p>
							</div>
						</div>
						<div className="border-y-2 border-dashed py-2">
							<table className="w-full [&_td:last-of-type]:text-right [&_td]:py-[2px] ">
								<tbody>
									<tr>
										<td className="text-xs text-[#444444]">Ticket Price</td>
										<td className="text-xs text-[#444444]">
											<span className="block text-sm">
												{formatValue({
													value: String(currentRental.rental_cost ?? 0),
													prefix: "₦",
												})}
												{currentRental.rent_type === "within marina" && (
													<> x {currentRental?.rental_duration}</>
												)}
											</span>
										</td>
									</tr>
									<tr>
										<td className="font-medium text-base">Total</td>
										<td className="font-medium text-base">
											₦
											{formatValue({
												value: String(currentRental?.total_cost),
											})}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<button
							className=" bg-blue-500 w-56 py-3 font-semibold text-sm hover:bg-blue-700 transition-all duration-150 ease-in-out text-white flex justify-center gap-2 mx-auto rounded-lg "
							onClick={() => {
								navigate(`/rental-invoice/${currentRental.ticket_id}`);
							}}
						>
							<PrinterIcon />
							Print
						</button>
					</div>
				</div>
			) : (
				<p className="ml-10">No Result</p>
			)}
		</div>
	);
};
