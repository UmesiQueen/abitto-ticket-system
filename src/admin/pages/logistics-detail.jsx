import React from "react";
import { useLoaderData, useNavigate, Navigate, useRevalidator } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getFilteredRowModel,
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
import { PaginationEllipsis } from "@/components/ui/pagination";
import ReactPaginate from "react-paginate";
import { Button } from "@/components/ui/button";
import {
	CaretIcon,
	CircleArrowLeftIcon,
	TickIcon,
	PrinterIcon,
	CancelSquareIcon
} from "@/assets/icons";
import { BookingCTX } from "@/contexts/BookingContext";
import { format } from "date-fns";
import { cn, customError } from "@/lib/utils";
import { formatValue } from "react-currency-input-field";
import axiosInstance from "@/api";
import { GlobalCTX } from "@/contexts/GlobalContext";
import ConfirmationModal from "@/components/modals/confirmation";
import { useUpdate } from "@/hooks/useUpdate";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const LogisticsDetails = () => {
	const navigate = useNavigate();
	const { setCurrentPageIndex, filtering, setFiltering, currentPageIndex } = React.useContext(BookingCTX);
	const [dataQuery, setDataQuery] = React.useState([]);
	const [columnFilters, setColumnFilters] = React.useState([]);
	const [pageCount, setPageCount] = React.useState(0);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const { data, isSuccess, isPending } = useQuery({
		queryKey: ["logistics"],
		queryFn: async () => {
			try {
				const response = await axiosInstance.get("logistics/get");
				return response.data.logistics;
			}
			catch (error) {
				customError(error, "Error occurred while fetching logistics. Refresh page.")
				return []
			}
		}
	})

	React.useEffect(() => {
		if (isSuccess) setDataQuery(data);
	}, [data, isSuccess])

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (dataQuery.length)
			setPageCount(Math.ceil(dataQuery.length / pagination.pageSize));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataQuery]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		table.setPageIndex(currentPageIndex.logistics);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (columnFilters.length || filtering.length) {
			setPageCount(
				Math.ceil(table.getFilteredRowModel().rows.length / pagination.pageSize)
			);
			setCurrentPageIndex((prev) => ({
				...prev,
				logistics: 0,
			}));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [columnFilters, filtering]);

	const columns = [
		{
			accessorKey: "shipment_id",
			header: "Shipment ID",
			cell: ({ row }) => <p className="uppercase">{row.getValue("shipment_id")}</p>,
		},
		{
			accessorKey: "departure",
			header: "Departure",
			cell: ({ row }) => row.getValue("departure"),
			enableGlobalFilter: false,
		},
		{
			accessorKey: "arrival",
			header: "Arrival",
			cell: ({ row }) => row.getValue("arrival"),
			enableGlobalFilter: false,
		},
		{
			accessorKey: "category",
			header: "Category",
			cell: ({ row }) => row.getValue("category"),
			enableGlobalFilter: false,
		},
		{
			accessorKey: "createdAt",
			header: "Created On",
			cell: ({ row }) => format(new Date(row.getValue("createdAt").split("T")[0]), "PP"),
			enableGlobalFilter: false,
		},
		{
			accessorKey: "shipment_status",
			header: <div className="text-center">Status</div>,
			cell: ({ row }) => {
				const status = row.original.shipment_status;
				return (
					<div
						className={cn(
							"rounded-lg w-20 mx-auto py-1 text-[10px] text-center font-semibold",
							{
								"text-green-500 bg-green-100": status === "Collected",
								"text-[#E78913] bg-[#F8DAB6]": status === "Origin",
								"text-purple-900 bg-purple-300/30": status === "Arrived",
							}
						)}
					>
						{status}
					</div>
				);
			},
			enableGlobalFilter: false,
		},
		{
			id: "dateTime",
			accessorKey: "dateTime",
			header: "DateTime",
			accessorFn: (row) => {
				const dateTime = new Date(row.createdAt);
				return dateTime;
			},
		},
	];

	const table = useReactTable({
		data: dataQuery,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: setPagination,
		onGroupingChange: setFiltering,
		pageCount,
		state: {
			pagination,
			columnFilters,
			columnVisibility: {
				dateTime: false,
			},
			globalFilter: filtering,
		},
		initialState: {
			sorting: [
				{
					id: "dateTime",
					desc: true, // sort by name in descending order by default
				},
			],
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
									{isPending ? <p className="inline-flex gap-2 items-center">Fetching data  <Loader2 className="animate-spin" /></p> : "No results."}
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
								logistics: val.selected,
							}));
						}}
						initialPage={currentPageIndex.logistics}
						forcePage={currentPageIndex.logistics}
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
		</>
	);
};

