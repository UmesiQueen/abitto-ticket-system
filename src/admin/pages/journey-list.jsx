import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
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
import { CaretIcon } from "@/assets/icons";
import { BookingCTX } from "@/contexts/BookingContext";
import axiosInstance from "@/api";
import { GlobalCTX } from "@/contexts/GlobalContext";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import SearchForm from "@/components/SearchForm";
import { useSearchParam } from "@/hooks/useSearchParam";

const JourneyList = () => {
	return (
		<>
			<Helmet>
				<title>Journey List | Admin</title>
			</Helmet>
			<h1 className=" text-lg font-semibold mb-10">Journey List</h1>
			<SearchForm
				props={{
					page: "journeyList",
					name: "departure",
					label: "Departure",
					placeholder: "Select Departure Terminal",
					options: ["Marina, Calabar", "Nwaniba Timber Beach, Uyo"]
				}}
			/>
			<JourneyTable />
		</>
	);
};

export default JourneyList;

const JourneyTable = () => {
	const navigate = useNavigate();
	const { adminProfile } = React.useContext(GlobalCTX);
	const { currentPageIndex, setCurrentPageIndex, resetPageIndex } = React.useContext(BookingCTX);
	const [pageCount, setPageCount] = React.useState(0);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 7,
	});
	const [sorting, setSorting] = React.useState([{
		id: "dateTime",
		desc: true, // sort by name in descending order by default
	}])
	const [journeyList, setJourneyList] = React.useState([]);
	const { searchParams, setSearchParams, getSearchParams, updateSearchParam, removeSearchParam } = useSearchParam();
	const searchParamValues = getSearchParams();
	const defaultColumnFilters =
		Object.entries(searchParamValues).map(([key, value]) => ({ id: key, value }))
	const [columnFilters, setColumnFilters] = React.useState(defaultColumnFilters);

	const { data, isSuccess, isLoading } = useQuery({
		queryKey: ["journeyList"],
		queryFn: async () => {
			try {
				const response = await axiosInstance.get("/ticket/get");
				const terminals = adminProfile.terminal.map((location) =>
					location.split(",")[1].trim().toLowerCase()
				);
				// Filter records based on the terminal
				const sortedJourneyList = response.data.tickets.filter((list) => {
					const city = list.departure.split(",")[1].trim().toLowerCase();
					return terminals.includes(city);
				});
				return sortedJourneyList;
			}
			catch (error) {
				customError(error, "Error occurred while fetching journey list. \n Refresh page.")
				return []
			}
		}
	})

	React.useEffect(() => {
		if (isSuccess) setJourneyList(data);
	}, [data, isSuccess])

	React.useEffect(() => {
		const departure = searchParams.get("departure")
		if (departure)
			table.getColumn("departure").setFilterValue(departure);

		const date = searchParams.get("date");
		if (date) {
			const formatDate = format(new Date(date), "P");
			table.getColumn("date").setFilterValue(formatDate);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	const columns = React.useMemo(() => [
		{
			accessorKey: "trip_code",
			header: "Trip Code",
			cell: ({ row }) => (
				<p className="uppercase">#{row.getValue("trip_code")}</p>
			),
		},
		{
			accessorKey: "departure",
			header: "Departure",
			cell: ({ row }) => row.getValue("departure"),
		},
		{
			accessorKey: "date",
			header: "Date",
			cell: ({ row }) => {
				const dateTime = new Date(row.getValue("date"));
				return format(dateTime, "PP");
			},
		},
		{
			accessorKey: "time",
			header: "Time",
			cell: ({ row }) => row.getValue("time"),
		},
		{
			accessorKey: "trip_capacity",
			header: "Capacity",
			cell: ({ row }) => row.getValue("trip_capacity") ?? "N/A",
		},
		{
			accessorKey: "trip_status",
			id: "trip_status",
			header: <div className="text-center">Trip Status</div>,
			cell: ({ row }) => {
				const status = row.original.trip_status;
				return (
					<div
						className={cn(
							"rounded-lg w-20 mx-auto py-1 text-[10px] text-center",
							{
								"text-green-500 bg-green-100": status === "Completed",
								"text-[#E78913] bg-[#F8DAB6]": status === "Upcoming",
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
			accessorKey: "ticket_cost",
			header: <div className="text-center">Ticket Cost</div>,
			cell: ({ row }) => (
				<p className="text-center">₦{row.getValue("ticket_cost")}</p>
			),
		},
		{
			id: "dateTime",
			accessorKey: "dateTime",
			header: "DateTime",
			accessorFn: (row) => {
				const date = format(new Date(row.date), "PP");
				const dateTime = new Date(`${date} ${row.time}`);
				return dateTime;
			},
		},
	], [])

	const table = useReactTable({
		data: journeyList,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: setPagination,
		pageCount,
		state: {
			sorting,
			columnFilters,
			pagination,
			columnVisibility: {
				dateTime: false,
			},
		},
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		setPageCount(Math.ceil(table.getFilteredRowModel().rows.length / pagination.pageSize));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [journeyList, columnFilters]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		table.setPageIndex(currentPageIndex.journeyList);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pageCount])

	return (
		<div>
			<div className="flex items-center gap-10 justify-between w-full mt-16 mb-5 ">
				<h2 className="font-semibold"> {Object.keys(searchParamValues).length ? "Search results" : "All Scheduled Trips"}</h2>
				{(columnFilters.length) ?
					<CustomButton
						variant="outline"
						className="!h-8 !text-sm"
						onClick={() => {
							table.resetColumnFilters(true);
							setSearchParams({});
							resetPageIndex("journeyList")
						}}
					>
						Reset filters
					</CustomButton> : ""}
			</div>

			<div className="flex items-center w-fit border border-gray-200 font-medium rounded-t-lg mt-8 bg-white ">
				<span className="px-4 text-nowrap text-sm font-semibold h-full inline-flex items-center rounded-l-lg">
					Filter
				</span>
				<Select
					defaultValue={searchParamValues?.trip_status ?? "#"}
					value={table.getColumn("trip_status")?.getFilterValue() ?? "#"}
					onValueChange={(value) => {
						if (value === "#") {
							removeSearchParam("trip_status")
							table.getColumn("trip_status")?.setFilterValue("");
							resetPageIndex("journeyList")
							return;
						}
						updateSearchParam("trip_status", value)
						table.getColumn("trip_status")?.setFilterValue(value);
						resetPageIndex("journeyList")
					}}
				>
					<SelectTrigger className="w-[150px] grow rounded-none rounded-r-lg border-0 border-l px-5 focus:ring-0 focus:ring-offset-0 bg-white">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="#">All trips</SelectItem>
							<SelectItem value="Upcoming">Upcoming</SelectItem>
							<SelectItem value="Completed">Completed</SelectItem>
							<SelectItem value="Canceled">Canceled</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<div className="bg-white rounded-lg rounded-tl-none p-5">
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
									key={row.original.trip_code}
									className="h-[65px]"
									onDoubleClick={() => {
										navigate(row.original.trip_code);
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
									{isLoading ? <p className="inline-flex gap-2 items-center">Fetching data  <Loader2 className="animate-spin" /></p> : "No results."}
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
								journeyList: val.selected,
							}));
						}}
						forcePage={currentPageIndex.journeyList}
						pageRangeDisplayed={3}
						pageCount={pageCount}
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
