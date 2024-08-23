import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
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
import { format } from "date-fns";
import Rating from "@mui/material/Rating";
import { GlobalCTX } from "@/contexts/GlobalContext";
import baseurl from "@/api";
import { toast } from "sonner";
import { capitalize } from "lodash";

const FeedbackAdmin = () => {
	const navigate = useNavigate();
	const { setCurrentPageIndex } = React.useContext(BookingCTX);
	const { setLoading, setCurrentFeedback } = React.useContext(GlobalCTX);
	const [dataQuery, setDataQuery] = React.useState([]);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});

	React.useEffect(() => {
		setLoading(true),
			baseurl
				.get("/feedback/get")
				.then((res) => {
					if (res.status == 200) {
						const resData = res.data.feedbacks;
						setDataQuery(resData)
					}
				})
				.catch((error) => {
					if (
						!error.code === "ERR_NETWORK" ||
						!error.code === "ERR_INTERNET_DISCONNECTED" ||
						!error.code === "ECONNABORTED"
					)
						toast.error(
							"Error occurred while fetching feedback. Refresh page."
						);
				})
				.finally(() => setLoading(false));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const columns = [
		{
			header: "S/N",
			cell: ({ row }) => Number(row.id) + 1,
		},
		{
			accessorKey: "fullName",
			id: "fullName",
			header: "Full name",
			accessorFn: (row) => `${row.first_name} ${row.surname}`,
			cell: ({ row }) => <div className="capitalize">{capitalize(`${row.original.first_name} ${row.original.surname}`)}</div>,
		},
		{
			accessorKey: "phone_number",
			header: "Phone number",
			cell: ({ row }) => row.getValue("phone_number"),
		},
		{
			accessorKey: "email",
			header: "Email",
			cell: ({ row }) => row.getValue("email"),
		},
		{
			accessorKey: "feedback_title",
			header: "Title",
			cell: ({ row }) => row.getValue("feedback_title")
			,
		},
		{
			accessorKey: "service_type",
			header: "Service",
			cell: ({ row }) =>
				row.getValue("service_type"),
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
										setCurrentFeedback(row.original)
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
						{table.getFilteredRowModel().rows.length} Feedback results.
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

export default FeedbackAdmin;

export const FeedbackDetails = () => {
	const navigate = useNavigate();
	const { currentFeedback, adminProfile } = React.useContext(GlobalCTX);

	if (!Object.keys(currentFeedback).length) return <Navigate to={`/backend/${adminProfile.account_type}/feedback`} />

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
								<td>Full name:</td>
								<td className="capitalize">{capitalize(`${currentFeedback.first_name} ${currentFeedback.surname}`)}</td>
							</tr>
							<tr>
								<td>Phone number:</td>
								<td>{currentFeedback.phone_number}</td>
							</tr>
							<tr>
								<td>Email:</td>
								<td>{currentFeedback.email}</td>
							</tr>
							<tr>
								<td>Title:</td>
								<td>{currentFeedback.feedback_title}</td>
							</tr>
							<tr>
								<td>Service:</td>
								<td>{currentFeedback.service_type}</td>
							</tr>
							<tr>
								<td>Comment:</td>
								<td>{currentFeedback.comment}</td>
							</tr>
							<tr>
								<td>Star rating:</td>
								<td>
									<div className="inline-flex items-center ">
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
									</div>
								</td>
							</tr>
							<tr>
								<td>Created at:</td>
								<td>{format(currentFeedback.createdAt, "PPPPpppp").split(
									"GMT",
									1
								)}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};