export const ShipmentDetails = () => {
	const navigate = useNavigate();
	const currentShipment = useLoaderData();
	const { adminProfile, mountPortalModal } = React.useContext(GlobalCTX);
	const { updateShipmentStatus } = useUpdate();
	const { revalidate } = useRevalidator();

	if (!currentShipment?.shipment_id) return <Navigate to={`/backend/${adminProfile.account_type}/pageNotFound`} />;

	return (
		<>
			<Helmet>
				<title>Shipment Details | Admin </title>
			</Helmet>
			<div>
				<div className="flex gap-1 items-center mb-5 py-2">
					<button type="button" onClick={() => navigate(-1)}>
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
								<div className="ml-auto">
									{currentShipment?.shipment_status === "Origin" ?
										<Button
											onClick={() => {
												mountPortalModal(
													<ConfirmationModal props={{
														header: "Shipment arrived? Please notify receiver",
														handleRequest: () => { updateShipmentStatus({ shipment_id: currentShipment?.shipment_id, shipment_status: "Arrived" }, () => { revalidate() }) }
													}} />)
											}}
										>Arrived</Button> :
										currentShipment?.shipment_status === "Arrived" ?
											<Button
												onClick={() => {
													mountPortalModal(
														<ConfirmationModal props={{
															header: "Confirm receiver",
															handleRequest: () => { updateShipmentStatus({ shipment_id: currentShipment?.shipment_id, shipment_status: "Collected" }, () => { revalidate() }) }
														}} />)
												}}
											>Collected</Button> : ""
									}
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
										<p className="text-xs text-[#7F7F7F]">Origin</p>
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
											{currentShipment?.name}
										</p>
									</li>
									<li>
										<p className="text-xs text-[#7F7F7F]">Description</p>
										<p className="text-base font-semibold">
											{currentShipment?.description.length ?
												<button
													type="button"
													className="text-blue-500 hover:text-blue-700 text-sm underline"
													onClick={() => {
														mountPortalModal(
															<DescriptionModal description={currentShipment?.description} />
														);
													}}
												>
													See description
												</button> : "N/A"}
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
											{formatValue({
												value: String(currentShipment.value),
												prefix: "₦",
											})}
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
												{currentShipment?.sender_alt_phone_number ??
													"N/A"}
											</p>
										</li>
										<li>
											<p className="text-xs text-[#7F7F7F]">Sender Address</p>
											<p className="text-base font-semibold">
												{currentShipment?.sender_address.length ? currentShipment?.sender_address : "N/A"}
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
												{currentShipment?.receiver_alt_phone_number ?? "N/A"}
											</p>
										</li>
										<li>
											<p className="text-xs text-[#7F7F7F]">Receiver Address</p>
											<p className="text-base font-semibold">
												{currentShipment?.receiver_address.length ? currentShipment?.receiver_address : "N/A"}
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
											{currentShipment?.txRef}
										</p>
									</li>
								</ul>
								<ul className="*:flex *:flex-col *:gap-1 flex flex-wrap gap-y-5 gap-x-10">
									<li>
										<p className="text-xs text-[#7F7F7F]">Created on</p>
										<p className="text-base font-semibold">
											{format(new Date(currentShipment?.createdAt.split("T")[0]), "PPPPpppp").split("GMT")[0]}
										</p>
									</li>
									<li>
										<p className="text-xs text-[#7F7F7F]">Created By</p>
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
														currentShipment?.shipment_status === "Collected",
													"text-[#E78913] bg-[#F8DAB6]":
														currentShipment?.shipment_status === "Origin",
													"text-purple-900 bg-purple-300/30 ":
														currentShipment?.shipment_status === "Arrived",
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
							<ul className="  [&_h3]:font-semibold [&_h3]:text-[13px] md:[&_h3]:text-sm space-y-1 text-[#1E1E1E] text-sm font-normal [&_p]:inline-flex [&_p]:items-center [&_p]:gap-1">
								<li>
									<p>
										<h3>Category:</h3>
										<span>{currentShipment?.category}</span>
									</p>
								</li>
								<li>
									<p>
										<h3>No. of item:</h3>
										<span>{currentShipment?.no_item}</span>
									</p>
								</li>
								<li>
									<p>
										<h3>Weight:</h3>
										<span>{currentShipment?.weight}kg</span>
									</p>
								</li>
								<li>
									<p>
										<h3 className="text-nowrap">Shipment status:</h3>
										<span
											className={cn(
												"w-full py-1 text-xs px-5 text-center font-semibold ",
												{
													"text-green-500 bg-green-100":
														currentShipment?.shipment_status === "Collected",
													"text-[#E78913] bg-[#F8DAB6]":
														currentShipment?.shipment_status === "Origin",
													"text-purple-900 bg-purple-300/30 ":
														currentShipment?.shipment_status === "Arrived",
												}
											)}
										>
											{currentShipment?.shipment_status}
										</span>
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
											<td className="font-semibold text-base">Total</td>
											<td className="font-semibold  text-base">
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
								type="button"
								className=" bg-blue-500 w-full py-3 font-semibold text-sm hover:bg-blue-700 transition-all duration-150 ease-in-out text-white flex justify-center gap-2 mx-auto rounded-lg "
								onClick={() => {
									navigate(`/logistics-invoice/${currentShipment.shipment_id}`);
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
			</div >
		</>
	);
};

export default LogisticsDetails;

// eslint-disable-next-line react/prop-types
const DescriptionModal = ({ description }) => {
	const { unMountPortalModal } = React.useContext(GlobalCTX);

	return (
		<div className="bg-white rounded-lg p-10 pt-5 flex flex-col max-w-[600px] w-full relative">
			<Button
				variant="ghost"
				size="icon"
				className="absolute top-0 right-0"
				onClick={unMountPortalModal}
			>
				<CancelSquareIcon />
			</Button>
			<h3 className="font-bold">Item Description</h3>
			<p>{description}</p>
		</div>
	)

}
