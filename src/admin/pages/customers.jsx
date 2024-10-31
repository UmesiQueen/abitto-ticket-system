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
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { capitalize } from "lodash";
import { PaginationEllipsis } from "@/components/ui/pagination";
import ReactPaginate from "react-paginate";
import axiosInstance from "@/api";
import { formatValue } from "react-currency-input-field";
import { v4 as uuid } from "uuid";
import { BookingCTX } from "@/contexts/BookingContext";
import { useQuery } from "@tanstack/react-query";
import { customError } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useSearchParam } from "@/hooks/useSearchParam";

const Customers = () => {
	const { setCurrentPageIndex, currentPageIndex } = React.useContext(BookingCTX);
	const [customersData, setCustomersData] = React.useState([])
	const [sorting, setSorting] = React.useState([]);
	const [columnFilters, setColumnFilters] = React.useState([]);
	const [columnVisibility, setColumnVisibility] = React.useState({
		fullName: false,
	});
	const [pageCount, setPageCount] = React.useState(0);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 7,
	});
	const { getSearchParams } = useSearchParam();
	const searchParamValues = getSearchParams();

	const { data, isSuccess, isPending } = useQuery({
		queryKey: ["customers"],
		queryFn: async () => {
			try {
				const response = await axiosInstance.get("/booking/customerdetails");
				const { customerDetails } = response.data;
				const customersData_ = Object.entries(customerDetails).map(
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
				return customersData_;
			}
			catch (error) {
				customError(error, "Error occurred while fetching customers. Refresh page.")
				return []
			}
		}
	})

	React.useEffect(() => {
		if (isSuccess) setCustomersData(data);
	}, [data, isSuccess])

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
	}, [customersData, columnFilters]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
									{isPending ? <p className="inline-flex gap-2 items-center">Fetching data  <Loader2 className="animate-spin" /></p> : "No results."}
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
								customers: val.selected,
							}));
						}}
						forcePage={currentPageIndex.customers}
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

export default Customers;
