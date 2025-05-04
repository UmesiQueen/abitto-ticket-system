import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLoaderData } from "react-router-dom";
import { format } from "date-fns";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import ReactPaginate from "react-paginate";
import { cn, customError } from "@/lib/utils";
import { PaginationEllipsis } from "@/components/ui/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import CustomButton from "@/components/custom/Button";
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
import { BookingCTX } from "@/contexts/BookingContext";
import axiosInstance from "@/api";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { capitalize, truncate } from "lodash";
import { formatValue } from "react-currency-input-field";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import RentalInvoice from "@/components/RentalInvoice";
import { useReactToPrint } from "react-to-print";
import { useSearchParam } from "@/hooks/useSearchParam";
import SearchForm from "@/components/SearchForm";

const RentalDetails = () => {
	return (
		<>
			<Helmet>
				<title>Rental Details | Admin</title>
			</Helmet>
			<h1 className="text-lg font-semibold mb-10">Rental Details</h1>
			<SearchForm
				props={{
					page: "rentals",
					name: "rent_type",
					label: "Select Package",
					placeholder: "Select Rental Package",
					options: ["Within Marina", "Calabar to Uyo", "Uyo to Calabar"]
				}}
			/>
			<RentalTable />
		</>
	);
};

export default RentalDetails;

const RentalTable = () => {
	const { adminProfile } = React.useContext(GlobalCTX);
	const { currentPageIndex, resetPageIndex, setFilterValue } =
		React.useContext(BookingCTX);
	const [sorting, setSorting] = React.useState([]);
	const [columnFilters, setColumnFilters] = React.useState([]);
	const [columnVisibility, setColumnVisibility] = React.useState({
		fullName: false,
		rental_date: false,
	});
	const [pageCount, setPageCount] = React.useState(0);
	const [pagination, setPagination] = React.useState({
		pageIndex: currentPageIndex.rentals,
		pageSize: 7,
	});
	const [rentalData, setRentalData] = React.useState([]);
	const navigate = useNavigate();
	const { searchParams, setSearchParams, getSearchParams } = useSearchParam();
	const searchParamValues = getSearchParams();

	const { data, isSuccess, isPending } = useQuery({
		queryKey: ["rentals"],
		queryFn: async () => {
			try {
				const response = await axiosInstance.get("/rent/getAllRents")
				const terminals = adminProfile.terminal.map((location) =>
					location.split(",")[1].trim().toLowerCase()
				);
				// Filter records based on the terminal
				const sortedRentals = response.data.rents
					.filter((rental) => {
						const city = rental.departure.split(",")[1].trim().toLowerCase();
						return terminals.includes(city);
					})
				return sortedRentals.reverse()
			}
			catch (error) {
				customError(error, "Error occurred while fetching rental data. Refresh page.");
				return [];
			}
		}
	})

	React.useEffect(() => {
		if (isSuccess) setRentalData(data)
	}, [isSuccess, data])

	React.useEffect(() => {
		const rent_type = searchParams.get("rent_type");
		if (rent_type)
			table.getColumn("rent_type").setFilterValue(rent_type);

		const date = searchParams.get("date");
		if (date) {
			const formatDate = format(new Date(date), "P");
			table.getColumn("rental_date").setFilterValue(formatDate);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	const columns = [
		{
			accessorKey: "ticket_id",
			header: "Rental ID",
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
			enableGlobalFilter: false,
		},
		{
			accessorKey: "fullName",
			id: "fullName",
			header: "fullName",
			accessorFn: (row) =>
				`${row.first_name} ${row.surname}`,
		},
		{
			accessorKey: "phone_number",
			header: "Phone number",
			cell: ({ row }) => row.getValue("phone_number"),
			enableGlobalFilter: false,
		},
		{
			accessorKey: "rent_type",
			id: "rent_type",
			header: "Package",
			cell: ({ row }) => (
				<p className="capitalize">{row.getValue("rent_type")}</p>
			),
			enableGlobalFilter: false,
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
			accessorFn: (row) => format(new Date(row.rental_date), "P"),
		},
		{
			accessorKey: "duration",
			header: "Duration",
			cell: ({ row }) => (
				<p>{row.original?.rental_duration ?? "Single trip"}</p>
			),
			enableGlobalFilter: false,
		},
		{
			accessorKey: "payment_status",
			header: <div className="text-center">Status</div>,
			cell: ({ row }) => {
				const status = row.getValue("payment_status");
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
			enableGlobalFilter: false,
		},
	];

	const table = useReactTable({
		data: rentalData,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		pageCount,
		state: {
			pagination,
			columnVisibility,
			sorting,
			columnFilters,
			globalFilter: searchParamValues?.s,
		},
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		setPageCount(Math.ceil(table.getFilteredRowModel().rows.length / pagination.pageSize));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [rentalData, columnFilters, searchParamValues]);

	return (
		<div>
			<div className="flex items-center gap-10 justify-between w-full mt-10 mb-5 ">
				<h2 className="font-semibold"> {Object.keys(searchParamValues).length ? "Search results" : "All Rentals"}</h2>
				{(columnFilters.length) ?
					<CustomButton
						variant="outline"
						className="!h-8 !text-sm"
						onClick={() => {
							table.resetColumnFilters(true);
							setSearchParams({});
							setFilterValue("");
							resetPageIndex("rentals")
						}}
					>
						Reset filters
					</CustomButton> : ""}
			</div>
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
									{isPending ? <p className="inline-flex gap-2 items-center">Fetching data  <Loader2 className="animate-spin" /></p> : "No results."}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				<div className="flex items-center gap-8  p-4">
					<p className="font-medium text-sm">
						{table.getFilteredRowModel().rows.length} Rental results.
					</p>
					<ReactPaginate
						breakLabel={<PaginationEllipsis />}
						nextLabel={
							<Button
								variant="ghost"
								size="sm"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								<CaretIcon />
							</Button>
						}
						onPageChange={(val) => {
							table.setPageIndex(val.selected);
							(prev) => ({
								...prev,
								rentals: val.selected,
							});
						}}
						forcePage={currentPageIndex.rentals}
						pageRangeDisplayed={3}
						pageCount={table.getPageCount()}
						previousLabel={
							<Button
								variant="ghost"
								size="sm"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								<span className="rotate-180">
									<CaretIcon />
								</span>
							</Button>
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
	const componentRef = React.useRef();

	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
		documentTitle: `Abitto Ticket - ${currentRental?.ticket_id}`,
	});

	return (
		<div>
			<div className="flex gap-1 items-center mb-5 py-2">
				<button type="button" onClick={() => navigate(-1)}>
					<CircleArrowLeftIcon />
				</button>
				<h1 className="text-base font-semibold">Rental Details</h1>
			</div>
			{currentRental ?
				<>
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
											<td className="text-sm text-[#444444]">Rental Cost</td>
											<td className="text-sm text-[#444444]">
												{formatValue({
													value: String(currentRental.rental_cost ?? 0),
													prefix: "₦",
												})}
												{currentRental.rent_type === "within marina" && (
													<> x {currentRental?.rental_duration}</>
												)}
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
								type="button"
								className=" bg-blue-500 w-full py-3 font-semibold text-sm hover:bg-blue-700 transition-all duration-150 ease-in-out text-white flex justify-center gap-2 mx-auto rounded-lg "
								onClick={handlePrint}
							>
								<PrinterIcon />
								Print
							</button>
						</div>
					</div>
					<RentalInvoice props={{ currentUser: currentRental }} ref={componentRef} />
				</>
				: (
					<p className="ml-10">No Result</p>
				)}
		</div>
	);
};
