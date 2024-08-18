import React from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
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
import { PaginationEllipsis } from "@/components/ui/pagination";
import ReactPaginate from "react-paginate";
import { Button as ButtonUI } from "@/components/ui/button";
import {
	CaretIcon,
	CircleArrowLeftIcon,
	TickIcon,
	PrinterIcon,
} from "@/assets/icons";
import { BookingCTX } from "@/contexts/BookingContext";
// import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { formatValue } from "react-currency-input-field";

const shipmentDataDemo = {
	_id: "9429405024024492440",
	shipment_id: "SP-73839021",
	departure: "Marina, Calabar",
	arrival: "Nwaniba Timber Beach, Uyo",
	category: "Food",
	name: "Food",
	description: "Lorem Ispum, etor djsns aped medu",
	no_item: 3,
	weight: 5,
	value: "10000",
	sender_name: "Queen Umesi",
	sender_email: "queenumesi01@gmailcom",
	sender_phone_number: "08083931561",
	sender_alt_phone_number: "",
	sender_address: "7 Mini-orlu, Banana Island, Calabar",
	receiver_name: "Ruth Umesi",
	receiver_email: "ruthumesi01@gmailcom",
	receiver_phone_number: "08083931561",
	receiver_alt_phone_number: "07035935342",
	receiver_address: "7 Mini-orlu, Sudan Island, Uyo",
	payment_method: "POS",
	payment_status: "Success",
	trxRef: "52923T944",
	cost_per_kg: 1000,
	total_cost: 5000,
	created_by: "Dev(dev)",
	created_at: "August 12th, 2024",
	shipment_status: "",
};

const LogisticsDetails = () => {
	const navigate = useNavigate();
	const { setCurrentPageIndex } = React.useContext(BookingCTX);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const dataQuery = [shipmentDataDemo];

	const columns = [
		{
			header: "S/N",
			cell: ({ row }) => Number(row.id) + 1,
		},
		{
			accessorKey: "shipment_id",
			header: "Shipment ID",
			cell: ({ row }) => row.getValue("shipment_id"),
		},
		{
			accessorKey: "departure",
			header: "Departure",
			cell: ({ row }) => row.getValue("departure"),
		},
		{
			accessorKey: "arrival",
			header: "Arrival",
			cell: ({ row }) => row.getValue("arrival"),
		},
		{
			accessorKey: "category",
			header: "Category",
			cell: ({ row }) => row.getValue("category"),
		},
		{
			accessorKey: "shipment_status",
			header: "Status",
			cell: ({ row }) => row.getValue("shipment_status"),
		},
	];

	const table = useReactTable({
		data: dataQuery,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
		pageCount: Math.ceil(dataQuery.length / pagination.pageSize),
		state: {
			pagination,
		},
	});

	return (
		<>
			<Helmet>
				<title>Logistics | Admin</title>
			</Helmet>
			<h1 className=" text-lg font-semibold mb-10">Shipment Entries</h1>
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
									key={row.original.shipment_id}
									className="h-[65px]"
									onDoubleClick={() => {
										navigate(row.original.shipment_id);
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
						{table.getFilteredRowModel().rows.length} Shipment results.
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
							setCurrentPageIndex((prev) => ({
								...prev,
								feedback: val.selected,
							}));
						}}
						initialPage={0}
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
		</>
	);
};

