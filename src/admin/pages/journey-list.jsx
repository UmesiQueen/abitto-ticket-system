import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
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
import { cn, customError } from "@/lib/utils";
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
import { CaretIcon, CalendarIcon } from "@/assets/icons";
import SelectField from "@/components/custom/SelectField";
import { BookingCTX } from "@/contexts/BookingContext";
import { Refresh } from "iconsax-react";
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

const JourneyList = () => {
	return (
		<>
			<Helmet>
				<title>Journey List | Admin</title>
			</Helmet>
			<h1 className=" text-lg font-semibold mb-10">Journey List</h1>
			<SearchForm />
			<JourneyTable />
		</>
	);
};

export default JourneyList;

const searchSchema = yup
	.object()
	.shape({
		departure: yup
			.string()
			.when("arrival", ([arrival], schema) =>
				arrival
					? schema.notOneOf(
						[yup.ref("arrival")],
						"Departure and arrival cannot be the same."
					)
					: schema
			),
		date: yup.string(),
	})
	.test("require at least one field", ({ departure, date }) => {
		const a = !!(departure || date); // At least one must be non-empty

		if (!a) {
			return new yup.ValidationError(
				"At least one of the two fields must be filled.", //Message
				"null",
				"departure", //error name
				"required" //type
			);
		}
		return true;
	});

export const SearchForm = () => {
	const { loading, setLoading, setSearchParams, searchParams } =
		React.useContext(BookingCTX);
	const { accountType } = useParams();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitted },
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
			className="flex gap-5 justify-between bg-white rounded-lg p-6"
		>
			<div className="flex gap-5 w-full ">
				{["super-admin", "dev"].includes(accountType) && (
					<SelectField
						{...register("departure")}
						label="Departure"
						placeholder="Select Departure Terminal"
						options={["Marina, Calabar", "Nwaniba Timber Beach, Uyo"]}
						errors={errors}
						formState={isSubmitted}
					/>
				)}
				<div className="flex flex-col w-full">
					<label htmlFor="date" className="text-xs md:text-sm !w-full flex flex-col ">
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
			</div>
			<Button
				text="Search"
				type="submit"
				loading={loading}
				className="w-44 py-6  md:mt-7 "
			/>
		</form>
	);
};

const JourneyTable = () => {
	const navigate = useNavigate();
	const { adminProfile } = React.useContext(GlobalCTX);
	const { searchParams, setSearchParams, setCurrentPageIndex } =
		React.useContext(BookingCTX);
	const [columnFilters, setColumnFilters] = React.useState([]);
	const [pageCount, setPageCount] = React.useState(0);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 7,
	});
	const [journeyList, setJourneyList] = React.useState([]);

	const { data, isSuccess, isPending } = useQuery({
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
		if (searchParams) {
			table.getColumn("departure").setFilterValue(searchParams?.departure);
			table
				.getColumn("date")
				.setFilterValue(searchParams?.date && format(searchParams?.date, "PP"));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	const columns = [
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
			cell: ({ row }) => row.getValue("date"),
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
				const dateTime = new Date(`${row.date} ${row.time}`);
				return dateTime;
			},
		},
	];

	const table = useReactTable({
		data: journeyList,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: setPagination,
		pageCount,
		state: {
			columnFilters,
			pagination,
			columnVisibility: {
				dateTime: false,
			},
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (journeyList.length)
			setPageCount(Math.ceil(journeyList.length / pagination.pageSize));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [journeyList]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (columnFilters.length)
			setPageCount(
				Math.ceil(table.getFilteredRowModel().rows.length / pagination.pageSize)
			);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [columnFilters]);

	return (
		<div>
			{Object.keys(searchParams).length ? (
				<div className="flex items-center mt-16 mb-5">
					<div className="inline-flex gap-1">
						<h2 className="font-semibold">Search results for </h2>
						<p className="divide-x divide-black flex gap-2 [&>*:not(:first-of-type)]:pl-2">
							({" "}
							{searchParams?.departure && (
								<span>{searchParams.departure} </span>
							)}
							{searchParams?.date && <span>{searchParams.date}</span>})
						</p>
					</div>

					<ButtonUI
						className="inline-flex gap-1 ml-5"
						size="icon"
						variant="ghost"
						onClick={() => {
							table.resetColumnFilters(true);
							setSearchParams({});
						}}
					>
						<Refresh />
					</ButtonUI>
				</div>
			) : (
				<h2 className="font-semibold mt-14 mb-5">All Scheduled Trips</h2>
			)}

			<div className="flex items-center w-fit border border-gray-200 font-medium rounded-t-lg mt-8 bg-white ">
				<span className="px-4 text-nowrap text-sm font-semibold h-full inline-flex items-center rounded-l-lg">
					Filter
				</span>
				<Select
					defaultValue="#"
					value={table.getColumn("trip_status")?.getFilterValue() ?? "#"}
					onValueChange={(value) => {
						if (value === "#") {
							return table.getColumn("trip_status")?.setFilterValue("");
						}
						table.getColumn("trip_status")?.setFilterValue(value);
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
									onClick={() => {
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
									{isPending ? <p className="inline-flex gap-2 items-center">Fetching data  <Loader2 className="animate-spin" /></p> : "No results."}
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
							setCurrentPageIndex((prev) => ({
								...prev,
								journeyList: val.selected,
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
		</div>
	);
};
