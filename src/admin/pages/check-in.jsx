/* eslint-disable react/prop-types */
import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/logo.svg";
import { format } from "date-fns";
import { BookingCTX } from "@/contexts/BookingContext";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { CaretIcon, CircleArrowLeftIcon } from "@/assets/icons";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import CustomButton from "@/components/custom/Button";
import { PaginationEllipsis } from "@/components/ui/pagination";
import ReactPaginate from "react-paginate";
import { truncate, capitalize } from "lodash";
import ConfirmationModal from "@/components/modals/confirmation";
import { useUpdate } from "@/hooks/useUpdate";
import humanizeList from "humanize-list";
import { useSearchParam } from "@/hooks/useSearchParam";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const CheckIn = () => {
	const navigate = useNavigate();
	const { adminProfile } = React.useContext(GlobalCTX);

	return (
		<>
			<Helmet>
				<title>Check In | Admin </title>
			</Helmet>
			<div>
				<div className="flex gap-1 items-center mb-10 ">
					<Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
						<CircleArrowLeftIcon />
					</Button>
					<h1 className="font-semibold text-lg">Check In</h1>
				</div>
				<section className="space-y-10 px-3 md:px-0">
					<div className="bg-white rounded-lg">
						<ul className="p-5 flex items-center">
							<li className="basis-2/12">
								<img
									src={Logo}
									alt="logo"
									className="w-1/2 mx-auto object-cover"
								/>
							</li>
							<li className="basis-6/12 [&_strong]:pr-2 [&_strong]:font-semibold ">
								<h2 className="font-bold uppercase">
									Abitto ferry daily check-in
								</h2>
								<p>
									<strong>Terminal:</strong>
									{humanizeList(adminProfile.terminal, { conjunction: "&" })}
								</p>
								<p>
									<strong>Date:</strong>
									{format(new Date(), "PPPP")}
								</p>
							</li>
						</ul>
					</div>
				</section>
				<CheckInTable />
			</div>
		</>
	);
};

export default CheckIn;

const CheckInTable = () => {
	const navigate = useNavigate();
	const { accountType } = useParams();
	const { bookingQuery, currentPageIndex, setCurrentPageIndex } = React.useContext(BookingCTX);
	const { mountPortalModal } = React.useContext(GlobalCTX);
	const { checkInPassenger } = useUpdate();
	const [sorting, setSorting] = React.useState([]);
	const [columnFilters, setColumnFilters] = React.useState([]);
	const [columnVisibility, setColumnVisibility] = React.useState({
		fullName: false,
		departure: accountType === "dev",
		phone_number: accountType !== "dev",
	});
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 7,
	});
	const [pageCount, setPageCount] = React.useState(0);
	const [dailyBookingQuery, setDailyBookingQuery] = React.useState([]);
	const { getSearchParams } = useSearchParam();
	const searchParamValues = getSearchParams();
	const queryClient = useQueryClient();

	React.useEffect(() => {
		const result = bookingQuery.filter((booking) => {
			const bookedDate = format(new Date(booking.departure_date), "P");
			const currentDate = format(new Date().toISOString().split("T")[0], "P");
			return bookedDate === currentDate && booking.payment_status === "Success";
		});
		setDailyBookingQuery(result);
	}, [bookingQuery]);

	const columns = [
		{
			accessorKey: "sn",
			header: <p className="font-bold">SN</p>,
			cell: ({ row }) => <div className="font-bold">{Number(row.id) + 1}</div>,
			enableGlobalFilter: false,
		},
		{
			accessorKey: "ticket_id",
			header: "Ticket ID",
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
			accessorKey: "phone_number",
			header: "Phone number",
			cell: ({ row }) => row.original.passenger1_phone_number,
			enableGlobalFilter: false,
		},
		{
			accessorKey: "departure",
			header: "Departure",
			cell: ({ row }) => row.original.travel_from,
			enableGlobalFilter: false,
		},
		{
			accessorKey: "medium",
			header: "Medium",
			cell: ({ row }) => row.original.medium,
			enableGlobalFilter: false,
		},
		{
			accessorKey: "time",
			header: "Time",
			cell: ({ row }) => row.original.departure_time,
			enableGlobalFilter: false,
		},
		{
			accessorKey: "passengers",
			header: <div className="text-center"> Passengers</div>,
			cell: ({ row }) => (
				<p className="text-center">{row.original.total_passengers}</p>
			),
			enableGlobalFilter: false,
		},
		{
			id: "action",
			header: <div className="text-center">Action</div>,
			cell: ({ row }) => (
				<CustomButton
					disabled={!!row.original.check_in}
					onClick={() => handleCheckIn(row.original.ticket_id)}
					className="check-btn px-2 h-8 !text-xs mx-auto !border-[#85AD33] !bg-[#85AD33] hover:!bg-[#5E7B24] hover:!border-[#5E7B24] disabled:!bg-[#C2C2C2] disabled:!border-[#C2C2C2]"
				>
					Check-in
				</CustomButton>
			),
			enableSorting: false,
			enableHiding: false,
		},
	];

	const table = useReactTable({
		data: dailyBookingQuery,
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
			sorting,
			columnFilters,
			columnVisibility,
			pagination,
			globalFilter: searchParamValues?.s,
		},
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		setPageCount(Math.ceil(table.getFilteredRowModel().rows.length / pagination.pageSize));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dailyBookingQuery, columnFilters]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		table.setPageIndex(currentPageIndex.checkIn);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleCheckIn = (ticket_id) => {
		mountPortalModal(
			<ConfirmationModal
				props={{
					header: "Check-in passenger?",
					handleRequest: () => {
						checkInPassenger(ticket_id);
					},
				}}
			/>
		);
	};

	return (
		<>
			<div className="bg-white rounded-lg px-4 py-2">
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
										onDoubleClick={(event) => {
											if (event.target.tagName !== "BUTTON")
												navigate(
													`/backend/${accountType}/booking-details/${row.original.ticket_id}`
												);
										}}
										data-state={row.getIsSelected() && "selected"}
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
									{queryClient.isFetching("booking") ? <p className="inline-flex gap-2 items-center">Fetching data  <Loader2 className="animate-spin" /></p> : "No results."}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				{/* Pagination */}
				<div className="flex items-center gap-8  p-4">
					<div className="font-medium text-sm">
						{table.getFilteredRowModel().rows.length} total booking result(s).
					</div>
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
							setCurrentPageIndex((prev) => ({
								...prev,
								checkIn: val.selected,
							}));
						}}
						forcePage={currentPageIndex.checkIn}
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
						className="flex gap-2 items-center text-xs font-normal [&_a]:inline-flex [&_a]:items-center [&_a]:justify-center [&_a]:min-w-7 [&_a]:h-8 [&_a]:rounded-lg *:text-center *:[&_.selected]:bg-blue-500  *:[&_.selected]:text-white [&_.disabled]:pointer-events-none "
					/>
				</div>
			</div>
		</>
	);
};
