/* eslint-disable react/prop-types */
import { Helmet } from "react-helmet-async";
import {
	CaretIcon,
	TickIcon,
	InformationCircleIcon,
	CalendarIcon,
	ClockIcon,
	ChairIcon,
	UsersIcon,
	PrinterIcon,
	Boat2Icon,
	CircleArrowLeftIcon,
	CancelSquareIcon,
} from "@/assets/icons";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import { format } from "date-fns";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Button as ButtonUI } from "@/components/ui/button";
import { formatValue } from "react-currency-input-field";
import { capitalize, truncate } from "lodash";
import { cn, humanize } from "@/lib/utils";
import { PaginationEllipsis } from "@/components/ui/pagination";
import ReactPaginate from "react-paginate";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { SearchForm } from "./journey-list";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Refresh } from "iconsax-react";

const BookingDetails = () => {
	const navigate = useNavigate();
	const {
		bookingQuery,
		currentPageIndex,
		filtering,
		setFiltering,
		searchParams,
		setSearchParams,
	} = React.useContext(BookingCTX);
	const { adminProfile } = React.useContext(GlobalCTX);
	const isColumnVisible =
		adminProfile.account_type == "dev" ||
		adminProfile.account_type == "super-admin";
	const [sorting, setSorting] = React.useState([]);
	const [columnFilters, setColumnFilters] = React.useState([]);
	const [columnVisibility, setColumnVisibility] = React.useState({
		fullName: false,
		departure: isColumnVisible ? true : false,
		date: false,
	});
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 7,
	});

	const columns = [
		{
			accessorKey: "ticket_id",
			header: "ID",
			cell: ({ row }) => (
				<p className="uppercase">#{row.getValue("ticket_id")}</p>
			),
		},
		{
			accessorKey: "fullName",
			id: "fullName",
			header: "fullName",
			accessorFn: (row) =>
				`${row.passenger1_first_name} ${row.passenger1_last_name}`,
		},
		{
			accessorKey: "customer",
			header: "Customer",
			cell: ({ row }) => (
				<div>
					<p className="text-[15px] font-semibold capitalize">
						{truncate(
							capitalize(
								` ${row.original.passenger1_last_name} ${row.original.passenger1_first_name}`
							),
							{ length: 25 }
						)}
					</p>
					<p className="italic  lowercase">
						{truncate(row.original.passenger1_email, { length: 25 })}
					</p>
				</div>
			),
			enableGlobalFilter: false,
		},
		{
			accessorKey: "trip_type",
			id: "trip_type",
			header: "Type",
			cell: ({ row }) => <div>{row.original.trip_type}</div>,
			enableGlobalFilter: false,
		},
		{
			accessorKey: "travel_from",
			header: "Departure",
			id: "departure",
			cell: ({ row }) => truncate(row.original.travel_from, { length: 20 }),
		},
		{
			accessorKey: "date_time",
			header: <div className="text-nowrap"> Date & Time</div>,
			cell: ({ row }) => (
				<div className="space-y-1">
					<p>{format(row.original.departure_date, "PP")}</p>
					<p>{row.original.departure_time}</p>
				</div>
			),
			enableGlobalFilter: false,
		},
		{
			accessorKey: "medium",
			header: <div className="text-center">Medium</div>,
			cell: ({ row }) => (
				<div className="text-center">{row.original?.medium}</div>
			),
			enableGlobalFilter: false,
		},
		{
			accessorKey: "payment_status",
			header: <div className="text-center text-nowrap">Payment status</div>,
			cell: ({ row }) => {
				const { payment_status } = row.original;
				return (
					<div
						className={cn(
							"rounded-lg w-20 mx-auto py-1 text-[10px] text-center font-semibold",
							{
								"text-green-500 bg-green-100": payment_status === "Success",
								"text-[#E78913] bg-[#F8DAB6]": payment_status === "Pending",
								"text-[#F00000] bg-[#FAB0B0]": payment_status === "Canceled",
							}
						)}
					>
						{payment_status}
					</div>
				);
			},
			enableGlobalFilter: false,
		},
		{
			accessorKey: "amount",
			header: "Amount",
			cell: ({ row }) => (
				<div>
					₦
					{formatValue({
						value: String(row.original.total_ticket_cost ?? 0),
					})}
				</div>
			),
			enableGlobalFilter: false,
		},
		{
			accessorKey: "trip_status",
			header: <div className="text-center">Trip status</div>,
			cell: ({ row }) => {
				const { trip_status } = row.original;
				return (
					<div
						className={cn(
							" rounded-lg w-20 mx-auto py-1 text-[10px] px-2 text-center font-semibold",
							{
								"text-green-500 bg-green-100": trip_status === "Completed",
								"text-[#E78913] bg-[#F8DAB6]": trip_status === "Upcoming",
								"text-[#F00000] bg-[#FAB0B0]": trip_status === "Canceled",
								"text-black bg-slate-500/50 ": trip_status === "Rescheduled",
								"text-purple-900 bg-purple-300/30 ": trip_status === "Missed",
							}
						)}
					>
						{trip_status}
					</div>
				);
			},
			enableGlobalFilter: false,
		},
		{
			accessorKey: "departure_date",
			header: "Date",
			id: "date",
			accessorFn: (row) => format(row.departure_date, "P"),
		},
	];

	const table = useReactTable({
		data: bookingQuery,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		onGroupingChange: setFiltering,
		pageCount: Math.ceil(bookingQuery.length / pagination.pageSize),
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			pagination,
			globalFilter: filtering,
		},
	});

	React.useEffect(() => {
		table.setPageIndex(currentPageIndex.booking);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	React.useEffect(() => {
		if (searchParams) {
			table.getColumn("departure").setFilterValue(searchParams?.departure);
			if (searchParams?.date) {
				const formatDate = format(new Date(searchParams.date), "P");
				table.getColumn("date").setFilterValue(formatDate);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	return (
		<>
			<Helmet>
				<title>Booking Details | Admin</title>
			</Helmet>

			<h1 className="text-lg font-semibold mb-10">Booking Details</h1>
			<SearchForm />
			<div className="my-10 flex gap-5 justify-end">
				<div className="flex items-center w-fit border border-gray-200 font-medium rounded-lg">
					<span className="px-4 text-nowrap text-sm font-semibold bg-white h-full inline-flex items-center rounded-l-lg">
						Trip type
					</span>
					<Select
						defaultValue="#"
						value={table.getColumn("trip_type")?.getFilterValue() ?? "#"}
						onValueChange={(value) => {
							if (value === "#") {
								return table.getColumn("trip_type")?.setFilterValue("");
							}
							table.getColumn("trip_type")?.setFilterValue(value);
						}}
					>
						<SelectTrigger className="w-[170px] grow rounded-none rounded-r-lg border-0 border-l px-5 focus:ring-0 focus:ring-offset-0 bg-white">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="#">All trip types</SelectItem>
								<SelectItem value="One-Way Trip">One-Way Trip</SelectItem>
								<SelectItem value="Round Trip">Round Trip</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-center w-fit border border-gray-200 font-medium rounded-lg">
					<span className="px-4 text-nowrap text-sm font-semibold bg-white h-full inline-flex items-center rounded-l-lg">
						Medium
					</span>
					<Select
						defaultValue="#"
						value={table.getColumn("medium")?.getFilterValue() ?? "#"}
						onValueChange={(value) => {
							if (value === "#") {
								return table.getColumn("medium")?.setFilterValue("");
							}
							table.getColumn("medium")?.setFilterValue(value);
						}}
					>
						<SelectTrigger className="w-[170px] grow rounded-none rounded-r-lg border-0 border-l px-5 focus:ring-0 focus:ring-offset-0 bg-white">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="#">Both mediums</SelectItem>
								<SelectItem value="Online">Online</SelectItem>
								<SelectItem value="Offline">Offline</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-center w-fit border border-gray-200 font-medium rounded-lg">
					<span className="px-4 text-nowrap text-sm font-semibold bg-white h-full inline-flex items-center rounded-l-lg">
						Trip status
					</span>
					<Select
						defaultValue="#"
						value={table.getColumn("trip_status")?.getFilterValue() ?? "#"}
						onValueChange={(value) => {
							if (value === "#") {
								return table.getColumn("trip_status")?.setFilterValue("");
							}
							table.getColumn("trip_status")?.setFilterValue(value);
						}}
					>
						<SelectTrigger className="w-[170px] grow rounded-none rounded-r-lg border-0 border-l px-5 focus:ring-0 focus:ring-offset-0 bg-white">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="#">All Passengers</SelectItem>
								<SelectItem value="Completed">Completed</SelectItem>
								<SelectItem value="Upcoming">Upcoming</SelectItem>
								<SelectItem value="Rescheduled">Rescheduled</SelectItem>
								<SelectItem value="Canceled">Canceled</SelectItem>
								<SelectItem value="Missed">Missed</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</div>

			{Object.keys(searchParams).length ? (
				<div className="flex items-center mb-5">
					<div className="inline-flex gap-1">
						<h2 className="font-semibold">Booking search results </h2>
						<p className="divide-x divide-black flex gap-2 [&>*:not(:first-of-type)]:pl-2">
							({" "}
							{searchParams?.departure && (
								<span>{searchParams.departure} </span>
							)}
							{searchParams?.date && <span>{searchParams.date}</span>})
						</p>
					</div>

					<ButtonUI
						size="icon"
						variant="ghost"
						className="inline-flex gap-1 ml-5"
						onClick={() => {
							table.resetColumnFilters(true);
							setSearchParams({});
						}}
					>
						<Refresh />
					</ButtonUI>
				</div>
			) : (
				<h2 className="font-semibold mb-5">All Bookings</h2>
			)}
			<div className="bg-white rounded-lg px-4 py-2 ">
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
							<>
								{table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										onDoubleClick={() => navigate(`${row.original._id}`)}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id} className="h-[77px]">
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
								))}
							</>
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

				{/* Pagination */}
				<div className="flex items-center gap-8  p-4">
					<div className="font-medium text-sm">
						{table.getFilteredRowModel().rows.length} result(s).
					</div>
					<Pagination props={{ table }} />
				</div>
			</div>
		</>
	);
};

export default BookingDetails;

const Pagination = ({ props: { table } }) => {
	const pageCount = table.getPageCount();
	const { setCurrentPageIndex, currentPageIndex } =
		React.useContext(BookingCTX);

	return (
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
				setCurrentPageIndex((prev) => ({
					...prev,
					booking: val.selected,
				}));
			}}
			initialPage={currentPageIndex.booking}
			pageRangeDisplayed={3}
			pageCount={pageCount}
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
			className="flex gap-2 items-center text-xs font-normal [&_a]:inline-flex [&_a]:items-center [&_a]:justify-center [&_a]:min-w-7 [&_a]:h-8 [&_a]:rounded-lg *:text-center *:[&_.selected]:bg-blue-500  *:[&_.selected]:text-white [&_.disabled]:pointer-events-none "
		/>
	);
};

