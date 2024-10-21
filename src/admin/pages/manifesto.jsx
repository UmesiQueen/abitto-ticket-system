import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { capitalize } from "lodash";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button as IconButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PrinterIcon, CircleArrowLeftIcon } from "@/assets/icons";
import { GlobalCTX } from "@/contexts/GlobalContext";
import { BookingCTX } from "@/contexts/BookingContext";
import Logo from "@/assets/logo.svg";
import { useReactToPrint } from "react-to-print";
import { formatValue } from "react-currency-input-field";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const Manifesto = () => {
	const { adminProfile } = React.useContext(GlobalCTX);
	const { tripDetails, bookingQuery } = React.useContext(BookingCTX);
	const navigate = useNavigate();
	const [isPrinting, setIsPrinting] = React.useState(false);
	const componentRef = React.useRef(null);
	const [sorting, setSorting] = React.useState([]);
	const [columnFilters, setColumnFilters] = React.useState([]);
	const [columnVisibility, setColumnVisibility] = React.useState({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 29,
	});
	const [currentDataQuery, setCurrentDataQuery] = React.useState([]);
	const { tripCode } = useParams();
	const queryClient = useQueryClient();


	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (tripDetails) {
			const sortedQuery = bookingQuery.filter(
				(booking) =>
					booking.departure_trip_code === tripDetails.trip_code &&
					booking.payment_status === "Success" &&
					booking.check_in
			);
			setCurrentDataQuery(sortedQuery);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const columns = [
		{
			accessorKey: "sn",
			header: <p className="font-bold">SN</p>,
			cell: ({ row }) => <div className="font-bold">{Number(row.id) + 1}</div>,
		},
		{
			accessorKey: "id",
			header: "Ticket ID",
			cell: ({ row }) => (
				<div className="uppercase">#{row.original.ticket_id}</div>
			),
		},
		{
			accessorKey: "customer",
			header: "Customer",
			cell: ({ row }) => (
				<div>
					<p className="text-[15px] font-semibold capitalize">
						{capitalize(
							`${row.original.passenger1_first_name} ${row.original.passenger1_last_name}`
						)}
					</p>
					<p className="italic  lowercase">{row.original.passenger1_email}</p>
				</div>
			),
		},
		{
			accessorKey: "phone_number",
			header: "Phone Number",
			cell: ({ row }) => <div>{row.original.passenger1_phone_number}</div>,
		},
		{
			accessorKey: "passenger",
			header: <div className="text-center">Passengers</div>,
			cell: ({ row }) => (
				<div className="text-center">{row.original.total_passengers}</div>
			),
		},
	];

	const table = useReactTable({
		data: currentDataQuery,
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
		pageCount: Math.ceil(currentDataQuery.length / pagination.pageSize),
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			pagination,
		},
	});

	const getTotalPassengers = () => {
		if (currentDataQuery.length)
			return currentDataQuery
				.map((booking) => booking.total_passengers)
				.reduce((a, c) => a + c, 0);
		return 0;
	};

	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
		documentTitle: `Abitto Ticket - ${tripDetails?.trip_code}`,
		onAfterPrint: () => setIsPrinting(false),
	});

	if (!tripDetails?.trip_code) return <Navigate to={`/backend/${adminProfile.account_type}/journey-list/${tripCode}`} />;

	return (
		<>
			<Helmet>
				<title>Manifesto | Admin</title>
			</Helmet>

			<section ref={componentRef}>
				<div
					className={cn("flex gap-1 items-center mb-8", {
						hidden: isPrinting,
					})}
				>
					<IconButton
						size="icon"
						variant="ghost"
						onClick={() => navigate(-1)}
					>
						<CircleArrowLeftIcon />
					</IconButton>
					<h1 className="text-lg font-semibold ">Manifesto</h1>
				</div>
				<div className="bg-white rounded-lg">
					<ul className="p-5 flex items-center">
						<li className="basis-2/12">
							<img
								src={Logo}
								alt="logo"
								className="w-1/2 mx-auto object-cover"
							/>
						</li>
						<li
							className={cn(
								"basis-6/12 [&_strong]:pr-2 [&_strong]:font-semibold",
								{ grow: isPrinting }
							)}
						>
							<hgroup className="flex gap-1">
								<h2 className="font-bold uppercase">Abitto Ferry</h2>
								<p>({tripDetails?.trip_code})</p>
							</hgroup>
							<p>
								<strong>Route: </strong>
								{tripDetails?.departure} - {tripDetails?.arrival}
							</p>
							<p>
								<strong>Date:</strong>
								{format(tripDetails?.date, "PPPP")} , {tripDetails?.time}
							</p>
							<p>
								<strong>Capacity:</strong>
								{tripDetails?.trip_capacity}
							</p>
							<p>
								<strong>Ticket Cost:</strong>
								{formatValue({
									value: String(tripDetails?.ticket_cost),
									prefix: "₦",
								})}
							</p>
							<p>
								<strong>Trip Status:</strong>
								<span
									className={cn("font-semibold", {
										"text-green-700": tripDetails?.trip_status === "Completed",
										"text-[#E78913] ": tripDetails?.trip_status === "Upcoming",
										"text-[#F00000] ": tripDetails?.trip_status === "Canceled",
									})}
								>
									{tripDetails?.trip_status}
								</span>
							</p>
							<p>
								<strong>Checked-in:</strong>
								{getTotalPassengers()}
							</p>
						</li>
						<li
							className={cn(
								"basis-3/12 self-end ml-auto flex justify-end gap-2",
								{ hidden: isPrinting }
							)}
						>
							<IconButton
								size="icon"
								className="bg-blue-500"
								onClick={() => {
									setIsPrinting(true);
									setTimeout(() => {
										handlePrint();
									});
								}}
							>
								<PrinterIcon />
							</IconButton>
						</li>
					</ul>
					<div
						className={cn("border-t-4 mt-5", {
							"border-green-700": tripDetails?.trip_status === "Completed",
							"border-[#E78913] ": tripDetails?.trip_status === "Upcoming",
							"border-[#F00000] ": tripDetails?.trip_status === "Canceled",
						})}
					/>
				</div>
				<div className="bg-white rounded-b-lg px-4 py-2">
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
														`/backend/${adminProfile.account_type}/booking-details/${row.original.ticket_id}`
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
				</div>
			</section>
		</>
	);
};

export default Manifesto;