export const ShipmentDetails = () => {
	const navigate = useNavigate();
	const currentShipment = shipmentDataDemo;

	return (
		<>
			<Helmet>
				<title>Shipment Details | Admin </title>
			</Helmet>
			<div>
				<div className="flex gap-1 items-center mb-5 py-2">
					<button onClick={() => navigate(-1)}>
						<CircleArrowLeftIcon />
					</button>
					<h1 className="text-base font-semibold">Shipment Details</h1>
				</div>
				{currentShipment ? (
					<div className="flex gap-5 items-start">
						<div className="bg-white rounded-lg overflow-hidden basis-8/12">
							<div className="bg-blue-50 flex gap-3 p-5 ">
								<div className="bg-white rounded-lg p-2 ">
									<TickIcon />
								</div>
								<div>
									<h2 className="text-blue-500 text-sm font-semibold">
										Shipment Confirmed!
									</h2>
									<p className="text-[10px]">
										Great news! The shipment has been successfully confirmed
										from our sales point.
									</p>
								</div>
							</div>

							<div className="p-5 pb-20 space-y-6">
								<ul className="*:flex *:flex-col *:gap-1 flex gap-10">
									<li>
										<p className="text-xs text-[#7F7F7F]">Shipment ID</p>
										<p className="text-base font-semibold uppercase">
											#{currentShipment?.shipment_id}
										</p>
									</li>
									<li>
										<p className="text-xs text-[#7F7F7F]">Departure</p>
										<p className="text-base font-semibold capitalize">
											{currentShipment?.departure}
										</p>
									</li>
									<li>
										<p className="text-xs text-[#7F7F7F]">Arrival</p>
										<p className="text-base font-semibold">
											{currentShipment?.arrival}
										</p>
									</li>
								</ul>
								<ul className="*:flex *:flex-col *:gap-1 flex  flex-wrap gap-y-5 gap-x-10">
									<li>
										<p className="text-xs text-[#7F7F7F]">Category</p>
										<p className="text-base font-semibold">
											{currentShipment?.category}
										</p>
									</li>
									<li>
										<p className="text-xs text-[#7F7F7F] ">Name</p>
										<p className="text-base font-semibold">
											{currentShipment?.name ?? currentShipment?.category}
										</p>
									</li>
									<li>
										<p className="text-xs text-[#7F7F7F]">Description</p>
										<p className="text-base font-semibold">
											{/*TODO: truncate this and make clickable */}
											{currentShipment?.description ?? "None"}
										</p>
									</li>
									<li>
										<p className="text-xs text-[#7F7F7F]">No. of Item</p>
										<p className="text-base font-semibold">
											{currentShipment?.no_item}
										</p>
									</li>
									<li>
										<p className="text-xs text-[#7F7F7F]">Weight(kg)</p>
										<p className="text-base font-semibold">
											{currentShipment?.weight}
										</p>
									</li>
									<li>
										<p className="text-xs text-[#7F7F7F]">Est. Item Value</p>
										<p className="text-base font-semibold">
											{currentShipment?.value}
										</p>
									</li>
									<li>
										<p className="text-xs text-[#7F7F7F]">Cost/kg</p>
										<p className="text-base font-semibold">
											{currentShipment?.cost_per_kg}
										</p>
									</li>
									<li>
										<p className="text-xs text-[#7F7F7F]">Total Cost</p>
										<p className="text-base font-semibold">
											{currentShipment?.total_cost}
										</p>
									</li>
								</ul>
								<div className=" space-y-6 border-l-8 border-green-800 bg-green-50 py-2 pl-3 -ml-5">
									<ul className="*:flex *:flex-col *:gap-1 flex flex-wrap gap-y-5 gap-x-10">
										<li>
											<p className="text-xs text-[#7F7F7F]">Sender Name</p>
											<p className="text-base font-semibold">
												{currentShipment?.sender_name}
											</p>
										</li>
										<li>
											<p className="text-xs text-[#7F7F7F]">Sender Email</p>
											<p className="text-base font-semibold">
												{currentShipment?.sender_email}
											</p>
										</li>
										<li>
											<p className="text-xs text-[#7F7F7F]">
												Sender Phone Number
											</p>
											<p className="text-base font-semibold">
												{currentShipment?.sender_phone_number}
											</p>
										</li>
										<li>
											<p className="text-xs text-[#7F7F7F]">
												Sender Alt. Phone Number
											</p>
											<p className="text-base font-semibold">
												{currentShipment?.sender_alt_phone_number.length
													? currentShipment?.sender_alt_phone_number
													: "N/A"}
											</p>
										</li>
										<li>
											<p className="text-xs text-[#7F7F7F]">Sender Address</p>
											<p className="text-base font-semibold">
												{currentShipment?.sender_address}
											</p>
										</li>
									</ul>
								</div>
								<div className=" space-y-6 border-l-8 border-red-800 bg-red-50 py-2 pl-3 -ml-5">
									<ul className="*:flex *:flex-col *:gap-1 flex flex-wrap gap-y-5 gap-x-10">
										<li>
											<p className="text-xs text-[#7F7F7F]">Receiver Name</p>
											<p className="text-base font-semibold">
												{currentShipment?.receiver_name}
											</p>
										</li>
										<li>
											<p className="text-xs text-[#7F7F7F]">Receiver Email</p>
											<p className="text-base font-semibold">
												{currentShipment?.receiver_email}
											</p>
										</li>
										<li>
											<p className="text-xs text-[#7F7F7F]">
												Receiver Phone Number
											</p>
											<p className="text-base font-semibold">
												{currentShipment?.receiver_phone_number}
											</p>
										</li>
										<li>
											<p className="text-xs text-[#7F7F7F]">
												Receiver Alt. Phone Number
											</p>
											<p className="text-base font-semibold">
												{currentShipment?.receiver_alt_phone_number.length
													? currentShipment?.receiver_alt_phone_number
													: "N/A"}
											</p>
										</li>
										<li>
											<p className="text-xs text-[#7F7F7F]">Receiver Address</p>
											<p className="text-base font-semibold">
												{currentShipment?.receiver_address}
											</p>
										</li>
									</ul>
								</div>

								<ul className="*:flex *:flex-col *:gap-1 flex flex-wrap gap-y-5 gap-x-10">
									<li>
										<p className="text-xs text-[#7F7F7F]">Payment Method</p>
										<p className="text-base font-semibold">
											{currentShipment?.payment_method}
										</p>
									</li>
									<li>
										<p className="text-xs text-[#7F7F7F]">Payment Status</p>
										<p
											className={cn(
												"text-center font-semibold rounded-lg py-1 px-2 text-xs",
												{
													"text-green-500 bg-green-100":
														currentShipment?.payment_status === "Success",
													"text-[#E78913] bg-[#F8DAB6]":
														currentShipment?.payment_status === "Pending",
													"text-[#F00000] bg-[#FAB0B0]":
														currentShipment?.payment_status === "Canceled",
												}
											)}
										>
											{currentShipment?.payment_status}
										</p>
									</li>
									<li>
										<p className="text-xs text-[#7F7F7F]">
											Transaction Reference
										</p>
										<p className="text-base font-semibold">
											{currentShipment?.trxRef}
										</p>
									</li>
								</ul>
								<ul className="*:flex *:flex-col *:gap-1 flex flex-wrap gap-y-5 gap-x-10">
									<li>
										<p className="text-xs text-[#7F7F7F]">Booked on</p>
										<p className="text-base font-semibold">
											{/* {format(
												new Date(currentShipment.created_at),
												"PPPPpppp"
											).split("GMT", 1)} */}
										</p>
									</li>
									<li>
										<p className="text-xs text-[#7F7F7F]">Booked By</p>
										<p className="text-base font-semibold">
											{currentShipment?.created_by}
										</p>
									</li>
									<li>
										<p className="text-xs text-[#7F7F7F]">Shipment Status</p>
										<p
											className={cn(
												"rounded-lg w-20 mx-auto py-1 text-xs px-2 text-center font-semibold",
												{
													"text-green-500 bg-green-100":
														currentShipment?.shipment_status === "Completed",
													"text-[#E78913] bg-[#F8DAB6]":
														currentShipment?.shipment_status === "Upcoming",
													"text-[#F00000] bg-[#FAB0B0]":
														currentShipment?.shipment_status === "Canceled",
													"text-black bg-slate-500/50 ":
														currentShipment?.shipment_status === "Rescheduled",
													"text-purple-900 bg-purple-300/30 ":
														currentShipment?.shipment_status === "Missed",
												}
											)}
										>
											{currentShipment?.shipment_status}
										</p>
									</li>
								</ul>
							</div>
						</div>

						<div className="bg-white rounded-lg basis-4/12 p-5 flex flex-col gap-6">
							<div>
								<h3 className="text-blue-500 font-semibold  text-base md:text-xl ">
									Abitto Logistics
								</h3>
								<p className="font-medium text-xs text-right">
									Shipment ID: #
									<span className="uppercase">
										{currentShipment?.shipment_id}
									</span>
								</p>
							</div>
							<ul className="space-y-1 text-[#1E1E1E] text-sm font-normal [&_p]:inline-flex [&_p]:items-center [&_p]:gap-1">
								<li>
									<p>
										<span>Category:</span>
										<span>{currentShipment?.category}</span>
									</p>
								</li>
								<li>
									<p>
										<span>No. of item:</span>
										<span>{currentShipment?.no_item}</span>
									</p>
								</li>
								<li>
									<p>
										<span>Weight:</span>
										<span>{currentShipment?.weight} kg</span>
									</p>
								</li>
								<li>
									<p>
										<span>Shipment status:</span>
										<span>{currentShipment?.shipment_status}</span>
									</p>
								</li>
							</ul>

							<div className="border-y-2 border-dashed py-2">
								<table className="w-full [&_td:last-of-type]:text-right [&_td]:py-[2px] ">
									<tbody>
										<tr>
											<td className="text-xs text-[#444444]">Cost/kg</td>
											<td className="text-xs text-[#444444]">
												<span className="block text-sm">
													{formatValue({
														value: String(currentShipment.cost_per_kg ?? 0),
														prefix: "₦",
													})}{" "}
													x {currentShipment.weight}kg
												</span>
											</td>
										</tr>
										<tr>
											<td className="font-medium text-base">Total</td>
											<td className="font-medium text-base">
												₦
												{formatValue({
													value: String(currentShipment?.total_cost),
												})}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<button
								className=" bg-blue-500 w-56 py-3 font-semibold text-sm hover:bg-blue-700 transition-all duration-150 ease-in-out text-white flex justify-center gap-2 mx-auto rounded-lg "
								onClick={() => {
									navigate(`/ticket-invoice/${currentShipment.ticket_id}`);
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
		</>
	);
};

export default LogisticsDetails;