export const CustomerDetails = () => {
	const navigate = useNavigate();
	const { bookingID } = useParams();
	const { bookingQuery } = React.useContext(BookingCTX);
	const { mountPortalModal } = React.useContext(GlobalCTX);

	const currentUser = bookingQuery.find((data) => data._id === bookingID);

	return (
		<div>
			<div className="flex gap-1 items-center mb-5 py-2">
				<button onClick={() => navigate(-1)}>
					<CircleArrowLeftIcon />
				</button>
				<h1 className="text-base font-semibold">Booking Details</h1>
			</div>
			{currentUser ? (
				<div className="flex gap-5 items-start">
					<div className="bg-white rounded-lg overflow-hidden basis-8/12">
						<div className="bg-blue-50 flex gap-3 p-5 ">
							<div className="bg-white rounded-lg p-2 ">
								<TickIcon />
							</div>
							<div>
								<h2 className="text-blue-500 text-sm font-semibold">
									Booking Confirmed!
								</h2>
								<p className="text-[10px]">
									Great news! The ferry trip has been successfully confirmed
									from our sales point.
								</p>
							</div>
							{/* FIXME: ADMIN SHOULDN'T BE ABLE TO SEE THIS BUTTONS */}
							{/* <div className="ml-auto flex gap-2">
								<Button
									text="Re-schedule Trip"
									variant="outline"
									className="text-nowrap h-10 ml-auto"
									onClick={() => {
										navigate(
											`/salesperson/booking-details/reschedule/${bookingID}`
										);
									}}
								/>
								<ButtonUI
									variant="destructive"
									// onClick={handleCancel}
								>
									Cancel
								</ButtonUI>
							</div> */}
						</div>

						<div className="p-5 pb-20 space-y-6">
							<ul className="*:flex *:flex-col *:gap-1 flex gap-10">
								<li>
									<p className="text-xs text-[#7F7F7F]">Booking ID</p>
									<p className="text-base font-semibold uppercase">
										#{currentUser?.ticket_id}
									</p>
								</li>
								<li>
									<p className="text-xs text-[#7F7F7F]">Customer Name</p>
									<p className="text-base font-semibold capitalize">{`${currentUser?.passenger1_first_name} ${currentUser?.passenger1_last_name}`}</p>
								</li>
								<li>
									<p className="text-xs text-[#7F7F7F]">Phone</p>
									<p className="text-base font-semibold">
										{currentUser?.passenger1_phone_number}
									</p>
								</li>
								<li>
									<p className="text-xs text-[#7F7F7F]">Email</p>
									<p className="text-base font-semibold">
										{currentUser?.passenger1_email}
									</p>
								</li>
							</ul>
							<ul className="*:flex *:flex-col *:gap-1 flex gap-10">
								<li>
									<p className="text-xs text-[#7F7F7F] ">Type</p>
									<p className="text-base font-semibold">
										{currentUser?.trip_type}
									</p>
								</li>

								<li>
									<p className="text-xs text-[#7F7F7F]">No. of Adult</p>
									<p className="text-base font-semibold">
										{currentUser?.adults_number}
									</p>
								</li>
								<li>
									<p className="text-xs text-[#7F7F7F]">No. of Children</p>
									<p className="text-base font-semibold">
										{currentUser?.children_number ?? 0}
									</p>
								</li>
								{currentUser?.passenger2_first_name && (
									<li className="self-center text-sm">
										<button
											className="text-blue-500 hover:text-blue-700 underline"
											onClick={() => {
												mountPortalModal(
													<CustomerDetailsModal props={{ currentUser }} />
												);
											}}
										>
											View other passenger details {">"}
										</button>
									</li>
								)}
							</ul>
							<div className=" space-y-6 border-l-8 border-green-800 pl-3 -ml-5">
								<ul className="*:flex *:flex-col *:gap-1 flex gap-10">
									<li>
										<p className="text-xs text-[#7F7F7F]">Departure From</p>
										<p className="text-base font-semibold">
											{currentUser?.travel_from}
										</p>
									</li>
									<li>
										<p className="text-xs text-[#7F7F7F]">Departure To</p>
										<p className="text-base font-semibold">
											{currentUser?.travel_to}
										</p>
									</li>
									<li>
										<p className="text-xs text-[#7F7F7F]">Seat No.</p>
										<p className="text-base font-semibold">
											{currentUser?.departure_seats.length
												? humanize(currentUser?.departure_seats)
												: "N/A"}
										</p>
									</li>
								</ul>
								<ul className="*:flex *:flex-col *:gap-1 flex gap-10 ">
									<li>
										<p className="text-xs text-[#7F7F7F]">Departure Date</p>
										<p className="text-base font-semibold">
											{format(currentUser?.departure_date, "PPPP")}
										</p>
									</li>
									<li>
										<p className="text-xs text-[#7F7F7F]">Departure Time</p>
										<p className="text-base font-semibold">
											{currentUser?.departure_time}
										</p>
									</li>
								</ul>
							</div>
							{currentUser?.trip_type === "Round Trip" && (
								<div className=" space-y-6 border-l-8 border-orange-800 pl-3 -ml-5">
									<ul className="*:flex *:flex-col *:gap-1 flex gap-10">
										<li>
											<p className="text-xs text-[#7F7F7F]">Return From</p>
											<p className="text-base font-semibold">
												{currentUser?.travel_to}
											</p>
										</li>
										<li>
											<p className="text-xs text-[#7F7F7F]">Return To</p>
											<p className="text-base font-semibold">
												{currentUser?.travel_from}
											</p>
										</li>
										<li>
											<p className="text-xs text-[#7F7F7F]">Seat No.</p>
											<p className="text-base font-semibold">
												{currentUser?.return_seats.length
													? humanize(currentUser?.return_seats)
													: "N/A"}
											</p>
										</li>
									</ul>
									<ul className="*:flex *:flex-col *:gap-1 flex gap-10">
										<li>
											<p className="text-xs text-[#7F7F7F]">Return Date</p>
											<p className="text-base font-semibold">
												{format(currentUser?.return_date, "PPPP")}
											</p>
										</li>
										<li>
											<p className="text-xs text-[#7F7F7F]">Return Time</p>
											<p className="text-base font-semibold">
												{currentUser?.return_time}
											</p>
										</li>
									</ul>
								</div>
							)}
							<ul className="*:flex *:flex-col *:gap-1 flex gap-10">
								<li>
									<p className="text-xs text-[#7F7F7F] ">Booking Medium</p>
									<p className="text-base font-semibold">
										{currentUser?.medium}
									</p>
								</li>
								<li>
									<p className="text-xs text-[#7F7F7F]">Payment Method</p>
									<p className="text-base font-semibold">
										{currentUser?.payment_method}
									</p>
								</li>
								<li>
									<p className="text-xs text-[#7F7F7F]">Payment Status</p>
									<p
										className={cn(
											"text-center font-semibold rounded-lg py-1 px-2 text-xs",
											{
												"text-green-500 bg-green-100":
													currentUser?.payment_status === "Success",
												"text-[#E78913] bg-[#F8DAB6]":
													currentUser?.payment_status === "Pending",
												"text-[#F00000] bg-[#FAB0B0]":
													currentUser?.payment_status === "Canceled",
											}
										)}
									>
										{currentUser?.payment_status}
									</p>
								</li>
								<li>
									<p className="text-xs text-[#7F7F7F]">
										Transaction Reference
									</p>
									<p className="text-base font-semibold">
										{currentUser?.trxRef}
									</p>
								</li>
							</ul>
							<ul className="*:flex *:flex-col *:gap-1 flex gap-10">
								<li>
									<p className="text-xs text-[#7F7F7F]">Booked on</p>
									<p className="text-base font-semibold">
										{format(currentUser.created_at, "PPPPpppp").split("GMT", 1)}
									</p>
								</li>
								<li>
									<p className="text-xs text-[#7F7F7F]">Booked By</p>
									<p className="text-base font-semibold">
										{currentUser?.booked_by}
									</p>
								</li>
								<li>
									<p className="text-xs text-[#7F7F7F]">Trip Status</p>
									<p
										className={cn(
											"rounded-lg w-20 mx-auto py-1 text-xs px-2 text-center font-semibold",
											{
												"text-green-500 bg-green-100":
													currentUser?.trip_status === "Completed",
												"text-[#E78913] bg-[#F8DAB6]":
													currentUser?.trip_status === "Upcoming",
												"text-[#F00000] bg-[#FAB0B0]":
													currentUser?.trip_status === "Canceled",
												"text-black bg-slate-500/50 ":
													currentUser?.trip_status === "Rescheduled",
												"text-purple-900 bg-purple-300/30 ":
													currentUser?.trip_status === "Missed",
											}
										)}
									>
										{currentUser?.trip_status}
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
								Booking ID: #
								<span className="uppercase">{currentUser?.ticket_id}</span>
							</p>
						</div>

						<div>
							<h4 className="font-semibold mb-1">Terminals</h4>
							<p className="text-xs mb-1">
								<span className="font-semibold text-sm text-gray-500">
									From:
								</span>{" "}
								{currentUser?.travel_from}
							</p>
							<p className="text-xs mb-1">
								<span className="font-semibold text-sm  text-gray-500">
									To:
								</span>{" "}
								{currentUser?.travel_to}
							</p>

							<div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[#1E1E1E] text-xs font-normal [&_p]:inline-flex [&_p]:items-center [&_p]:gap-1">
								<p>
									<Boat2Icon />
									{currentUser?.trip_type}
								</p>
								<p>
									<UsersIcon /> {currentUser?.total_passengers} passenger(s)
								</p>
							</div>
						</div>
						<div className="flex flex-wrap gap-x-5 gap-y-3">
							<div>
								<h5 className="font-semibold text-sm mb-1">
									Departure Details
								</h5>
								<div className="flex flex-wrap gap-x-4 gap-y-1 text-[#1E1E1E] text-xs font-normal [&_p]:inline-flex [&_p]:items-center [&_p]:gap-1">
									<p>
										<CalendarIcon />
										{format(currentUser?.departure_date, "PP")}
									</p>
									<p>
										<ClockIcon />
										{currentUser?.departure_time}
									</p>
									<p>
										<ChairIcon />
										{currentUser?.departure_seats.length
											? humanize(currentUser?.departure_seats)
											: "N/A"}
									</p>
								</div>
							</div>
							{currentUser?.trip_type === "Round Trip" && (
								<div>
									<h5 className="font-semibold text-sm mb-1">Return Details</h5>
									<div className="flex flex-wrap gap-x-4 gap-y-1 text-[#1E1E1E] text-xs font-normal [&_p]:inline-flex [&_p]:items-center [&_p]:gap-1">
										<p>
											<CalendarIcon />
											{format(new Date(currentUser?.return_date), "PP")}
										</p>
										<p>
											<ClockIcon />
											{currentUser?.return_time}
										</p>
										<p>
											<ChairIcon />
											{currentUser?.return_seats.length
												? humanize(currentUser?.return_seats)
												: "N/A"}
										</p>
									</div>
								</div>
							)}
						</div>
						<div className="border-y-2 border-dashed py-2">
							<table className="w-full [&_td:last-of-type]:text-right [&_td]:py-[2px] ">
								<tbody>
									{/* <tr>
										<td className="text-xs text-[#444444]">Ride Insurance</td>
										<td className="text-xs text-[#444444]">₦0</td>
									</tr> */}
									<tr>
										<td className="text-xs text-[#444444]">Ticket Price</td>
										<td className="text-xs text-[#444444]">
											<span className="block text-sm">
												{formatValue({
													value: String(currentUser.departure_ticket_cost ?? 0),
													prefix: "₦",
												})}
												{currentUser.trip_type === "Round Trip" && (
													<>
														{" + "}
														{formatValue({
															value: String(
																currentUser.return_ticket_cost ?? 0
															),
															prefix: "₦",
														})}
													</>
												)}{" "}
												x {currentUser.total_passengers}
											</span>
										</td>
									</tr>
									<tr>
										<td className="font-medium text-base">Total</td>
										<td className="font-medium text-base">
											₦
											{formatValue({
												value: String(currentUser?.total_ticket_cost),
											})}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<button
							className=" bg-blue-500 w-56 py-3 font-semibold text-sm hover:bg-blue-700 transition-all duration-150 ease-in-out text-white flex justify-center gap-2 mx-auto rounded-lg "
							onClick={() => {
								navigate(`/ticket-invoice/${currentUser.ticket_id}`);
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

const CustomerDetailsModal = ({ props: { currentUser } }) => {
	const { unMountPortalModal } = React.useContext(GlobalCTX);

	return (
		<div className="bg-white rounded-lg p-10 pt-5 flex flex-col">
			<ButtonUI
				variant="ghost"
				size="icon"
				className="ml-auto"
				onClick={unMountPortalModal}
			>
				<CancelSquareIcon />
			</ButtonUI>
			<div className="space-y-2">
				<div id="Passenger01">
					<h4 className="font-semibold text-sm">Passenger 01</h4>
					<ul className="mt-2 border-2 rounded-lg py-3 px-5 flex flex-wrap gap-y-3 gap-x-5 md:gap-x-12 [&_p:first-of-type]:text-xs  [&_p:first-of-type]:font-semibold  [&_p:last-of-type]:text-gray-500  [&_li]:space-y-1  ">
						<li>
							<p>First Name</p>
							<p className="capitalize">{currentUser.passenger1_first_name}</p>
						</li>
						<li>
							<p>Surname</p>
							<p className="capitalize">{currentUser.passenger1_last_name}</p>
						</li>
						<li>
							<p>Phone Number</p>
							<p>{currentUser.passenger1_phone_number}</p>
						</li>
						<li>
							<p>Email Address</p>
							<p>{currentUser?.passenger1_email}</p>
						</li>
					</ul>
				</div>
				{currentUser.adults_number > 1 && currentUser?.passenger2_first_name ? (
					<>
						{Array.from({
							length: currentUser.adults_number - 1,
						}).map((_, i) => {
							const num = i + 2;
							return (
								<div id={`Passenger0${num}`} key={`Passenger0${num}`}>
									<h4 className="font-semibold text-sm">Passenger 0{num}</h4>
									<ul className="mt-2 border-2 rounded-lg py-3 px-5 flex flex-wrap gap-y-3 gap-x-5 md:gap-x-12 [&_p:first-of-type]:text-xs  [&_p:first-of-type]:font-semibold  [&_p:last-of-type]:text-gray-500 [&_li]:space-y-1">
										<li>
											<p>First Name</p>
											<p className="capitalize">
												{currentUser[`passenger${num}_first_name`]}
											</p>
										</li>
										<li>
											<p>Surname</p>
											<p className="capitalize">
												{currentUser[`passenger${num}_last_name`]}
											</p>
										</li>
										<li>
											<p>Phone Number</p>
											<p>{currentUser[`passenger${num}_phone_number`]}</p>
										</li>
										<li>
											<p>Email Address</p>
											<p>{currentUser?.[`passenger${num}_email`]}</p>
										</li>
									</ul>
								</div>
							);
						})}
					</>
				) : (
					""
				)}
			</div>
		</div>
	);
};
