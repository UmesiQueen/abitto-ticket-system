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
import { CaretIcon, CircleArrowLeftIcon } from "@/assets/icons";
import { BookingCTX } from "@/contexts/BookingContext";
import { truncate } from "lodash";
import { format } from "date-fns";
import Rating from "@mui/material/Rating";
import { humanize } from "@/lib/utils";

const FeedbackAdmin = () => {
	const navigate = useNavigate();
	const { setCurrentPageIndex } = React.useContext(BookingCTX);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const dataQuery = [
		{
			_id: "9429405024024492440",
			full_name: "Umesi Queen",
			email: "queenumesi01@gmailcom",
			travel_date: String(new Date()),
			travel_time: "10:00 AM",
			star_rating: 3,
			suggestion_title: ["Overall Service", "Customer Support"],
			comment:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,",
			trip_remark:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,",
		},
	];

	const columns = [
		{
			header: "S/N",
			cell: ({ row }) => Number(row.id) + 1,
		},
		{
			accessorKey: "full_name",
			header: "Full Name",
			cell: ({ row }) => row.getValue("full_name"),
		},
		{
			accessorKey: "email",
			header: "Email",
			cell: ({ row }) => row.getValue("email"),
		},
		{
			accessorKey: "travel_date",
			header: "Travel Date",
			cell: ({ row }) => format(row.getValue("travel_date"), "PPP"),
		},
		{
			accessorKey: "travel_time",
			header: "Travel Time",
			cell: ({ row }) => row.getValue("travel_time"),
		},
		{
			accessorKey: "suggestion_title",
			header: "Comments",
			cell: ({ row }) => (
				<div>{truncate(row.getValue("suggestion_title"), { length: 20 })}</div>
			),
		},
		{
			accessorKey: "star_rating",
			header: "Ratings",
			cell: ({ row }) => (
				<Rating
					size="small"
					sx={{
						"& .MuiRating-iconFilled": {
							color: "#3366CC",
						},
					}}
					value={row.getValue("star_rating")}
					readOnly
				/>
			),
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
				<title>Feedback| Admin</title>
			</Helmet>
			<h1 className=" text-lg font-semibold mb-10">Feedback Entries</h1>
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
									key={row.original._id}
									className="h-[65px]"
									onDoubleClick={() => {
										navigate(row.original._id);
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
					<tr className="font-medium text-sm">
						{table.getFilteredRowModel().rows.length} Feedback results.
					</tr>
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

export default FeedbackAdmin;

export const FeedbackDetails = () => {
	const navigate = useNavigate();

	const currentFeedback = {
		_id: "9429405024024492440",
		full_name: "Umesi Queen",
		email: "queenumesi01@gmailcom",
		travel_date: String(new Date()),
		travel_time: "10:00 AM",
		star_rating: 3,
		suggestion_title: ["Overall Service", "Customer Support"],
		comment:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,",
		trip_remark:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,",
	};

	return (
		<>
			<Helmet>
				<title>Feedback Details | Admin </title>
			</Helmet>
			<div>
				<div className="flex gap-1 items-center mb-10 ">
					<ButtonUI size="icon" variant="ghost" onClick={() => navigate(-1)}>
						<CircleArrowLeftIcon />
					</ButtonUI>
					<h1 className="font-semibold text-lg">Feedback Details</h1>
				</div>
				<div className=" bg-white p-10 rounded-lg">
					<table className="w-4/6 border border-collapse">
						<tbody className=" [&_td:first-of-type]:font-semibold  [&_td:first-of-type]:text-nowrap  [&_td]:p-3   [&_td]:border-2 ">
							<tr>
								<td>Name:</td>
								<td>{currentFeedback.full_name}</td>
							</tr>
							<tr>
								<td>Email:</td>
								<td>{currentFeedback.email}</td>
							</tr>
							<tr>
								<td>Travel date:</td>
								<td>{currentFeedback.travel_date}</td>
							</tr>
							<tr>
								<td>Travel time:</td>
								<td>{currentFeedback.travel_time}</td>
							</tr>
							<tr>
								<td>Trip remark:</td>
								<td>{currentFeedback.trip_remark}</td>
							</tr>
							<tr>
								<td>Suggestion title:</td>
								<td>{humanize(currentFeedback.suggestion_title)}</td>
							</tr>
							<tr>
								<td>Comment:</td>
								<td>{currentFeedback.comment}</td>
							</tr>
							<tr>
								<td>Star rating:</td>
								<td className="inline-flex items-center w-full border-none">
									<Rating
										size="small"
										sx={{
											"& .MuiRating-iconFilled": {
												color: "#3366CC",
											},
										}}
										value={currentFeedback.star_rating}
										readOnly
									/>
									({currentFeedback.star_rating})
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};
