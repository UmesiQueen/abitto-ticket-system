/* eslint-disable react/prop-types */
import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button as ButtonIcon } from "@/components/ui/button";
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
import { Button as ButtonUI } from "@/components/ui/button";
import Button from "@/components/custom/Button";
import { formatValue } from "react-currency-input-field";
import { PaginationEllipsis } from "@/components/ui/pagination";
import ReactPaginate from "react-paginate";
import { truncate, capitalize } from "lodash";
import ConfirmationModal from "@/components/modals/confirmation";
import { useUpdate } from "@/hooks/useUpdate";
import { cn } from "@/lib/utils";

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
					<ButtonIcon size="icon" variant="ghost" onClick={() => navigate(-1)}>
						<CircleArrowLeftIcon />
					</ButtonIcon>
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
									{adminProfile.terminal}
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
	const {
		bookingQuery,
		currentPageIndex,
		filtering,
		setFiltering,
		setCurrentPageIndex,
	} = React.useContext(BookingCTX);
	const { mountPortalModal } = React.useContext(GlobalCTX);
	const { checkInPassenger } = useUpdate();
	const [sorting, setSorting] = React.useState([]);
	const [columnFilters, setColumnFilters] = React.useState([]);
	const [columnVisibility, setColumnVisibility] = React.useState({
		fullName: false,
	});
	const [rowSelection, setRowSelection] = React.useState({});
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 7,
	});
	const [dailyBookingQuery, setDailyBookingQuery] = React.useState([]);

	React.useEffect(() => {
		if (bookingQuery.length) {
			const result = bookingQuery.filter((booking) => {
				const bookedDate = new Date(booking?.departure_date)
					.toISOString()
					.split("T")[0];
				const currentDate = new Date().toISOString().split("T")[0];
				const isCurrentDate = bookedDate == currentDate;
				const isSuccess = booking?.payment_status == "Success";
				return isCurrentDate && isSuccess;
			});
			setDailyBookingQuery(result);
		}
	}, [bookingQuery]);

	const columns = [
		{
			accessorKey: "sn",
			header: <p className="font-bold">SN</p>,
			cell: ({ row }) => <div className="font-bold">{Number(row.id) + 1}</div>,
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
		},
		{
			accessorKey: "type",
			header: "Trip type",
			cell: ({ row }) => <div>{row.original.trip_type}</div>,
		},
		{
			accessorKey: "time",
			header: "Time",
			cell: ({ row }) => row.original.departure_time,
		},
		{
			accessorKey: "passengers",
			header: "Passengers",
			cell: ({ row }) => (
				<p className="text-center">{row.original.total_passengers}</p>
			),
		},
		{
			accessorKey: "amount",
			header: "Amount",
			cell: ({ row }) =>
				formatValue({
					value: String(row.original.total_ticket_cost ?? 0),
					prefix: "₦",
				}),
		},
		{
			accessorKey: "trip_status",
			header: <div className="text-center">Trip Status</div>,
			cell: ({ row }) => {
				const trip_status = row.original?.trip_status;
				return (
					<div
						className={cn(
							"rounded-lg w-20 mx-auto py-1 text-[10px] text-center font-semibold",
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
		},
		{
			id: "action",
			header: <div className="text-center">Action</div>,
			cell: ({ row }) => (
				<Button
					disabled={row.original.check_in ? true : false}
					onClick={() => handleCheckIn(row.original.ticket_id)}
					className="check-btn px-2 h-8 !text-xs mx-auto !border-[#85AD33] !bg-[#85AD33] hover:!bg-[#5E7B24] hover:!border-[#5E7B24] disabled:!bg-[#C2C2C2] disabled:!border-[#C2C2C2]"
					text="Check-in"
				/>
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
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,
		onGroupingChange: setFiltering,
		pageCount: Math.ceil(dailyBookingQuery.length / pagination.pageSize),
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			pagination,
			globalFilter: filtering,
		},
	});

	React.useEffect(() => {
		table.setPageIndex(currentPageIndex);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleCheckIn = (ticket_id) => {
		mountPortalModal(
			<ConfirmationModal
				props={{
					header: "Do you want to check-in this passenger?",
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
													`/backend/salesperson/booking-details/${row.original._id}`
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
									No results.
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
							setCurrentPageIndex(val.selected);
						}}
						initialPage={table.getPageCount()}
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
						className="flex gap-2 items-center text-xs font-normal [&_a]:inline-flex [&_a]:items-center [&_a]:justify-center [&_a]:min-w-7 [&_a]:h-8 [&_a]:rounded-lg *:text-center *:[&_.selected]:bg-blue-500  *:[&_.selected]:text-white [&_.disabled]:pointer-events-none "
					/>
				</div>
			</div>
		</>
	);
};
