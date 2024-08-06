import React from "react";
import { Helmet } from "react-helmet-async";
// import { useNavigate } from "react-router-dom";
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
import { CaretIcon, CalendarIcon, ClockIcon } from "@/assets/icons";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { BookingCTX } from "@/contexts/BookingContext";
import { Refresh } from "iconsax-react";
import baseurl from "@/api/instance";
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

const SearchForm = () => {
	const searchSchema = yup
		.object()
		.shape({
			date: yup.string(),
			time: yup.string(),
		})
		.test("require at least one field", function ({ date, time }) {
			const a = !!(date || time); // At least one must be non-empty

			if (!a) {
				return new yup.ValidationError(
					"At least one of the two fields must be filled.", //Message
					"null",
					"date", //error name
					"required" //type
				);
			}
			return true;
		});
	const { loading, setLoading, setSearchParams, searchParams } =
		React.useContext(BookingCTX);
	const {
		handleSubmit,
		formState: { errors },
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
				{/* time field */}
				<div className="flex flex-col w-full">
					<label className="text-xs md:text-sm w-full flex gap-2 md:gap-3 flex-col relative">
						Enter Time
						<Controller
							control={control}
							name="rental_time"
							render={({ field }) => (
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<TimeField
										{...field}
										sx={{
											"& .MuiOutlinedInput-notchedOutline": {
												display: "none",
											},
											"& .MuiInputBase-root": {
												height: { xs: "2.5rem", md: "3rem" },
												borderRadius: "0.5rem",
												borderColor: "#3366CC",
												bgcolor: "#EBF0FA",
												borderWidth: "1px",
												paddingX: "14px",
											},
											"& .MuiInputBase-input": { padding: 0 },
										}}
									/>
								</LocalizationProvider>
							)}
						/>
						<div className="absolute right-4 bottom-3 md:bottom-4">
							<ClockIcon />
						</div>
					</label>
					{errors?.rental_time && (
						<p className="text-xs pt-2 text-red-700">
							{errors?.rental_time.message}
						</p>
					)}
				</div>
			</div>
			<Button
				text="Search"
				// type="submit"
				disabled={true}
				loading={loading}
				className="w-40 py-6  md:mt-7 "
			/>
		</form>
	);
};

const RentalTable = () => {
	// const navigate = useNavigate();
	// const rentalData = useLoaderData();
	const { adminProfile } = React.useContext(GlobalCTX);
	const {
		searchParams,
		setSearchParams,
		setCurrentPageIndex,
		currentPageIndex,
	} = React.useContext(BookingCTX);
	const [rowSelection, setRowSelection] = React.useState({});
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 7,
	});
	const [rentalData, setRentalData] = React.useState([]);

	React.useEffect(() => {
		baseurl
			.get("/rent/getAllRents")
			.then((res) => {
				if (res.status == 200) {
					const terminals = adminProfile.terminal.map((location) =>
						location.split(",")[1].trim().toLowerCase()
					);
					// Filter records based on the terminal
					const sortedRentals = res.data.rents.filter((rentals) => {
						const city = rentals.travel_from.split(",")[1].trim().toLowerCase();
						return terminals.includes(city);
					});
					setRentalData(sortedRentals);
				}
			})
			.catch((error) => {
				console.error(error, "Error occurred while fetching rental data.");
				toast.error("Error occurred while fetching rental data. Refresh page.");
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	React.useEffect(() => {
		table.setPageIndex(currentPageIndex.rentals);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	React.useEffect(() => {
		if (searchParams) {
			// table.getColumn("departure").setFilterValue(searchParams?.departure);
			// table.getColumn("arrival").setFilterValue(searchParams?.arrival);
			// table
			//   .getColumn("date")
			//   .setFilterValue(searchParams?.date && format(searchParams?.date, "PP"));
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
			header: "Package",
			cell: ({ row }) => <p>{row.getValue("rent_type")}</p>,
		},
		{
			accessorKey: "date_time",
			header: "Date & Time",
			cell: ({ row }) => (
				<div className="space-y-1">
					<p>{truncate(row.original.rental_date)}</p>
					{/* <p>{format(row.original.rental_date, "PP")}</p> */}
					<p>{row.original.rental_time}</p>
				</div>
			),
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
		{
			id: "dateTime",
			header: "DateTime",
			cell: ({ row }) => {
				const dateTime = new Date(`${row.original.date} ${row.original.time}`);
				return <p>{format(dateTime, "PPp")}</p>;
			},
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
				dateTime: false,
			},
		},
		initialState: {
			sorting: [
				{
					id: "dateTime",
					asc: true, // sort by name in descending order by default
				},
			],
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
							({" "}
							{searchParams?.departure && (
								<span>{searchParams.departure} </span>
							)}
							{searchParams?.arrival && <span>{searchParams.arrival}</span>}
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
				<h2 className="font-semibold mt-14 mb-5">
					Rental Details <span className="font-normal">(Recent)</span>
				</h2>
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
								<TableRow key={row.original.ticket_id} className="h-[65px]">
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
