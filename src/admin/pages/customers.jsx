import React from "react";
import { Helmet } from "react-helmet-async";
import { CaretIcon } from "@/assets/icons";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
// import { useNavigate } from "react-router-dom";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Button as ButtonUI } from "@/components/ui/button";
import { capitalize } from "lodash";
// import { GlobalCTX } from "@/contexts/GlobalContext";
import { PaginationEllipsis } from "@/components/ui/pagination";
import ReactPaginate from "react-paginate";
import baseurl from "@/api/instance";
import { formatValue } from "react-currency-input-field";
import { v4 as uuid } from "uuid";
import { BookingCTX } from "@/contexts/BookingContext";
import { toast } from "sonner";

const Customers = () => {
	// const navigate = useNavigate();
	const {
		customersData,
		setCustomersData,
		filtering,
		setFiltering,
		setCurrentPageIndex,
		currentPageIndex,
	} = React.useContext(BookingCTX);
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

	React.useEffect(() => {
		baseurl
			.get("/booking/customerdetails")
			.then((res) => {
				if (res.status == 200) {
					const response = res.data.customerDetails;
					const customersData_ = Object.entries(response).map(
						([email, data]) => {
							const {
								details: { first_name, last_name, phone_number },
								bookings,
							} = data;

							const total_spent = bookings
								.map((booking) => Number(booking.totalTicketCost ?? 0))
								.reduce((a, c) => a + c, 0);

							return {
								_id: `CUS_${uuid().slice(0, 10)}`,
								email,
								first_name,
								last_name,
								phone_number,
								total_spent,
								total_trips: bookings.length,
								bookings,
							};
						}
					);
					setCustomersData(customersData_);
				}
			})
			.catch((err) => {
				console.error(err, "Error occurred while fetching customers data.");
				toast.error(
					"Error occurred while fetching customers data. Refresh page."
				);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const columns = [
		{
			accessorKey: "id",
			header: "ID",
			cell: ({ row }) => Number(row.id) + 1,
		},
		{
			accessorKey: "fullName",
			id: "fullName",
			header: "fullName",
			accessorFn: (row) => `${row.first_name} ${row.last_name}`,
		},
		{
			accessorKey: "customer",
			header: "Customer",
			cell: ({ row }) => (
				<p className="text-[15px] font-semibold capitalize">
					{capitalize(`${row.original.first_name} ${row.original.last_name}`)}
				</p>
			),
			enableGlobalFilter: false,
		},
		{
			accessorKey: "email",
			header: "Email",
			cell: ({ row }) => <p className="lowercase">{row.getValue("email")}</p>,
			enableGlobalFilter: false,
		},
		{
			accessorKey: "phone_number",
			header: "Phone number",
			cell: ({ row }) => row.getValue("phone_number"),
			enableGlobalFilter: false,
		},
		{
			accessorKey: "total_trips",
			header: "Total trips",
			cell: ({ row }) => row.getValue("total_trips"),
			enableGlobalFilter: false,
		},
		{
			accessorKey: "total_spent",
			header: "Total spent",
			cell: ({ row }) =>
				formatValue({
					value: String(row.getValue("total_spent")),
					prefix: "₦",
				}),
			enableGlobalFilter: false,
		},
	];

	const table = useReactTable({
		data: customersData,
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
		pageCount: Math.ceil(customersData.length / pagination.pageSize),
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
		table.setPageIndex(currentPageIndex.customers);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Helmet>
				<title>Customers | Admin</title>
			</Helmet>
			<h1 className="text-base font-semibold mb-5">Customers</h1>
			<div className="bg-white rounded-lg p-2">
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
						{table.getFilteredRowModel().rows.length} result(s).
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
							setCurrentPageIndex((prev) => ({
								...prev,
								customers: val.selected,
							}));
						}}
						initialPage={currentPageIndex.customers}
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

export default Customers;
